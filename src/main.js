import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from './store';

Vue.config.productionTip = false;

import "./assets/basic.less"

import vueJustgage from 'vue-justgage';
Vue.use(vueJustgage);

/*iView*/
// import "./assets/iview.css"
import "./assets/my-theme/index.less"
//import "iview/dist/styles/iview.css"
import iView from 'iview'
Vue.use(iView)

/*axios*/
import https from './util/https.js'
Vue.prototype.$https = https;

// lodash.js
import _ from 'lodash'
Vue.prototype._ = _

//切换伟思，绿盟，昊天皮肤
Vue.prototype.$theme = process.env.VUE_APP_LOGO;

import util from './util/util.js';
Vue.prototype.$util = util;
import api from './util/api.js';
Vue.prototype.$api = api;
import storage from './util/web-storage.js';
Vue.prototype.$storage = storage;


/*echarts*/
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;

// import Contextmenu from 'vue-contextmenujs'
// Vue.use(Contextmenu);



new Vue({
    router,
    store,
    render: h => h(App)
}).$mount("#app");