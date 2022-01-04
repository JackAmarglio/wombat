import TeamStage from "@/app/team/TeamStage";
import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import { BUTTON } from "@/app/team/components/bottomHalf/modes";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";

export default {
    data() {
        return {
            shouldDisplayQuestionTopic: false,
            delayBeforeShowingTopicInSecond: 4,
            showingTopicTimeout: undefined,
        };
    },
    beforeMount() {
        this.$store.commit(SET_BOTTOM_HALF_MODE, BUTTON);
    },
    mounted() {
        this.showingTopicTimeout = setTimeout(
            () => (this.shouldDisplayQuestionTopic = true),
            this.delayBeforeShowingTopicInSecond * 1000
        );

        this.addSignalrSubscribeResults(
            this.signalrClient.onTeamsAllowedInteract(() => {
                this.setStage(TeamStage.AllowedInteractAsActiveTeam);
            })
        );
    },
    computed: {
        questionTopic() {
            return this.$store.state.team.questionTopics.current;
        },
    },
    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamSelectedCellStage",
};
