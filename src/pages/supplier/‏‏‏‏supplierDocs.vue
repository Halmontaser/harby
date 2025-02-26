<script setup>
import { ListView } from 'frappe-ui';
import { FeatherIcon,TabButtons} from 'frappe-ui';
import { ref,h,computed,reactive ,onMounted} from 'vue';
const selectable = ref(true);
const showTooltip = ref(true);


const sim_columns = reactive([
      { label: 'type_name', key: 'type_name',width:1},
      { label: 'description', key: 'description',width:4},
      { label: 'action', key: 'rr',width:1},
    ])
const dataA={"pre_tender": [
      {
        "category": "pre_tender",
        "type_name": "expression_of_interest",
        "description": "Formal document indicating preliminary interest in participating in the tender process",
        "metadata": {
          "validity_period": "typically 30-90 days",
          "required_fields": [
            "company_details",
            "financial_capacity",
            "technical_capability",
            "past_experience"
          ],
          "file_formats": ["pdf", "docx"],
          "security_level": "confidential"
        }
      },
      {
        "category": "pre_tender",
        "type_name": "market_research_report",
        "description": "Analysis of market conditions, competitors, and industry trends",
        "metadata": {
          "update_frequency": "quarterly",
          "data_sources": [
            "industry_reports",
            "competitor_analysis",
            "market_surveys"
          ],
          "classification": "internal_use",
          "retention_period": "3 years"
        }
      },
      {
        "category": "pre_tender",
        "type_name": "feasibility_study",
        "description": "Detailed analysis of project viability including technical, financial, and operational aspects",
        "metadata": {
          "components": [
            "technical_analysis",
            "financial_analysis",
            "risk_assessment",
            "environmental_impact"
          ],
          "review_cycle": "annual",
          "approval_levels": ["technical_committee", "board"]
        }
      }
    ],
    "tender_core": [
      {
        "category": "tender_core",
        "type_name": "request_for_proposal",
        "description": "Comprehensive document detailing project requirements and submission guidelines",
        "metadata": {
          "sections": [
            "project_overview",
            "scope_of_work",
            "technical_requirements",
            "evaluation_criteria",
            "submission_guidelines"
          ],
          "validity_period": "60-120 days",
          "confidentiality_level": "restricted",
          "version_control": "required"
        }
      },
      {
        "category": "tender_core",
        "type_name": "bill_of_quantities",
        "description": "Itemized list of materials, parts, and labor with quantities and specifications",
        "metadata": {
          "structure": [
            "item_code",
            "description",
            "unit",
            "quantity",
            "rate",
            "amount"
          ],
          "pricing_format": "unit_rate",
          "calculation_rules": "specified",
          "revision_tracking": "mandatory"
        }
      }
    ],
    "legal": [
      {
        "category": "legal",
        "type_name": "non_disclosure_agreement",
        "description": "Legal document ensuring confidentiality of shared information",
        "metadata": {
          "duration": "project_duration_plus_2_years",
          "parties": ["bidder", "tender_issuer"],
          "legal_jurisdiction": "specified",
          "enforcement_terms": "included"
        }
      },
      {
        "category": "legal",
        "type_name": "draft_contract",
        "description": "Proposed legal agreement defining terms and conditions",
        "metadata": {
          "components": [
            "general_conditions",
            "special_conditions",
            "scope_of_work",
            "pricing_terms",
            "service_levels"
          ],
          "review_requirements": ["legal", "technical", "commercial"],
          "negotiation_status": "tracked"
        }
      }
    ],
    "financial": [
      {
        "category": "financial",
        "type_name": "financial_statements",
        "description": "Company financial records including balance sheets and profit/loss statements",
        "metadata": {
          "period_covered": "3_years",
          "audit_requirement": "required",
          "components": [
            "balance_sheet",
            "income_statement",
            "cash_flow",
            "audit_report"
          ],
          "certification": "required"
        }
      },
      {
        "category": "financial",
        "type_name": "bid_bond",
        "description": "Financial guarantee for bid submission",
        "metadata": {
          "value": "percentage_of_bid",
          "validity": "bid_period_plus_30_days",
          "issuer_requirements": "bank_or_insurance",
          "format": "standardized"
        }
      }
    ],
    "technical": [
      {
        "category": "technical",
        "type_name": "technical_proposal",
        "description": "Detailed technical solution and implementation approach",
        "metadata": {
          "sections": [
            "executive_summary",
            "technical_approach",
            "methodology",
            "work_plan",
            "team_structure"
          ],
          "format_requirements": "specified",
          "evaluation_criteria": "included"
        }
      },
      {
        "category": "technical",
        "type_name": "quality_management_plan",
        "description": "Document outlining quality control and assurance measures",
        "metadata": {
          "components": [
            "quality_policy",
            "control_measures",
            "inspection_plans",
            "reporting_procedures"
          ],
          "standards_compliance": "required",
          "review_frequency": "monthly"
        }
      }
    ],
    "compliance": [
      {
        "category": "compliance",
        "type_name": "tax_compliance_certificate",
        "description": "Official document proving tax compliance status",
        "metadata": {
          "validity_period": "annual",
          "issuing_authority": "tax_agency",
          "verification_method": "online",
          "renewal_requirement": "automatic"
        }
      },
      {
        "category": "compliance",
        "type_name": "health_safety_certification",
        "description": "Certification of compliance with health and safety regulations",
        "metadata": {
          "standards": ["iso45001", "local_regulations"],
          "audit_frequency": "annual",
          "coverage": "comprehensive",
          "reporting_requirements": "quarterly"
        }
      }
    ],
    "evaluation": [
      {
        "category": "evaluation",
        "type_name": "bid_evaluation_report",
        "description": "Comprehensive assessment of submitted bids",
        "metadata": {
          "components": [
            "technical_evaluation",
            "commercial_evaluation",
            "compliance_check",
            "recommendation"
          ],
          "scoring_system": "defined",
          "approval_workflow": "multi_level"
        }
      },
      {
        "category": "evaluation",
        "type_name": "clarification_request",
        "description": "Formal request for additional information or clarification",
        "metadata": {
          "response_timeframe": "specified",
          "format": "standardized",
          "tracking_system": "required",
          "documentation": "mandatory"
        }
      }
    ]
  }
  const ffilter=ref('tender_core')
const simple_row = computed(()=>dataA[ffilter.value]);

// Define options directly
const options = {
  selectable: selectable.value,
  showTooltip: showTooltip.value,
  emptyState:{
    title: 'No records found',
    description: 'Create a new record to get started',
    button: {
      label: 'New Record',
      variant: 'solid',
      onClick: () => console.log('New Record'),
    }
  },
  onRowClick: (row) => {
    console.log(row);
  }
};
const validateFileFunction = (fileObject) => {}
const onSuccess = (file) => {}
const getbuttons=()=>{return Object.keys(dataA).map(r=>{let s={};s.label=r;return s})}

</script>
<template>
  <TabButtons
					class="inline-block p-6"
					:buttons="getbuttons()"
					v-model="ffilter"
/>

  <ListView
    :columns="sim_columns"
    :rows="simple_row"
    :options="options"
    row-key="id"
  >
  <template #cell="{ item, row, column }">
    <h3 v-if="column.key=='type_name'">{{ row.type_name }}</h3>
    <span v-if="column.key=='description'">{{ row.description }}</span>
    <FileUploader
    v-if="column.key == 'rr'"
      :fileTypes="['image/*']"
      :validateFile="validateFileFunction"
      @success="onSuccess"
    >
      <template
        v-slot="{
          file,
          uploading,
          progress,
          uploaded,
          message,
          error,
          total,
          success,
          openFileSelector,
        }"
      >
        <Button @click="openFileSelector" :loading="uploading">
          {{ uploading ? `Uploading ${progress}%` : 'Upload Image' }}
        </Button>
      </template>
    </FileUploader>
  </template>
  
  </ListView>
</template>