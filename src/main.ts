import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import * as ApiProvider from '@/api-provider'

const app = createApp(App)

app.use(router)

app.provide(ApiProvider.KEY, ApiProvider.singleton)

app.mount('#app')
