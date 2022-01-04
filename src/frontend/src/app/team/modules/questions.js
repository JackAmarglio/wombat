import { ROUND_ENDED, SET_CURRENT_TOUR_QUESTION } from "@/app/team/modules/mutations";

export default {
    state: {
        currentTourQuestion: null,
    },

    mutations: {
        [SET_CURRENT_TOUR_QUESTION](state, question) {
            state.currentTourQuestion = question;
        },

        [ROUND_ENDED](state) {
            state.currentTourQuestion = null;
        },
    },
};
