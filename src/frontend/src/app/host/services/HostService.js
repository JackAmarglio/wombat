import axios from "axios";
import {
    GAME_HOST_AUTH_URL,
    GAME_HOST_GET_GAME_URL,
    GAME_HOST_SUBMIT_GAME_SETTINGS_URL,
} from "@/app/shared/apiUrls";

class HostService {
    authorize(data) {
        return axios.post(GAME_HOST_AUTH_URL, data);
    }

    submitGameSettings(gameSettings) {
        return axios.post(GAME_HOST_SUBMIT_GAME_SETTINGS_URL, gameSettings);
    }

    getGameInfo(params) {
        return axios.get(GAME_HOST_GET_GAME_URL, { params: params });
    }

    prepareGameInfoStateModel(data) {
        const responseModel = data.gameInfo;
        return {
            id: responseModel.id,
            name: responseModel.name,
            gameHost: {
                id: responseModel.host.id,
                name: responseModel.host.name,
            },
            questions: responseModel.questions,
            screen: {
                accessCode: responseModel.gameScreenAccessCode,
                connected: false,
            },
            teams: responseModel.teamsAccessCodes.map((model) => ({
                id: model.teamId,
                name: "Команда " + model.teamId,
                accessCode: model.accessCode,
                connected: false,
            })),
        };
    }
}

export default new HostService();
