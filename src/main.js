import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router/index.js'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import './style.css'
import App from './App.vue'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1565C0',
          secondary: '#424242',
          accent: '#1976D2',
          background: '#F5F5F5',
          surface: '#FFFFFF',
        },
      },
    },
  },
  defaults: {
    global: {
      ripple: false,
    },
  },
})

createApp(App).use(createPinia()).use(vuetify).use(router).mount('#app')
