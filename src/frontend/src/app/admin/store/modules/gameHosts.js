import GameHostsDataService from "@/app/admin/services/GameHostsDataService";

export default {
    namespaced: true,

    state: {
        all: [],
    },

    getters: {
        gameHostById: (state) => (id) => {
            return state.all.find((gameHost) => gameHost.id === id);
        },
    },

    mutations: {
        SET_GAME_HOSTS(state, gameHosts) {
            state.all = gameHosts;
        },
        ADD_GAME_HOST(state, data) {
            state.all.push(data);
        },
        UPDATE_GAME_HOST(state, data) {
            const index = state.all.findIndex((gameHost) => gameHost.id === data.id);
            state.all.splice(index, 1, data);
        },

        REMOVE_GAME_HOST(state, hostId) {
            const index = state.all.findIndex((gameHost) => gameHost.id === hostId);
            state.all.splice(index, 1);
        },
    },

    actions: {
        async fetchGameHosts({ commit }, params) {
            const gameHosts = await GameHostsDataService.getGameHosts(params);
            commit("SET_GAME_HOSTS", gameHosts);
        },

        async createGameHost({ commit }, data) {
            const newGameHostId = await GameHostsDataService.createGameHost(data);
            const itemWithNewId = {
                id: newGameHostId,
                name: data.name,
            };
            commit("ADD_GAME_HOST", itemWithNewId);
        },

        async updateGameHost({ commit }, data) {
            await GameHostsDataService.updateGameHost(data);
            commit("UPDATE_GAME_HOST", data);
        },

        async deleteGameHost({ commit }, hostId) {
            await GameHostsDataService.deleteGameHost(hostId);
            commit("REMOVE_GAME_HOST", hostId);
        },
    },
};
