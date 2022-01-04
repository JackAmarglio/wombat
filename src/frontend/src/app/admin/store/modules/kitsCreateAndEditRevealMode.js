const diffNameToDiffNumber = {
    easy: 0,
    medium: 1,
    hard: 2,
    // пока то что ниже не использовалось
    0: 0,
    1: 1,
    2: 2,
};

const topicsPerPage = 4;
const questionsPerPage = 6;

export default {
    state: () => {
        return {
            revealModeUsedTopics: [],
            currentPage: 1,
        };
    },

    mutations: {
        SET_REVEAL_MODE_USED_TOPICS(state, topics) {
            state.revealModeUsedTopics = topics;
        },

        SET_REVEAL_CURRENT_PAGE(state, page) {
            state.currentPage = page;
        },

        CLEAR_REVEAL_MODE_STATE(state) {
            state.revealModeUsedTopics = [];
            state.currentPage = 1;
        },
    },

    actions: {
        selectTopicInRevealMode({ commit }, topic) {
            commit("admin/kits/SET_SELECTED_TOPIC", topic, { root: true });
        },

        setQuestionsDifficultyInRevealMode({ commit }, difficulty) {
            commit("SET_SELECTED_QUESTIONS_DIFFICULTY", difficulty);
        },

        goToSelectedTopicQuestionsPageInRevealMode({ commit }, { newPage }) {
            commit("admin/kits/SET_SELECTED_TOPIC_QUESTIONS_PAGE", newPage, {
                root: true,
            });
        },
    },

    getters: {
        currentPageTopicsInRevealMode: (state) => {
            const { revealModeUsedTopics, currentPage } = state;

            const skipFirstElements = revealModeUsedTopics.filter(
                (_, i) => i > (currentPage - 1) * topicsPerPage - 1
            );

            return skipFirstElements.splice(0, topicsPerPage);
        },

        selectedTopicQuestionsInRevealMode: (state, getters, rootState, rootGetters) => {
            const topicSelectedQuestions = rootGetters["admin/kits/selectedTopicSelectedQuestions"];

            return topicSelectedQuestions.filter(
                (q) =>
                    q.difficulty ===
                    diffNameToDiffNumber[rootState.admin.kits.kitsCreateAndEdit.selectedQuestionsDifficulty]
            );
        },

        selectedTopicCurrentPageQuestionsInRevealMode: (state, getters, rootState) => {
            const selectedTopicQuestions = getters.selectedTopicQuestionsInRevealMode;
            const { selectedTopicQuestionsPageNumber } = rootState.admin.kits.kitsCreateAndEdit;

            const skipFirstElements = selectedTopicQuestions.filter(
                (_, i) => i > (selectedTopicQuestionsPageNumber - 1) * questionsPerPage - 1
            );

            return skipFirstElements.splice(0, questionsPerPage);
        },

        topicSelectedDifficultyQuestionsNumberInRevealMode: (state, getters) => {
            const topicSelectedQuestions = getters.selectedTopicQuestionsInRevealMode;

            return topicSelectedQuestions.length;
        },
    },
};
