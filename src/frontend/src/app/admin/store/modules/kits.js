import KitsDataService from "@/app/admin/services/content/KitsDataService";
import { HumbleKitQuestionsShortcutOptions } from "@/app/admin/models/content/shared/HumbleKitQuestionsShortcutOptions";

export default {
    namespaced: true,

    state: {
        all: [], //: Array <HumbleKitStateModel>
        currentKit: {}, //: KitStateModel
        kitQuestionsShortcut: HumbleKitQuestionsShortcutOptions.AmountByDifficulty,
    },

    mutations: {
        SET_KITS(state, kitListForState) {
            state.all = kitListForState;
        },
        SET_CURRENT_KIT(state, kitStateModel) {
            state.currentKit = kitStateModel;
        },
        ADD_KIT(state, humbleKitStateModel) {
            state.all.push(humbleKitStateModel);
        },
        UPDATE_KIT(state, kitId) {
            const index = state.all.findIndex((kit) => kit.id === kitId);
            state.all.splice(index, 1, kitId);
        },
        UPDATE_CURRENT_KIT(state, kitStateModel) {
            state.currentKit = kitStateModel;
        },
        REMOVE_KIT(state, kitId) {
            const index = state.all.findIndex((kit) => kit.id === kitId);
            state.all.splice(index, 1);
        },
    },

    actions: {
        async fetchKits({ commit, state }, offsetLimitParams) {
            const response = await KitsDataService.getQuestionsKits(offsetLimitParams);
            const kitListForState = KitsDataService.prepareKitListForState(
                response.data,
                true,
                state.kitQuestionsShortcut
            ); //humble kits here
            commit("SET_KITS", kitListForState);
        },

        async fetchCurrentKit({ commit }, kitId) {
            const response = await KitsDataService.getQuestionsKit(kitId);
            const kitStateModel = KitsDataService.prepareKitStateModel(response.data.questionsKit); //full kit here
            commit("SET_CURRENT_KIT", kitStateModel);
        },

        async createKit({ commit, state }, kitStateModel) {
            const kitShortcutModel = KitsDataService.prepareKitShortcutModel(kitStateModel);
            const response = await KitsDataService.createQuestionsKit(kitShortcutModel);
            const itemWithNewId = KitsDataService.setNewId(kitStateModel, response.data.id);
            const humbleKitStateModel = KitsDataService.prepareHumbleKitStateModel(
                itemWithNewId,
                false,
                state.kitQuestionsShortcut
            ); //humble kit here
            commit("ADD_KIT", humbleKitStateModel);
        },

        async updateCurrentKit({ commit }, kitStateModel) {
            commit("UPDATE_CURRENT_KIT", kitStateModel); //full kit here
        },

        async updateKit({ commit, dispatch }, kitStateModel) {
            const kitShortcutModel = KitsDataService.prepareKitShortcutModel(kitStateModel);
            await KitsDataService.updateQuestionsKit(kitShortcutModel);
            await dispatch("updateCurrentKit", kitStateModel); //full kit here
            commit("UPDATE_KIT", kitStateModel);
        },

        async deleteKit({ commit }, kitId) {
            await KitsDataService.deleteQuestionsKit(kitId);
            commit("REMOVE_KIT", kitId);
        },
    },
};
