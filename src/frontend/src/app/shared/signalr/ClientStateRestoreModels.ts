import {
    GameConfiguration,
    GameEndedArgs,
    Question,
    QuestionTopic,
    RoundEndedArgs,
} from "@/app/shared/signalr/EventsArguments";

// prob move out all models from signlar dir

enum ServerGameState {
    Corrupted = 0,
    Init,
    PresentingActiveTeams,
    PresentingRoundTopics,
    RoundStarted,
    CellSelected,
    TimerStartedForActiveTeam,
    ActiveTeamGivesAnswer,
    ActiveTeamGaveNoRightAnswer,
    QuestionAnsweredCorrectly,
    TimerStartedForOtherTeams,
    OtherTeamsGaveNoRightAnswer,
    OtherTeamGivesAnswer,
    OtherTeamGaveWrongAnswer,
    ActiveTeamAnsweredCorrectlyToRoundEnd,
    ActiveTeamAnsweredWrongToRoundEnd,
    TimerForOtherTeamsStoppedToRoundEnd,
    OtherTeamAnsweredCorrectlyToRoundEnd,
    OtherTeamAnsweredWrongToRoundEnd,
    RoundEndedAfterActiveTeamAnsweredCorrectly,
    RoundEndedAfterActiveTeamAnsweredWrong,
    RoundEndedAfterTimerForOtherTeamsExpired,
    RoundEndedAfterOtherTeamAnsweredCorrectly,
    RoundEndedAfterOtherTeamAnsweredWrong,
    RoundEnded,
    GameEnded,
}

interface ActorState {
    isExists: boolean;
    gameConfiguration: GameConfiguration;
    gameState: ServerGameState;
    previousGameState: ServerGameState;
    stateReentryNumber: number;
    currentRoundQuestionTopics: Array<QuestionTopic>;
    cellNumberToCapturedTeamId: { [cellNumber: number]: number };
    questionInPlay: Question;
    roundsNumber: number;
    tourActiveTeamId: number;
    lastAnsweringTeamId: number;
    lastAnsweringTeamMemberId: number;
    teamsRoundsOrder: Array<number[]>;
    cellNumberInPlay: number;
    currentRoundNumber: number;
    tourNumber: number;
    lapNumber: number;
    numberOfTeamsInRound: number;
    lastAnsweredOtherTeamsIds: Array<number>;
    roundActiveTeamsIds: Array<number>;
    gameResult: GameEndedArgs;
    gameTeamsMembers: { [teamId: number]: Array<{ id: number; name: string }> };
    teamIdToAttemptsToAnswerAfterActiveTeam: { [teamId: number]: number };
    teamIdToTeamName: { [teamId: number]: string };
    roundResultInfo: RoundEndedArgs;
    optionalFeaturesData: { [featureName: string]: undefined | object | number };
}

interface TeamState extends ActorState {
    teamId: number;
    name: string;
    isTourActive: boolean;
    isRoundActive: boolean;
    attemptsToInteract: number;
    currentCellDifficulty: number;
}

interface ScreenState extends ActorState {
    cellNumberWithCurrentDifficulty: { [cellNumber: number]: number };
}

interface GameHostState extends ActorState {
    // ad-hoc! Not present when fetched from backend & post-filled with ActorState.gameConfiguration.roundActiveTeamsNumber
    roundActiveTeamsNumber: number;
}

export { ActorState };
export { TeamState, ScreenState, GameHostState };
export { ServerGameState };
