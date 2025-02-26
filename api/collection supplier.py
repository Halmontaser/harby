
def make_contact(args, is_primary_contact=1):
	values = {
		"doctype": "Contact",
		"is_primary_contact": is_primary_contact,
		"links": [{"link_doctype": args.get("doctype"), "link_name": args.get("name")}],
	}

	party_type = args.customer_type if args.doctype == "Customer" else args.supplier_type
	party_name_key = "customer_name" if args.doctype == "Customer" else "supplier_name"

	if party_type == "Individual":
		first, middle, last = parse_full_name(args.get(party_name_key))
		values.update(
			{
				"first_name": first,
				"middle_name": middle,
				"last_name": last,
			}
		)
	else:
		values.update(
			{
				"company_name": args.get(party_name_key),
			}
		)

	contact = frappe.get_doc(values)

	if args.get("email_id"):
		contact.add_email(args.get("email_id"), is_primary=True)
	if args.get("mobile_no"):
		contact.add_phone(args.get("mobile_no"), is_primary_mobile_no=True)

	if flags := args.get("flags"):
		contact.insert(ignore_permissions=flags.get("ignore_permissions"))
	else:
		contact.insert()

	return contact


def make_address(args, is_primary_address=1, is_shipping_address=1):
	reqd_fields = []
	for field in ["city", "country"]:
		if not args.get(field):
			reqd_fields.append("<li>" + field.title() + "</li>")

	if reqd_fields:
		msg = _("Following fields are mandatory to create address:")
		frappe.throw(
			"{} <br><br> <ul>{}</ul>".format(msg, "\n".join(reqd_fields)),
			title=_("Missing Values Required"),
		)

	party_name_key = "customer_name" if args.doctype == "Customer" else "supplier_name"

	address = frappe.get_doc(
		{
			"doctype": "Address",
			"address_title": args.get(party_name_key),
			"address_line1": args.get("address_line1"),
			"address_line2": args.get("address_line2"),
			"city": args.get("city"),
			"state": args.get("state"),
			"pincode": args.get("pincode"),
			"country": args.get("country"),
			"is_primary_address": is_primary_address,
			"is_shipping_address": is_shipping_address,
			"links": [{"link_doctype": args.get("doctype"), "link_name": args.get("name")}],
		}
	)

	if flags := args.get("flags"):
		address.insert(ignore_permissions=flags.get("ignore_permissions"))
	else:
		address.insert()

	return address
def parse_full_name(full_name: str) -> tuple[str, str | None, str | None]:
	"""Parse full name into first name, middle name and last name"""
	names = full_name.split()
	first_name = names[0]
	middle_name = " ".join(names[1:-1]) if len(names) > 2 else None
	last_name = names[-1] if len(names) > 1 else None

	return first_name, middle_name, last_name
@frappe.whitelist()
@frappe.validate_and_sanitize_search_inputs
def get_supplier_primary_contact(doctype, txt, searchfield, start, page_len, filters):
	supplier = filters.get("supplier")
	contact = frappe.qb.DocType("Contact")
	dynamic_link = frappe.qb.DocType("Dynamic Link")

	return (
		frappe.qb.from_(contact)
		.join(dynamic_link)
		.on(contact.name == dynamic_link.parent)
		.select(contact.name, contact.email_id)
		.where(
			(dynamic_link.link_name == supplier)
			& (dynamic_link.link_doctype == "Supplier")
			& (contact.name.like(f"%{txt}%"))
		)
	).run(as_dict=False)
def add_role_for_portal_user(portal_user, role):
	"""When a new portal user is added, give appropriate roles to user if
	posssible, else warn user to add roles."""
	if not portal_user.is_new():
		return

	user_doc = frappe.get_doc("User", portal_user.user)
	roles = {r.role for r in user_doc.roles}

	if role in roles:
		return

	if "System Manager" not in frappe.get_roles():
		frappe.msgprint(
			_("Please add {1} role to user {0}.").format(portal_user.user, role),
			alert=True,
		)
		return

	user_doc.add_roles(role)
	frappe.msgprint(_("Added {1} Role to User {0}.").format(frappe.bold(user_doc.name), role), alert=True)

def get_customers_suppliers(doctype, user):
	customers = []
	suppliers = []
	meta = frappe.get_meta(doctype)

	customer_field_name = get_customer_field_name(doctype)

	has_customer_field = meta.has_field(customer_field_name)
	has_supplier_field = meta.has_field("supplier")

	if has_common(["Supplier", "Customer"], frappe.get_roles(user)):
		suppliers = get_parents_for_user("Supplier")
		customers = get_parents_for_user("Customer")
	elif frappe.has_permission(doctype, "read", user=user):
		customer_list = frappe.get_list("Customer")
		customers = suppliers = [customer.name for customer in customer_list]

	return customers if has_customer_field else None, suppliers if has_supplier_field else None


def get_parents_for_user(parenttype: str) -> list[str]:
	portal_user = frappe.qb.DocType("Portal User")

	return (
		frappe.qb.from_(portal_user)
		.select(portal_user.parent)
		.where(portal_user.user == frappe.session.user)
		.where(portal_user.parenttype == parenttype)
	).run(pluck="name")


def has_website_permission(doc, ptype, user, verbose=False):
	doctype = doc.doctype
	customers, suppliers = get_customers_suppliers(doctype, user)
	if customers:
		return frappe.db.exists(doctype, get_customer_filter(doc, customers))
	elif suppliers:
		fieldname = "suppliers" if doctype == "Request for Quotation" else "supplier"
		return frappe.db.exists(doctype, {"name": doc.name, fieldname: ["in", suppliers]})
	else:
		return False


def get_customer_filter(doc, customers):
	doctype = doc.doctype
	filters = frappe._dict()
	filters.name = doc.name
	filters[get_customer_field_name(doctype)] = ["in", customers]
	if doctype == "Quotation":
		filters.quotation_to = "Customer"
	return filters

