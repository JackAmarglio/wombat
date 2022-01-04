import ScreenService from "@/app/screen/services/ScreenService";
import { createGameScreenRClient } from "@/app/shared/SignalrWombat";
import roundQuestionTopics from "@/app/host/modules/roundQuestionTopics";
import { SET_AUTHENTICATION_STATE } from "@/app/shared/store/modules/mutations/authStatus";

export default {
    namespaced: true,
    state: {
        signalrClient: null,
        gameInfo: {},
    },

    mutations: {
        SET_GAME_INFO(state, payload) {
            state.gameInfo = payload;
        },
        SET_SIGNALR_CLIENT(state, payload) {
            state.signalrClient = payload;
        },
        RESET_STATE(state) {
            Object.assign(state, {
                signalrClient: null,
                gameInfo: {},
            });
        },
    },
    actions: {
        async enterGame({ commit, dispatch }, screenAccessCode) {
            const gameId = await ScreenService.authorize(screenAccessCode);

            if (gameId === undefined) return;

            await dispatch("_initSignalr", gameId);
            await dispatch("_fetchGameInfo", gameId);
            commit(SET_AUTHENTICATION_STATE, { isAuthenticated: true }, { root: true });
        },

        async _initSignalr({ commit }, gameId) {
            const signalrClient = await createGameScreenRClient(gameId);
            await signalrClient.init();
            await signalrClient.addToGameScreenGroup();
            commit("SET_SIGNALR_CLIENT", signalrClient);
        },

        async _fetchGameInfo({ commit }, gameId) {
            const response = await ScreenService.getGameInfo(gameId);
            const stateModel = ScreenService.prepareGameInfoStateModel(response.data);
            commit("SET_GAME_INFO", stateModel);
        },

        resetState({ commit }) {
            commit("RESET_STATE");
            commit(SET_AUTHENTICATION_STATE, { isAuthenticated: false }, { root: true });
        },
    },

    modules: { roundQuestionTopics },
};
