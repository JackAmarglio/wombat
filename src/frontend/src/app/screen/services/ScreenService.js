import axios from "axios";
import { SCREEN_AUTH_URL, SCREEN_GET_GAME_URL } from "@/app/shared/apiUrls";

class ScreenService {
    async authorize(screenAccessCode) {
        return (await axios.post(SCREEN_AUTH_URL, { code: screenAccessCode })).data?.gameId;
    }

    getGameInfo(gameId) {
        return axios.get(SCREEN_GET_GAME_URL, { params: { gameId } });
    }

    prepareGameInfoStateModel(data) {
        const responseModel = data.gameInfo;
        return {
            id: responseModel.id,
            name: responseModel.name,
            teams: responseModel.teamsAccessCodes.map((model) => ({
                id: model.teamId,
                accessCode: model.accessCode,
            })),
            questions: responseModel.questions,
        };
    }
}

export default new ScreenService();
