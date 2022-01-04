import { HOSTS_URL } from "@/app/shared/apiUrls";
import HttpClient from "@/app/admin/services/adminHttpClient";

class GameHostsDataService {
    async getGameHosts(params) {
        return (await HttpClient.getAndReturnData(HOSTS_URL, params)).gameHosts;
    }

    async createGameHost(hostDetails) {
        return (await HttpClient.postAndReturnData(HOSTS_URL, hostDetails)).id;
    }

    async updateGameHost(hostDetails) {
        return HttpClient.put(HOSTS_URL, hostDetails);
    }

    async deleteGameHost(hostId) {
        return HttpClient.delete(HOSTS_URL, hostId);
    }
}

export default new GameHostsDataService();
