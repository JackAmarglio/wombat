import { SET_BACKEND_ACTOR_STATE, SET_TEAM_NAME } from "@/app/shared/store/modules/mutations";

export default {
    state() {
        return {
            all: {},
        };
    },

    mutations: {
        [SET_BACKEND_ACTOR_STATE](state, backendState) {
            const { teamIdToTeamName } = backendState;

            Object.entries(teamIdToTeamName).forEach(([teamId, name]) => {
                let teamNameToSet = name;

                // Я не совсем понял, но почему-то teamId тут как строка, хотя в самом объекте это должен быть number
                if (teamId === name || teamId === parseInt(name)) teamNameToSet = `Команда ${teamId}`;

                state.all = { ...state.all, [teamId]: teamNameToSet };
            });
        },

        [SET_TEAM_NAME](state, { teamId, name }) {
            if (state.all[teamId] === undefined) {
                console.error("Team name must be pre initialized", { missingNameTeamId: teamId });
            }

            state.all[teamId] = name;
        },
    },
};
