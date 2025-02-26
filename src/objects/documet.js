import { h } from 'vue';
import { confirmDialog, icon, renderDialog } from '../utils/components';
import GenericDialog from '../components/GenericDialog.vue';
import ObjectList from '../components/ObjectList.vue';
import { toast } from 'vue-sonner';
import router from '../router';
import Icon from '../components/Icon.vue';

export default {
    doctype: 'party Attachment',
    list: {
    
        fields: ['doc_title', 'attachment_type', 'attached_file','supplier', 'tender', 'is_match_with_original', 'is_locked'],
        columns: [
            {
                label: 'Document Title',
                fieldname: 'doc_title',
                width: 0.4,
                class: 'font-medium'
            },
            {
                label: 'Type',
                fieldname: 'attachment_type',
                width: 0.2,
                format: value => {
                    const typeColors = {
                        'Contract': 'blue',
                        'Certificate': 'green',
                        'Financial': 'purple',
                        'Other': 'gray'
                    };
                    return {
                        label: value,
                        color: typeColors[value] || 'gray'
                    };
                }
            },
            {
                label: 'attached_file',
                fieldname: 'attached_file',
                width: 0.3,
                type:'link'
            },
           
            {
                label: 'Verified',
                fieldname: 'is_match_with_original',
                type: 'icon',
                
            },
            {
                label: 'Lock Status',
                fieldname: 'is_locked',
                type: 'icon',
                width: 0.2,
               
            }
        ],
        primaryAction({ listResource: attachments }) {
            return {
                label: 'Add Document',
                variant: 'solid',
                slots: {
                    prefix: icon('plus')
                },
                onClick() {
                    renderDialog(
                        h(GenericDialog, {
                            options: {
                                title: 'New Supplier Document',
                                size: '2xl'
                            },
                            default: () =>
                                h(GenericDialog, {
                                    options: {
                                        fields: [
                                            { fieldname: 'doc_title', required: true },
                                            { fieldname: 'attachment_type', type: 'Select', options: ['Contract', 'Certificate', 'Financial', 'Other'] },
                                            { fieldname: 'supplier', type: 'Link', required: true },
                                            { fieldname: 'tender', type: 'Link' },
                                            { fieldname: 'attached_file', type: 'File', required: true },
                                            { fieldname: 'descriptions', type: 'Long Text' },
                                            { fieldname: 'is_locked', type: 'Checkbox', default: false }
                                        ],
                                        onSubmit(values) {
                                            toast.promise(attachments.insert.submit(values), {
                                                loading: 'Uploading document...',
                                                success: () => {
                                                    attachments.reload();
                                                    return 'Document added successfully';
                                                },
                                                error: e => e.message
                                            });
                                        }
                                    }
                                })
                        })
                    );
                }
            };
        }
    },
    detail: {
        titleField: 'doc_title',
        route: '/supplier-attachments/:name',
        breadcrumbs({ items, documentResource: attachment }) {
            return [
                items[0],
                {
                    label: attachment.doc.doc_title,
                    route: `/supplier-attachments/${attachment.doc.name}`
                }
            ];
        },
        tabs: [
            {
                label: 'Document Details',
                icon: icon('file-text'),
                route: 'details',
                type: 'list',
                list: {
                    doctype: 'Supplier Attachment',
                    fields: [
                        'attached_file',
                        'descriptions',
                        'attachment_type',
                        'supplier',
                        'tender',
                        'created_by',
                        'creation'
                    ],
                    columns: [
                        {
                            label: 'Document',
                            fieldname: 'attached_file',
                            format: value => h('a', {
                                href: value,
                                target: '_blank',
                                class: 'text-blue-600 hover:underline'
                            }, 'View File')
                        },
                        {
                            label: 'Description',
                            fieldname: 'descriptions',
                            width: 2
                        },
                        {
                            label: 'Uploaded By',
                            fieldname: 'created_by',
                            type: 'Link'
                        },
                        {
                            label: 'Upload Date',
                            fieldname: 'creation',
                            type: 'Date'
                        }
                    ]
                }
            },
            {
                label: 'Verification History',
                icon: icon('shield-check'),
                route: 'verification',
                type: 'list',
                list: {
                    doctype: 'Document Verification Log',
                    filters: attachment => ({
                        referenced_doc: attachment.doc.name
                    }),
                    fields: ['verified_by', 'verification_date', 'verification_status', 'notes'],
                    columns: [
                        { label: 'Verified By', fieldname: 'verified_by' },
                        { label: 'Date', fieldname: 'verification_date', type: 'Date' },
                        { 
                            label: 'Status', 
                            fieldname: 'verification_status',
                            type: 'Badge',
                            format: value => ({
                                label: value,
                                color: value === 'Approved' ? 'green' : value === 'Rejected' ? 'red' : 'orange'
                            })
                        },
                        { label: 'Notes', fieldname: 'notes', width: 2 }
                    ]
                }
            }
        ],
        actions({ documentResource: attachment }) {
            return [
                {
                    label: 'Download',
                    slots: { prefix: icon('download') },
                    onClick() {
                        window.open(attachment.doc.attached_file);
                    }
                },
                {
                    label: 'Document Actions',
                    variant: 'outline',
                    options: [
                        {
                            label: 'Verify Match',
                            icon: icon('check-circle'),
                            condition: () => !attachment.doc.is_match_with_original,
                            onClick() {
                                renderDialog(
                                    h(VerificationDialog, {
                                        doc: attachment.doc.name,
                                        onSuccess: () => attachment.reload()
                                    })
                                );
                            }
                        },
                        {
                            label: 'Toggle Lock',
                            icon: icon(attachment.doc.is_locked ? 'unlock' : 'lock'),
                            onClick() {
                                toast.promise(attachment.toggleLock.submit(), {
                                    loading: 'Updating lock status...',
                                    success: () => {
                                        attachment.reload();
                                        return `Document ${attachment.doc.is_locked ? 'unlocked' : 'locked'}`;
                                    },
                                    error: e => e.message
                                });
                            }
                        }
                    ]
                },
                {
                    label: 'Options',
                    options: [
                        {
                            label: 'Delete',
                            icon: icon('trash-2'),
                            condition: () => !attachment.doc.is_locked,
                            onClick() {
                                confirmDialog({
                                    title: 'Delete Document',
                                    message: 'This will permanently remove this attachment',
                                    onConfirm() {
                                        toast.promise(attachment.delete.submit(), {
                                            loading: 'Deleting...',
                                            success: () => {
                                                router.push('/supplier-attachments');
                                                return 'Document deleted';
                                            },
                                            error: e => e.message
                                        });
                                    }
                                });
                            }
                        }
                    ]
                }
            ];
        }
    }
};