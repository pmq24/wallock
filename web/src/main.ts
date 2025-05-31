import { createApp } from 'vue'
import App from './App.vue'
import router from './pages/router'
import './style.css'
import { api, API_PROVIDER_KEY } from 'providers/api'
import setUpEnv from 'setUpEnv'

setUpEnv()

createApp(App).use(router).provide(API_PROVIDER_KEY, api).mount('#app')
