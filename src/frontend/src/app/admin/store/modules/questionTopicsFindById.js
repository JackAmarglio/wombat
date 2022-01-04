import QuestionTopicsService from "@/app/admin/services/content/QuestionTopicsService";

export default {
    state: () => {
        return {
            foundTopics: [],
        };
    },

    mutations: {
        ADD_FOUND_TOPIC(state, questionTopics) {
            state.foundTopics.push(questionTopics);
        },

        CLEAR_FOUND_TOPICS(state) {
            state.foundTopics = [];
        },
    },

    actions: {
        async findTopicById({ commit }, topicId) {
            const questionTopic = await QuestionTopicsService.getQuestionTopic(topicId);

            if (questionTopic === null || questionTopic.id === undefined) return;

            commit("ADD_FOUND_TOPIC", questionTopic);
        },
    },
};
