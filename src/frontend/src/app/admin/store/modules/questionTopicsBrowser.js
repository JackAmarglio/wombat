const defaultItemsPerPage = 6;

const zeroQuestionTopicHeader = {
    id: -1,
    name: "Вопросы без темы",
};

// requires and depends on questionTopic.js vuex module
export default {
    state: () => {
        return {
            currentPage: 1,
            itemsPerPage: defaultItemsPerPage,
            isZeroTopicIncluded: false,
        };
    },

    mutations: {
        SET_ITEMS_PER_PAGE(state, itemsPerPage) {
            state.itemsPerPage = itemsPerPage;
        },

        SET_CURRENT_PAGE(state, currentPage) {
            state.currentPage = currentPage;
        },

        ENABLE_ZERO_TOPIC(state) {
            state.isZeroTopicIncluded = true;
        },

        DISABLE_ZERO_TOPIC(state) {
            state.isZeroTopicIncluded = false;
        },
    },

    actions: {
        async setCurrentPage(context, { newPage, force = false }) {
            const { state, dispatch, commit, getters } = context;

            if (newPage === state.currentPage && force === false) return;

            let fetchOffset = (newPage - 1) * state.itemsPerPage;

            if (state.isZeroTopicIncluded) {
                if (newPage === 1) {
                    await dispatch("admin/questionTopics/fetchTopicLessMeta", null, {
                        root: true,
                    });
                } else {
                    /*
                         Так как на первой странице встраивается "нулевой топик",
                         то на ней показывается не itemsPerPage топиков, а на 1 меньше.
                         Выходит нужно всегда на след страницах смещать оффсет из-за первой страницы
                    */
                    fetchOffset -= 1;
                }
            }

            await dispatch(
                "admin/questionTopics/fetchQuestionTopics",
                { offset: fetchOffset, limit: getters.pageLimit, newestFirst: true },
                { root: true }
            );

            commit("SET_CURRENT_PAGE", newPage);
        },
    },

    getters: {
        currentPageQuestionTopics: (state, getters, rootState) => {
            const { currentPage, isZeroTopicIncluded } = state;
            const questionTopicState = rootState.admin.questionTopics;
            const result = [];

            if (isZeroTopicIncluded && currentPage === 1) {
                const { numberOfEasyQuestions, numberOfMediumQuestions, numberOfHardQuestions } =
                    questionTopicState.topicLessMeta;

                result.push({
                    ...zeroQuestionTopicHeader,
                    numberOfEasyQuestions,
                    numberOfMediumQuestions,
                    numberOfHardQuestions,
                });
            }

            result.push(...questionTopicState.currentTopicBatch);
            result.splice(state.itemsPerPage);

            return result;
        },

        pageLimit: (state) => {
            return state.itemsPerPage * 3;
        },
    },
};
