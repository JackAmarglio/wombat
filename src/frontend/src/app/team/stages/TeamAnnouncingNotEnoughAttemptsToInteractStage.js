import TeamStage from "@/app/team/TeamStage";
import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { BUTTON } from "@/app/team/components/bottomHalf/modes";
import { TEAM_BUTTON_DISABLED } from "@/app/team/components/bottomHalf/interactButton";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";
import { SET_TEAM_BUTTON_MODE } from "@/app/team/modules/components/mutations/teamInteractButton";
import {
    DECREASE_TEAM_REMAINING_ATTEMPTS,
    INCREASE_TEAM_REMAINING_ATTEMPTS,
    SET_LAST_INTERACTED_OTHER_TEAM_ID,
    SET_OTHER_TEAM_SUSPENSE_TIMEOUT,
} from "@/app/team/modules/mutations";

export default {
    beforeMount() {
        this.$store.commit(SET_BOTTOM_HALF_MODE, BUTTON);
        this.$store.commit(SET_TEAM_BUTTON_MODE, TEAM_BUTTON_DISABLED);
    },

    mounted() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onRoundEnded(async (roundEndedArgs) => {
                const { lastAnsweredTeamId, isLastAnsweredTeamCorrect } = roundEndedArgs;

                if (isLastAnsweredTeamCorrect) {
                    await this.$store.dispatch("captureCurrentCell", lastAnsweredTeamId);
                }

                this.defaultOnRoundEndedHandler(roundEndedArgs);
            }),

            this.signalrClient.onNoTeamsLeftToAnswer(() => {
                this.setStage(TeamStage.NoOtherTeamsThatCanAnswer);
            }),

            this.signalrClient.onTeamInteracted((teamId, _, suspenseTime) => {
                this.$store.commit(SET_LAST_INTERACTED_OTHER_TEAM_ID, teamId);
                this.$store.commit(DECREASE_TEAM_REMAINING_ATTEMPTS, {
                    teamId: teamId,
                    numberToDecrease: 1,
                });

                this.$store.commit(SET_OTHER_TEAM_SUSPENSE_TIMEOUT, suspenseTime);

                this.setStage(TeamStage.OtherTeamAnswering);
            }),

            this.signalrClient.onTimerExpired(() => {
                this.setStage(TeamStage.OtherTeamsTimerExpired);
            }),

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
            })
        );
    },
    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamAnnouncingNotEnoughAttemptsToInteractStage",
};
