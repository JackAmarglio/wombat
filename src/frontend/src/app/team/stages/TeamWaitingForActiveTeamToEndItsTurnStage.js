import TeamStage from "@/app/team/TeamStage";
import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import { INCREASE_TEAM_REMAINING_ATTEMPTS, SET_TOUR_CELL_NUMBER } from "@/app/team/modules/mutations";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { BUTTON } from "@/app/team/components/bottomHalf/modes";
import { SET_TEAM_BUTTON_MODE } from "@/app/team/modules/components/mutations/teamInteractButton";
import { TEAM_BUTTON_ACTIVE_TEAM } from "@/app/team/components/bottomHalf/interactButton";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";

export default {
    beforeMount() {
        this.$store.commit(SET_BOTTOM_HALF_MODE, BUTTON);
        this.$store.commit(SET_TEAM_BUTTON_MODE, TEAM_BUTTON_ACTIVE_TEAM);
    },

    mounted() {
        this.addSignalrSubscribeResults(
            // as workaround cuz onNExtAnswerSelected does not hold cell number
            this.signalrClient.onTeamsAllowedInteract(({ cellNumberInPlay }) => {
                this.$store.commit(SET_TOUR_CELL_NUMBER, cellNumberInPlay);
            }),

            this.signalrClient.onTeamAnsweredCorrectly(async ({ teamId }) => {
                this.$store.commit(INCREASE_TEAM_REMAINING_ATTEMPTS, {
                    teamId: this.tourActiveTeamId,
                    numberToIncrease: this.getAttemptsPriceForCurrentCell,
                });
                await this.$store.dispatch("captureCurrentCell", teamId);
                this.setStage(TeamStage.ActiveTeamAnsweredCorrectly);
            }),

            this.signalrClient.onRoundEnded(async (roundEndedArgs) => {
                const { lastAnsweredTeamId, isLastAnsweredTeamCorrect } = roundEndedArgs;

                if (isLastAnsweredTeamCorrect) {
                    await this.$store.dispatch("captureCurrentCell", lastAnsweredTeamId);
                }

                this.defaultOnRoundEndedHandler(roundEndedArgs);
            }),

            this.signalrClient.onTeamAnsweredWrong((args) => {
                const { isVictoryConditionMet } = args;

                if (isVictoryConditionMet) {
                    this.setStage(TeamStage.ActiveTeamAnsweredWrongToRoundEnd);
                    return;
                }

                this.setStage(TeamStage.WaitingForTimerStartToAnswerAsOtherTeam);
            }),

            this.signalrClient.onTimerExpired(() => {
                this.setStage(TeamStage.WaitingForTimerStartToAnswerAsOtherTeam);
            })
        );
    },
    computed: {
        questionTopic() {
            return this.$store.state.team.questionTopics.current;
        },
    },
    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamWaitingForActiveTeamToEndItsTurnStage",
};
