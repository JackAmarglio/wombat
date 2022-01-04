import axios from "axios";
import { TEAM_AUTH_URL, TEAM_SUBMIT_VOICE_URL } from "@/app/shared/apiUrls";

const codeStorageKey = "teamLastSuccessfulCode";
const teamMemberAuthDataStorageKey = "team-auth-member-data";

// Version control for auth data as modifying the algo could lead to misbehaviour
// But have to remember to  manually increase after some update
const teamMemberAuthDataVersion = 1;

class TeamService {
    authorize(data) {
        return axios.post(TEAM_AUTH_URL, data);
    }

    sendVoiceData(gameId, voiceB64) {
        return axios.post(TEAM_SUBMIT_VOICE_URL, { gameId, voiceB64 });
    }

    saveSessionCode(code) {
        sessionStorage.setItem(codeStorageKey, code);
    }

    removeSessionCode() {
        sessionStorage.removeItem(codeStorageKey);
    }

    getLastSessionCode() {
        return sessionStorage.getItem(codeStorageKey);
    }

    getDeviceMemberAuthData(teamId) {
        // Don't forget to change teamMemberAuthDataVersion after change

        const teamAuthStorageDataString = window.localStorage.getItem(teamMemberAuthDataStorageKey);
        if (teamAuthStorageDataString === null) return null;
        const teamAuthStorageData = JSON.parse(teamAuthStorageDataString);

        const teamAuthStorageDataForTeam = teamAuthStorageData[teamId];
        if (teamAuthStorageDataForTeam === undefined) return null;

        const { __authVersion } = teamAuthStorageDataForTeam;
        if (__authVersion < teamMemberAuthDataVersion) {
            return null;
        }

        return teamAuthStorageDataForTeam;
    }

    saveMemberAuthData({ memberId, gameId, teamId }) {
        // Don't forget to change teamMemberAuthDataVersion after change

        // expire date is one hour from now in ms
        const expireDate = Date.now() + 1000 * 60 * 60;

        const currentTeamAuthStorageDataString = window.localStorage.getItem(teamMemberAuthDataStorageKey);
        const currentTeamAuthStorageData =
            currentTeamAuthStorageDataString === null ? {} : JSON.parse(currentTeamAuthStorageDataString);

        currentTeamAuthStorageData[teamId] = {
            memberId,
            gameId,
            teamId,
            expireDate,
            __authVersion: teamMemberAuthDataVersion,
        };

        window.localStorage.setItem(teamMemberAuthDataStorageKey, JSON.stringify(currentTeamAuthStorageData));
    }

    removeMemberAuthData(teamId) {
        const currentTeamAuthStorageDataString = window.localStorage.getItem(teamMemberAuthDataStorageKey);
        if (currentTeamAuthStorageDataString === null) return;

        const currentTeamAuthStorageData = JSON.parse(currentTeamAuthStorageDataString);
        delete currentTeamAuthStorageData[teamId];

        window.localStorage.setItem(teamMemberAuthDataStorageKey, JSON.stringify(currentTeamAuthStorageData));
    }

    prepareGameInfoStateModel(data) {
        return {
            id: data.teamId,
            gameId: data.gameId,
            gameScore: 0,
        };
    }

    prepareTeamInRoundModel(data) {
        return {
            ...data,
            active: false,
            isAnswering: false,
            isAnsweredOnce: false,
            isAllowedToAnswer: true,
            attemptsToInteract: 0,
            roundScore: 0,
        };
    }
}

export default new TeamService();
