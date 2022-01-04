import Vue from "vue";
import App from "@/app/App.vue";
import router from "@/app/AppRoutes";
import store from "@/app/AppStore";

import { FormPlugin, IconsPlugin, BootstrapVue } from "bootstrap-vue";
import Vue2TouchEvents from "vue2-touch-events";
import "bootstrap/dist/css/bootstrap.css";

import "bootstrap-vue/dist/bootstrap-vue.css";

const isDev = process.env.NODE_ENV === "development";

Vue.config.productionTip = !isDev;
Vue.use(BootstrapVue);
Vue.use(FormPlugin);
Vue.use(IconsPlugin);
Vue.use(Vue2TouchEvents);

if (isDev) document.title = "<dev> Wombat";
else document.title = "Wombat";

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");
