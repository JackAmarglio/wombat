/*
    Ставка и "цена" клетки которая вернется в виде попыток отвечать после активной команды,
    если команда ответила правильно как "остальная команда"
*/
export default {
    getters: {
        getAttemptsPriceForCurrentCell: (_, getters, rootState) => {
            const cellDifficulty = rootState.team.tourActiveCell.cellDifficulty;

            const cellDifficultyToAttemptsMap = getters._getCellDifficultyToAttemptsMap;
            return cellDifficultyToAttemptsMap[cellDifficulty];
        },
        _getCellDifficultyToAttemptsMap: (_, __, rootState) => {
            const { triesNumberToCellDifficulty } = rootState.team.backendTeamState.gameConfiguration;

            return {
                1: triesNumberToCellDifficulty.triesForEasy,
                2: triesNumberToCellDifficulty.triesForMedium,
                3: triesNumberToCellDifficulty.triesForHard,
            };
        },
    },
};
