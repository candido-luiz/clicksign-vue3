import './assets/tailwind/index.css';
import './assets/base.css';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.js'
import './assets/scss/bootstrap/custom.scss';

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { piniaPluginPersist } from "@/plugins/pinia/persistPlugin";
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'

import App from './App.vue'
import router from './router'

const app = createApp(App)

const pinia = createPinia();

pinia.use(piniaPluginPersist);

app.use(pinia);
app.use(router);
app.use(autoAnimatePlugin);

app.mount('#app')
