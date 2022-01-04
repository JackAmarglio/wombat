import { KIT_COMPILATIONS_URL } from "@/app/shared/apiUrls";
import KitsDataService from "@/app/admin/services/content/KitsDataService";
import HttpClient from "@/app/admin/services/adminHttpClient";

class KitCompilationsDataService {
    async getKitCompilations(offsetLimitRequestParams) {
        return HttpClient.get(KIT_COMPILATIONS_URL, offsetLimitRequestParams);
    }

    async getKitCompilation(kitCompilationId) {
        return HttpClient.get(KIT_COMPILATIONS_URL, { id: kitCompilationId }, { idInUrl: true });
    }

    async createItem(kitCompilationShortcutModel) {
        return HttpClient.post(KIT_COMPILATIONS_URL, kitCompilationShortcutModel);
    }

    async updateItem(kitCompilationShortcutModel) {
        return HttpClient.put(KIT_COMPILATIONS_URL, kitCompilationShortcutModel);
    }

    async deleteItem(id) {
        return HttpClient.delete(KIT_COMPILATIONS_URL, id);
    }

    prepareHumbleKitCompilationStateModel(data, areKitsAlreadyHumble, questionsShortcutOptions) {
        return {
            id: data.id,
            name: data.name,
            kitList: KitsDataService.prepareKitListForState(
                data.kitList,
                areKitsAlreadyHumble,
                questionsShortcutOptions
            ), //converts kits to humble model
        };
    }

    setNewId(kitCompilationStateModel, id) {
        kitCompilationStateModel.id = id;
        return kitCompilationStateModel;
    }

    prepareKitCompilationsListForState(data, areKitsAlreadyHumble, questionsShortcutOptions) {
        return data.kitCompilations.map((comp) => {
            return this.prepareHumbleKitCompilationStateModel(
                comp,
                areKitsAlreadyHumble,
                questionsShortcutOptions
            );
        });
    }

    prepareKitCompilationShortcutModel(data) {
        const kitsIds = [];
        //taking questions ids
        if (data.kitList) {
            data.kitList.map(function (kit) {
                kitsIds.push(kit.id);
                return kit;
            });
        }
        return {
            id: data.id,
            name: data.name,
            isReserve: data.isReserve,
            kitIds: kitsIds,
        };
    }
}

export default new KitCompilationsDataService();
