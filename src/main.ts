import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import { createI18n } from 'vue-i18n'
import en from '@/i18n/en'

import * as ApiProvider from '@/api-provider'

const app = createApp(App)

app.use(router)

const i18n = createI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en
  }
})
app.use(i18n)

app.provide(ApiProvider.KEY, ApiProvider.singleton)

app.mount('#app')
