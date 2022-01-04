import { CLOSE_LOGOUT_GUARD, OPEN_LOGOUT_GUARD } from "@/app/shared/store/modules/mutations";

export default {
    state() {
        return {
            isActive: false,
        };
    },

    mutations: {
        [OPEN_LOGOUT_GUARD](state) {
            state.isActive = true;
        },

        [CLOSE_LOGOUT_GUARD](state) {
            state.isActive = false;
        },
    },
};
