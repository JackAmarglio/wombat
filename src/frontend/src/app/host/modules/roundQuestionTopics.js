// todo: Move from host as used as shared module
export default {
    state: {
        currentRoundQuestionTopics: [],
    },

    mutations: {
        SET_CURRENT_ROUND_QUESTION_TOPICS(state, topics) {
            state.currentRoundQuestionTopics = topics;
        },

        CLEAR_CURRENT_ROUND_QUESTION_TOPICS(state) {
            state.currentRoundQuestionTopics = [];
        },
    },
};
