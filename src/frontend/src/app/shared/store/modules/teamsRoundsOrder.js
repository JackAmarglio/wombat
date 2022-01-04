import {
    PROCESS_SERVER_TEAMS_ROUNDS_ORDER,
    SET_BACKEND_ACTOR_STATE,
    SET_TEAMS_ROUNDS_ORDER,
} from "@/app/shared/store/modules/mutations";

export default {
    state: () => {
        return {
            current: [],
            roundActiveTeamsNumber: 0,
        };
    },

    mutations: {
        [SET_BACKEND_ACTOR_STATE](state, backendState) {
            // Not work for a host as he logs in before setting configuration so no value in backend state
            state.roundActiveTeamsNumber = backendState.gameConfiguration.roundActiveTeamsNumber;
        },

        [SET_TEAMS_ROUNDS_ORDER](state, teamsRoundsOrder) {
            state.current = teamsRoundsOrder;
        },

        [PROCESS_SERVER_TEAMS_ROUNDS_ORDER](state, teamsRoundsOrder) {
            const { current } = state;

            if (current.length > 0) {
                const flattenedCurrent = current.map((i) => i.teamsIds);

                if (JSON.stringify(flattenedCurrent) === JSON.stringify(teamsRoundsOrder)) return;
            }

            state.current = teamsRoundsOrder.map((teamsIds, index) => {
                return { initRoundNumber: index + 1, teamsIds };
            });
        },
    },

    getters: {
        isTeamsRoundsOrderValid: (state, { isTeamsIdsValid }) => {
            return !state.current.some((item) => isTeamsIdsValid(item.teamsIds) === false);
        },

        isTeamsIdsValid: (state) => (teamsIds) => {
            return teamsIds.length === state.roundActiveTeamsNumber;
        },
    },
};
