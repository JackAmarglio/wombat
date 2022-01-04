import teamsRoundsOrder from "@/app/shared/store/modules/teamsRoundsOrder";
import { SET_TEAMS_ROUNDS_ORDER } from "@/app/shared/store/modules/mutations";

let sendUpdateTimeout = null;
export default {
    state: () => ({
        ...teamsRoundsOrder.state(),
        hasNotSyncChanges: false,
        syncError: false,
        lastTrustedOrder: [],
        // sendUpdateTimeout: null,
    }),

    mutations: {
        ...teamsRoundsOrder.mutations,
    },

    getters: {
        ...teamsRoundsOrder.getters,
    },

    actions: {
        async setAndUpdateCurrentTeamsRoundsOrder({ dispatch, commit, getters, state }, teamsRoundsOrder) {
            state.hasNotSyncChanges = true;
            clearTimeout(sendUpdateTimeout);
            commit(SET_TEAMS_ROUNDS_ORDER, teamsRoundsOrder);

            if (getters.isTeamsRoundsOrderValid === false) return;

            sendUpdateTimeout = setTimeout(async () => await dispatch("postUpdatedOrder"), 1000);
        },

        async postUpdatedOrder({ getters, rootState, state }) {
            if (getters.isTeamsRoundsOrderValid === false) return;

            const signalr = rootState.host.signalrClient;

            const updateResult = await signalr.updateTeamsRoundsOrder(
                state.current.map((item) => item.teamsIds)
            );

            if (updateResult === false) {
                console.error("update teams rounds order failed", [...state.current]);
                state.syncError = true;

                return;
            }

            state.lastTrustedOrder = state.current;
            state.hasNotSyncChanges = false;
            state.syncError = false;
        },
    },
};
