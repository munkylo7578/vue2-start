import 'bootstrap/dist/css/bootstrap.css'

import 'bootstrap-vue/dist/bootstrap-vue.min.css'
import "devextreme/dist/css/dx.common.css";
import "./themes/generated/theme.base.css";
import "./themes/generated/theme.additional.css";

import Vue from "vue";
import themes from "devextreme/ui/themes";
import { BootstrapVue ,IconsPlugin} from "bootstrap-vue";
import PortalVue from 'portal-vue'

import App from "./App";
import router from "./router";
import appInfo from "./app-info";
import Notifications from 'vue-notification'



Vue.use(Notifications)
Vue.config.productionTip = false;
Vue.use(PortalVue)
Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.prototype.$appInfo = appInfo;

themes.initialized(() => {
  new Vue({
    router,
    render: (h) => h(App),
  }).$mount("#app");
});
