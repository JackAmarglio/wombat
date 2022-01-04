interface KitCompilationStateModel {
    id: string;
    name: string;
    kitList: Array<KitStateModel>;
}

interface HumbleKitCompilationStateModel {
    id: string;
    name: string;
    kitList: Array<HumbleKitStateModel>;
}

interface KitCompilationShortcutModel {
    id: string;
    name: string;
    kitIds: Array<string>;
}

interface KitCompilationsStoreModuleState {
    kitCompilationsList: Array<KitCompilationStateModel>;
    currentKitCompilation: KitCompilationStateModel;
}
