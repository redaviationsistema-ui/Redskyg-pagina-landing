import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css'

import VCalendar from 'v-calendar'
import 'v-calendar/style.css'

createApp(App)
  .use(router)
  .use(VCalendar, {})   // 👈 IMPORTANTE agregar esto
  .mount('#app')