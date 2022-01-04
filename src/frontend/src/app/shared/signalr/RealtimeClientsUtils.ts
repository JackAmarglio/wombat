import { GameHostClient, GameScreenClient, TeamClient } from "@/app/shared/signalr/RealtimeClients";
import {
    WombatRGameHostClient,
    WombatRGameScreenClient,
    WombatRTeamClient,
} from "@/app/shared/signalr/RealtimeClientsBase";

function createGameHostRClient(gameId: number | undefined): WombatRGameHostClient {
    return new GameHostClient(gameId);
}

function createTeamRClient(gameId: number | undefined, teamId: number): WombatRTeamClient {
    return new TeamClient(gameId, teamId);
}

function createGameScreenRClient(gameId: number | undefined): WombatRGameScreenClient {
    return new GameScreenClient(gameId);
}

export { createGameHostRClient, createTeamRClient, createGameScreenRClient };
