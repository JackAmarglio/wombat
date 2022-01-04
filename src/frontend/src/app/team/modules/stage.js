import { SET_STAGE } from "@/app/team/modules/mutations";
import TeamStage from "@/app/team/TeamStage";

export default {
    state() {
        return {
            current: null,
            previous: null,
        };
    },

    mutations: {
        [SET_STAGE](state, newStage) {
            state.previous = state.current;
            state.current = newStage;
        },
    },

    getters: {
        _devStageAsString: (state) => {
            return TeamStage[state.current];
        },
    },
};
