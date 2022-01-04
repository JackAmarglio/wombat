import { SET_OTHER_TEAM_SUSPENSE_TIMEOUT } from "@/app/team/modules/mutations";

export default {
    state() {
        return {
            timeout: 0,
        };
    },

    mutations: {
        [SET_OTHER_TEAM_SUSPENSE_TIMEOUT](state, timeout) {
            state.timeout = timeout;
        },
    },
};
