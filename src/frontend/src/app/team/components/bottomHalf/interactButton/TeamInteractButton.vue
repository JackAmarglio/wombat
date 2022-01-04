<template>
    <div>
        <div class="btn-wrapper">
            <button class="team-btn" :style="buttonStyle" :disabled="isDisabled" @click="onButtonClick()">
                <span>
                    {{ remainingAttempts }}
                </span>
            </button>
        </div>
    </div>
</template>

<script>
import {
    TEAM_BUTTON_ACTIVE_TEAM,
    TEAM_BUTTON_WRONG_ANSWER,
    TEAM_BUTTON_OTHER_TEAM_INTERACTED,
    TEAM_BUTTON_CORRECT_ANSWER,
    TEAM_BUTTON_DISABLED,
    TEAM_BUTTON_TIMER_LAUNCHED,
    TEAM_BUTTON_SUSPENSE,
} from "@/app/team/components/bottomHalf/interactButton";
import { TEAM_BUTTON_PRESSED } from "@/app/team/modules/components/mutations/teamInteractButton";
import { mapGetters } from "vuex";

// Takes hex color with an opacity and returns string like 'rgba(r,g,b,o)'
function getCssColorStringFromHexWithOpacity(hexValue, opacity) {
    const rgbColors = hexValue
        .replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => "#" + r + r + g + g + b + b)
        .substring(1)
        .match(/.{2}/g)
        .map((x) => parseInt(x, 16));

    return `rgba(${rgbColors[0]},${rgbColors[1]},${rgbColors[2]},${opacity})`;
}

export default {
    data() {
        return {
            buttonStyle: {
                ["background-color"]: "цвет говна",
            },
            isDisabled: true,

            inActiveColor: "#72757A",
        };
    },

    beforeMount() {
        this.setMode(this.mode);
    },

    computed: {
        ...mapGetters({
            remainingAttempts: "currentTeamAttempts",
        }),
        ...mapGetters(["activeTeamColor", "teamColor"]),

        lastInteractedOtherTeamId() {
            return this.$store.state.team.status.lastTeamIdOfInteractedOtherTeam;
        },

        tourActiveTeamId() {
            return this.$store.state.team.tourActiveTeam.id;
        },

        mode() {
            return this.$store.state.team.ui.interactButton.mode;
        },
    },

    watch: {
        mode(newMode) {
            this.setMode(newMode);
        },
    },

    methods: {
        setMode(mode) {
            switch (mode) {
                case TEAM_BUTTON_DISABLED: {
                    const backgroundColor = getCssColorStringFromHexWithOpacity(this.teamColor, 0.7);
                    this.buttonStyle = { backgroundColor };
                    this.isDisabled = true;

                    break;
                }

                case TEAM_BUTTON_TIMER_LAUNCHED: {
                    const backgroundColor = getCssColorStringFromHexWithOpacity(this.teamColor, 1);
                    this.buttonStyle = { backgroundColor };
                    this.isDisabled = false;

                    break;
                }

                case TEAM_BUTTON_ACTIVE_TEAM: {
                    const backgroundColor = "white";
                    const border = `3px solid ${this.activeTeamColor}`;
                    this.buttonStyle = { backgroundColor, border };

                    this.isDisabled = true;

                    break;
                }

                case TEAM_BUTTON_OTHER_TEAM_INTERACTED: {
                    const interactedTeamId = this.$store.state.team.status.lastTeamIdOfInteractedOtherTeam;
                    const interactedTeamColor = this.$store.getters.getTeamColorByTeamId(interactedTeamId);

                    const backgroundColor = "white";
                    const border = `3px solid ${interactedTeamColor}`;
                    this.buttonStyle = { backgroundColor, border };

                    this.isDisabled = true;

                    break;
                }

                case TEAM_BUTTON_WRONG_ANSWER: {
                    const backgroundColor = getCssColorStringFromHexWithOpacity(this.inActiveColor, 1);
                    this.buttonStyle = { backgroundColor };

                    this.isDisabled = true;

                    break;
                }

                case TEAM_BUTTON_CORRECT_ANSWER: {
                    const backgroundColor = getCssColorStringFromHexWithOpacity(this.teamColor, 1);
                    this.buttonStyle = { backgroundColor };

                    this.isDisabled = true;

                    break;
                }

                case TEAM_BUTTON_SUSPENSE: {
                    const backgroundColor = "rgba(228, 235, 245, 0.7)";
                    this.buttonStyle = { backgroundColor };
                    this.isDisabled = true;

                    break;
                }
            }
        },

        onButtonClick() {
            this.$store.commit(TEAM_BUTTON_PRESSED);
        },
    },

    name: "TeamInteractButton",
};
</script>

<style scoped lang="sass">
.team-btn
  border-radius: 100px
  width: 10rem
  height: 10rem
  border: none

  display: flex
  justify-content: center
  align-items: center
  padding: 0


  position: relative

  span
    position: absolute
    line-height: 0

    top: 50%
    left: 50%
    transform: translate(-50%, -50%)

    font-size: 4em
    color: #111111
    opacity: 0.8
</style>
