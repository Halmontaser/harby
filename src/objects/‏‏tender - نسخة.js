let ConfigEditorDialog = defineAsyncComponent(() =>
	import('../components/ConfigEditorDialog.vue')
);
renderDialog(
	h(ConfigEditorDialog, {
		site: site.doc.name,
		config: row,
		onSuccess() {
			configs.reload();
		}
	})
);

secondaryAction({ listResource: configs }) {
	return {
		label: 'Preview',
		slots: {
			prefix: icon('eye')
		},
		onClick() {
			let ConfigPreviewDialog = defineAsyncComponent(() =>
				import('../components/ConfigPreviewDialog.vue')
			);
			renderDialog(
				h(ConfigPreviewDialog, {
					configs: configs.data
				})
			);
		}
	};
}

onClick() {
	confirmDialog({
		title: 'Schedule Backup',
		message:
			'Are you sure you want to schedule a backup? This will create an onsite backup.',
		onSuccess({ hide }) {
			toast.promise(
				site.backup.submit({
					with_files: true
				}),
				{
					loading: 'Scheduling backup...',
					success: () => {
						hide();
						toast.success('Backup scheduled');
						router.push({
							name: 'Site Jobs',
							params: { name: site.name }
						});
					},
					error: e => {
						return e.messages.length
							? e.messages.join('\n')
							: e.message;
					}
				}
			);
		}
	});
}

confirmDialog({
	title: `Set Primary Domain`,
	message: `Are you sure you want to set the domain <b>${row.domain}</b> as the primary domain for the site <b>${site.doc.name}</b>?`,
	onSuccess({ hide }) {
		if (site.setPrimaryDomain.loading) return;
		toast.promise(
			site.setPrimaryDomain.submit({
				domain: row.domain
			}),
			{
				loading: 'Setting primary domain...',
				success: () => {
					hide();
					return 'Primary domain set';
				},
				error: e => {
					return e.messages.length
						? e.messages.join('\n')
						: e.message;
				}
			}
		);
	}
});
}
},
{
label: 'Redirect to Primary',
condition: () => !row.primary && !row.redirect_to_primary,
onClick() {
confirmDialog({
	title: `Redirect Domain`,
	message: `Are you sure you want to redirect the domain <b>${row.domain}</b> to the primary domain of the site <b>${site.doc.name}</b>?`,
	onSuccess({ hide }) {
		if (site.redirectToPrimary.loading) return;
		toast.promise(
			site.redirectToPrimary.submit({
				domain: row.domain
			}),
			{
				loading: 'Redirecting domain...',
				success: () => {
					hide();
					return 'Domain redirected';
				},
				error: e => {
					return e.messages.length
						? e.messages.join('\n')
						: e.message;
				}
			}
		);
	}
});
}
},
