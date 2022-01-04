import QuestionTopicsService from "@/app/admin/services/content/QuestionTopicsService";

export default {
    namespaced: true,

    state: () => {
        return {
            currentTopicBatch: [],
            topicLessMeta: {},
        };
    },

    mutations: {
        SET_QUESTION_TOPICS(state, questionTopics) {
            state.currentTopicBatch = questionTopics;
        },

        SET_TOPIC_LESS_META(state, data) {
            state.topicLessMeta = data;
        },
    },

    actions: {
        async fetchQuestionTopics({ commit }, { offset, limit, newestFirst = true }) {
            const questionTopics = await QuestionTopicsService.getQuestionTopics({
                offset,
                limit,
                newestFirst,
            });

            commit("SET_QUESTION_TOPICS", questionTopics);
        },

        async fetchTopicLessMeta({ commit }) {
            const topicLessMeta = await QuestionTopicsService.getTopicLessMeta();

            commit("SET_TOPIC_LESS_META", topicLessMeta);
        },
    },
};
