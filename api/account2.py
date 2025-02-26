g@frappe.whitelist(allow_guest=True)
def validate_account_request(key):
	if not key:
		frappe.throw("Request Key not provided")

	app = frappe.db.get_value("Account Request", {"request_key": key}, "saas_app")
	headless, route = frappe.db.get_value(
		"Saas Setup Account Generator", app, ["headless", "route"]
	)

	if headless:
		headless_setup_account(key)
	else:
		frappe.local.response["type"] = "redirect"
		frappe.local.response["location"] = f"/{route}?key={key}"


@frappe.whitelist(allow_guest=True)
def setup_account(key, business_data=None):
	"""
	Includes the data collection step in setup-account.html
	"""
	account_request = get_account_request_from_key(key)
	if not account_request:
		frappe.throw("Invalid or Expired Key")

	capture(
		"init_server_setup_account",
		"fc_saas",
		account_request.get_site_name(),
	)
	frappe.set_user("Administrator")

	if business_data:
		business_data = frappe.parse_json(business_data)

	if isinstance(business_data, dict):
		business_data = {
			key: business_data.get(key)
			for key in [
				"company",
				"no_of_employees",
				"industry",
				"no_of_users",
				"designation",
				"phone_number",
				"referral_source",
				"agreed_to_partner_consent",
			]
		}

	account_request.update(business_data)
	account_request.save(ignore_permissions=True)

	create_marketplace_subscription(account_request)
	capture(
		"completed_server_setup_account",
		"fc_saas",
		account_request.get_site_name(),
	)

