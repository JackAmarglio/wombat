export interface Question {
    questionId: number;
    topicId: number;
    topicName: string;
    content: string;
    answer: string;
    difficulty: number;
}

export interface ReceivedQuestion extends Question {
    selectedCellNumber: number;
}

export interface GameScreenTimerStartedArgs {
    timestamp: number;
    shouldDisplayQuestionText: string;
}

export interface TimerExpiredArgs {
    isExpiredForOtherTeams: boolean;
    isVictoryConditionMet: boolean;
    roundWinningTeamId: number;
    victoryType: "CapturedCells";
}

export interface RoundEndedArgs {
    winningTeamId: number;
    victoryType: "CapturedCells" | "MoreAnswers";
    teamIdsToRightAnswerNumber: Map<number, number>;
    // Если равно 0, то отвечающей команды не было, например, если таймер для остальных команд закончился и никто не пытался отвечать
    lastAnsweredTeamId: number | 0;
    isLastAnsweredTeamCorrect: boolean;
}

interface GameEndedArgs {
    teamIdToGameScore: Map<number, number>;
    lastAnsweredTeamId: number;
    isLastAnsweredTeamCorrect: boolean;
}

interface TeamsAllowedToInteractArgs {
    allowedTeams: "OnlyTourActiveTeam" | "AllTourTeamsExceptAnswered" | "AllTourTeams";
    cellNumberInPlay: number;
    cellDifficulty: number;
}

export interface TriesNumberToCellDifficulty {
    triesForEasy: number;
    triesForMedium: number;
    triesForHard: number;
}

export interface GameConfiguration {
    roundActiveTeamsNumber: number;
    isTeamAllowedAnsweringMultipleTimes: boolean;
    initialNumberOfAttemptsToAnswerAfterActiveTeam: number;
    isTimerStartNumberLimitForOtherTeamsEnabled: boolean;
    timerStartNumberLimitForOtherTeams: number;
    triesNumberToCellDifficulty: TriesNumberToCellDifficulty;
}

export interface QuestionTopic {
    id: number;
    name: string;
}

export interface TeamAnswerResultArgs {
    teamId: number;
    isAnsweredCorrectly: boolean;
    isVictoryConditionMet: boolean;
    winningTeamId: number;
    victoryType: "CapturedCells" | "MoreAnswers";
}

export interface TeamAddedOrUpdatedTeamMemberArgs {
    teamId: number;
    memberId: number;
    memberName: string;
}

export { GameEndedArgs, TeamsAllowedToInteractArgs };
