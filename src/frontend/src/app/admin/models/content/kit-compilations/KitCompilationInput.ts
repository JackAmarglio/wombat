interface KitCompilationInput {
    id: number;
    name: string;
    kitList: Array<KitStateModel>;
}

interface KitListInputManager {
    generalKitsMinimum: 1;
    reserveKitsMinimum: 1;
    generalKits: Array<KitStateModel>;
    reserveKits: Array<KitStateModel>;
}

export const KitListInputManager: KitListInputManager = {
    generalKitsMinimum: 1,
    reserveKitsMinimum: 1,
    generalKits: [],
    reserveKits: [],
};
