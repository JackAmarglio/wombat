import HostService from "@/app/host/services/HostService";
import * as RequestModelService from "@/app/shared/factories";
import { createGameHostRClient } from "@/app/shared/SignalrWombat";
import roundQuestionTopics from "@/app/host/modules/roundQuestionTopics";
import teamNames from "@/app/shared/store/modules/teamNames";
import teamsRoundsOrder from "@/app/host/modules/hostTeamsRoundsOrder";
import teamsMembers from "@/app/shared/store/modules/teamsMembers";
import { SET_AUTHENTICATION_STATE } from "@/app/shared/store/modules/mutations/authStatus";

export default {
    namespaced: true,
    state: {
        signalrClient: null,
        gameInfo: {},
        teamsToPlayRound: [],
    },

    mutations: {
        SET_GAME_INFO(state, payload) {
            state.gameInfo = payload;
        },
        SET_SIGNALR_CLIENT(state, payload) {
            state.signalrClient = payload;
        },
        SET_TEAM_CONNECTION_STATUS(state, teamId) {
            state.gameInfo.teams.find((team) => team.id === teamId).connected = true;
        },
        SET_NEW_TEAM_NAME(state, { teamId, name }) {
            state.gameInfo.teams.find((team) => team.id === teamId).name = name;
        },
        RESET_STATE(state) {
            Object.assign(state, {
                signalrClient: null,
                gameInfo: {},
                teamsToPlayRound: [],
            });
        },
    },
    actions: {
        async enterGame({ commit, dispatch }, loginFormInput) {
            const authResponseData = await dispatch("_authorize", loginFormInput);
            await dispatch("_initSignalr", authResponseData);
            await dispatch("_fetchGameInfo", authResponseData);
            commit(SET_AUTHENTICATION_STATE, { isAuthenticated: true }, { root: true });
        },

        async submitGameSettings({ state }, gameSettingsInput) {
            const gameSettingsRequestModel = RequestModelService.prepareGameSettingsRequestModel(
                state.gameInfo.id,
                gameSettingsInput
            );
            await HostService.submitGameSettings(gameSettingsRequestModel);
        },

        async _authorize(_, loginFormInput) {
            const authRequestModel = RequestModelService.prepareAuthRequestModel(loginFormInput);
            const response = await HostService.authorize(authRequestModel);
            return response.data;
        },

        async _initSignalr({ commit }, { gameId }) {
            const signalrClient = await createGameHostRClient(gameId);
            await signalrClient.init();
            await signalrClient.addToHostGroup();
            commit("SET_SIGNALR_CLIENT", signalrClient);
        },

        async _fetchGameInfo({ commit }, payload) {
            const gameInfoRequestModel = RequestModelService.prepareGameInfoRequestModel(payload);
            const response = await HostService.getGameInfo(gameInfoRequestModel);
            const stateModel = HostService.prepareGameInfoStateModel(response.data);
            commit("SET_GAME_INFO", stateModel);
        },

        resetState({ commit }) {
            commit("RESET_STATE");
            commit(SET_AUTHENTICATION_STATE, { isAuthenticated: false }, { root: true });
        },
    },

    modules: {
        roundQuestionTopics,
        teamNames,
        teamsRoundsOrder,
        teamsMembers,
    },
};
