def link_events_with_prospect(event, method):
	if event.event_participants:
		ref_doctype = event.event_participants[0].reference_doctype
		ref_docname = event.event_participants[0].reference_docname
		prospect = get_linked_prospect(ref_doctype, ref_docname)
		if prospect:
			event.add_participant("Prospect", prospect)
			event.save()


def link_open_tasks(ref_doctype, ref_docname, doc):
	todos = get_open_todos(ref_doctype, ref_docname)

	for todo in todos:
		todo_doc = frappe.get_doc("ToDo", todo.name)
		todo_doc.reference_type = doc.doctype
		todo_doc.reference_name = doc.name
		todo_doc.save()


def link_open_events(ref_doctype, ref_docname, doc):
	events = get_open_events(ref_doctype, ref_docname)
	for event in events:
		event_doc = frappe.get_doc("Event", event.name)
		event_doc.add_participant(doc.doctype, doc.name)
		event_doc.save()


@frappe.whitelist()
def get_open_activities(ref_doctype, ref_docname):
	tasks = get_open_todos(ref_doctype, ref_docname)
	events = get_open_events(ref_doctype, ref_docname)

	return {"tasks": tasks, "events": events}


def get_open_todos(ref_doctype, ref_docname):
	return frappe.get_all(
		"ToDo",
		filters={"reference_type": ref_doctype, "reference_name": ref_docname, "status": "Open"},
		fields=[
			"name",
			"description",
			"allocated_to",
			"date",
		],
	)


def get_open_events(ref_doctype, ref_docname):
	event = frappe.qb.DocType("Event")
	event_link = frappe.qb.DocType("Event Participants")

	query = (
		frappe.qb.from_(event)
		.join(event_link)
		.on(event_link.parent == event.name)
		.select(
			event.name,
			event.subject,
			event.event_category,
			event.starts_on,
			event.ends_on,
			event.description,
		)
		.where(
			(event_link.reference_doctype == ref_doctype)
			& (event_link.reference_docname == ref_docname)
			& (event.status == "Open")
		)
	)
	data = query.run(as_dict=True)

	return data


def open_leads_opportunities_based_on_todays_event():
	event = frappe.qb.DocType("Event")
	event_link = frappe.qb.DocType("Event Participants")

	query = (
		frappe.qb.from_(event)
		.join(event_link)
		.on(event_link.parent == event.name)
		.select(event_link.reference_doctype, event_link.reference_docname)
		.where(
			(event_link.reference_doctype.isin(["Lead", "Opportunity"]))
			& (event.status == "Open")
			& (functions.Date(event.starts_on) == today())
		)
	)
	data = query.run(as_dict=True)

	for d in data:
		frappe.db.set_value(d.reference_doctype, d.reference_docname, "status", "Open")
