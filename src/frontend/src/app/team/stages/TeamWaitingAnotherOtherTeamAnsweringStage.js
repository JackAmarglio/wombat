import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import TeamStage from "@/app/team/TeamStage";
import { BUTTON } from "@/app/team/components/bottomHalf/modes";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { TEAM_BUTTON_OTHER_TEAM_INTERACTED } from "@/app/team/components/bottomHalf/interactButton";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";
import { SET_TEAM_BUTTON_MODE } from "@/app/team/modules/components/mutations/teamInteractButton";
import { INCREASE_TEAM_REMAINING_ATTEMPTS } from "@/app/team/modules/mutations";

export default {
    created() {
        this._devCheck();
    },

    beforeMount() {
        this.$store.commit(SET_BOTTOM_HALF_MODE, BUTTON);
        this.$store.commit(SET_TEAM_BUTTON_MODE, TEAM_BUTTON_OTHER_TEAM_INTERACTED);
    },

    mounted() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onTeamAnsweredCorrectly(async ({ teamId }) => {
                // sanity check
                if (this.lastInteractedOtherTeamId !== teamId) {
                    console.warn("Answered other team id is differ from local last interacted other team id");
                }

                this.$store.commit(INCREASE_TEAM_REMAINING_ATTEMPTS, {
                    teamId: this.lastInteractedOtherTeamId,
                    numberToIncrease: this.getAttemptsPriceForCurrentCell,
                });
                await this.$store.dispatch("captureCurrentCell", teamId);

                this.setStage(TeamStage.OtherTeamAnsweredCorrectly);
            }),

            this.signalrClient.onTeamAnsweredWrong((args) => {
                const { isVictoryConditionMet } = args;

                // todo: нужен отдельный этап для этого
                if (isVictoryConditionMet) return;

                this.setStage(TeamStage.WaitingForTimerStartToAnswerAsOtherTeam);
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
    methods: {
        _devCheck() {
            if (process.env.NODE_ENV === "development") {
                if (this.tourActiveTeamId === this.id) {
                    alert("Comp only for other team. И как мне блять по-другому это в компоненте показать?");
                }
            }
        },
    },
    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamWaitingAnotherOtherTeamAnsweringStage",
};
