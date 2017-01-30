// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import VueResource from 'vue-resource'
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

// The Vue thing
Vue.use(VueResource)
Vue.use(VueMaterial)

// Theme
Vue.material.registerTheme({
  default: {
    primary: 'blue',
    accent: 'pink',
    background: 'white'
  },
  white: {
    primary: 'white',
    accent: 'deep-purple'
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  data () {
    return {
      version: "0.001"
    }
  }
})
