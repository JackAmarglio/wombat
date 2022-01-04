import questionTopics from "@/app/admin/store/modules/questionTopics";
import questionTopicsBrowser from "@/app/admin/store/modules/questionTopicsBrowser";
import questions from "@/app/admin/store/modules/questions";
import questionTopicsFindById from "@/app/admin/store/modules/questionTopicsFindById";
import kitsCreateAndEditRevealMode from "@/app/admin/store/modules/kitsCreateAndEditRevealMode";
import questionDetails from "@/app/admin/store/modules/questionDetails";

const diffNameToDiffProp = {
    easy: "numberOfEasyQuestions",
    medium: "numberOfMediumQuestions",
    hard: "numberOfHardQuestions",
    0: "numberOfEasyQuestions",
    1: "numberOfMediumQuestions",
    2: "numberOfHardQuestions",
};

const getSelectedTopicQuestionsNumber = (state, getters, topicId, diff) => {
    if (topicId === undefined) return 0;

    const topicQuestions = getters.getTopicSelectedQuestions(topicId);

    return topicQuestions.filter((q) => q.difficulty === diff).length;
};

export default {
    state: () => {
        return {
            // показывает что темы/вопросы должны отоброжатся те, которые были выбранны
            isInRevealAllSelectedMode: false,

            selectedTopic: undefined,
            selectedTopicQuestionsPageNumber: 1,
            selectedQuestionsDifficulty: 3, // 3 or 'all' is all diff,
            selectedQuestions: {
                hard: [],
                medium: [],
                easy: [],
            },
            selectedQuestionsWithNoTopic: [],

            questionsPerPage: 6,
            isKitValidFunc:
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (numberOfEasyQuestions, numberOfMediumQuestions, numberOfHardQuestions) => {
                    return true;
                },
        };
    },

    mutations: {
        SET_REVEAL_SELECTED_MODE(state) {
            state.isInRevealAllSelectedMode = true;
        },

        UNSET_REVEAL_SELECTED_MODE(state) {
            state.isInRevealAllSelectedMode = false;
        },

        SET_SELECTED_TOPIC(state, topic) {
            state.selectedTopic = topic;
        },

        UNSET_SELECTED_TOPIC(state) {
            state.selectedTopic = undefined;
        },

        SET_SELECTED_QUESTIONS_DIFFICULTY(state, diff) {
            state.selectedQuestionsDifficulty = diff;
        },

        SET_SELECTED_TOPIC_QUESTIONS_PAGE(state, page) {
            state.selectedTopicQuestionsPageNumber = page;
        },

        SET_CURRENT_DIFFICULTY_SELECTED_QUESTIONS(state, questions) {
            const { selectedQuestions, selectedQuestionsDifficulty } = state;

            selectedQuestions[selectedQuestionsDifficulty] = questions;
        },

        REMOVE_CURRENT_DIFFICULTY_SELECTED_QUESTIONS(state) {
            const { selectedQuestions, selectedQuestionsDifficulty } = state;

            // todo check observer не летит к хуям
            selectedQuestions[selectedQuestionsDifficulty] = [];
        },

        SET_ALL_SELECTED_QUESTIONS(state, questions) {
            const { selectedQuestions } = state;

            // todo использование литерала для сложности -- грех
            selectedQuestions["easy"] = questions.filter((q) => q.difficulty === 0);
            selectedQuestions["medium"] = questions.filter((q) => q.difficulty === 1);
            selectedQuestions["hard"] = questions.filter((q) => q.difficulty === 2);
        },

        SET_SELECTED_QUESTIONS_WITH_NO_TOPIC(state, questions) {
            state.selectedQuestionsWithNoTopic = questions;
        },

        SET_KIT_VALIDATION_FUNC(state, func) {
            state.isKitValidFunc = func;
        },
    },

    actions: {
        removeFromCurrentDifficultySelectedQuestion({ getters, commit }, questionsToRemove) {
            const currentDifficultyPickedQuestions = getters.currentDifficultyPickedQuestions;
            const newSelectedQuestionsForCurrentDifficulty = [];

            questionsToRemove.forEach((q) => {
                const selectedQuestionIndex = currentDifficultyPickedQuestions.findIndex(
                    (pq) => pq.id === q.id
                );
                if (selectedQuestionIndex === -1) return;

                currentDifficultyPickedQuestions.splice(selectedQuestionIndex, 1);
            });

            // неэфективно и похуй
            currentDifficultyPickedQuestions.forEach((q) => {
                if (questionsToRemove.findIndex((qr) => qr.id === q.id) !== -1) return;

                newSelectedQuestionsForCurrentDifficulty.push(q);
            });

            commit("SET_CURRENT_DIFFICULTY_SELECTED_QUESTIONS", newSelectedQuestionsForCurrentDifficulty);
        },

        addToCurrentDifficultySelectedQuestions({ getters, commit }, questionsToAdd) {
            const currentDifficultyPickedQuestions = getters.currentDifficultyPickedQuestions;

            commit("SET_CURRENT_DIFFICULTY_SELECTED_QUESTIONS", [
                ...currentDifficultyPickedQuestions,
                ...questionsToAdd,
            ]);
        },

        async selectTopic(context, topic) {
            const { state, dispatch, commit } = context;

            if (state.isInRevealAllSelectedMode) return dispatch("selectTopicInRevealMode", topic);

            await dispatch("questions/fetchQuestions", {
                topicId: topic.id,
                offset: (state.selectedTopicQuestionsPageNumber - 1) * state.questionsPerPage,
                limit: state.questionsPerPage,
                newestFirst: true,
                difficulty: state.selectedQuestionsDifficulty,
            });

            commit("SET_SELECTED_TOPIC", topic);
        },

        async setQuestionsDifficulty(context, difficulty) {
            const { state, dispatch, commit } = context;

            if (state.isInRevealAllSelectedMode)
                return dispatch("setQuestionsDifficultyInRevealMode", difficulty);

            if (state.selectedTopic !== undefined && state.selectedQuestionsDifficulty !== difficulty) {
                await dispatch("questions/fetchQuestions", {
                    topicId: state.selectedTopic.id,
                    offset: 0,
                    limit: state.questionsPerPage,
                    newestFirst: true,
                    difficulty: difficulty,
                });
            }

            commit("SET_SELECTED_QUESTIONS_DIFFICULTY", difficulty);
        },

        async goToSelectedTopicQuestionsPage({ state, commit, dispatch }, { newPage, force = false }) {
            if (state.isInRevealAllSelectedMode)
                return dispatch("goToSelectedTopicQuestionsPageInRevealMode", {
                    newPage,
                });

            if (state.selectedTopicQuestionsPageNumber === newPage && force === false) return;

            await dispatch("questions/fetchQuestions", {
                topicId: state.selectedTopic.id,
                offset: (newPage - 1) * state.questionsPerPage,
                limit: state.questionsPerPage,
                newestFirst: true,
                difficulty: state.selectedQuestionsDifficulty,
            });

            commit("SET_SELECTED_TOPIC_QUESTIONS_PAGE", newPage);
        },

        async switchToRevealSelectedMode({ state, dispatch, commit, rootState }) {
            const { selectedQuestions } = state;

            // getting all uniq topic ids in selectedQuestions
            //использование литерала для сложности это костыль

            const selectedEasyQuestions = selectedQuestions["easy"] || [];
            const selectedMediumQuestions = selectedQuestions["medium"] || [];
            const selectedHardQuestions = selectedQuestions["hard"] || [];

            const allSelectedQuestions = [
                ...selectedEasyQuestions,
                ...selectedMediumQuestions,
                ...selectedHardQuestions,
            ];

            const topicIds = [...new Set(allSelectedQuestions.map((q) => q.topicId))];

            const noTopicQuestions = allSelectedQuestions.filter((q) => q.topicId <= 0);
            commit("SET_SELECTED_QUESTIONS_WITH_NO_TOPIC", noTopicQuestions);

            for (const topicId of topicIds) {
                // todo try to find some topics in already fetched rather than fetch all

                // В случае, если открыли кит с вопросом без темы
                if (topicId <= 0) continue;

                await dispatch("findTopicById", topicId);
            }

            commit(
                "SET_REVEAL_MODE_USED_TOPICS",
                rootState.admin.kits.kitsCreateAndEdit.questionTopicsFindById.foundTopics
            );
            commit("SET_REVEAL_SELECTED_MODE");
            commit("SET_SELECTED_TOPIC_QUESTIONS_PAGE", 1);
            commit("CLEAR_FOUND_TOPICS");
        },

        async switchOffRevealSelectedMode({ state, dispatch, commit }) {
            if (state.isInRevealAllSelectedMode === false) return;

            commit("UNSET_REVEAL_SELECTED_MODE");
            commit("CLEAR_REVEAL_MODE_STATE");
            commit("UNSET_SELECTED_TOPIC");
            commit("SET_SELECTED_TOPIC_QUESTIONS_PAGE", 1);

            await dispatch("setTopicPage", { newPage: 1, force: true });
        },

        async setTopicPage({ state, dispatch, commit }, { newPage, force = false }) {
            if (state.isInRevealAllSelectedMode) return commit("SET_REVEAL_CURRENT_PAGE", newPage);

            return dispatch("setCurrentPage", { newPage, force });
        },
    },

    getters: {
        // список топиков в зависимости от мода
        honorModeCurrentPageQuestionTopics: (state, getters) => {
            if (!state.isInRevealAllSelectedMode) return getters["currentPageQuestionTopics"];
            return getters["currentPageTopicsInRevealMode"];
        },

        selectedTopicQuestions: (state, getters, rootState) => {
            if (state.selectedTopic === undefined) return [];

            if (state.isInRevealAllSelectedMode)
                return getters["selectedTopicCurrentPageQuestionsInRevealMode"];

            const questionsModule = rootState.admin.kits.kitsCreateAndEdit.questions;

            return questionsModule.all;
        },

        topicSelectedDifficultyQuestionsNumber: (state, getters) => {
            if (state.isInRevealAllSelectedMode)
                return getters.topicSelectedDifficultyQuestionsNumberInRevealMode;

            const topic = state.selectedTopic;

            if (topic === undefined) return 0;

            return topic[diffNameToDiffProp[state.selectedQuestionsDifficulty]];
        },

        topicSelectedEasyQuestionsNumber: (state, getters) => (topicId) => {
            return getSelectedTopicQuestionsNumber(state, getters, topicId, 0);
        },

        topicSelectedMediumQuestionsNumber: (state, getters) => (topicId) => {
            return getSelectedTopicQuestionsNumber(state, getters, topicId, 1);
        },

        topicSelectedHardQuestionsNumber: (state, getters) => (topicId) => {
            return getSelectedTopicQuestionsNumber(state, getters, topicId, 2);
        },

        selectedTopicSelectedQuestions: (state, getters) => {
            const topic = state.selectedTopic;

            return getters.getTopicSelectedQuestions(topic.id);
        },

        getTopicSelectedQuestions: (state) => (topicId) => {
            const selectedQuestions = state.selectedQuestions;

            const topicSelectedQuestions = [];

            //использование литерала для сложности это костыль
            for (const diff of ["easy", "medium", "hard"]) {
                const currentDifficultySelectedQuestions = selectedQuestions[diff];

                if (currentDifficultySelectedQuestions === undefined) continue;

                topicSelectedQuestions.push(
                    ...currentDifficultySelectedQuestions.filter((q) => q.topicId === topicId)
                );
            }

            return topicSelectedQuestions;
        },

        currentTopicPage: (state, _, rootState) => {
            if (!state.isInRevealAllSelectedMode)
                return rootState.admin.kits.kitsCreateAndEdit.questionTopicsBrowser.currentPage;
        },

        isQuestionsKitFilledCorrectly: (state) => {
            const { selectedQuestions } = state;

            // todo использование литералов для сложности плоха
            const numberOfEasy = selectedQuestions["easy"]?.length || 0;
            const numberOfMedium = selectedQuestions["medium"]?.length || 0;
            const numberOfHard = selectedQuestions["hard"]?.length || 0;

            return state.isKitValidFunc(numberOfEasy, numberOfMedium, numberOfHard);
        },

        selectedTopicId: (state) => {
            const { selectedTopic } = state;

            return selectedTopic?.id || -1;
        },

        allSelectedQuestions: (state) => {
            const { selectedQuestions } = state;
            const { easy, medium, hard } = selectedQuestions;

            return [...easy, ...medium, ...hard];
        },

        currentDifficultyPickedQuestions: (state) => {
            const { selectedQuestionsDifficulty, selectedQuestions } = state;

            return selectedQuestions[selectedQuestionsDifficulty] ?? [];
        },

        // выбраны ли все вопросы, которые сейчас показываеются на странице
        isAllSelectedTopicQuestionsPicked: (state, getters) => {
            if (state.selectedTopic === undefined) return false;

            const selectedTopicQuestions = getters.selectedTopicQuestions;
            const allSelectedQuestions = getters.selectedTopicSelectedQuestions;

            for (const selectedTopicQuestion of selectedTopicQuestions) {
                if (allSelectedQuestions.find((sq) => sq.id === selectedTopicQuestion.id) === undefined) {
                    return false;
                }
            }

            return true;
        },
    },

    modules: {
        questions,
        questionDetails,
        questionTopics,
        questionTopicsBrowser,
        questionTopicsFindById,
        kitsCreateAndEditRevealMode,
    },
};
