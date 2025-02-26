<template>
<ObjectList :options="obtion" />

</template>
<script>
import router from '../router';
import { userCurrency, currency } from '../utils/format';
import { confirmDialog,icon,renderDialog} from '../utils/components';
import { defineAsyncComponent, h } from 'vue';
import GenericDialog from '@/components/GenericDialog.vue';
import dayjs from 'dayjs';  
import ObjectList from '@/components/ObjectList.vue';
import { FeatherIcon} from 'frappe-ui';
const contractListConfig = {
    doctype:'tnt Contract',
    fields: ['contract_type', 'start_date', 'end_date', 'contract_value', 'supplier'],
    columns: [
        {
            label: 'Contract Type',
            fieldname: 'contract_type',
        },
        {
            label: 'start',
            fieldname: 'start_date',
        },
        {
            label: 'end_date',
            fieldname: 'end_date',
        },
        {
            label: 'supplier',
            fieldname: 'supplier',
            type:'link'
        },
        {
            label: 'org',
            fieldname: 'organisation',
        },
        {
            label: 'project',
            fieldname: 'project',
        },
        
      
        {
            label: 'Value',
            fieldname: 'contract_value',
            width: 2,
            align: 'right',   
        }
    ],
    primaryAction() {
        return {
            label: 'New Contract',
            variant: 'solid',
            slots: {
                prefix: icon('file-plus')
            },
            onClick() {
                const GDialog= defineAsyncComponent(()=>
                import('@/models/contract.vue'))
                renderDialog(
            h(GenericDialog,{
options: {
													title: `Releases for  branch`,
													size: '4xl'
												}
											},
											{
												default: () => h(GDialog)
                      }
          ));
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
  export default {
    components:[ObjectList,h,GenericDialog],

    data() {
        return {
            obtion:contractListConfig
        }
    },
    
} 
</script>
