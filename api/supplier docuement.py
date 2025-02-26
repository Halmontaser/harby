import frappe
from frappe import _
from frappe.utils import random_string, get_datetime
import json
from frappe.core.doctype.file.file import create_new_folder

def setup_supplier_folder(supplier):
    """Create supplier folder structure"""
    parent = "Home/Suppliers"
    
    # Create Suppliers folder if not exists
    if not frappe.db.exists("File", {"file_name": "Suppliers"}):
        create_new_folder("Suppliers", "Home")
        
    # Create supplier specific folder
    supplier_folder = create_new_folder(supplier, parent)
    
    return supplier_folder

@frappe.whitelist()
def upload_supplier_file():
    """Upload file to supplier folder"""
    try:
        if not frappe.session.supplier:
            frappe.throw(_("Supplier not found"))
            
        file = frappe.request.files.get('file')
        doctype = frappe.form_dict.doctype
        docname = frappe.form_dict.docname
        folder = f"Home/Suppliers/{frappe.session.supplier}"
        
        if not frappe.db.exists("File", {"file_name": frappe.session.supplier, "is_folder": 1}):
            setup_supplier_folder(frappe.session.supplier)
            
        file_doc = frappe.get_doc({
            "doctype": "File",
            "file_name": file.filename,
            "folder": folder,
            "attached_to_doctype": doctype,
            "attached_to_name": docname,
            "attached_to_supplier": frappe.session.supplier,
            "is_private": 1
        })
        
        file_doc.save()
        
        return file_doc
        
    except Exception as e:
        return {
            "success": False,
            "message": str(e)
        }

class SupplierActivity(Document):
    def validate(self):
        if not self.supplier:
            self.supplier = frappe.session.supplier
            
    def after_insert(self):
        self.notify_supplier_users()
        
    def notify_supplier_users(self):
        users = frappe.get_all("Supplier User", 
            filters={"parent": self.supplier},
            fields=["user"]
        )
        
        for user in users:
            if user.user:
                frappe.publish_realtime(
                    event='supplier_activity_update',
                    message={
                        'activity': self.activity_type,
                        'description': self.description,
                        'reference_doctype': self.reference_doctype,
                        'reference_name': self.reference_name
                    },
                    user=user.user
                )

def log_supplier_activity(supplier, activity_type, description, reference_doctype=None, reference_name=None):
    """Log supplier activity"""
    activity = frappe.get_doc({
        "doctype": "Supplier Activity",
        "supplier": supplier,
        "activity_type": activity_type,
        "description": description,
        "reference_doctype": reference_doctype,
        "reference_name": reference_name,
        "created_by": frappe.session.user
    })
    activity.insert(ignore_permissions=True)
    
def on_file_upload(doc, method):
    """Hook for file upload"""
    if doc.attached_to_supplier:
        log_supplier_activity(
            doc.attached_to_supplier,
            "File Upload",
            f"File {doc.file_name} uploaded",
            "File",
            doc.name
        )

def on_file_delete(doc, method):
    """Hook for file delete"""
    if doc.attached_to_supplier:
        log_supplier_activity(
            doc.attached_to_supplier,
            "File Delete",
            f"File {doc.file_name} deleted",
            "File",
            doc.name
        )

def on_document_update(doc, method):
    """Hook for document updates"""
    if hasattr(doc, 'supplier') and doc.supplier:
        log_supplier_activity(
            doc.supplier,
            f"{doc.doctype} Update",
            f"{doc.doctype} {doc.name} updated",
            doc.doctype,
            doc.name
        )

# File DocType customization
def get_permission_query_conditions(user):
    if not user:
        user = frappe.session.user
        
    if "System Manager" in frappe.get_roles(user):
        return ""
        
    supplier_user = frappe.get_list("Supplier User",
        filters={"user": user},
        fields=["parent"]
    )
    
    if supplier_user:
        return f"(`tabFile`.attached_to_supplier = '{supplier_user[0].parent}')"
        
    return "1=0"

def has_permission(doc, ptype, user):
    if "System Manager" in frappe.get_roles(user):
        return True
        
    supplier_user = frappe.get_list("Supplier User",
        filters={"user": user},
        fields=["parent"]
    )
    
    if supplier_user and doc.attached_to_supplier == supplier_user[0].parent:
        return True
        
    return False

# Supplier Activity DocType JSON
{
    "doctype": "DocType",
    "name": "Supplier Activity",
    "is_submittable": 0,
    "fields": [
        {
            "fieldname": "supplier",
            "fieldtype": "Link",
            "label": "Supplier",
            "options": "Supplier",
            "reqd": 1
        },
        {
            "fieldname": "activity_type",
            "fieldtype": "Data",
            "label": "Activity Type",
            "reqd": 1
        },
        {
            "fieldname": "description",
            "fieldtype": "Text",
            "label": "Description",
            "reqd": 1
        },
        {
            "fieldname": "reference_doctype",
            "fieldtype": "Link",
            "label": "Reference DocType",
            "options": "DocType"
        },
        {
            "fieldname": "reference_name",
            "fieldtype": "Dynamic Link",
            "label": "Reference Name",
            "options": "reference_doctype"
        },
        {
            "fieldname": "created_by",
            "fieldtype": "Link",
            "label": "Created By",
            "options": "User"
        },
        {
            "fieldname": "creation",
            "fieldtype": "Datetime",
            "label": "Creation Date",
            "read_only": 1
        }
    ]
}

# Update File DocType JSON to add supplier field
{
    "fieldname": "attached_to_supplier",
    "fieldtype": "Link", 
    "label": "Attached To Supplier",
    "options": "Supplier"
}

# Add to hooks.py
"""
doc_events = {
    "File": {
        "after_insert": "app.api.on_file_upload",
        "on_trash": "app.api.on_file_delete"
    },
    "*": {
        "on_update": "app.api.on_document_update"
    }
}

has_permission = {
    "File": "app.api.has_permission"
}

get_permission_query_conditions = {
    "File": "app.api.get_permission_query_conditions"
}
"""