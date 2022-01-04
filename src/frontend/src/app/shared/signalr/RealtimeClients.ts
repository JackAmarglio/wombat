import {
    ClientWithEventProviderWrappers,
    WombatRGameHostClient,
    WombatRGameScreenClient,
    WombatRTeamClient,
} from "@/app/shared/signalr/RealtimeClientsBase";
import { GameHostState, ScreenState, TeamState } from "@/app/shared/signalr/ClientStateRestoreModels";

class GameHostClient extends ClientWithEventProviderWrappers implements WombatRGameHostClient {
    async addToHostGroup(): Promise<boolean> {
        return this.invokeHubMethod<boolean>("gameHostAddToGroup", this.activeGameId);
    }

    startGame(): Promise<void> {
        return this.callHubMethod("gameHostStartGame", this.activeGameId);
    }

    updateTeamsRoundsOrder(teamsRoundsOrder: Array<number[]>): Promise<boolean> {
        return this.invokeHubMethod<boolean>(
            "gameHostUpdateTeamsRoundsOrder",
            this.activeGameId,
            teamsRoundsOrder
        );
    }

    contextAction(): Promise<void> {
        return this.invokeHubMethod("gameHostContextInteraction", this.activeGameId);
    }

    selectCell(selectedCellNumber: number): Promise<boolean> {
        return this.invokeHubMethod<boolean>("gameHostSelectCell", this.activeGameId, selectedCellNumber);
    }

    startTimer(): Promise<boolean> {
        return this.invokeHubMethod<boolean>("gameHostStartTimer", this.activeGameId, Date.now());
    }

    stopTimer(): Promise<boolean> {
        return this.invokeHubMethod<boolean>("gameHostStopTimer", this.activeGameId, Date.now());
    }

    reviewTeamAnswer(isAnswerCorrect: boolean): Promise<boolean> {
        return this.invokeHubMethod<boolean>("gameHostReviewTeamAnswer", this.activeGameId, isAnswerCorrect);
    }

    confirmGameEnding(): Promise<void> {
        return this.invokeHubMethod<void>("gameHostConfirmGameEnding", this.activeGameId);
    }

    async getState(): Promise<GameHostState> {
        const state = await this.invokeHubMethod<GameHostState>("gameHostGetState", this.activeGameId);

        // костыль, чтобы не переписывать милион строк где ссылается на это говно
        state.roundActiveTeamsNumber = state.gameConfiguration.roundActiveTeamsNumber;
        return state;
    }
}

class TeamClient extends ClientWithEventProviderWrappers implements WombatRTeamClient {
    private readonly _teamId: number;
    private _memberId = -1;

    // todo: investigate why gameId could be undefined
    constructor(gameId: number | undefined, teamId: number) {
        super(gameId);
        this._teamId = teamId;
    }

    setMemberId(memberId: number) {
        this._memberId = memberId;
    }

    addToTeamGroup(): Promise<boolean> {
        return this.addToTeamGroupInternal();
    }

    changeTeamName(newName: string): Promise<void> {
        return this.callHubMethod("teamChangeName", this.activeGameId, this._teamId, newName);
    }

    // returns newly created member id
    addTeamMember(teamMemberName: string): Promise<number> {
        return this.invokeHubMethod("teamAddMember", this.activeGameId, this._teamId, teamMemberName);
    }

    updateTeamMemberName(
        teamMemberId: number /* todo: keep memberId in client props after adding */,
        teamMemberName: string
    ): Promise<boolean> {
        return this.invokeHubMethod(
            "teamUpdateMember",
            this.activeGameId,
            this._teamId,
            teamMemberId,
            teamMemberName
        );
    }

    interact(): Promise<void> {
        return this.callHubMethod("teamInteract", this.activeGameId, this._teamId, this._memberId, Date.now());
    }

    getState(): Promise<TeamState> {
        return this.invokeHubMethod("teamGetState", this.activeGameId, this._teamId);
    }

    override async onClientReconnected(): Promise<void> {
        await this.addToTeamGroupInternal();
    }

    private addToTeamGroupInternal(): Promise<boolean> {
        return this.invokeHubMethod<boolean>("teamAddToGroup", this.activeGameId, this._teamId);
    }

    private isMemberIdNotSet(): boolean {
        return this._memberId === -1;
    }
}

class GameScreenClient extends ClientWithEventProviderWrappers implements WombatRGameScreenClient {
    constructor(gameId: number | undefined) {
        super(gameId);
    }

    addToGameScreenGroup(): Promise<boolean> {
        return this.invokeHubMethod<boolean>("gameScreenAddToGroup", this.activeGameId);
    }

    getState(): Promise<ScreenState> {
        return this.invokeHubMethod("gameScreenGetState", this.activeGameId);
    }
}

export { GameHostClient, TeamClient, GameScreenClient };
