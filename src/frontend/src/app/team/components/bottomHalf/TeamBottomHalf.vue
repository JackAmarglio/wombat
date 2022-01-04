<template>
    <div class="outer-wrapper">
        <div class="current-comp">
            <component v-bind:is="getComponentFromCurrentMode(mode)" />
        </div>
    </div>
</template>

<script>
import {
    BUTTON,
    AFTER_TOUR,
    ANSWERING_TO_QUESTION,
    CELL_SELECTION,
} from "@/app/team/components/bottomHalf/modes";
import TeamInteractButton from "@/app/team/components/bottomHalf/interactButton/TeamInteractButton";
import TeamSelectingCellBottomHalf from "@/app/team/components/bottomHalf/TeamSelectingCellBottomHalf";
import TeamAnsweringToQuestionBottomHalf from "@/app/team/components/bottomHalf/TeamAnsweringToQuestionBottomHalf";
import TeamAfterTourBottomHalf from "@/app/team/components/bottomHalf/TeamAfterTourBottomHalf";

const modeToComp = {
    [BUTTON]: TeamInteractButton.name,
    [CELL_SELECTION]: TeamSelectingCellBottomHalf.name,
    [ANSWERING_TO_QUESTION]: TeamAnsweringToQuestionBottomHalf.name,
    [AFTER_TOUR]: TeamAfterTourBottomHalf.name,
};

export default {
    computed: {
        mode() {
            return this.$store.state.team.ui.bottomHalf.mode;
        },
    },
    methods: {
        getComponentFromCurrentMode(mode) {
            if (mode === undefined) return;

            return modeToComp[mode];
        },
    },
    components: {
        TeamInteractButton,
        TeamSelectingCellBottomHalf,
        TeamAnsweringToQuestionBottomHalf,
        TeamAfterTourBottomHalf,
    },
    name: "TeamBottomHalf",
};
</script>

<style scoped lang="sass">
.outer-wrapper
  height: 100%
  display: flex
  justify-content: center
  align-items: center

  .current-comp
    background-color: #111111
    display: flex
    justify-content: center
    align-items: center

    height: 100%
    width: 100%
</style>
