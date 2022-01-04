interface HumbleGameStateModel {
    id: number;
    name: string;
    gameHostName: string;
    kitCompilationName: string;
}

interface GameStateModel {
    id: number;
    name: string;
    gameHostName: string;
    kitCompilation: HumbleKitCompilationStateModel;
    hostAccessCode: string;
}

interface GameShortcutModel {
    id: number;
    name: string;
    gameHostId: number;
    kitCompilationId: number;
}
