import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import TeamStage from "@/app/team/TeamStage";
import { BUTTON } from "@/app/team/components/bottomHalf/modes";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { TEAM_BUTTON_TIMER_LAUNCHED } from "@/app/team/components/bottomHalf/interactButton";
import {
    ADD_TEAM_BUTTON_LISTENER_ONCE,
    SET_TEAM_BUTTON_MODE,
} from "@/app/team/modules/components/mutations/teamInteractButton";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";

export default {
    data() {
        return {
            isButtonClickable: true,
        };
    },
    beforeMount() {
        this.$store.commit(SET_BOTTOM_HALF_MODE, BUTTON);
        this.$store.commit(SET_TEAM_BUTTON_MODE, TEAM_BUTTON_TIMER_LAUNCHED);
        this.$store.commit(ADD_TEAM_BUTTON_LISTENER_ONCE, async () => await this.interact());
    },
    mounted() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onTeamInteracted((teamId) => {
                if (teamId !== this.id) {
                    console.warn("Interacted team id should be active but it's not", {
                        expectedTeamId: this.id,
                        actualTeamId: teamId,
                    });
                }

                this.setStage(TeamStage.AnsweringAsActiveTeam);
            }),

            this.signalrClient.onTimerExpired(() => {
                this.setStage(TeamStage.TimeIsUpAsActiveTeam);
            }),

            // разве это возможно тут? Или это потому что команда дальше не слушает
            this.signalrClient.onNoTeamsLeftToAnswer(() => {
                this.setStage(TeamStage.NoOtherTeamsThatCanAnswer);
            })
        );
    },
    methods: {
        async interact() {
            this.isButtonClickable = false;

            // interact is not waiting for server response and could cause a trouble
            await this.signalrClient.interact();
        },
    },
    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamAllowedInteractAsActiveTeamStage",
};
