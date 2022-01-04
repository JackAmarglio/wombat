import KitCompilationsDataService from "@/app/admin/services/content/KitCompilationsDataService";
import { HumbleKitQuestionsShortcutOptions } from "@/app/admin/models/content/shared/HumbleKitQuestionsShortcutOptions";

export default {
    namespaced: true,

    state: {
        all: [], //: Array<HumbleKitCompilationStateModel
        currentKitCompilation: {}, //Array<KitCompilationStateModel
        kitQuestionsShortcut: HumbleKitQuestionsShortcutOptions.AllQuestionsAmount,
    },

    mutations: {
        SET_KIT_COMPILATIONS(state, kitCompilationsListForState) {
            state.all = kitCompilationsListForState;
        },
        SET_CURRENT_KIT_COMPILATION(state, kitCompilationStateModel) {
            state.currentKitCompilation = kitCompilationStateModel;
        },
        ADD_KIT_COMPILATION(state, humbleKitCompilationStateModel) {
            state.all.push(humbleKitCompilationStateModel);
        },
        UPDATE_KIT_COMPILATION(state, kitCompilationId) {
            const index = state.all.findIndex((kitCompilation) => kitCompilation.id === kitCompilationId);
            state.all.splice(index, 1, kitCompilationId);
        },
        UPDATE_CURRENT_KIT_COMPILATION(state, kitCompilationStateModel) {
            state.currentKitCompilation = kitCompilationStateModel;
        },
        REMOVE_KIT_COMPILATION(state, kitCompilationId) {
            const index = state.all.findIndex((kitCompilation) => kitCompilation.id === kitCompilationId);
            state.all.splice(index, 1);
        },
    },

    actions: {
        async fetchKitCompilations({ commit, state }, offsetLimitParams) {
            const response = await KitCompilationsDataService.getKitCompilations(offsetLimitParams);
            const kitCompilationsListForState = KitCompilationsDataService.prepareKitCompilationsListForState(
                response.data,
                true,
                state.kitQuestionsShortcut
            ); //humble model here
            commit("SET_KIT_COMPILATIONS", kitCompilationsListForState);
        },

        async fetchCurrentKitCompilation({ commit, rootState }, kitCompilationId) {
            const response = await KitCompilationsDataService.getKitCompilation(kitCompilationId);
            const kitCompilationStateModel = KitCompilationsDataService.prepareHumbleKitCompilationStateModel(
                response.data.kitCompilation,
                false,
                rootState.admin.kits.kitQuestionsShortcut
            );
            commit("SET_CURRENT_KIT_COMPILATION", kitCompilationStateModel);
        },

        async createKitCompilation({ commit, state }, humbleKitCompilationStateModel) {
            const kitCompilationShortcutModel = KitCompilationsDataService.prepareKitCompilationShortcutModel(
                humbleKitCompilationStateModel
            );
            const response = await KitCompilationsDataService.createItem(kitCompilationShortcutModel);
            const itemWithNewId = KitCompilationsDataService.setNewId(
                humbleKitCompilationStateModel,
                response.data.id
            );
            const withRemodeledKitlist = KitCompilationsDataService.prepareHumbleKitCompilationStateModel(
                itemWithNewId,
                true,
                state.kitQuestionsShortcut
            );
            commit("ADD_KIT_COMPILATION", withRemodeledKitlist);
        },

        async updateCurrentKitCompilation({ commit }, humbleKitCompilationStateModel) {
            commit("UPDATE_CURRENT_KIT_COMPILATION", humbleKitCompilationStateModel);
        },

        async updateKitCompilation({ commit, state, dispatch }, humbleKitCompilationStateModel) {
            const kitCompilationShortcutModel = KitCompilationsDataService.prepareKitCompilationShortcutModel(
                humbleKitCompilationStateModel
            );
            await KitCompilationsDataService.updateItem(kitCompilationShortcutModel);
            const withRemodeledKitlist = KitCompilationsDataService.prepareHumbleKitCompilationStateModel(
                humbleKitCompilationStateModel,
                true,
                state.kitQuestionsShortcut
            );
            await dispatch("updateCurrentKitCompilation", withRemodeledKitlist);
            commit("UPDATE_KIT_COMPILATION", withRemodeledKitlist);
        },

        async deleteKitCompilation({ commit }, kitCompilationId) {
            await KitCompilationsDataService.deleteItem(kitCompilationId);
            commit("REMOVE_KIT_COMPILATION", kitCompilationId);
        },
    },
};
