import { createApp } from 'vue'
import App from './app.vue'
import router from './pages'

import i18n from '@/i18n'
import i18nextVue from 'i18next-vue'

import * as v from 'valibot'
import '@/i18n/valibot-en'
v.setGlobalConfig({ lang: 'en' })

import * as ApiProvider from '@/api-provider'

const app = createApp(App)
app.use(router)
app.use(i18nextVue, { i18next: i18n })
app.provide(ApiProvider.KEY, ApiProvider.singleton)
app.mount('#app')
