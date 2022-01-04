import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { BUTTON } from "@/app/team/components/bottomHalf/modes";

export default {
    state() {
        return {
            mode: BUTTON,
        };
    },

    mutations: {
        [SET_BOTTOM_HALF_MODE](state, mode) {
            if (state.mode === mode) return;
            state.mode = mode;
        },
    },
};
