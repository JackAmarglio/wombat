import {
    DECREASE_TOUR_CELL_DIFFICULTY,
    ROUND_ENDED,
    SET_TOUR_ACTIVE_TEAM_ID,
    SET_TOUR_CELL_DIFFICULTY,
    SET_TOUR_CELL_NUMBER,
} from "@/app/team/modules/mutations";

// Инфо об клетке находящейся в игре
export default {
    state: () => {
        return {
            cellNumber: -1,
            cellDifficulty: -1,
        };
    },

    mutations: {
        [SET_TOUR_CELL_NUMBER](state, cellNumber) {
            state.cellNumber = cellNumber;
        },

        [SET_TOUR_CELL_DIFFICULTY](state, cellDifficulty) {
            state.cellDifficulty = cellDifficulty;
        },

        [DECREASE_TOUR_CELL_DIFFICULTY](state) {
            const { cellDifficulty } = state;
            if (cellDifficulty === 0) return;

            state.cellDifficulty--;
        },

        [SET_TOUR_ACTIVE_TEAM_ID](state) {
            state.cellNumber = -1;
            state.cellDifficulty = -1;
        },

        [ROUND_ENDED](state) {
            state.cellNumber = -1;
            state.cellDifficulty = -1;
        },
    },
};
