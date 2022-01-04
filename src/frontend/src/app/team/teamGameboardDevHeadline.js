/*Used only in dev*/

import Vue from "vue";
import DevTeamHeadline from "@/app/team/DevTeamHeadline";

let instance;

export default {
    mounted() {
        if (process.env.NODE_ENV !== "development") return;

        const compClass = Vue.extend(DevTeamHeadline);
        instance = new compClass();
        instance.$store = this.$store;

        instance.$mount();

        this.$root.$el.appendChild(instance.$el);
    },

    beforeDestroy() {
        if (process.env.NODE_ENV !== "development") return;

        // Vue 3 incompatible
        // Could use smth like https://forum.vuejs.org/t/how-to-destroy-vue-3-component-programatically/116872
        instance.$destroy();
        instance.$el.remove();
    },
};
