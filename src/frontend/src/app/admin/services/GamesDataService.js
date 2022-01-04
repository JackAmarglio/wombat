import { GAMES_URL, GAME_RESTART_URL } from "@/app/shared/apiUrls";
import HttpClient from "@/app/admin/services/adminHttpClient";

class GamesDataService {
    async getAllItems(params) {
        return HttpClient.getAndReturnData(GAMES_URL, params);
    }

    async getItem(params) {
        return (await HttpClient.get(GAMES_URL, params, { idInUrl: true })).data;
    }

    async createItem(data) {
        return (await HttpClient.postAndReturnData(GAMES_URL, data)).id;
    }

    async updateItem(data) {
        return HttpClient.put(GAMES_URL, data);
    }

    async deleteGame(gameId) {
        return HttpClient.delete(GAMES_URL, gameId);
    }

    // вряд ли это тут должно быть
    async restartGame(gameId) {
        return HttpClient.postAndReturnData(GAME_RESTART_URL, { id: gameId });
    }

    prepareGameShortcutModel(data) {
        let gameHostId = "";
        let kitCompilationId = [];
        //taking host id
        if (data.gameHost.id) {
            gameHostId = data.gameHost.id;
        }
        //taking questions ids
        if (data.kitCompilation.id) {
            kitCompilationId = data.kitCompilation.id;
        }
        return {
            id: data.id,
            name: data.name,
            gameHostId: gameHostId,
            kitCompilationId: kitCompilationId,
        };
    }
}

export default new GamesDataService();
