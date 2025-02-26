const partyAttachmentList = {
  doctype: 'Party docummetns',
  route
  list: {
    fields: ['doc_title', 'attachment_type', 'attached_file', 'supplier', 'tender', 'is_match_with_original', 'is_locked'],
    columns: [
    
      {
        label: 'Type',
        fieldname: 'attachment_type',
        width: 0.2,
        type: 'Badge', // Required for badge styling
        theme: value => {
          const typeColors = {
            'legal--قانوني': 'blue',
            'Certificate': 'green',
            'Financial': 'purple',
            'other--اخري': 'red'
          };
          return 
             typeColors[value] || 'gray'
          };
        }
      },
      {
        label: 'File',
        fieldname: 'attached_file',
        width: 0.3,
        type: 'Link',
        link: (value) => `/files/${value}`, // Adjust path based on your file routing
        format: value => value.split('/').pop() // Show filename only
      },
      {
        label: 'Verified',
        fieldname: 'is_match_with_original',
        type: 'Icon',
        Icon: (value) => value ? 'check-circle' : 'x-circle',
        theme: (value) => value ? 'green' : 'red'
      },
      {
        label: 'Lock Status',
        fieldname: 'is_locked',
        type: 'Icon',
        width: 0.2,
        Icon: (value) => value ? 'lock' : 'unlock',
        theme: (value) => value ? 'orange' : 'gray'
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
                size: '2xl',
                fields: [
                  { 
                    fieldname: 'doc_title', 
                    label: 'Document Title', 
                    required: true 
                  },
                  { 
                    fieldname: 'attachment_type', 
                    label: 'Type',
                    type: 'Select', 
                    options: ['Contract', 'Certificate', 'Financial', 'Other'] 
                  },
                  { 
                    fieldname: 'supplier', 
                    label: 'Supplier',
                    type: 'Link', 
                    options: 'Supplier',
                    required: true 
                  },
                  { 
                    fieldname: 'tender', 
                    label: 'Tender',
                    type: 'Link', 
                    options: 'Tender'
                  },
                  { 
                    fieldname: 'attached_file', 
                    label: 'File',
                    type: 'File', 
                    required: true 
                  },
                  { 
                    fieldname: 'descriptions', 
                    label: 'Description',
                    type: 'Long Text' 
                  },
                  { 
                    fieldname: 'is_locked', 
                    label: 'Lock Document',
                    type: 'Checkbox', 
                    default: false 
                  }
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
          );
        }
      };
    }
  }
};

// Usage in your Vue component
<ObjectList :options="partyAttachmentList" />


const bankStatementConfig = {
  doctype: 'Bank Statement',
  whitelistedMethods: {
    // Add custom server methods if needed
  },
  list: {
    filters: { 'bidder': object.name }, // Ensure 'object' is defined in context
    fields: ['bank_account', 'from_date', 'to_date', 'attached_file', 'closing_balance'],
    columns: [
      {
        label: 'Bank Account',
        fieldname: 'bank_account',
        type: 'Link',
        options: 'Bank Account',
        width: 0.3,
        class: 'font-medium',
        format: value => `${value.accountHolderName} (${value.bankName})` // Assuming linked doc
      },
      {
        label: 'From Date',
        fieldname: 'from_date',
        type: 'Date',
        width: 0.2,
        format: value => value ? dayjs(value).format('DD MMM YYYY') : ''
      },
      {
        label: 'To Date',
        fieldname: 'to_date',
        type: 'Date',
        width: 0.2,
        format: value => value ? dayjs(value).format('DD MMM YYYY') : ''
      },
      {
        label: 'Closing Balance',
        fieldname: 'closing_balance',
        type: 'Currency',
        width: 0.2,
        align: 'right'
      }
    ]
  },
  form: {
    fields: [
      {
        fieldtype: 'Section Break',
        label: 'Bank Details',
        collapsible: true
      },
      {
        fieldname: 'bank_account',
        label: 'Bank Account',
        fieldtype: 'Link',
        options: 'Bank Account',
        reqd: 1,
        get_query: () => ({
          filters: { 'supplier': object.name } // Filter by current bidder
        }),
        columns: 2
      },
      {
        fieldtype: 'Column Break'
      },
      {
        fieldname: 'bank_account_details',
        label: 'Account Details',
        fieldtype: 'HTML',
        depends_on: 'eval:doc.bank_account',
        template: `
          <div class="text-sm space-y-1" v-if="doc.bank_account">
            <div>Bank: {{ doc.bank_account.bankName }}</div>
            <div>Account: {{ doc.bank_account.accountNumber }}</div>
            <div>Currency: {{ doc.bank_account.currency }}</div>
          </div>
        `
      },
      {
        fieldtype: 'Section Break',
        label: 'Statement Period'
      },
      {
        fieldname: 'from_date',
        label: 'From Date',
        fieldtype: 'Date',
        reqd: 1,
        columns: 2
      },
      {
        fieldname: 'to_date',
        label: 'To Date',
        fieldtype: 'Date',
        reqd: 1,
        columns: 2
      },
      {
        fieldtype: 'Section Break',
        label: 'Financial Details'
      },
      {
        fieldname: 'opening_balance',
        label: 'Opening Balance',
        fieldtype: 'Currency',
        reqd: 1,
        columns: 2
      },
      {
        fieldname: 'closing_balance',
        label: 'Closing Balance',
        fieldtype: 'Currency',
        reqd: 1,
        columns: 2
      },
      {
        fieldname: 'debit_amount',
        label: 'Total Debits',
        fieldtype: 'Currency',
        read_only: 1,
        columns: 2
      },
      {
        fieldname: 'credit_amount',
        label: 'Total Credits',
        fieldtype: 'Currency',
        read_only: 1,
        columns: 2
      },
      {
        fieldtype: 'Section Break',
        label: 'Additional Info'
      },
      {
        fieldname: 'reference_number',
        label: 'Reference Number',
        fieldtype: 'Data',
        columns: 2
      },
      {
        fieldname: 'attached_file',
        label: 'Statement File',
        fieldtype: 'Attach',
        reqd: 1,
        columns: 2
      }
    ]
  }
};

// Bank Account Form Configuration
const bankAccountFields = [
  {
    fieldtype: 'Section Break',
    label: 'Account Information'
  },
  {
    fieldname: 'accountHolderName',
    label: 'Account Holder Name',
    fieldtype: 'Data',
    reqd: 1,
    columns: 2
  },
  {
    fieldname: 'bankName',
    label: 'Bank Name',
    fieldtype: 'Data',
    reqd: 1,
    columns: 2
  },
  {
    fieldname: 'accountNumber',
    label: 'Account Number',
    fieldtype: 'Data',
    reqd: 1,
    columns: 2
  },
  {
    fieldtype: 'Column Break'
  },
  {
    fieldname: 'accountType',
    label: 'Account Type',
    fieldtype: 'Select',
    options: ['Savings', 'Current', 'Credit', 'Loan'],
    reqd: 1,
    columns: 2
  },
  {
    fieldname: 'currency',
    label: 'Currency',
    fieldtype: 'Link',
    options: 'Currency',
    reqd: 1,
    columns: 2
  },
  {
    fieldname: 'supplier',
    label: 'Linked Supplier',
    fieldtype: 'Link',
    options: 'Supplier',
    columns: 2
  }
];

const contactListConfig = {
  doctype: 'Contact',
  fields: ['first_name', 'last_name', 'email', 'phone', 'company', 'status'],
  columns: [
    {
      label: 'Name',
      width: 0.3,
      format: (_, row) => h('div', { class: 'font-medium' }, 
        `${row.first_name} ${row.last_name}`
      )
    },
    {
      label: 'Email',
      fieldname: 'email',
      type: 'Link',
      width: 0.3,
      link: value => `mailto:${value}`,
      format: value => h('div', { class: 'text-gray-600' }, value)
    },
    {
      label: 'Phone',
      fieldname: 'phone',
      type: 'Link',
      width: 0.2,
      link: value => `tel:${value}`,
      format: value => formatPhoneNumber(value) // Add phone formatting function
    },
    {
      label: 'Company',
      fieldname: 'company',
      type: 'Link',
      options: 'Company',
      width: 0.3,
      format: value => value?.company_name
    },
    {
      label: 'Status',
      fieldname: 'status',
      type: 'Badge',
      width: 0.2,
      format: value => ({
        label: value,
        color: {
          'Active': 'green',
          'Inactive': 'gray',
          'Archived': 'orange'
        }[value] || 'gray'
      })
    }
  ],
  primaryAction({ listResource: contacts }) {
    return {
      label: 'New Contact',
      variant: 'solid',
      slots: { prefix: icon('user-plus') },
      onClick() {
        renderDialog(
          h(GenericDialog, {
            options: {
              title: 'Create New Contact',
              size: 'lg',
              fields: [
                {
                  fieldtype: 'Section Break',
                  label: 'Basic Information'
                },
                {
                  fieldname: 'first_name',
                  label: 'First Name',
                  fieldtype: 'Data',
                  required: true,
                  columns: 2
                },
                {
                  fieldname: 'last_name',
                  label: 'Last Name',
                  fieldtype: 'Data',
                  columns: 2
                },
                {
                  fieldtype: 'Column Break'
                },
                {
                  fieldname: 'status',
                  label: 'Status',
                  fieldtype: 'Select',
                  options: ['Active', 'Inactive', 'Archived'],
                  default: 'Active',
                  columns: 2
                },
                {
                  fieldtype: 'Section Break',
                  label: 'Contact Details'
                },
                {
                  fieldname: 'email',
                  label: 'Email',
                  fieldtype: 'Data',
                  required: true,
                  columns: 2,
                  validator: value => isValidEmail(value) || 'Invalid email format'
                },
                {
                  fieldname: 'phone',
                  label: 'Phone',
                  fieldtype: 'Data',
                  columns: 2,
                  validator: value => isValidPhone(value) || 'Invalid phone format'
                },
                {
                  fieldname: 'company',
                  label: 'Company',
                  fieldtype: 'Link',
                  options: 'Company',
                  columns: 2
                },
                {
                  fieldtype: 'Section Break',
                  label: 'Additional Info'
                },
                {
                  fieldname: 'notes',
                  label: 'Notes',
                  fieldtype: 'Text',
                  columns: 2
                }
              ],
              onSubmit(values) {
                toast.promise(contacts.insert.submit(values), {
                  loading: 'Creating contact...',
                  success: () => {
                    contacts.reload();
                    return 'Contact created successfully';
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

// Helper functions
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
  return /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/.test(phone);
}

function formatPhoneNumber(phone) {
  // Add phone formatting logic
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

// Usage in component
<ObjectList :options="contactListConfig" />







const contractListConfig = {
  doctype: 'tnt Contract',
  fields: ['contract_type', 'start_date', 'end_date', 'contract_value', 'status', 'supplier'],
  columns: [
      {
          label: 'Contract Type',
          fieldname: 'contract_type',
          type: 'Badge',
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
      {
          label: 'Supplier',
          fieldname: 'supplier',
          type: 'Link',
          options: 'Supplier',
          width: 0.3,
          format: value => h('div', { class: 'flex items-center' }, [
              h('img', { 
                  src: value.logo, 
                  class: 'h-5 w-5 mr-2 rounded-full object-cover',
                  onError: e => { e.target.style.display = 'none' }
              }),
              value.supplier_name
          ])
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

const bankStatementConfig = {
  doctype: 'tnd Bank Statement',
  whitelistedMethods: {
    create_bank_account: 'frappe.client.insert'
  },
  list: {
    filters: { 'bidder': object.name },
    fields: ['bank_account', 'from_date', 'to_date', 'closing_balance'],
    columns: [
      {
        label: 'Bank Account',
        fieldname: 'bank_account',
        type: 'Link',
        options: 'Bank Account',
        width: 0.3,
        format: value => `${value.accountHolderName} (${value.bankName})`
      },
      // ... (keep other columns as previous)
    ]
  },
  form: {
    fields: [
      {
        fieldtype: 'Section Break',
        label: 'Bank Account Selection',
        collapsible: true
      },
      {
        fieldname: 'bank_account',
        label: 'Select Bank Account',
        fieldtype: 'Link',
        options: 'Bank Account',
        reqd: 1,
        columns: 2,
        get_query: () => ({
          filters: { 'supplier': object.name }
        })
      },
      {
        fieldtype: 'Column Break'
      },
      {
        fieldname: 'new_account_btn',
        label: ' ',
        fieldtype: 'HTML',
        columns: 2,
        template: `
          <div class="mt-2">
            <Button
              label="Create New Bank Account"
              variant="outline"
              @click="openNewBankAccount"
              class="w-full"
            />
          </div>
        `
      },
      // ... (rest of the form fields)
    ],
    methods: {
      async openNewBankAccount() {
        const { doc } = await this.$dialog({
          title: 'Create New Bank Account',
          size: 'xl',
          fields: [
            {
              fieldname: 'accountHolderName',
              label: 'Account Holder Name',
              fieldtype: 'Data',
              required: true
            },
            {
              fieldname: 'bankName',
              label: 'Bank Name',
              fieldtype: 'Data',
              required: true
            },
            {
              fieldname: 'accountNumber',
              label: 'Account Number',
              fieldtype: 'Data',
              required: true
            },
            // ... (other bank account fields)
          ],
          primaryActionLabel: 'Create Account',
          primaryAction: async (data) => {
            const bankAccount = await this.$resources.create_bank_account.submit({
              doctype: 'Bank Account',
              ...data,
              supplier: object.name
            })
            
            // Update current form
            this.doc.bank_account = bankAccount.name
            
            // Refresh link options
            this.$refs.bank_account.get_query()
          }
        })
      }
    }
  }
};

// Usage in component
<ObjectList 
  :options="bankStatementConfig"
  ref="bankStatementList"
/>

const partyAttachmentList = {
  doctype: 'Party Documents',
  list: {
    fields: ['doc_title', 'attachment_type', 'attached_file', 'supplier', 'tender', 'is_match_with_original', 'is_locked'],
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
        type: 'Badge', // Required for badge styling
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
        label: 'File',
        fieldname: 'attached_file',
        width: 0.3,
        type: 'Link',
        link: (value) => `/files/${value}`, // Adjust path based on your file routing
        format: value => value.split('/').pop() // Show filename only
      },
      {
        label: 'Verified',
        fieldname: 'is_match_with_original',
        type: 'Icon',
        Icon: (value) => value ? 'check-circle' : 'x-circle',
        theme: (value) => value ? 'green' : 'red'
      },
      {
        label: 'Lock Status',
        fieldname: 'is_locked',
        type: 'Icon',
        width: 0.2,
        Icon: (value) => value ? 'lock' : 'unlock',
        theme: (value) => value ? 'orange' : 'gray'
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
                size: '2xl',
                fields: [
                  { 
                    fieldname: 'doc_title', 
                    label: 'Document Title', 
                    required: true 
                  },
                  { 
                    fieldname: 'attachment_type', 
                    label: 'Type',
                    type: 'Select', 
                    options: ['Contract', 'Certificate', 'Financial', 'Other'] 
                  },
                  { 
                    fieldname: 'supplier', 
                    label: 'Supplier',
                    type: 'Link', 
                    options: 'Supplier',
                    required: true 
                  },
                  { 
                    fieldname: 'tender', 
                    label: 'Tender',
                    type: 'Link', 
                    options: 'Tender'
                  },
                  { 
                    fieldname: 'attached_file', 
                    label: 'File',
                    type: 'File', 
                    required: true 
                  },
                  { 
                    fieldname: 'descriptions', 
                    label: 'Description',
                    type: 'Long Text' 
                  },
                  { 
                    fieldname: 'is_locked', 
                    label: 'Lock Document',
                    type: 'Checkbox', 
                    default: false 
                  }
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
          );
        }
      };
    }
  }
};

// Usage in your Vue component
<ObjectList :options="partyAttachmentList" />