import TeamStage from "@/app/team/TeamStage";
import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import { ServerGameState } from "@/app/shared/SignalrWombat";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { BUTTON } from "@/app/team/components/bottomHalf/modes";
import { TEAM_BUTTON_WRONG_ANSWER } from "@/app/team/components/bottomHalf/interactButton";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";
import { SET_TEAM_BUTTON_MODE } from "@/app/team/modules/components/mutations/teamInteractButton";
import {
    DECREASE_TEAM_REMAINING_ATTEMPTS,
    INCREASE_TEAM_REMAINING_ATTEMPTS,
    SET_LAST_INTERACTED_OTHER_TEAM_ID,
    SET_OTHER_TEAM_SUSPENSE_TIMEOUT,
} from "@/app/team/modules/mutations";
import { SET_CAROUSEL_ACTIVE_COMPONENT } from "@/app/team/modules/components/mutations/carousel";
import { FIELD } from "@/app/team/components/carousel/modes";

export default {
    data() {
        return {
            isSomeTeamTriedToAnswerAfterTimerStarted: false,
        };
    },

    beforeMount() {
        this.$store.commit(SET_BOTTOM_HALF_MODE, BUTTON);
        this.$store.commit(SET_TEAM_BUTTON_MODE, TEAM_BUTTON_WRONG_ANSWER);
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

                // хотя пока что не используется для активной команды
                this.$store.commit(SET_OTHER_TEAM_SUSPENSE_TIMEOUT, suspenseTime);

                this.isSomeTeamTriedToAnswerAfterTimerStarted = true;
            }),

            this.signalrClient.onTeamAnsweredWrong(({ isVictoryConditionMet }) => {
                if (isVictoryConditionMet) {
                    this.$store.commit(SET_CAROUSEL_ACTIVE_COMPONENT, FIELD);

                    return;
                }

                this.isSomeTeamTriedToAnswerAfterTimerStarted = false;
            }),

            this.signalrClient.onTimerExpired(() => {
                if (this.isSomeTeamTriedToAnswerAfterTimerStarted) {
                    this.isSomeTeamTriedToAnswerAfterTimerStarted = false;
                    return;
                }

                this.setStage(TeamStage.OtherTeamsTimerExpired);
            }),

            // adhoc cuz when restoring from backend state isSomeTeamTriedToAnswerAfterTimerStarted could be in invalid state
            // partly fixed by createdRightAfterRestore but still need to be observed
            this.signalrClient.onNextActiveTeamSelected(this.defaultOnNextActiveTeamSelectedHandler)
        );
    },
    methods: {
        createdRightAfterRestore() {
            const { backendTeamState } = this.$store.state.team;
            const backendGameState = backendTeamState.gameState;

            if (backendGameState === ServerGameState.OtherTeamGivesAnswer) {
                this.isSomeTeamTriedToAnswerAfterTimerStarted = true;
            }
        },
    },
    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamAnsweredWrongAsActiveTeamStage",
};
