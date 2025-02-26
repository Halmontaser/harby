import {h} from 'vue'
import {Badge, createResource} from 'frappe-ui';
import {  icon,renderDialog,confirmDialog } from '../utils/components';
import TenderEvents from '../components/TenderEvents.vue'
import eventrow from '../components/eventrow.vue'

export default {
	doctype: 'tender',
	whitelistedMethods: {},
	list: {
		route: '/tenders',
		title: 'tender',
		fields:[
			
			'tender_name','docstatus','techevaltype'
		],
		orderBy: 'creation desc',
		columns: [
			{
				label: 'tender name',
				fieldname: 'tender_name',
				width: '20rem',
			
			},
			
			{
				label: 'name',
				fieldname: 'name',
			},
			{
				label: 'Status',
				fieldname:'docstatus',
				width: 0.2,
				prefix:icon("home"),
				suffix:icon("check"),
				format: value => {			
				return value?'enable':'desable';
																	}
				
				
																},
																{
				label: 'fullname',
				fieldname: 'techevaltype',

				
			},{label: 'Primary',
				fieldname: 'docstatus',
				type: 'Icon',
				Icon(value) {
					return !value ? 'uncheck' : 'check';
				}
			}
			
			

		],
		rowActions({ row, documentResource: tender }){
			return [{	
				group:'hellow',
				items:[
					{label:'hellow first',
					onClick(){console.log("hi")}
	
					},
					{label:"hellow two",
					onClick(){console.log("from two")}
					}
				]
			}]
		},
	
		primaryAction ({ listResource: apps, documentResource: tender }){
			return {
				label: 'hellow',
				variant: 'solid',
				icon:"plus",
				onClick(){ console.log("hello from primary");
					confirmDialog(
					{ title:"hello",
					messsage:"hello",	
					fields:[
						{label:'first name',fieldname:'name',type:"text"},

						{label:'tender',fieldname:'tender_name',type:"data"}
					],
					primaryAction(values){
						console.log(values)
					}
				  ,onSuccess({hide}){
					hide()
					console.log("from button");
				}
					});
					
				}
			}
	},
		secondaryAction ({ listResource: apps, documentResource: tender }){
			return {
				label: 'secondary',
				slots:{prefix:icon('plus')

				},
				onClick: () => {
					confirmDialog({
						title: 'Login as Administrator',
						message: 'Are you sure you want to login as administrator on the site <b></b>?',
						fields:
								 [
										{
											label: 'Reason',
											type: 'textarea',
											fieldname: 'tender_name'
										}
								  ],
								
						onSuccess: ({ hide, values }) => {
							
							return hide();
								
						}
					});
				}					
					
				}
			
	},actions(context) {
		let { documentResource: tender } = context;
		return [{label:'hellow first',
			icon:'trash',
			onClick(){console.log("action hi")}

			},
			{label:"hellow two",
			onClick(){console.log("action two")}
			}
		
		]}
},
	detail:{
		titleField: 'tender_name',
		route: '/tender/:name',
	
		tabs:[
			{label:"hello",route:"overview"
			,icon:icon("upload"),
			type:"list",
			list:{
				doctype:'bidder_quotation',
				fields:['tender_name','bidder'],
				filters:tender =>{return {tender_name:tender.doc.name}},	
				columns:[
					{
label:'o',
fieldname:'name'

					},
					{
label:'varient',
fieldname:'bidder'


					},
					
				],
				actions({ listResource: bidder_quotation,documentResource:tender }) {
					return [{
						label: 'New Site',
						variant: 'solid',
						slots: {
							prefix: icon('plus')
						},
						onClick() {
							console.log("hello");
						}
					},{
						label:'withdrow',
						slots: {
							prefix: icon('trash')
						},
						variant:'solid'

					}]
				},
			rowActions ({row,listResource: bidder_quotation,documentResource:tender}){
				return [{group:"test",
					items:[{
				label: 'New Site',
				variant: 'solid',
				slots: {
					prefix: icon('plus')
				},
				onClick() {
					console.log("hello");
				}
			},{
				label:'withdrow',
				slots: {
					prefix: icon('trash')
				},
				variant:'solid'

			}]
		}
	]}
}},
		
		{
			label:"harby",route:"harby"
			,icon:icon("plus"),
			type:"list",
			list:{
                data:({documentResource:tender})=> {return tender.doc.doc_param},
				columns:[
					
					
					{
label:'group',
fieldname:'bc_group'


					},
					{
label:'p_name',
fieldname:'p_name'


					},
					
				]
			}},
			{
				label: 'Actions',
				icon: icon('activity'),
				route: 'actions',
				type: 'Component',
				component: eventrow,
				props: tender => {
					return { tender: tender.doc.name };
				}
			},
		{label:"param",
		route:"roaa"
			,icon:icon("plus"),
			type:"list",
			list:{

				data:({documentResource:tender}) =>{return tender.doc.fixed_parameter},	
				columns:[
					{
label:'variation name',
fieldname:'variation_name'

					},

					{
label:'standard value',
fieldname:'standard_value'


					},
					{
label:'group',
fieldname:'group'


					},
					
				],
				primaryAction({ listResource: wgt,documentResource:tender }) {
					return {
						label: 'New Site',
						variant: 'solid',
						slots: {
							prefix: icon('plus')
						},
						onClick() {
							console.log(wgt,tender);
						}
					};
				}
			}
		},
			{label:"bidder",route:"bidder",icon:icon("home"),
				type:'list',
				list:{
				data:({documentResource:tender})=> {return tender.doc.bidders2},

				columns:
				[{label:'bidder',fieldname:'bidder'},
				{label:'idx',fieldname:'idx'},
					
			   {label:'total price',fieldname:'total_price'}]


					
				}
			},
		
		]
	}

};
