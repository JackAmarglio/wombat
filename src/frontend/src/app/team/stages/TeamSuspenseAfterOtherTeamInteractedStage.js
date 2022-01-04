import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import { SET_TEAM_BUTTON_MODE } from "@/app/team/modules/components/mutations/teamInteractButton";
import { TEAM_BUTTON_SUSPENSE } from "@/app/team/components/bottomHalf/interactButton";
import { DECREASE_TEAM_REMAINING_ATTEMPTS, SET_INTERACTED_AS_OTHER_TEAM } from "@/app/team/modules/mutations";
import { mapState } from "vuex";
import TeamStage from "@/app/team/TeamStage";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";

export default {
    computed: {
        ...mapState({
            lastTeamIdOfInteractedOtherTeam: (state) => state.team.status.lastTeamIdOfInteractedOtherTeam,
            suspenseTimeout: (state) => state.team.otherTeamSuspense.timeout,
        }),
    },
    beforeCreate() {
        this.$store.commit(SET_TEAM_BUTTON_MODE, TEAM_BUTTON_SUSPENSE);
    },
    mounted() {
        setTimeout(this.handleSuspenseEnded, this.suspenseTimeout);
    },
    methods: {
        handleSuspenseEnded() {
            this.$store.commit(DECREASE_TEAM_REMAINING_ATTEMPTS, {
                teamId: this.lastInteractedOtherTeamId,
                numberToDecrease: 1,
            });

            const isThisTeamInteracted = this.lastInteractedOtherTeamId === this.id;

            if (isThisTeamInteracted) {
                this.$store.commit(SET_INTERACTED_AS_OTHER_TEAM);
                this.setStage(TeamStage.AnsweringAsOtherTeam);
            } else {
                this.setStage(TeamStage.OtherTeamAnswering);
            }
        },
    },
    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamSuspenseAfterOtherTeamInteractedStage",
};
