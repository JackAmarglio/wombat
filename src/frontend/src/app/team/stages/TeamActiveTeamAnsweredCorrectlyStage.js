import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { AFTER_TOUR, BUTTON } from "@/app/team/components/bottomHalf/modes";
import { SET_TEAM_BUTTON_MODE } from "@/app/team/modules/components/mutations/teamInteractButton";
import { TEAM_BUTTON_ACTIVE_TEAM } from "@/app/team/components/bottomHalf/interactButton";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";
import { SET_CAROUSEL_ACTIVE_COMPONENT } from "@/app/team/modules/components/mutations/carousel";
import { FIELD } from "@/app/team/components/carousel/modes";

export default {
    data() {
        return {
            timeOutBeforeMovingToField: null,
            msBeforeMovingToField: 3000,
        };
    },

    beforeMount() {
        this.$store.commit(SET_BOTTOM_HALF_MODE, BUTTON);
        this.$store.commit(SET_TEAM_BUTTON_MODE, TEAM_BUTTON_ACTIVE_TEAM);
    },

    mounted() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onNextActiveTeamSelected(this.defaultOnNextActiveTeamSelectedHandler),

            this.signalrClient.onRoundEnded(this.defaultOnRoundEndedHandler)
        );

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
    name: "TeamActiveTeamAnsweredCorrectlyStage",
};
