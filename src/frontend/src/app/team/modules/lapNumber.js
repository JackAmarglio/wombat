import { ROUND_ENDED, SET_LAP_NUMBER } from "@/app/team/modules/mutations";

export default {
    state() {
        return {
            current: 0,
        };
    },

    mutations: {
        [SET_LAP_NUMBER](state, number) {
            state.current = number;
        },

        [ROUND_ENDED](state) {
            state.current = 0;
        },
    },
};
