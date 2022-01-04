import { SET_CURRENT_QUESTION_TOPIC_BY_ID, SET_ROUND_QUESTION_TOPICS } from "@/app/team/modules/mutations";

export default {
    state() {
        return {
            roundTopics: [],
            // Question topic of tour selected question
            current: null,
        };
    },

    mutations: {
        [SET_ROUND_QUESTION_TOPICS](state, topics) {
            state.roundTopics = topics;
        },

        [SET_CURRENT_QUESTION_TOPIC_BY_ID](state, topicId) {
            const { roundTopics } = state;
            const currentTopic = roundTopics.find((t) => t.id === topicId);

            if (currentTopic === undefined) {
                throw "Can't find current topic by id.";
            }

            state.current = currentTopic;
        },
    },
};
