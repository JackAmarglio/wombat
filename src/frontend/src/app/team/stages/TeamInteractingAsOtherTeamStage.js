import { mapState } from "vuex";
import TeamStage from "@/app/team/TeamStage";
import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import {
    SET_LAST_INTERACTED_OTHER_TEAM_ID,
    SET_OTHER_TEAM_SUSPENSE_TIMEOUT,
} from "@/app/team/modules/mutations";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { BUTTON } from "@/app/team/components/bottomHalf/modes";
import {
    TEAM_BUTTON_DISABLED,
    TEAM_BUTTON_TIMER_LAUNCHED,
} from "@/app/team/components/bottomHalf/interactButton";
import {
    ADD_TEAM_BUTTON_LISTENER_ONCE,
    SET_TEAM_BUTTON_MODE,
} from "@/app/team/modules/components/mutations/teamInteractButton";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";

// решил объеденить несколько этапов в один подумав что так будет лучше из-за момента с тем что нужно как можно быстрее показывать кнопку.
// но это мне кажется бред и лучше всё таки разделить на "до запуска" и "после запуска". Так как это все равно будет быстро
export default {
    data() {
        return {
            isTimerStartedStep: false,

            /* isTimerStartedStep */
            isInteracted: false,
        };
    },
    beforeMount() {
        const { result, stageToTransit } = this.isStateSuitableToStage();
        if (!result) {
            this.setStage(stageToTransit);
            return;
        }

        this.setStepFromStage();

        this.$store.commit(ADD_TEAM_BUTTON_LISTENER_ONCE, async () => await this.interact());
    },
    mounted() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onTeamsAllowedInteract(() => {
                this.setStep("timerStarted");
            }),

            this.signalrClient.onTeamInteracted((interactedTeamId, _, suspenseTime) => {
                this.$store.commit(SET_LAST_INTERACTED_OTHER_TEAM_ID, interactedTeamId);
                this.$store.commit(SET_OTHER_TEAM_SUSPENSE_TIMEOUT, suspenseTime);

                this.setStage(TeamStage.SuspenseAfterOtherTeamInteract);
            }),

            this.signalrClient.onTimerExpired(() => {
                this.setStage(TeamStage.OtherTeamsTimerExpired);
            })
        );
    },
    computed: {
        ...mapState({
            stage: (state) => state.team.stage.current,
            isTriedToAnswerAsOther: (state) => state.team.status.isInteractedAsOtherTeamInCurrentTour,
            questionTopic: (state) => state.team.questionTopics.current,
            question: (state) => state.team.questions.currentTourQuestion,
        }),

        answerWord() {
            return this.isTimerStartedStep ? "отвечаешь" : "ответишь";
        },
    },
    methods: {
        async interact() {
            this.isInteractButtonDisabled = true;
            this.isInteracted = true;

            await this.signalrClient.interact();
        },

        setStep(step) {
            this.$store.commit(SET_BOTTOM_HALF_MODE, BUTTON);

            switch (step) {
                case "preTimerStart":
                    this.isTimerStartedStep = false;

                    this.$store.commit(SET_TEAM_BUTTON_MODE, TEAM_BUTTON_DISABLED);
                    break;
                case "timerStarted":
                    this.isTimerStartedStep = true;

                    this.$store.commit(SET_TEAM_BUTTON_MODE, TEAM_BUTTON_TIMER_LAUNCHED);
                    break;
                default:
                    throw `Unknown step (${step})`;
            }
        },

        isStateSuitableToStage() {
            function createResult(isSuitable, newStage) {
                return {
                    result: isSuitable,
                    stageToTransit: newStage,
                };
            }

            if (this.remainingAttempts === 0)
                return createResult(false, TeamStage.AnnouncingNotEnoughAttemptsToInteract);

            const isMultipleTriesFeatureEnabled =
                this.backendState.gameConfiguration.isTeamAllowedAnsweringMultipleTimes;
            if (isMultipleTriesFeatureEnabled) return createResult(true);

            const isTriedToAnswerAsOther = this.$store.state.team.status.isInteractedAsOtherTeamInCurrentTour;
            if (isTriedToAnswerAsOther) return createResult(false, TeamStage.AlreadyInteractedAsOtherTeam);

            return createResult(true);
        },

        setStepFromStage() {
            switch (this.stage) {
                case TeamStage.WaitingForTimerStartToAnswerAsOtherTeam:
                    this.setStep("preTimerStart");
                    break;
                case TeamStage.AllowedInteractAsOtherTeam:
                    this.setStep("timerStarted");
                    break;
                default:
                    throw `Unknown stage provided: ${this.stage}`;
            }
        },
    },

    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamInteractingAsOtherTeamStage",
};
