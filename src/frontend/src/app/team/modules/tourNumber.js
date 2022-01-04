import { INCREASE_TOUR_NUMBER, SET_TOUR_NUMBER } from "@/app/team/modules/mutations/tourNumber";
import { ROUND_ENDED } from "@/app/team/modules/mutations";

export default {
    state() {
        return {
            // 0, а не 1, потому что defaultOnNextActiveTeamSelectedHandler всегда инкрементит на 1, а до игры, номер тура не видно
            current: 0,
        };
    },

    mutations: {
        [SET_TOUR_NUMBER](state, tourNumber) {
            state.current = tourNumber;
        },

        [INCREASE_TOUR_NUMBER](state) {
            state.current++;
        },

        [ROUND_ENDED](state) {
            state.current = 0;
        },
    },
};
