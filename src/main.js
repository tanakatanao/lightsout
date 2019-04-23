import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import lodash from "lodash";
Object.defineProperty(Vue.prototype, "$lodash", { value: lodash });

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
