import { createApp } from 'vue'
import App from './App.vue'
import router from './pages/router'
import './style.css'
import { api, API_PROVIDER_KEY } from 'providers/api'

import dayjs from 'dayjs'
import utcDayjsPlugin from 'dayjs/plugin/utc'
dayjs.extend(utcDayjsPlugin)
dayjs.extend((_option, dayjsClass, _dayjsFactory) => {
  const oldFormat = dayjsClass.prototype.format

  dayjsClass.prototype.format = function (formatString) {
    return oldFormat.bind(this)(formatString ?? 'YYYY-MM-DDTHH:mm:ss')
  }
})

createApp(App).use(router).provide(API_PROVIDER_KEY, api).mount('#app')
