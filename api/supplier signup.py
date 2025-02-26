from typing import Optional, List
import frappe
from frappe import _
from frappe.query_builder import DocType
from frappe.query_builder.functions import Now
from frappe.utils import validate_email_address, getdate, now_datetime, add_to_date
from frappe.model.document import Document
from frappe.core.doctype.user_permission.user_permission import add_user_permission, remove_user_permission

class SupplierUser(Document):
    # Type hints for fields
    email: str
    is_primary: bool 
    is_admin: bool
    parent: str
    name: str

    def validate(self) -> None:
        self.validate_email()
        self.validate_unique_user()
        self.validate_primary_user()
        
    def validate_email(self) -> None:
        if not self.email:
            frappe.throw(_("Email is mandatory"))
        
        if not validate_email_address(self.email):
            frappe.throw(_("Invalid Email Address"))
            
    def validate_unique_user(self) -> None:
        supplier_user = DocType("Supplier User")
        existing = (
            frappe.qb.from_(supplier_user)
            .select(supplier_user.name)
            .where(
                (supplier_user.email == self.email) & 
                (supplier_user.name != self.name)
            )
            .run(as_dict=True)
        )
        if existing:
            frappe.throw(_("User already exists for another supplier"))
            
    def validate_primary_user(self) -> None:
        if self.is_primary:
            supplier_user = DocType("Supplier User")
            existing_primary = (
                frappe.qb.from_(supplier_user)
                .select(supplier_user.name)
                .where(
                    (supplier_user.parent == self.parent) &
                    (supplier_user.is_primary == 1) &
                    (supplier_user.name != self.name)
                )
                .run(as_dict=True)
            )
            if existing_primary:
                frappe.throw(_("Another primary user already exists for this supplier"))
                
        if self.is_admin and not self.is_primary:
            frappe.throw(_("Only primary user can be admin"))

class SupplierPermission(Document):
    # Type hints
    supplier: str
    user: str
    doctype: str
    document: str
    has_permission: bool
    expiry_date: Optional[str]

    def validate(self) -> None:
        self.validate_user()
        self.validate_expiry()
        
    def validate_user(self) -> None:
        supplier_user = DocType("Supplier User")
        is_admin = (
            frappe.qb.from_(supplier_user)
            .select(supplier_user.name)
            .where(
                (supplier_user.parent == self.supplier) &
                (supplier_user.user == frappe.session.user) &
                (supplier_user.is_primary == 1) &
                (supplier_user.is_admin == 1)
            )
            .run(as_dict=True)
        )
        if not is_admin:
            frappe.throw(_("Only primary admin user can manage permissions"))
            
    def validate_expiry(self) -> None:
        if self.expiry_date and getdate(self.expiry_date) < getdate():
            frappe.throw(_("Expiry date cannot be in the past"))
            
    def on_update(self) -> None:
        self.update_user_permissions()
        
    def update_user_permissions(self) -> None:
        if self.has_permission:
            add_user_permission(
                self.doctype,
                self.document,
                self.user,
                ignore_permissions=True,
                applicable_for=self.doctype,
                valid_upto=self.expiry_date
            )
        else:
            remove_user_permission(
                self.doctype,
                self.document, 
                self.user
            )
            
        self.notify_user()
            
    def notify_user(self) -> None:
        subject = _("Permission Updated")
        message = _("""Permission for {0} {1} has been {2} by {3}""").format(
            self.doctype,
            self.document,
            _('granted') if self.has_permission else _('revoked'),
            frappe.session.user
        )
            
        frappe.sendmail(
            recipients=self.user,
            subject=subject,
            message=message
        )

@frappe.whitelist()
def grant_supplier_permission(user: str, doctype: str, document: str, expiry_days: Optional[int] = None) -> SupplierPermission:
    """Grant permission to supplier user"""
    if not frappe.session.supplier:
        frappe.throw(_("Not authorized"))
        
    supplier_user = DocType("Supplier User")
    
    # Check if granting user is primary admin
    is_admin = (
        frappe.qb.from_(supplier_user)
        .select(supplier_user.name)
        .where(
            (supplier_user.parent == frappe.session.supplier) &
            (supplier_user.user == frappe.session.user) &
            (supplier_user.is_primary == 1) &
            (supplier_user.is_admin == 1)
        )
        .run(as_dict=True)
    )
    if not is_admin:
        frappe.throw(_("Only primary admin user can grant permissions"))
        
    # Check if user belongs to same supplier
    is_supplier_user = (
        frappe.qb.from_(supplier_user)
        .select(supplier_user.name)
        .where(
            (supplier_user.parent == frappe.session.supplier) &
            (supplier_user.user == user)
        )
        .run(as_dict=True)
    )
    if not is_supplier_user:
        frappe.throw(_("User does not belong to this supplier"))
        
    expiry_date = None
    if expiry_days:
        expiry_date = add_to_date(now_datetime(), days=expiry_days)
        
    permission = frappe.get_doc({
        "doctype": "Supplier Permission",
        "supplier": frappe.session.supplier,
        "user": user,
        "doctype": doctype,
        "document": document,
        "has_permission": 1,
        "expiry_date": expiry_date
    })
    permission.insert(ignore_permissions=True)
    
    return permission

@frappe.whitelist()
def revoke_supplier_permission(user: str, doctype: str, document: str) -> SupplierPermission:
    """Revoke permission from supplier user"""
    if not frappe.session.supplier:
        frappe.throw(_("Not authorized"))
        
    permission = frappe.get_doc({
        "doctype": "Supplier Permission",
        "supplier": frappe.session.supplier,
        "user": user,
        "doctype": doctype,
        "document": document,
        "has_permission": 0
    })
    permission.insert(ignore_permissions=True)
    
    return permission

def get_permitted_documents(doctype: str, user: Optional[str] = None) -> List[str]:
    """Get list of permitted documents for user"""
    if not user:
        user = frappe.session.user
        
    supplier_permission = DocType("Supplier Permission")
    permissions = (
        frappe.qb.from_(supplier_permission)
        .select(supplier_permission.document)
        .where(
            (supplier_permission.user == user) &
            (supplier_permission.doctype == doctype) &
            (supplier_permission.has_permission == 1) &
            (
                (supplier_permission.expiry_date.isnull()) |
                (supplier_permission.expiry_date >= Now())
            )
        )
        .run(as_dict=True)
    )
    
    return [p.document for p in permissions]

def get_permission_query_conditions(user: Optional[str] = None) -> str:
    """Permission query conditions for supplier documents"""
    if not user:
        user = frappe.session.user
        
    if "System Manager" in frappe.get_roles(user):
        return ""
        
    supplier_user = DocType("Supplier User")
    # Get user's supplier
    supplier = (
        frappe.qb.from_(supplier_user)
        .select(supplier_user.parent)
        .where(supplier_user.user == user)
        .run(as_dict=True)
    )
    
    conditions = []
    if supplier:
        conditions.append(f"`tabDocType`.supplier = '{supplier[0].parent}'")
    
    # Get explicitly permitted documents
    permitted_docs = get_permitted_documents(doctype, user)
    if permitted_docs:
        conditions.append(f"`tabDocType`.name in ({','.join(['%s']*len(permitted_docs))})")
        
    if conditions:
        return f"({' OR '.join(conditions)})"
        
    return "1=0"

def has_permission(doc: Document, ptype: str, user: Optional[str] = None) -> bool:
    """Permission check for supplier documents"""
    if not user:
        user = frappe.session.user
        
    if "System Manager" in frappe.get_roles(user):
        return True
        
    supplier_user = DocType("Supplier User")
    # Check direct supplier access
    supplier = (
        frappe.qb.from_(supplier_user)
        .select(supplier_user.parent)
        .where(supplier_user.user == user)
        .run(as_dict=True)
    )
    
    if supplier and doc.supplier == supplier[0].parent:
        return True
        
    # Check explicit permissions
    permitted_docs = get_permitted_documents(doc.doctype, user)
    if doc.name in permitted_docs:
        return True
        
    return False

def clear_expired_permissions() -> None:
    """Clear expired permissions"""
    supplier_permission = DocType("Supplier Permission")
    expired = (
        frappe.qb.from_(supplier_permission)
        .select(supplier_permission.name)
        .where(
            (supplier_permission.has_permission == 1) &
            (supplier_permission.expiry_date < Now())
        )
        .run(as_dict=True)
    )
    
    for permission in expired:
        doc = frappe.get_doc("Supplier Permission", permission.name)
        doc.has_permission = 0
        doc.save(ignore_permissions=True)