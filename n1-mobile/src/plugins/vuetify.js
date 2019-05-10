import Vue from 'vue'
import Vuetify from 'vuetify/lib'
// import 'vuetify/dist/vuetify.min.css'

import VueAnimateNumber from 'vue-animate-number'
Vue.use(VueAnimateNumber)

import VueQr from 'vue-qr'
Vue.component('vue-qr', VueQr)

Vue.use(Vuetify, {
  iconfont: 'md',
})
