import './assets/main.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { ko } from 'vuetify/locale'

const vuetify = createVuetify({
  icons: {
    iconfont: 'md',
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi
    }
  },
  components,
  directives,
  locale: {
    locale: 'ko',
    fallback: 'ko',
    messages: { ko }
  }
})

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify)

app.mount('#app')
