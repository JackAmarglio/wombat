import { SET_ROUND_END_RESULTS } from "@/app/team/modules/mutations";

export default {
    state() {
        return {
            winningTeamId: -1,
            victoryType: null,
            teamIdToPoints: [],
        };
    },

    mutations: {
        [SET_ROUND_END_RESULTS](state, backendRoundEndResults) {
            state.winningTeamId = backendRoundEndResults.winningTeamId;
            state.victoryType = backendRoundEndResults.victoryType;

            state.teamIdToPoints = Object.entries(backendRoundEndResults.teamIdsToRightAnswerNumber)
                .map(([teamId, points]) => {
                    return { teamId: parseInt(teamId), points };
                })
                .sort((a, b) => b.points - a.points);
        },
    },
};
