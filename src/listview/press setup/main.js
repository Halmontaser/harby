import { createApp } from 'vue';
import {
	setConfig,
	frappeRequest,
	pageMetaPlugin,
	resourcesPlugin
} from 'frappe-ui';
import App from './App.vue';
import router from './router';
import { initSocket } from './socket';
import { subscribeToJobUpdates } from './utils/agentJob';
import { fetchPlans } from './data/plans.js';
import * as Sentry from '@sentry/vue';
import { session } from './data/session.js';
import { toast } from 'vue-sonner';
import './vendor/posthog.js';

let request = options => {
	let _options = options || {};
	_options.headers = options.headers || {};
	let currentTeam = localStorage.getItem('current_team') || window.default_team;
	if (currentTeam) {
		_options.headers['X-Press-Team'] = currentTeam;
	}
	return frappeRequest(_options);
};
setConfig('resourceFetcher', request);
setConfig('defaultListUrl', 'press.api.client.get_list');
setConfig('defaultDocGetUrl', 'press.api.client.get');
setConfig('defaultDocInsertUrl', 'press.api.client.insert');
setConfig('defaultRunDocMethodUrl', 'press.api.client.run_doc_method');
setConfig('defaultDocUpdateUrl', 'press.api.client.set_value');
setConfig('defaultDocDeleteUrl', 'press.api.client.delete');

let app;
let socket;

getInitialData().then(() => {
	app = createApp(App);
	app.use(router);
	app.use(resourcesPlugin);
	app.use(pageMetaPlugin);

	socket = initSocket();
	app.config.globalProperties.$socket = socket;
	window.$socket = socket;
	subscribeToJobUpdates(socket);
	if (session.isLoggedIn) {
		fetchPlans();
		session.roles.fetch();
	}

	if (window.press_dashboard_sentry_dsn.includes('https://')) {
		Sentry.init({
			app,
			dsn: window.press_dashboard_sentry_dsn,
			integrations: [
				Sentry.browserTracingIntegration({ router }),
				Sentry.replayIntegration()
			],
			replaysSessionSampleRate: 0.1,
			replaysOnErrorSampleRate: 1.0,
			beforeSend(event, hint) {
				const ignoreErrors = [
					/api\/method\/press.api.client/,
					/dynamically imported module/,
					/NetworkError when attempting to fetch resource/,
					/Load failed/,
					/Importing a module script failed./
				];
				const ignoreErrorTypes = [
					'BuildValidationError',
					'ValidationError',
					'PermissionError',
					'SecurityException',
					'AuthenticationError'
				];
				const error = hint.originalException;

				if (
					error?.name === 'DashboardError' ||
					ignoreErrorTypes.includes(error?.exc_type) ||
					(error?.message && ignoreErrors.some(re => re.test(error.message)))
				)
					return null;

				return event;
			},
			logErrors: true
		});
	}

	if (
		window.press_frontend_posthog_project_id &&
		window.press_frontend_posthog_host &&
		window.posthog
	) {
		window.posthog.init(window.press_frontend_posthog_project_id, {
			api_host: window.press_frontend_posthog_host,
			person_profiles: 'identified_only',
			autocapture: false,
			disable_session_recording: true,
			session_recording: {
				maskAllInputs: true
			}
		});
	} else {
		// unset posthog if not configured
		window.posthog = undefined;
	}

	importGlobals().then(() => {
		app.mount('#app');
	});
});

function getInitialData() {
	if (import.meta.env.DEV) {
		return frappeRequest({
			url: '/api/method/press.www.dashboard.get_context_for_dev'
		}).then(values => Object.assign(window, values));
	} else {
		return Promise.resolve();
	}
}

function importGlobals() {
	return import('./globals.ts').then(globals => {
		app.use(globals.default);
	});
}
