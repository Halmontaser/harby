import { h } from 'vue';
import { confirmDialog, icon, renderDialog } from '../utils/components';
import GenericDialog from '../components/GenericDialog.vue';
import ObjectList from '../components/ObjectList.vue';
import { toast } from 'vue-sonner';
import router from '../router';
import { currency } from '../utils/format';
import Supplier from '../pages/supplier/supplier.vue';

export default {
    doctype: 'Bank Statement',
    whitelistedMethods: {
        // Add any server methods here if needed
    },
    list: {
     
        filters:{'bidder':object.name},
        fields: ['bank_account', 'from_date', 'to_date','attached_file'],
        columns: [
            {
                label: 'Bank Account',
                fieldname: 'bank_account',
                width: 0.3,
                class: 'font-medium'
            },
            {
                label: 'From Date',
                fieldname: 'from_date',
                type: 'Date',
                width: 0.2
            },
            {
                label: 'To Date',
                fieldname: 'to_date',
                type: 'Date',
                width: 0.2
            }
            
        ],
        primaryAction({ listResource: statements }) {
            return {
                label: 'New Statement',
                variant: 'solid',
                slots: {
                    prefix: icon('plus')
                },
                onClick() {
                    renderDialog(
                        h(GenericDialog, {
                            options: {
                                title: 'New Bank Statement',
                                size: 'xl'
                            },
                            default: () =>
                                h(ObjectList, {
                                    options: {
                                        fields: [
                                            'bank_account',
                                            'from_date',
                                            'to_date',
                                            'opening_balance'
                                        ],
                                        resource: {
                                            doctype: 'Bank Statement',
                                            insert: true
                                        },
                                        onSubmit(values) {
                                            toast.promise(statements.insert.submit(values), {
                                                loading: 'Creating new statement...',
                                                success: () => {
                                                    statements.reload();
                                                    return 'Bank statement created';
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
        titleField: 'bank_account',
        route: '/bank-statements/:name',
        breadcrumbs({ items, documentResource: statement }) {
            return [
                items[0],
                {
                    label: `${statement.doc.bank_account} Statement`,
                    route: `/bank-statements/${statement.doc.name}`
                }
            ];
        },
        tabs: [
            {
                label: 'Details',
                icon: icon('file-text'),
                route: 'details',
                type: 'list',
                list: {
                    doctype: 'Bank Statement Transaction',
                    filters: statement => ({
                        parent: statement.doc.name
                    }),
                    fields: ['date', 'description', 'debit', 'credit', 'balance'],
                    columns: [
                        {
                            label: 'Date',
                            fieldname: 'date',
                            type: 'Date'
                        },
                        {
                            label: 'Description',
                            fieldname: 'description',
                            width: 2
                        },
                        {
                            label: 'Debit',
                            fieldname: 'debit',
                            format: value => currency(value)
                        },
                        {
                            label: 'Credit',
                            fieldname: 'credit',
                            format: value => currency(value)
                        },
                        {
                            label: 'Balance',
                            fieldname: 'balance',
                            format: value => currency(value)
                        }
                    ]
                }
            }
        ],
        actions({ documentResource: statement }) {
            return [
                {
                    label: 'Download PDF',
                    slots: {
                        prefix: icon('download')
                    },
                    onClick() {
                        window.open(`/api/method/download_bank_statement?name=${statement.doc.name}`);
                    }
                },
                {
                    label: 'Options',
                    options: [
                        {
                            label: 'Delete',
                            icon: icon('trash-2'),
                            onClick() {
                                confirmDialog({
                                    title: 'Delete Bank Statement',
                                    message: 'Are you sure you want to delete this statement?',
                                    onSuccess({ hide }) {
                                        toast.promise(statement.delete.submit(), {
                                            loading: 'Deleting statement...',
                                            success: () => {
                                                hide();
                                                router.push({ name: 'Bank Statement List' });
                                                return 'Statement deleted successfully';
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