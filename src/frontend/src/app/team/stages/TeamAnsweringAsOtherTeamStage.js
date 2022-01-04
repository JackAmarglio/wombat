import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import TeamStage from "@/app/team/TeamStage";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { ANSWERING_TO_QUESTION, BUTTON } from "@/app/team/components/bottomHalf/modes";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";
import { SET_CAROUSEL_ACTIVE_COMPONENT } from "@/app/team/modules/components/mutations/carousel";
import { FIELD } from "@/app/team/components/carousel/modes";
import { SET_TEAM_BUTTON_MODE } from "@/app/team/modules/components/mutations/teamInteractButton";
import { TEAM_BUTTON_WRONG_ANSWER } from "@/app/team/components/bottomHalf/interactButton";

export default {
    beforeMount() {
        this.$store.commit(SET_BOTTOM_HALF_MODE, ANSWERING_TO_QUESTION);
    },

    mounted() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onTeamAnsweredCorrectly(async ({ teamId }) => {
                if (teamId !== this.id) {
                    console.warn("Got unexpected team id", {
                        expectedTeamId: this.id,
                        actualTeamId: teamId,
                    });
                }

                await this.$store.dispatch("increaseCurrentTeamAttempts", this.getAttemptsPriceForCurrentCell);
                await this.$store.dispatch("captureCurrentCell", teamId);
                this.setStage(TeamStage.AnsweredCorrectlyAsOtherTeam);
            }),

            this.signalrClient.onTeamAnsweredWrong((args) => {
                const { isVictoryConditionMet, teamId } = args;

                // todo: нужен отдельный этап для этого
                if (isVictoryConditionMet) {
                    this.$store.commit(SET_CAROUSEL_ACTIVE_COMPONENT, FIELD);
                    this.$store.commit(SET_BOTTOM_HALF_MODE, BUTTON);
                    this.$store.commit(SET_TEAM_BUTTON_MODE, TEAM_BUTTON_WRONG_ANSWER);

                    return;
                }

                if (teamId !== this.id) {
                    console.warn("Got unexpected team id", {
                        expectedTeamId: this.id,
                        actualTeamId: teamId,
                    });
                }

                this.setStage(TeamStage.AnsweredWrongAsOtherTeam);
            }),

            this.signalrClient.onNoTeamsLeftToAnswer(() => {
                this.setStage(TeamStage.NoOtherTeamsThatCanAnswer);
            }),

            this.signalrClient.onRoundEnded(async (roundEndedArgs) => {
                const { lastAnsweredTeamId, isLastAnsweredTeamCorrect } = roundEndedArgs;

                if (isLastAnsweredTeamCorrect) {
                    await this.$store.dispatch("captureCurrentCell", lastAnsweredTeamId);
                }

                this.defaultOnRoundEndedHandler(roundEndedArgs);
            })
        );
    },
    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamAnsweringAsOtherTeamStage",
};
