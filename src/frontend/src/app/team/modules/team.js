import * as RequestModelService from "@/app/shared/factories";
import TeamService from "@/app/team/services/TeamService";
import { createTeamRClient } from "@/app/shared/SignalrWombat";
import { SET_BACKEND_ACTOR_STATE, SET_TEAM_MEMBERS } from "@/app/shared/store/modules/mutations";
import tourActiveCell from "@/app/team/modules/tourActiveCell";
import attemptsWager from "@/app/team/modules/attemptsWager";
import attempts from "@/app/team/modules/attempts";
import status from "@/app/team/modules/status";
import stage from "@/app/team/modules/stage";
import color from "@/app/team/modules/color";
import tourActiveTeam from "@/app/team/modules/tourActiveTeam";
import questionTopics from "@/app/team/modules/questionTopics";
import questions from "@/app/team/modules/questions";
import ui from "@/app/team/modules/components/index";
import tourNumber from "@/app/team/modules/tourNumber";
import teamNames from "@/app/team/modules/teamNamesForTeam";
import gameField from "@/app/team/modules/gameField";
import otherTeamSuspense from "@/app/team/modules/otherTeamSuspense";
import connectionLifeService from "@/app/shared/connectionLifeService";
import lapNumber from "@/app/team/modules/lapNumber";
import roundEndResults from "@/app/team/modules/roundEndResults";
import roundActiveTeams from "@/app/team/modules/roundActiveTeams";
import teamsRoundsOrder from "@/app/shared/store/modules/teamsRoundsOrder";
import teamsMembers from "@/app/shared/store/modules/teamsMembers";
import { SET_CURRENT_MEMBER_ID } from "@/app/team/modules/mutations";
import { SET_AUTHENTICATION_STATE } from "@/app/shared/store/modules/mutations/authStatus";

export default {
    state() {
        return {
            signalrClient: null,
            id: null,
            memberId: null,
            gameId: null,
            backendTeamState: null,
            isStateValid: false,
        };
    },

    mutations: {
        SET_GAME_INFO(state, payload) {
            state.id = payload.id;
            state.gameId = payload.gameId;
        },
        SET_SIGNALR_CLIENT(state, payload) {
            state.signalrClient = payload;
        },
        [SET_BACKEND_ACTOR_STATE](state, backendState) {
            state.backendTeamState = backendState;
        },
        MARK_STATE_IS_VALID(state) {
            state.isStateValid = true;
        },
        [SET_CURRENT_MEMBER_ID](state, memberId) {
            state.memberId = memberId;
            state.signalrClient.setMemberId(memberId);
        },
    },
    actions: {
        async enterGame({ commit, dispatch }, loginFormInput) {
            const authResponseData = await dispatch("_authorize", loginFormInput);
            await dispatch("_initSignalr", authResponseData);
            const stateModel = TeamService.prepareGameInfoStateModel(authResponseData);

            commit(SET_TEAM_MEMBERS, {
                teamId: authResponseData.teamId,
                members: authResponseData.teamMembers,
            });

            commit("SET_GAME_INFO", stateModel);
            commit(SET_AUTHENTICATION_STATE, { isAuthenticated: true }, { root: true });
        },

        async getBackendTeamState({ commit, state }) {
            const backendState = await state.signalrClient.getState();
            commit(SET_BACKEND_ACTOR_STATE, backendState);
        },

        async _authorize(_, loginFormInput) {
            const authRequestModel = RequestModelService.prepareAuthRequestModel(loginFormInput);
            const response = await TeamService.authorize(authRequestModel);
            return response.data;
        },

        async _initSignalr({ commit }, { gameId, teamId }) {
            const signalrClient = await createTeamRClient(gameId, teamId);
            await signalrClient.init();
            await signalrClient.addToTeamGroup();
            commit("SET_SIGNALR_CLIENT", signalrClient);
            connectionLifeService.init(signalrClient);
        },
    },
    modules: {
        questionTopics,
        status,
        attempts,
        questions,
        attemptsWager,
        tourActiveCell,
        tourActiveTeam,
        tourNumber,
        roundActiveTeams,
        lapNumber,
        teamNames,
        teamsMembers,
        teamsRoundsOrder,
        roundEndResults,
        otherTeamSuspense,
        stage,
        color,
        ui,
        gameField,
    },
};
