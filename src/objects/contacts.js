

export default {
	doctype: 'Contact',
	whitelistedMethods: {},
	list: {
		route: '/contacts',
		title: 'Contacts',
		fields:[
			'email_id',
			'name',
			'user',
			'creation',
		],
		orderBy: 'creation desc',
		columns: [
			{
				label: 'full name',
				fieldname: 'name',
				width: '20rem',
			
			},
			{
				label: 'email',
				fieldname: 'email_id',
				width: '40rem',		
			
			},
			{
				label: '',
				fieldname: 'creation',
				type: 'Timestamp',
				align: 'right'
			}

		]
	},
	detail:{
		titleField: 'name',
		route: '/contacts/:name',
		tabs:[]
	}

};
