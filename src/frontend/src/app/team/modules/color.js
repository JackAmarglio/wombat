import colors from "@/app/shared/teamColors";

export default {
    getters: {
        teamColor: (_, __, rootState) => {
            const teamId = rootState.team.id;

            return colors.get(teamId);
        },

        getTeamColorByTeamId: () => (teamId) => {
            return colors.get(teamId);
        },
    },
};
