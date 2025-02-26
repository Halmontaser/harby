import { icon } from "../utils/components";


export default {
	doctype: 'bidder',
	whitelistedMethods: {},
	list: {
		route: '/bidders',
		title: 'Bidders',
		fields:[
			
			'bidder_name_ar'
					],
		columns: [
			{
				label: 'name',
				fieldname: 'name',
				width: '40rem',
			
			},
			
			{
				label: 'bidder ar',
				fieldname: 'bidder_name_ar',
				align: 'right'
			}

		],
			primaryAction({listResource: bidder}) {
				return {
					label: 'New Site',
					variant: 'solid',
					slots: {
						prefix: icon('plus')
					},
					onClick() {
						console.log("hellow");
					}
				}


	}},
	detail:{
		titleField: 'name',
		route: '/bidders/:name',
		tabs:[]
	}

};
