import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import { FIELD } from "@/app/team/components/carousel/modes";
import { SET_CAROUSEL_ACTIVE_COMPONENT } from "@/app/team/modules/components/mutations/carousel";
import { AFTER_TOUR, BUTTON } from "@/app/team/components/bottomHalf/modes";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { TEAM_BUTTON_CORRECT_ANSWER } from "@/app/team/components/bottomHalf/interactButton";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";
import { SET_TEAM_BUTTON_MODE } from "@/app/team/modules/components/mutations/teamInteractButton";

export default {
    data() {
        return {
            timeOutBeforeMovingToField: null,
            msBeforeMovingToField: 3000,
        };
    },

    beforeMount() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onNextActiveTeamSelected((teamId) => {
                //todo: investigate exception swallowing. Signalr's doing?
                if (this.$store.state.team.tourActiveTeam.id === this.id && this.id === teamId) {
                    console.error("Next active team id is the same as current", {
                        currentActiveTeamId: this.id,
                        nextTeamId: teamId,
                    });
                }

                this.defaultOnNextActiveTeamSelectedHandler(teamId);
            }),

            this.signalrClient.onRoundEnded(this.defaultOnRoundEndedHandler)
        );

        // мб заставить bottomHalf слушать SET_TEAM_BUTTON_MODE и ставить BUTTON мод неявно
        this.$store.commit(SET_BOTTOM_HALF_MODE, BUTTON);

        this.$store.commit(SET_TEAM_BUTTON_MODE, TEAM_BUTTON_CORRECT_ANSWER);

        this.timeOutBeforeMovingToField = setTimeout(() => {
            this.$store.commit(SET_BOTTOM_HALF_MODE, AFTER_TOUR);
            this.$store.commit(SET_CAROUSEL_ACTIVE_COMPONENT, FIELD);
        }, this.msBeforeMovingToField);
    },

    methods: {
        createdRightAfterRestore() {
            this.msBeforeMovingToField = 0;
        },
    },

    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamAnsweredCorrectlyStage",
};
