list: {
    route: '/sites',
    title: 'Sites',
    fields: [
        'plan.plan_title as plan_title',
        'plan.price_usd as price_usd',
        'plan.price_inr as price_inr',
        'group.title as group_title',
        'group.public as group_public',
        'group.team as group_team',
        'group.version as version',
        'cluster.image as cluster_image',
        'cluster.title as cluster_title',
        'trial_end_date'
    ],
    orderBy: 'creation desc',
    searchField: 'host_name',
    filterControls() {
        return [
            {
                type: 'select',
                label: 'Status',
                fieldname: 'status',
                options: ['', 'Active', 'Inactive', 'Suspended', 'Broken']
            },
            {
                type: 'link',
                label: 'Version',
                fieldname: 'group.version',
                options: {
                    doctype: 'Frappe Version'
                }
            },
            {
                type: 'link',
                label: 'Bench',
                fieldname: 'group',
                options: {
                    doctype: 'Release Group'
                }
            },
            {
                type: 'select',
                label: 'Region',
                fieldname: 'cluster',
                options: [
                    '',
                    'Bahrain',
                    'Cape Town',
                    'Frankfurt',
                    'KSA',
                    'London',
                    'Mumbai',
                    'Singapore',
                    'UAE',
                    'Virginia',
                    'Zurich'
                ]
            },
            {
                type: 'link',
                label: 'Tag',
                fieldname: 'tags.tag',
                options: {
                    doctype: 'Press Tag',
                    filters: {
                        doctype_name: 'Site'
                    }
                }
            }
        ];
    },
    columns: [
        {
            label: 'type',
            fieldname: 'attachmet_type',
            width: 1.5,
            class: 'font-medium',
            format(value, row) {
                return value || row.name;
            }
        },
        { label: 'Status', fieldname: 'status', type: 'Badge', width: 0.8 },
        {
            label: 'Plan',
            fieldname: 'plan',
            width: 0.75,
            format(value, row) {
                if (row.trial_end_date) {
                    return trialDays(row.trial_end_date);
                }
                let $team = getTeam();
                if (row.price_usd > 0) {
                    let india = $team.doc.country == 'India';
                    let formattedValue = userCurrency(
                        india ? row.price_inr : row.price_usd,
                        0
                    );
                    return `${formattedValue} /mo`;
                }
                return row.plan_title;
            }
        },
        {
            label: 'Cluster',
            fieldname: 'cluster',
            width: 1,
            format(value, row) {
                return row.cluster_title || value;
            },
            prefix(row) {
                return h('img', {
                    src: row.cluster_image,
                    class: 'w-4 h-4',
                    alt: row.cluster_title
                });
            }
        },
        {
            label: 'Bench',
            fieldname: 'group',
            width: '15rem',
            format(value, row) {
                return row.group_public ? 'Shared' : row.group_title || value;
            }
        },
        {
            label: 'Version',
            fieldname: 'version',
            width: 0.5
        }
    ],
    primaryAction({ listResource: sites }) {
        return {
            label: 'New Site',
            variant: 'solid',
            slots: {
                prefix: icon('plus')
            },
            onClick() {
                router.push({ name: 'New Site' });
            }
        };
    }