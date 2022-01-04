interface GameSettingsRequestModel {
    gameId: number;
    roundActiveTeamsNumber: number;
    isTeamAllowedAnsweringMultipleTimes: boolean;
    initialNumberOfAttemptsToAnswerAfterActiveTeam: number;
    isTimerStartNumberLimitForOtherTeamsEnabled: boolean;
    timerStartNumberLimitForOtherTeams: number;
    triesToCellDifficulty: {
        triesForEasy: number;
        triesForMedium: number;
        triesForHard: number;
    };
}

interface GameSettingsInputModel {
    teamsInRoundNumber: number;
    defaultExtrasTries: number;
    triesToCellDifficulty: {
        triesForEasy: number;
        triesForMedium: 0;
        triesForHard: 0;
    };
    multipleExtrasTriesInTour: {
        enabled: boolean;
        timerSettings: {
            restrictTimerLaunches: boolean;
            timerLaunchesLimit: number;
        };
    };
}

const DefaultGameSettings = {
    teamsInRoundNumber: 3,
    defaultExtrasTries: 2,
    triesToCellDifficulty: {
        triesForEasy: 1,
        triesForMedium: 2,
        triesForHard: 3,
    },
    multipleExtrasTriesInTour: {
        enabled: false,
        timerSettings: {
            restrictTimerLaunches: false,
            timerLaunchesLimit: 2,
        },
    },
};

const DefaultTimerSettingsWithExtraTries = {
    restrictTimerLaunches: true,
    timerLaunchesLimit: 5,
};

export { DefaultGameSettings, DefaultTimerSettingsWithExtraTries };
