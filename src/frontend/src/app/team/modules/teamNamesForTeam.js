import teamNames from "@/app/shared/store/modules/teamNames";
import { SET_TEAM_NAME } from "@/app/shared/store/modules/mutations";

// or use lodash merge
export default {
    ...teamNames,

    actions: {
        ...teamNames.actions,

        async changeCurrentTeamName({ commit, rootState }, name) {
            const { signalrClient, id } = rootState.team;

            await signalrClient.changeTeamName(name);

            commit(SET_TEAM_NAME, { teamId: id, name });
        },
    },

    getters: {
        ...teamNames.getters,

        currentTeamName: (state, _, rootState) => {
            const currentTeamId = rootState.team.id;

            return state.all[currentTeamId];
        },
    },
};
