// todo: bad naming, rename from questionDetails
export default {
    state: () => {
        return {
            activeQuestion: undefined,
        };
    },

    mutations: {
        SET_ACTIVE_QUESTION(state, question) {
            state.activeQuestion = question;
        },

        UNSET_ACTIVE_QUESTION(state) {
            state.activeQuestion = undefined;
        },
    },
};
