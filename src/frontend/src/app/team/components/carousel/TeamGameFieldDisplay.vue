<template>
    <div class="outer-wrapper">
        <div class="game-field" ref="fieldBlock">
            <ul class="game-field__wrapper">
                <li
                    class="game-field__cell"
                    :key="index"
                    v-for="(cell, index) in field"
                    :style="getCellStyle(cell, index)"
                >
                    <span>{{ cell.value }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import colors from "@/app/shared/teamColors";

export default {
    name: "TeamGameFieldDisplay",
    computed: {
        ...mapState({
            field: (state) => state.team.gameField.cells,
            tourCellNumber: (state) => state.team.tourActiveCell.cellNumber,
        }),

        ...mapGetters({
            activeTeamColor: "activeTeamColor",
        }),
    },
    methods: {
        getCellStyle(cell, index) {
            const activeTeamColor = this.activeTeamColor;

            function activeCellStyle() {
                return {
                    background: "#fff",
                    border: `2px solid ${activeTeamColor ?? "black"}`,
                };
            }

            function capturedCellStyle() {
                return {
                    background: colors.get(cell.teamId),
                    color: "white",
                };
            }

            function defaultCellStyle() {
                return {
                    background: "#fff",
                    color: "inherit",
                };
            }

            const isCellCaptured = cell.teamId !== 0;
            const isCellActive = this.isCellActive(index);

            if (isCellCaptured) return capturedCellStyle();
            if (isCellActive) return activeCellStyle();
            return defaultCellStyle();
        },

        isCellActive(index) {
            return index + 1 === this.tourCellNumber;
        },
    },
};
</script>

<style scoped lang="scss">
.outer-wrapper {
    width: 100%;
    height: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
}

.game-field {
    width: 100%;
    height: 100%;
    display: grid;
    place-content: center;

    &__wrapper {
        width: 40vmin;
        height: 40vmin;
        margin: 0;
        padding: 0;
        list-style-type: none;
        display: grid;
        grid-gap: 6px;
        grid-template-columns: repeat(6, minmax(1px, 1fr));

        @media (max-width: 425px) {
            width: 70vmin;
            height: 70vmin;
        }
    }

    &__cell {
        background: #e4ebf5;
        box-shadow: -3px -3px 15px #ffffff, 6px 6px 18px #c8d0e7;
        border-radius: 10px;

        display: flex;
        justify-content: center;
        align-items: center;
    }
}
</style>
