import {
    DECREASE_TEAM_REMAINING_ATTEMPTS,
    INCREASE_TEAM_REMAINING_ATTEMPTS,
    ROUND_ENDED,
    SET_TEAM_REMAINING_ATTEMPTS,
} from "@/app/team/modules/mutations";
import { SET_BACKEND_ACTOR_STATE } from "@/app/shared/store/modules/mutations";

// Попытки отвечать после активной команды
export default {
    state: () => {
        return {
            initAttempts: 0,
            teamsAttempts: {},
        };
    },

    mutations: {
        [SET_TEAM_REMAINING_ATTEMPTS](state, { teamId, attempts }) {
            state.teamsAttempts[teamId] = attempts;
        },

        [INCREASE_TEAM_REMAINING_ATTEMPTS](state, { teamId, numberToIncrease }) {
            state.teamsAttempts[teamId] += numberToIncrease;
        },

        [DECREASE_TEAM_REMAINING_ATTEMPTS](state, { teamId, numberToDecrease }) {
            state.teamsAttempts[teamId] -= numberToDecrease;
        },

        [SET_BACKEND_ACTOR_STATE](state, screenBackendState) {
            const { gameConfiguration } = screenBackendState;
            const { initialNumberOfAttemptsToAnswerAfterActiveTeam } = gameConfiguration;

            const teamAttempts = {};

            const maxPossibleTeamId = 7;
            const minPossibleTeamId = 1;
            for (let i = minPossibleTeamId; i < maxPossibleTeamId; i++) {
                teamAttempts[i] = initialNumberOfAttemptsToAnswerAfterActiveTeam;
            }

            state.initAttempts = initialNumberOfAttemptsToAnswerAfterActiveTeam;
            state.teamsAttempts = Object.assign({}, state.teamsAttempts, teamAttempts);
        },

        [ROUND_ENDED](state) {
            const teamAttempts = {};

            const maxPossibleTeamId = 7;
            const minPossibleTeamId = 1;
            for (let i = minPossibleTeamId; i < maxPossibleTeamId; i++) {
                teamAttempts[i] = state.initAttempts;
            }

            state.teamsAttempts = Object.assign({}, this.teamsAttempts, teamAttempts);
            state.remainingAttempts = state.initAttempts;
        },
    },

    getters: {
        getTeamAttempts: (state) => (teamId) => {
            return state.teamsAttempts[teamId];
        },

        currentTeamAttempts: (state, _, rootState) => {
            const currentTeamId = rootState.team.id;

            return state.teamsAttempts[currentTeamId];
        },

        teamsAttemptsIterable: (state) => {
            const attempts = state.teamsAttempts;

            return Object.entries(attempts).map((e) => {
                return { teamId: parseInt(e[0]), attempts: e[1] };
            });
        },
    },

    actions: {
        increaseCurrentTeamAttempts({ commit, rootState }, numberToIncrease) {
            const currentTeamId = rootState.team.id;

            commit(INCREASE_TEAM_REMAINING_ATTEMPTS, {
                teamId: currentTeamId,
                numberToIncrease: numberToIncrease,
            });
        },

        decreaseCurrentTeamAttempts({ commit, rootState }, numberToDecrease) {
            const currentTeamId = rootState.team.id;

            commit(DECREASE_TEAM_REMAINING_ATTEMPTS, {
                teamId: currentTeamId,
                numberToDecrease: numberToDecrease,
            });
        },
    },
};
