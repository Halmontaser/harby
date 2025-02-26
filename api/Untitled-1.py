def get_supplier():
	doctype = frappe.form_dict.doctype
	parties_doctype = "Request for Quotation Supplier" if doctype == "Request for Quotation" else doctype
	customers, suppliers = get_customers_suppliers(parties_doctype, frappe.session.user)

	return suppliers[0] if suppliers else ""


def check_supplier_has_docname_access(supplier):
	status = True
	if frappe.form_dict.name not in frappe.db.sql_list(
		"""select parent from `tabRequest for Quotation Supplier`
		where supplier = %s""",
		(supplier,),
	):
		status = False
	return status


def unauthorized_user(supplier):
	status = check_supplier_has_docname_access(supplier) or False
	if status is False:
		frappe.throw(_("Not Permitted"), frappe.PermissionError)


def update_supplier_details(context):
	supplier_doc = frappe.get_doc("Supplier", context.doc.supplier)
	context.doc.currency = supplier_doc.default_currency or frappe.get_cached_value(
		"Company", context.doc.company, "default_currency"
	)
	context.doc.currency_symbol = frappe.db.get_value("Currency", context.doc.currency, "symbol", cache=True)
	context.doc.number_format = frappe.db.get_value(
		"Currency", context.doc.currency, "number_format", cache=True
	)
	context.doc.buying_price_list = supplier_doc.default_price_list or ""


def get_link_quotation(supplier, rfq):
	quotation = frappe.db.sql(
		""" select distinct `tabSupplier Quotation Item`.parent as name,
		`tabSupplier Quotation`.status, `tabSupplier Quotation`.transaction_date from
		`tabSupplier Quotation Item`, `tabSupplier Quotation` where `tabSupplier Quotation`.docstatus < 2 and
		`tabSupplier Quotation Item`.request_for_quotation =%(name)s and
		`tabSupplier Quotation Item`.parent = `tabSupplier Quotation`.name and
		`tabSupplier Quotation`.supplier = %(supplier)s order by `tabSupplier Quotation`.creation desc""",
		{"name": rfq, "supplier": supplier},
		as_dict=1,
	)

	for data in quotation:
		data.transaction_date = formatdate(data.transaction_date)

	return quotation or None

def update_supplier_contact(self, rfq_supplier, link):
		"""Create a new user for the supplier if not set in contact"""
		update_password_link, contact = "", ""

		if frappe.db.exists("User", rfq_supplier.email_id):
			user = frappe.get_doc("User", rfq_supplier.email_id)
		else:
			user, update_password_link = self.create_user(rfq_supplier, link)

		contact = self.link_supplier_contact(rfq_supplier, user)

		return update_password_link, contact

	def link_supplier_contact(self, rfq_supplier, user):
		"""If no Contact, create a new contact against Supplier. If Contact exists, check if email and user id set."""
		if rfq_supplier.contact:
			contact = frappe.get_doc("Contact", rfq_supplier.contact)
		else:
			contact = frappe.new_doc("Contact")
			contact.first_name = rfq_supplier.supplier_name or rfq_supplier.supplier
			contact.append("links", {"link_doctype": "Supplier", "link_name": rfq_supplier.supplier})
			contact.append("email_ids", {"email_id": user.name, "is_primary": 1})

		if not contact.email_id and not contact.user:
			contact.email_id = user.name
			contact.user = user.name

		contact.save(ignore_permissions=True)

		if rfq_supplier.supplier:
			self.update_user_in_supplier(rfq_supplier.supplier, user.name)

		if not rfq_supplier.contact:
			# return contact to later update, RFQ supplier row's contact
			return contact.name

	def update_user_in_supplier(self, supplier, user):
		"""Update user in Supplier."""
		if not frappe.db.exists("Portal User", {"parent": supplier, "user": user}):
			supplier_doc = frappe.get_doc("Supplier", supplier)
			supplier_doc.append(
				"portal_users",
				{
					"user": user,
				},
			)

			supplier_doc.flags.ignore_validate = True
			supplier_doc.flags.ignore_mandatory = True
			supplier_doc.flags.ignore_permissions = True

			supplier_doc.save()

	def create_user(self, rfq_supplier, link):
		user = frappe.get_doc(
			{
				"doctype": "User",
				"send_welcome_email": 0,
				"email": rfq_supplier.email_id,
				"first_name": rfq_supplier.supplier_name or rfq_supplier.supplier,
				"user_type": "Website User",
				"redirect_url": link,
			}
		)
		user.save(ignore_permissions=True)
		update_password_link = user.reset_password()

		return user, update_password_link

