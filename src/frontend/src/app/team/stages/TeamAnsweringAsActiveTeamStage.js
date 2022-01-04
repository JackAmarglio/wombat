import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import TeamStage from "@/app/team/TeamStage";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { ANSWERING_TO_QUESTION } from "@/app/team/components/bottomHalf/modes";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";

export default {
    beforeMount() {
        this.$store.commit(SET_BOTTOM_HALF_MODE, ANSWERING_TO_QUESTION);
    },

    mounted() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onTeamAnsweredCorrectly(async ({ teamId }) => {
                if (teamId !== this.id) {
                    console.warn("Interacted team id should be active but it's not", {
                        expectedTeamId: this.id,
                        actualTeamId: teamId,
                    });
                }

                await this.$store.dispatch("increaseCurrentTeamAttempts", this.getAttemptsPriceForCurrentCell);
                await this.$store.dispatch("captureCurrentCell", teamId);
                this.setStage(TeamStage.AnsweredCorrectlyAsActiveTeam);
            }),

            this.signalrClient.onTeamAnsweredWrong(() => {
                this.setStage(TeamStage.AnsweredWrongAsActiveTeam);
            }),

            this.signalrClient.onRoundEnded(async (roundEndedArgs) => {
                const { lastAnsweredTeamId, isLastAnsweredTeamCorrect } = roundEndedArgs;

                if (isLastAnsweredTeamCorrect) {
                    await this.$store.dispatch("captureCurrentCell", lastAnsweredTeamId);
                }

                this.defaultOnRoundEndedHandler(roundEndedArgs);
            }),

            this.signalrClient.onNoTeamsLeftToAnswer(() => {
                this.setStage(TeamStage.NoOtherTeamsThatCanAnswer);
            })
        );
    },
    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamAnsweringAsActiveTeamStage",
};
