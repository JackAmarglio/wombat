import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { BUTTON } from "@/app/team/components/bottomHalf/modes";
import { SET_TEAM_BUTTON_MODE } from "@/app/team/modules/components/mutations/teamInteractButton";
import { TEAM_BUTTON_OTHER_TEAM_INTERACTED } from "@/app/team/components/bottomHalf/interactButton";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";

export default {
    beforeMount() {
        this.$store.commit(SET_BOTTOM_HALF_MODE, BUTTON);
        this.$store.commit(SET_TEAM_BUTTON_MODE, TEAM_BUTTON_OTHER_TEAM_INTERACTED);
    },

    mounted() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onNextActiveTeamSelected(this.defaultOnNextActiveTeamSelectedHandler),

            this.signalrClient.onRoundEnded(this.defaultOnRoundEndedHandler)
        );
    },
    name: "TeamOtherTeamAnsweredCorrectlyStage",
    mixins: [teamStageCompMixin, nilRenderMixin],
};
