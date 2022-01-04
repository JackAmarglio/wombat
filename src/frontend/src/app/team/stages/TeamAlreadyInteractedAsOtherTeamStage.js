import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import TeamStage from "@/app/team/TeamStage";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { BUTTON } from "@/app/team/components/bottomHalf/modes";
import { SET_TEAM_BUTTON_MODE } from "@/app/team/modules/components/mutations/teamInteractButton";
import { TEAM_BUTTON_DISABLED } from "@/app/team/components/bottomHalf/interactButton";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";
import {
    DECREASE_TEAM_REMAINING_ATTEMPTS,
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
            this.signalrClient.onTeamInteracted((teamId, _, suspenseTime) => {
                /* 
                   Несмотря на то, что код, который ниже, кажется бойлерплейтом, который можно вынести сразу в компонент TeamStage.OtherTeamAnswering
                   так как эти две строчки вызываются везде перед сменной на TeamStage.OtherTeamAnswering.
                   Но если так сделать, то возникнут такие проблемы, которые нужно будет решать:
                     При ресторе, будут отниматся лишнике попытки (легко решить, но..)
                     
                     То, как сейчас определяется "После рестора ли компонет" работает плохо, а именно, в случае если рестор решает идти в компонент TeamInteractingAsOtherTeamStage,
                     а он понимает что нужно идти на этот компонент, то логика вызова сразу после рестора сработает только в первом компоненте, а не тут.
                */
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
            })
        );
    },
    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamAlreadyInteractedAsOtherTeamStage",
};
