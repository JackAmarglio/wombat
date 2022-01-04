export function prepareAuthRequestModel(formInput) {
    return {
        code: formInput.code,
    };
}

export function prepareGameInfoRequestModel(data) {
    return {
        gameId: data.gameId,
    };
}

export function prepareGameSettingsRequestModel(gameId, gameSettingsInput) {
    return {
        gameId: gameId,
        roundActiveTeamsNumber: gameSettingsInput.teamsInRoundNumber,
        isTeamAllowedAnsweringMultipleTimes: gameSettingsInput.multipleExtrasTriesInTour.enabled,
        initialNumberOfAttemptsToAnswerAfterActiveTeam: gameSettingsInput.defaultExtrasTries,
        isTimerStartNumberLimitForOtherTeamsEnabled:
            gameSettingsInput.multipleExtrasTriesInTour.timerSettings.restrictTimerLaunches,
        timerStartNumberLimitForOtherTeams:
            gameSettingsInput.multipleExtrasTriesInTour.timerSettings.timerLaunchesLimit,
        triesToCellDifficulty: {
            triesForEasy: gameSettingsInput.triesToCellDifficulty.triesForEasy,
            triesForMedium: gameSettingsInput.triesToCellDifficulty.triesForMedium,
            triesForHard: gameSettingsInput.triesToCellDifficulty.triesForHard,
        },
    };
}
