import { SET_GAME_FIELD, RESTORE_GAME_FIELD, CAPTURE_CELL, ROUND_ENDED } from "@/app/team/modules/mutations";

function getCellsInitState() {
    return Array.from({ length: 36 }, (_, i) => {
        return { value: i + 1, teamId: 0 };
    });
}

export default {
    state() {
        return {
            cells: getCellsInitState(),
        };
    },

    actions: {
        captureCurrentCell({ commit, rootState }, teamId) {
            commit(CAPTURE_CELL, {
                cellNumber: rootState.team.tourActiveCell.cellNumber,
                teamId: teamId,
            });
        },
    },

    mutations: {
        [SET_GAME_FIELD](state, cells) {
            state.cells = cells;
        },

        [RESTORE_GAME_FIELD](state, restoredCells) {
            Object.entries(restoredCells).forEach(([cellNumber, teamId]) => {
                if (cellNumber < 1 || cellNumber > state.cells.length) {
                    console.error("Invalid cell number was found", cellNumber);
                    return;
                }
                state.cells[cellNumber - 1].teamId = teamId;
            });
        },

        [CAPTURE_CELL](state, { cellNumber, teamId }) {
            if (cellNumber < 1 || cellNumber > state.cells.length) {
                console.error("Invalid cell number was found", cellNumber);
                return;
            }
            state.cells[cellNumber - 1].teamId = teamId;
        },

        [ROUND_ENDED](state) {
            state.cells = getCellsInitState();
        },
    },
};
