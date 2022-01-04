import GamesDataService from "@/app/admin/services/GamesDataService";

export default {
    namespaced: true,

    state: {
        all: [], //HumbleGameStateModel
        activeGame: {}, //GameStateModel
    },

    mutations: {
        SET_ALL_GAMES(state, data) {
            state.all = data.games;
        },
        SET_ACTIVE_GAME(state, data) {
            state.activeGame = data;
        },
        ADD_GAME(state, data) {
            state.all.push(data);
        },
        UPDATE_GAME(state, data) {
            const index = state.all.findIndex((game) => game.id === data.id);
            state.all.splice(index, 1, data);
        },
        UPDATE_ACTIVE_GAME(state, data) {
            state.activeGame = data;
        },
        REMOVE_GAME(state, data) {
            const index = state.all.findIndex((game) => game.id === data.id);
            state.all.splice(index, 1);
        },
    },

    actions: {
        async fetchGames({ commit }, params) {
            const response = await GamesDataService.getAllItems(params);
            commit("SET_ALL_GAMES", response);
        },

        async fetchActiveGame({ commit }, params) {
            const response = await GamesDataService.getItem(params);
            commit("SET_ACTIVE_GAME", response);
        },

        async createGame({ commit }, data) {
            const gameShortcutModel = GamesDataService.prepareGameShortcutModel(data);
            const newGameId = await GamesDataService.createItem(gameShortcutModel);
            const itemWithNewId = {
                id: newGameId,
                name: data.name,
                gameHostName: data.gameHost.name,
                kitCompilationName: data.kitCompilation.name,
            };
            commit("ADD_GAME", itemWithNewId);
        },

        async updateActiveGame({ commit }, data) {
            commit("UPDATE_ACTIVE_GAME", data);
        },

        async updateGame({ commit }, data) {
            const gameShortcutModel = GamesDataService.prepareGameShortcutModel(data);
            await GamesDataService.updateItem(gameShortcutModel);
            const shortcutForState = {
                id: data.id,
                name: data.name,
                gameHostName: data.gameHost.name,
                kitCompilationName: data.kitCompilation.name,
            };
            commit("UPDATE_GAME", shortcutForState);
        },

        async deleteGame({ commit }, data) {
            await GamesDataService.deleteGame(data.id);
            commit("REMOVE_GAME", data);
        },

        async restartGame(_, { gameId }) {
            await GamesDataService.restartGame(gameId);
        },
    },
};
