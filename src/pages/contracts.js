import { h } from 'vue';
import { confirmDialog, icon, renderDialog } from '../utils/components';
import GenericDialog from '../components/GenericDialog.vue';
import ObjectList from '../components/ObjectList.vue';
import { toast } from 'vue-sonner';
import router from '../router';
import { currency } from '../utils/format';

export default {
    doctype: 'Contract',
    whitelistedMethods: {
        renewContract: 'renew_contract',
        terminateContract: 'terminate_contract'
    },
    list: {
        route: '/contracts',
        title: 'Contracts',
        fields: ['contract_type', 'start_date', 'end_date', 'contract_value', 'status', 'supplier'],
        columns: [
            {
                label: 'Contract Type',
                fieldname: 'contract_type',
                type: 'Badge',
                width: 0.3,
                format: value => value.toUpperCase()
            },
            {
                label: 'Dates',
                width: 0.4,
                format: (_, row) => {
                    return h('div', { class: 'text-gray-600' }, [
                        h('div', `Start: ${row.start_date}`),
                        h('div', `End: ${row.end_date}`)
                    ]);
                }
            },
            {
                label: 'Value',
                fieldname: 'contract_value',
                format: value => currency(value),
                width: 0.3
            },
            {
                label: 'Status',
                fieldname: 'status',
                type: 'Badge',
                width: 0.3,
                format: value => {
                    const statusColors = {
                        Active: 'green',
                        Draft: 'gray',
                        Expired: 'orange',
                        Terminated: 'red'
                    };
                    return {
                        label: value,
                        color: statusColors[value] || 'gray'
                    };
                }
            },
            {
                label: 'Supplier',
                fieldname: 'supplier',
                width: 0.4
            }
        ],
        primaryAction({ listResource: contracts }) {
            return {
                label: 'New Contract',
                variant: 'solid',
                slots: {
                    prefix: icon('file-plus')
                },
                onClick() {
                    renderDialog(
                        h(GenericDialog, {
                            options: {
                                title: 'Create New Contract',
                                size: '2xl'
                            },
                            default: () =>
                                h(ObjectList, {
                                    options: {
                                        fields: [
                                            { fieldname: 'contract_type', required: true },
                                            { fieldname: 'start_date', type: 'Date' },
                                            { fieldname: 'end_date', type: 'Date' },
                                            { fieldname: 'contract_value', type: 'Currency' },
                                            { fieldname: 'status', type: 'Select', options: ['Draft', 'Active'] },
                                            { fieldname: 'attach_file', type: 'File' },
                                            { fieldname: 'project', type: 'Link' },
                                            { fieldname: 'contact', type: 'Link' },
                                            { fieldname: 'supplier', type: 'Link' },
                                            { fieldname: 'organisation', type: 'Link' }
                                        ],
                                        onSubmit(values) {
                                            toast.promise(contracts.insert.submit(values), {
                                                loading: 'Creating contract...',
                                                success: () => {
                                                    contracts.reload();
                                                    return 'Contract created successfully';
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
        titleField: 'name',
        route: '/contracts/:name',
        breadcrumbs({ items, documentResource: contract }) {
            return [
                items[0],
                {
                    label: `${contract.doc.contract_type} Contract`,
                    route: `/contracts/${contract.doc.name}`
                }
            ];
        },
        tabs: [
            {
                label: 'Overview',
                icon: icon('file-text'),
                route: 'overview',
                type: 'Component',
                component: defineAsyncComponent(() => 
                    import('../components/ContractOverview.vue')
                ),
                props: contract => ({ doc: contract.doc })
            },
            {
                label: 'Parties',
                icon: icon('users'),
                route: 'parties',
                type: 'list',
                list: {
                    doctype: 'Contract Party',
                    fields: ['contact', 'organisation', 'role'],
                    filters: contract => ({
                        parent: contract.doc.name
                    }),
                    columns: [
                        { label: 'Contact', fieldname: 'contact' },
                        { label: 'Organisation', fieldname: 'organisation' },
                        { label: 'Role', fieldname: 'role', type: 'Badge' }
                    ]
                }
            },
            {
                label: 'Documents',
                icon: icon('paperclip'),
                route: 'documents',
                type: 'list',
                list: {
                    doctype: 'File',
                    fields: ['file_name', 'file_url', 'is_private'],
                    filters: contract => ({
                        attached_to_doctype: 'Contract',
                        attached_to_name: contract.doc.name
                    }),
                    columns: [
                        {
                            label: 'File',
                            fieldname: 'file_url',
                            format: value => h('a', { 
                                href: value, 
                                target: '_blank',
                                class: 'text-blue-600 hover:underline'
                            }, 'View Document')
                        },
                        {
                            label: 'Visibility',
                            fieldname: 'is_private',
                            format: value => value ? 'Private' : 'Public'
                        }
                    ]
                }
            }
        ],
        actions({ documentResource: contract }) {
            return [
                {
                    label: 'Download PDF',
                    slots: { prefix: icon('download') },
                    onClick() {
                        window.open(`/api/method/download_contract?name=${contract.doc.name}`);
                    }
                },
                {
                    label: 'Contract Actions',
                    variant: 'outline',
                    options: [
                        {
                            label: 'Renew Contract',
                            icon: icon('refresh-cw'),
                            condition: () => contract.doc.status === 'Active',
                            onClick() {
                                renderDialog(
                                    h(RenewContractDialog, {
                                        contract: contract.doc.name,
                                        onSuccess: () => contract.reload()
                                    })
                                );
                            }
                        },
                        {
                            label: 'Terminate Contract',
                            icon: icon('x-circle'),
                            condition: () => contract.doc.status === 'Active',
                            onClick() {
                                confirmDialog({
                                    title: 'Confirm Termination',
                                    message: 'Are you sure you want to terminate this contract?',
                                    onConfirm() {
                                        toast.promise(contract.terminateContract.submit(), {
                                            loading: 'Terminating contract...',
                                            success: () => {
                                                contract.reload();
                                                return 'Contract terminated';
                                            },
                                            error: e => e.message
                                        });
                                    }
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
                            condition: () => contract.doc.status === 'Draft',
                            onClick() {
                                confirmDialog({
                                    title: 'Delete Contract',
                                    message: 'This action cannot be undone',
                                    onConfirm() {
                                        toast.promise(contract.delete.submit(), {
                                            loading: 'Deleting...',
                                            success: () => {
                                                router.push('/contracts');
                                                return 'Contract deleted';
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