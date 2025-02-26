<template>
  <ObjectList :options="obtion">
    
  </ObjectList>
</template>

<script>
import router from '../router';
import { userCurrency, currency } from '../utils/format';
import { confirmDialog,icon,renderDialog} from '../utils/components';
import { defineAsyncComponent, h } from 'vue';
import GenericDialog from '@/components/GenericDialog.vue';
import dayjs from 'dayjs';  
import ObjectList from '@/components/ObjectList.vue';
import { call,Button} from 'frappe-ui';
import { FileType } from 'lucide-vue-next';
const typeColors = {
            'legal--قانوني': 'blue',
            'Certificate': 'green',
            'Financial': 'purple',
            'other--اخري': 'red'
          };

const partyAttachmentList = {
  list: {
    doctype: 'Party Documents',
    fields: ['doc_title', 'attachment_type', 'attached_file', 'supplier', 'tender', 'is_match_with_orginal', 'islocked'],
    columns: [
      {
        label: 'Type',
        fieldname: 'attachment_type',
        width: 0.2,
        type: 'Badge',
      }
    
    ,
      {
        label: 'File',
        fieldname: 'attached_file',
        width: 3,
        type: 'Link',
        link: (value) => `${value}`, // Adjust path based on your file routing
      },
      {
        label: 'Verified',
        fieldname: 'is_match_with_orginal',
        type: 'Icon',
        Icon: (value) => value ? 'check-circle' : 'x-circle',
        class: (value) => value ? 'bg-green-800' : 'bg-red-600'
      },
  {
    label: 'upload',
    fieldname: 'attached_file',
    width:3,
    type: 'Component',
    component: ({row}) => {
      const uploader = defineAsyncComponent(() => import('../components/uploader.vue'));
      return h('div', [
        h(uploader, { modelvalue: row.name }),
      ]);
    }
  },
  {
    label: 'view',
    fieldname: 'name',
    type: 'Component',
    component: ({row}) => {
      const preview = defineAsyncComponent(() => import('../views/preview.vue'));
      return h('div', [
        h(preview, { row })
      ]);
    }
  },
      {
        label: 'Lock Status',
        fieldname: 'islocked',
        type: 'Icon',
        width: 0.2,
        Icon: (value) => value ? 'lock' : 'unlock',
        class: (value) => value ? 'text-orange' : 'text-gray-900'
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
          confirmDialog({
            title: 'Add Party Document',
            message: 'Fill in the details and attach the file.',
            fields: [
              {
                label: 'Document Title',
                fieldname: 'doc_title',
                type: 'Data',
                required: true
              },
              {
                label: 'Attachment Type',
                fieldname: 'attachment_type',
                type: 'Select',
                options: ['legal--قانوني', 'Certificate', 'Financial', 'other--اخري'],
              },
              
              {
                label: 'Supplier',
                fieldname: 'supplier',
                type: 'Link',
                options: 'Supplier', // Assuming 'Supplier' is your link doctype
              },
              {
                label: 'Tender',
                fieldname: 'tender',
                type: 'Link',
                options: 'Tender', // Assuming 'Tender' is your link doctype
              }
            ],
            primaryAction: {
              label: 'Add Document',
              theme: 'primary'
            },
            onSuccess: async ({ hide, values }) => {
              try {
                /* const formData = new FormData();
                formData.append('file', values.attached_file);
                formData.append('doctype', 'Party Documents');
                formData.append('docname', ''); // Let Frappe generate the name
                formData.append('is_private', 1);
 */
                // Upload the file first
                // const uploadResponse = await call('upload_file', formData);

                // Create the Party Document record
                const doc = {
                  doctype: 'Party Documents',
                  doc_title: values.doc_title,
                  attachment_type: values.attachment_type,
                  supplier: values.supplier,
                  tender: values.tender,
                  is_match_with_orginal: 0, // Default value
                  islocked: 0 // Default value
                };

                await attachments.insert.submit(doc);

                alert('Party Document added successfully' );
                attachments.reload(); // Refresh the list
                hide();
              } catch (error) {
            alert('Error addi')
              }
            }
          });
        }}
      },
      rowActions({
						row,
						listResource: attachments,
					}) {
            return [
              {
                label: 'View',
                icon: 'eye',
                onClick() {
                  const FilePreviewDialog = defineAsyncComponent(() => import('../views/FilePreviewDialog.vue'))
                h(FilePreviewDialog, {
      row: row,
      title: 'Document Preview',
      
      // Events
      onOpen: () => console.log('Preview opened'),
      onClose: () => console.log('Preview closed'),
      
      // Scoped Slots
      slots: {
        trigger: ({ openPreview }) => h(Button, {
          icon: 'eye',
          label: 'View document',
          onClick: openPreview
        }),
        actions: () => h(Button, {
          label: 'Download',
          onClick: () => downloadFile(row.file_url)
        })
      }
    });
  

                }}
              ,
              {
                label: 'Edit',
                icon: 'edit',
                onClick() {
                  confirmDialog(
                    {
                        title: 'Edit Party Document',
                        fields: [
                          {
                            fieldname: 'doc_title',
                            label: 'Document Title',
                            type: 'Data',
                            default: row.doc_title,
                            required: true
                          },
                          {
                            fieldname: 'attachment_type',
                            label: 'Attachment Type',
                            type: 'Select',
                            options: ['legal--قانوني', 'Certificate', 'Financial', 'other--اخري'],
                            default: row.attachment_type,
                            required: true
                          },
                          {
                            fieldname: 'supplier',
                            label: 'Supplier',
                            type: 'Link',
                            options: 'Supplier',
                            default: row.supplier,
                            required: true
                          },
                          {
                            fieldname: 'tender',
                            label: 'Tender',
                            type: 'Link',
                            options: 'Tender',
                            default: row.tender,
                            required: true
                          }
                        ],
                        primaryAction: {
              label: 'edit',
              theme: 'primary',
              onClick: async (values) => {
                await attachments.update.submit({
                  ...row,
                  ...values
                });
                alert('Party Document updated successfully');
                attachments.reload();
              }
            }
                    }
                  );
                }
              },
              {
                label: 'Delete',
                icon: 'trash',
                theme: 'danger',
                onClick() {
                  console.log(row.name);

                  confirmDialog({
                    title: 'Delete Party Document',
                    message: 'Are you sure you want to delete this document?',
                    onConfirm: async () => {
                      console.log(row.name);
                      await attachments.delete.submit(row.name);
                      alert('Party Document deleted successfully');
                      attachments.reload();
                    }
                  });
                }
              }
            ];
          },
  }};
export default {
    components:[ObjectList,h,GenericDialog,call,Button],

    data() {
        return {
            obtion:partyAttachmentList.list
        }
    },
    
} 

// Usage in your Vue component


/* const contractListConfig = {
doctype:'tnt Contract',
  fields: ['contract_type', 'start_date', 'end_date', 'contract_value', 'status']
  ,columns: [
      {
          label: 'Contract Type',
          fieldname: 'contract_type',
          width: 0.25,
          format: value => ({
              label: value.toUpperCase(),
              color: {
                  'SERVICE': 'blue',
                  'PRODUCT': 'purple',
                  'CONSULTING': 'teal',
                  'LEASE': 'orange'
              }[value] || 'gray'
          })
      },
      {
          label: 'Duration',
          width: 0.35,
          format: (_, row) => h('div', { class: 'space-y-1' }, [
              h('div', { class: 'flex items-center text-gray-600' }, [
                  h(FeatherIcon, { name: 'calendar', class: 'h-4 w-4 mr-2' }),
                  h('span', `${dayjs(row.start_date).format('DD MMM YY')} - ${dayjs(row.end_date).format('DD MMM YY')}`)
              ]),
              h('div', { class: 'h-1 bg-gray-200 rounded-full' }, [
                  h('div', {
                      class: 'h-full bg-blue-500 rounded-full',
                      style: { width: `${getProgress(row.start_date, row.end_date)}%` }
                  })
              ])
          ])
      },
      {
          label: 'Value',
          fieldname: 'contract_value',
          width: 0.2,
          align: 'right',
          format: value => h('div', { class: 'font-medium' }, [
              currency(value, { symbol: '$', precision: 0 }),
              h('span', { class: 'text-xs text-gray-500 ml-1' }, 'USD')
          ])
      },
      {
          label: 'Status',
          fieldname: 'status',
          type: 'Badge',
          width: 0.2,
          format: value => ({
              label: value,
              color: {
                  Active: 'green',
                  Draft: 'gray',
                  Expired: 'orange',
                  Terminated: 'red'
              }[value] || 'gray'
          })
      },
      
      
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
                          size: '2xl',
                          fields: [
                              { 
                                  fieldtype: 'Section Break',
                                  label: 'Contract Details',
                                  collapsible: true
                              },
                              {
                                  fieldname: 'contract_type',
                                  label: 'Contract Type',
                                  type: 'Select',
                                  options: ['Service', 'Product', 'Consulting', 'Lease'],
                                  required: true,
                                  columns: 2
                              },
                              {
                                  fieldname: 'start_date',
                                  label: 'Start Date',
                                  type: 'Date',
                                  required: true,
                                  columns: 2
                              },
                              {
                                  fieldname: 'end_date',
                                  label: 'End Date',
                                  type: 'Date',
                                  required: true,
                                  columns: 2,
                                  validator: (value, doc) => value > doc.start_date || 'End date must be after start date'
                              },
                              {
                                  fieldtype: 'Section Break',
                                  label: 'Financial Details'
                              },
                              {
                                  fieldname: 'contract_value',
                                  label: 'Contract Value',
                                  type: 'Currency',
                                  required: true,
                                  columns: 2,
                                  validator: value => value > 0 || 'Value must be positive'
                              },
                              {
                                  fieldname: 'currency',
                                  label: 'Currency',
                                  type: 'Select',
                                  options: ['USD', 'EUR', 'GBP'],
                                  default: 'USD',
                                  columns: 2
                              },
                              {
                                  fieldtype: 'Section Break',
                                  label: 'Parties Involved'
                              },
                              {
                                  fieldname: 'supplier',
                                  label: 'Supplier',
                                  type: 'Link',
                                  options: 'Supplier',
                                  required: true,
                                  columns: 2
                              },
                              {
                                  fieldname: 'project',
                                  label: 'Project',
                                  type: 'Link',
                                  options: 'Project',
                                  columns: 2
                              },
                              {
                                  fieldtype: 'Section Break',
                                  label: 'Attachments'
                              },
                              {
                                  fieldname: 'contract_file',
                                  label: 'Contract Document',
                                  type: 'File',
                                  required: true,
                                  columns: 2,
                                  allowedFileTypes: ['.pdf', '.docx']
                              }
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
              );
          }
      };
  }
};

// Helper function
function getProgress(start, end) {
  const total = dayjs(end).diff(start, 'days');
  const elapsed = dayjs().diff(start, 'days');
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}
import { icon,renderDialog} from '../utils/components';
 import { h } from 'vue'
import GenericDialog from '@/components/GenericDialog.vue';
import dayjs from 'dayjs';  
import ObjectList from '@/components/ObjectList.vue';

export default {
    components:[ObjectList,h,GenericDialog],

    data() {
        return {
            obtion:contractListConfig
        }
    },
    
} */
</script>


<style>

</style>   