import { toast } from 'frappe-ui';
import { dayjsLocal } from './utils/dayjs';
import { session } from './data/session';
import { debounce } from 'frappe-ui';
import * as formatters from './utils/format';

export default function globals(app) {
	app.config.globalProperties.$session = session;
	app.config.globalProperties.$toast = toast;
	app.config.globalProperties.$dayjs = dayjsLocal;
	app.config.globalProperties.$platform = getPlatform();
	app.config.globalProperties.$format = formatters;
	app.config.globalProperties.$log = console.log;
	app.config.globalProperties.$debounce = debounce;
	app.config.globalProperties.$isMobile = isMobile();

	// legacy globals for old dashboard
	// TODO: remove later
	app.config.globalProperties.formatBytes = formatters.bytes;
	app.config.globalProperties.$planTitle = formatters.planTitle;
	app.config.globalProperties.$plural = formatters.plural;
}

function getPlatform() {
	const ua = navigator.userAgent.toLowerCase();

	if (ua.indexOf('win') > -1) {
		return 'win';
	} else if (ua.indexOf('mac') > -1) {
		return 'mac';
	} else if (ua.indexOf('x11') > -1 || ua.indexOf('linux') > -1) {
		return 'linux';
	}

	return 'unknown';
}

function isMobile(): boolean {
	return window.innerWidth < 640;
}
