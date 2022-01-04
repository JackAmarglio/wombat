import QuestionsDataService from "@/app/admin/services/content/QuestionsDataService";

export default {
    namespaced: true,

    state: () => {
        return {
            all: [],
        };
    },

    getters: {
        questionById: (state) => (id) => {
            return state.all.find((questions) => questions.id === id);
        },
    },

    mutations: {
        SET_QUESTIONS(state, data) {
            state.all = data;
        },
        ADD_QUESTION(state, data) {
            state.all.push(data);
        },
        UPDATE_QUESTION(state, data) {
            const index = state.all.findIndex((question) => question.id === data.id);
            state.all.splice(index, 1, data);
        },

        REMOVE_QUESTION(state, questionId) {
            const index = state.all.findIndex((question) => question.id === questionId);
            state.all.splice(index, 1);
        },
    },
    actions: {
        async fetchQuestions({ commit }, params) {
            const { topicId } = params;

            let questions = [];

            if (topicId === -1 || topicId === undefined) {
                questions = (await QuestionsDataService.getTopicLessQuestions(params)).questions;
            } else {
                questions = (await QuestionsDataService.getTopicQuestions(params)).topicQuestions;
            }

            const questionStateModelsList = QuestionsDataService.prepareQuestionListForState(
                questions,
                topicId
            );
            commit("SET_QUESTIONS", questionStateModelsList);
        },
        async createQuestion({ commit }, data) {
            const newQuestionId = await QuestionsDataService.createQuestion(data);

            const itemWithNewId = {
                id: newQuestionId,
                content: data.content,
                answer: data.answer,
                difficulty: data.difficulty,
            };

            commit("ADD_QUESTION", itemWithNewId);
        },

        async updateQuestion({ commit }, questionDetails) {
            await QuestionsDataService.updateQuestion(questionDetails);
            commit("UPDATE_QUESTION", questionDetails);
        },

        async deleteQuestion({ commit }, questionId) {
            await QuestionsDataService.deleteQuestion(questionId);
            commit("REMOVE_QUESTION", questionId);
        },
    },
};
