import { ROUND_ENDED, SET_TOUR_ACTIVE_TEAM_ID } from "@/app/team/modules/mutations";
import colors from "@/app/shared/teamColors";

export default {
    state() {
        return {
            id: -1,
        };
    },

    mutations: {
        [SET_TOUR_ACTIVE_TEAM_ID](state, teamId) {
            state.id = teamId;
        },

        [ROUND_ENDED](state) {
            state.id = -1;
        },
    },

    getters: {
        activeTeamColor: (state) => {
            return colors.get(state.id);
        },
    },
};
