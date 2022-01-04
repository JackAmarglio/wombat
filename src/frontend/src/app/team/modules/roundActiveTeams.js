import { SET_ROUND_ACTIVE_TEAMS } from "@/app/team/modules/mutations/roundActiveTeams";

export default {
    state() {
        return {
            current: [],
        };
    },

    mutations: {
        [SET_ROUND_ACTIVE_TEAMS](state, teamsIds) {
            state.current = teamsIds;
        },
    },
};
