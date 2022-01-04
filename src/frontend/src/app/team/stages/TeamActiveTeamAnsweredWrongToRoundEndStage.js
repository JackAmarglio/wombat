import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { AFTER_TOUR } from "@/app/team/components/bottomHalf/modes";
import { SET_CAROUSEL_ACTIVE_COMPONENT } from "@/app/team/modules/components/mutations/carousel";
import { FIELD } from "@/app/team/components/carousel/modes";

export default {
    beforeMount() {
        this.$store.commit(SET_BOTTOM_HALF_MODE, AFTER_TOUR);
        this.$store.commit(SET_CAROUSEL_ACTIVE_COMPONENT, FIELD);
    },
    mounted() {
        this.addSignalrSubscribeResults(this.signalrClient.onRoundEnded(this.defaultOnRoundEndedHandler));
    },
    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamActiveTeamAnsweredWrongToRoundEndStage",
};
