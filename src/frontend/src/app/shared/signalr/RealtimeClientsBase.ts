import { HubConnection } from "@microsoft/signalr";
import * as signalR from "@microsoft/signalr";

import { GAMEHUB_URL } from "@/app/shared/apiUrls";
import { GameHostState, ScreenState, TeamState } from "@/app/shared/signalr/ClientStateRestoreModels";
import { GameEventsProvider } from "@/app/shared/signalr/EventsProviders";
import {
    GameConfiguration,
    GameEndedArgs,
    GameScreenTimerStartedArgs,
    QuestionTopic,
    ReceivedQuestion,
    RoundEndedArgs,
    TeamAddedOrUpdatedTeamMemberArgs,
    TeamAnswerResultArgs,
    TeamsAllowedToInteractArgs,
    TimerExpiredArgs,
} from "@/app/shared/signalr/EventsArguments";

interface WobmatRClientInterface {
    activeGameId: number;
    init: () => Promise<void>;
    getState: () => Promise<TeamState | ScreenState | GameHostState>;
}

interface WombatRGameHostActions {
    addToHostGroup: () => Promise<boolean>;
    startGame: () => Promise<void>;
    updateTeamsRoundsOrder(teamsRoundsOrder: Array<number[]>): Promise<boolean>;
    contextAction: () => Promise<void>;
    selectCell: (selectedCellNumber: number) => Promise<boolean>;
    startTimer: () => Promise<boolean>;
    stopTimer: () => Promise<boolean>;
    reviewTeamAnswer: (isAnswerCorrect: boolean) => Promise<boolean>;
    confirmGameEnding: () => Promise<void>;
}

interface WombatRTeamActions {
    addToTeamGroup: () => Promise<boolean>;
    changeTeamName: (newName: string) => Promise<void>;
    addTeamMember: (teamMemberName: string) => Promise<number>;
    updateTeamMemberName: (teamMemberId: number, teamMemberName: string) => Promise<boolean>;
    interact: () => Promise<void>;
    getState: () => Promise<TeamState>;
}

interface WombatRGameScreenActions {
    addToGameScreenGroup: () => Promise<boolean>;
}

// Holds info about subscribed event and is used for simple unsubscribing
interface SubscribeResult {
    subscribedEventName: string;
    providedHandler: (...args: unknown[]) => void;
}

enum ConnectionLostType {
    None,
}

type WombatRGameHostClient = WobmatRClientInterface & WombatRGameHostActions & GameEventsProvider;
type WombatRTeamClient = WobmatRClientInterface & WombatRTeamActions & GameEventsProvider;
type WombatRGameScreenClient = WobmatRClientInterface & WombatRGameScreenActions & GameEventsProvider;

abstract class ClientBase implements WobmatRClientInterface {
    constructor(gameId: number | undefined) {
        this.activeGameId = gameId ?? 0;
    }

    activeGameId: number;
    protected connection!: HubConnection;

    init(): Promise<void> {
        const builder = new signalR.HubConnectionBuilder().withUrl(GAMEHUB_URL);

        const isDev = process.env.NODE_ENV === "development";

        if (isDev) {
            builder.configureLogging("debug");
        }

        builder.withAutomaticReconnect([
            1000, 1000, 1000, 1000, 1000, 1000, 2000, 2000, 2000, 3000, 4000, 5000,
        ]);

        this.connection = builder.build();
        this.connection.onreconnected(() => this.onClientReconnected());

        if (isDev) {
            this.connection.serverTimeoutInMilliseconds = 300000; // 5 min to allow debugging on server
        }

        return this.connection.start();
    }

    public onConnectionLost(handler: (connectionLostType: ConnectionLostType) => void): void {
        this.connection.onclose(() => handler(ConnectionLostType.None));
    }

    public onReconnecting(handler: (connectionLostType: ConnectionLostType) => void): void {
        this.connection.onreconnecting(() => handler(ConnectionLostType.None));
    }

    public onReconnected(handler: (connectionLostType: ConnectionLostType) => void): void {
        this.connection.onreconnected(() => handler(ConnectionLostType.None));
    }

    public disconnect(): Promise<void> {
        return this.connection.stop();
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected subscribeToEvent(eventName: string, handler: (...args: any[]) => void): SubscribeResult {
        this.connection.on(eventName, handler);
        return { providedHandler: handler, subscribedEventName: eventName };
    }

    protected invokeHubMethod<T extends number | string | boolean | unknown>(
        methodName: string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...args: any[]
    ): Promise<T> {
        return this.connection.invoke<T>(methodName, ...args);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    protected callHubMethod(methodName: string, ...args: any[]): Promise<void> {
        return this.connection.send(methodName, ...args);
    }

    protected onClientReconnected(): Promise<void> {
        return Promise.resolve();
    }

    abstract getState(): Promise<TeamState | ScreenState | GameHostState>;
}

abstract class ClientWithEventProviderWrappers extends ClientBase implements GameEventsProvider {
    onGameHostStartedGame(handler: (gameConfiguration: GameConfiguration) => void): SubscribeResult {
        return this.subscribeToEvent("gameStartedEvent", handler);
    }

    onTeamConnected(handler: (teamId: number) => void): SubscribeResult {
        return this.subscribeToEvent("teamConnectedEvent", handler);
    }

    onTeamsRoundsOrderUpdated(handler: (updatedTeamsOrders: Array<number[]>) => void): SubscribeResult {
        return this.subscribeToEvent("updateTeamsRoundsOrder", handler);
    }

    onTeamChangedName(handler: (teamId: number, name: string) => Promise<void>): SubscribeResult {
        return this.subscribeToEvent("teamChangedName", handler);
    }

    onActiveTeamsSelected(handler: (teamsIds: number[]) => void): SubscribeResult {
        return this.subscribeToEvent("activeTeamsForRoundSelected", handler);
    }

    onPresentRoundQuestionTopics(handler: (questionTopics: QuestionTopic[]) => void): SubscribeResult {
        return this.subscribeToEvent("presentRoundQuestionTopics", handler);
    }

    onNextActiveTeamSelected(handler: (teamId: number) => void): SubscribeResult {
        return this.subscribeToEvent("nextActiveTeamSelected", handler);
    }

    onCellSelected(handler: (cellNumber: number) => void): SubscribeResult {
        return this.subscribeToEvent("receiveSelectedCell", handler);
    }

    onNextQuestionSelected(handler: (question: ReceivedQuestion) => void): SubscribeResult {
        return this.subscribeToEvent("receiveQuestion", handler);
    }

    onTimerStarted(handler: (timerStartedArgs: GameScreenTimerStartedArgs) => void): SubscribeResult {
        return this.subscribeToEvent("timerStartedEvent", handler);
    }

    onTeamsAllowedInteract(handler: (args: TeamsAllowedToInteractArgs) => void): SubscribeResult {
        return this.subscribeToEvent("teamsAllowInteract", handler);
    }

    // for timeToSuspenseInMs see https://trello.com/c/bKj5Bk4r
    onTeamInteracted(
        handler: (teamId: number, memberId: number, timeToSuspenseInMs: 0 | number) => void
    ): SubscribeResult {
        return this.subscribeToEvent("teamInteracted", handler);
    }

    onNoTeamsLeftToAnswer(handler: () => void): SubscribeResult {
        return this.subscribeToEvent("noTeamsLeftToAnswerEvent", handler);
    }

    onTimerExpired(handler: (timerExpiredArgs: TimerExpiredArgs) => void): SubscribeResult {
        return this.subscribeToEvent("timerExpiredEvent", handler);
    }

    onTeamAnsweredCorrectly(handler: (teamAnswerResultArgs: TeamAnswerResultArgs) => void): SubscribeResult {
        return this.subscribeToEvent("teamAnsweredCorrectly", handler);
    }

    onTeamAnsweredWrong(handler: (teamAnswerResultArgs: TeamAnswerResultArgs) => void): SubscribeResult {
        return this.subscribeToEvent("teamAnsweredWrong", handler);
    }

    onRoundEnded(handler: (roundEndedArgs: RoundEndedArgs) => void): SubscribeResult {
        return this.subscribeToEvent("roundEnded", handler);
    }

    onGameEnded(handler: (gameEndedArgs: GameEndedArgs) => void): SubscribeResult {
        return this.subscribeToEvent("gameEnded", handler);
    }

    onGameHostSubmittedConfiguration(handler: (configuration: GameConfiguration) => void): SubscribeResult {
        return this.subscribeToEvent("gameHostSubmittedGameConfiguration", handler);
    }

    off(subscribeResult: SubscribeResult): void {
        this.connection.off(subscribeResult.subscribedEventName, subscribeResult.providedHandler);
    }

    onTeamVoiceDataRecorded(handler: (voiceDataB64: string) => Promise<void>): SubscribeResult {
        return this.subscribeToEvent("receiveTeamVoiceData", handler);
    }

    onTeamAddedOrUpdatedTeamMember(
        handler: (addedTeamMemberArgs: TeamAddedOrUpdatedTeamMemberArgs) => void
    ): SubscribeResult {
        return this.subscribeToEvent("teamAddedOrUpdatedTeamMember", handler);
    }
}

export { ClientWithEventProviderWrappers };
export { WombatRGameScreenClient, WombatRGameHostClient, WombatRTeamClient };
