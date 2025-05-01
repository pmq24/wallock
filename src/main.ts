import { createApp } from 'vue'
import App from './App.vue'
import router from './pages/router'
import './style.css'

createApp(App).use(router).mount('#app')
