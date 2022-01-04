interface KitStateModel {
    id: string;
    name: string;
    isReserve: boolean;
    questions: Array<QuestionStateModel>;
}

interface DetailedQuestionsAmount {
    hard: number;
    medium: number;
    easy: number;
}

interface HumbleKitStateModel {
    id: string;
    name: string;
    isReserve: boolean;
    questionsAmount: DetailedQuestionsAmount | number;
}

interface KitShortcutModel {
    id: string;
    name: string;
    isReserve: boolean;
    questionsIds: Array<string>;
}

interface KitsStoreModuleState {
    kitList: Array<HumbleKitStateModel>;
    currentKit: KitStateModel;
}
