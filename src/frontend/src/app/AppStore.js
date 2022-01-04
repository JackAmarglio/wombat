import Vue from "vue";
import Vuex, { Store } from "vuex";
import authStatus from "@/app/shared/store/modules/authStatus";

Vue.use(Vuex);
export default new Store({
    modules: { authStatus },
});
