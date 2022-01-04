<template>
    <div>
        <div class="shape" :style="shapeStyle">
            <span>
                {{ currentTeamAttempts }}
            </span>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {
    data() {
        return {
            shapeStyle: {
                ["background-color"]: "white",
            },
        };
    },

    beforeMount() {
        if (this.teamId === this.activeTeamId) {
            this.shapeStyle["background-color"] = this.activeTeamColor;
            return;
        }

        this.shapeStyle["border"] = `3px solid ${this.activeTeamColor}`;
    },

    computed: {
        ...mapGetters(["activeTeamColor", "currentTeamAttempts"]),

        ...mapState({
            teamId: (state) => state.team.id,
            activeTeamId: (state) => state.team.tourActiveTeam.id,
        }),
    },

    name: "TeamSelectingCellBottomHalf",
};
</script>

<style scoped lang="sass">
.shape
  height: 10rem
  width: 10rem
  border-radius: 100px

  display: flex
  justify-content: center
  align-items: center

  span
    line-height: 0
    font-size: 4em
    color: #111111
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8)
</style>
