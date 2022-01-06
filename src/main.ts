import { createApp } from 'vue'
import App from './App.vue'
//@ts-ignore
import vClickOutside from "click-outside-vue3"
import './assets/index.css'

createApp(App)
  .use(vClickOutside)
  .mount('#app')


