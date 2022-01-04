import {
    GameConfiguration,
    GameEndedArgs,
    GameScreenTimerStartedArgs,
    ReceivedQuestion,
    RoundEndedArgs,
    TeamAddedOrUpdatedTeamMemberArgs,
    TeamAnswerResultArgs,
    TeamsAllowedToInteractArgs,
    TimerExpiredArgs,
} from "@/app/shared/signalr/EventsArguments";

interface GameHostEventsProvider {
    onGameHostSubmittedConfiguration(handler: (configuration: GameConfiguration) => void): void;
    onGameHostStartedGame(handler: (gameConfiguration: GameConfiguration) => void): void;
    onCellSelected(handler: (cellNumber: number) => void): void;
}

interface TeamEventsProvider {
    onTeamConnected(handler: (teamId: number) => void): void;
    onTeamChangedName(handler: (teamId: number, name: string) => Promise<void>): void;
    onTeamVoiceDataRecorded(handler: (voiceDataB64: string) => Promise<void>): void;
    onTeamInteracted(
        handler: (teamId: number, memberId: number, timeToSuspenseInMs: 0 | number) => void
    ): void;
    onTeamAddedOrUpdatedTeamMember(
        handler: (addedTeamMemberArgs: TeamAddedOrUpdatedTeamMemberArgs) => void
    ): void;
    onTeamAnsweredCorrectly(handler: (teamAnswerResultArgs: TeamAnswerResultArgs) => void): void;
    onTeamAnsweredWrong(handler: (teamAnswerResultArgs: TeamAnswerResultArgs) => void): void;
}

interface OrchestratorEventsProvider {
    onActiveTeamsSelected(handler: (teamsIds: number[]) => void): void;
    onNextActiveTeamSelected(handler: (teamId: number) => void): void;
    onNextQuestionSelected(handler: (question: ReceivedQuestion) => void): void;
    onTeamsAllowedInteract(handler: (args: TeamsAllowedToInteractArgs) => void): void;
    onTimerStarted(handler: (timerStartedArgs: GameScreenTimerStartedArgs) => void): void;
    onTimerExpired(handler: (timerExpiredArgs: TimerExpiredArgs) => void): void;
    onNoTeamsLeftToAnswer(handler: () => void): void;
    onTeamsRoundsOrderUpdated(handler: (updatedTeamsOrders: Array<number[]>) => void): void;
    onRoundEnded(handler: (roundEndedArgs: RoundEndedArgs) => void): void;
    onGameEnded(handler: (gameEndedArgs: GameEndedArgs) => void): void;
}

type GameEventsProvider = GameHostEventsProvider & TeamEventsProvider & OrchestratorEventsProvider;

export { GameHostEventsProvider, TeamEventsProvider, OrchestratorEventsProvider };
export { GameEventsProvider };
