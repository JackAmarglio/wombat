import {
    ROUND_ENDED,
    SET_INTERACTED_AS_OTHER_TEAM,
    SET_IS_AFTER_RESTORE_STATUS,
    SET_LAST_INTERACTED_OTHER_TEAM_ID,
    SET_TOUR_ACTIVE_TEAM_ID,
} from "@/app/team/modules/mutations";
import TeamStage from "@/app/team/TeamStage";

export default {
    state() {
        return {
            isInteractedAsOtherTeamInCurrentTour: false,
            lastTeamIdOfInteractedOtherTeam: -1,
            isAfterRestore: false,
        };
    },

    mutations: {
        [SET_INTERACTED_AS_OTHER_TEAM](state) {
            state.isInteractedAsOtherTeamInCurrentTour = true;
        },

        [SET_LAST_INTERACTED_OTHER_TEAM_ID](state, teamId) {
            state.lastTeamIdOfInteractedOtherTeam = teamId;
        },

        [SET_TOUR_ACTIVE_TEAM_ID](state) {
            state.isInteractedAsOtherTeamInCurrentTour = false;
            state.lastTeamIdOfInteractedOtherTeam = 0;
        },

        [SET_IS_AFTER_RESTORE_STATUS](state, status) {
            state.isAfterRestore = status;
        },

        [ROUND_ENDED](state) {
            state.isInteractedAsOtherTeamInCurrentTour = false;
            state.lastTeamIdOfInteractedOtherTeam = 0;
        },
    },

    getters: {
        isTeamActiveInRound(_, __, rootState) {
            const currentStage = rootState.team.stage.current;

            return !(
                currentStage === TeamStage.Unknown ||
                currentStage === TeamStage.AnnouncingNotActiveInRound ||
                currentStage === TeamStage.PreGame
            );
        },
    },
};
