import { SET_AUTHENTICATION_STATE } from "@/app/shared/store/modules/mutations/authStatus";

export default {
    state() {
        return {
            isAuthenticated: false,
        };
    },

    mutations: {
        [SET_AUTHENTICATION_STATE](state, { isAuthenticated }) {
            state.isAuthenticated = isAuthenticated;
        },
    },
};
