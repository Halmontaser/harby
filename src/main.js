
import './assets/main.css'
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { initSocket } from './socket';

import {resourcesPlugin,pageMetaPlugin,setConfig,
    frappeRequest,
    FrappeUI} from "frappe-ui"
let socket;
socket = initSocket();

setConfig('resourceFetcher', frappeRequest)
const app = createApp(App)
app.use(resourcesPlugin);
app.use(pageMetaPlugin);
app.use(router)
app.config.globalProperties.$socket = socket;
window.$socket = socket;
app.use(FrappeUI)
importGlobals()
app.mount('#app')

function importGlobals() {
	return import('./globals.ts').then(globals => {
		app.use(globals.default);
	});
}
