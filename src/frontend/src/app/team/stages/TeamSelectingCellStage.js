import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import TeamStage from "@/app/team/TeamStage";
import {
    SET_CURRENT_QUESTION_TOPIC_BY_ID,
    SET_CURRENT_TOUR_QUESTION,
    SET_TOUR_CELL_DIFFICULTY,
    SET_TOUR_CELL_NUMBER,
} from "@/app/team/modules/mutations";
import { BUTTON, CELL_SELECTION } from "@/app/team/components/bottomHalf/modes";
import { SET_BOTTOM_HALF_MODE } from "@/app/team/modules/components/mutations/bottomHalf";
import { TEAM_BUTTON_DISABLED } from "@/app/team/components/bottomHalf/interactButton";
import { SET_CAROUSEL_ACTIVE_COMPONENT } from "@/app/team/modules/components/mutations/carousel";
import { FIELD } from "@/app/team/components/carousel/modes";
import nilRenderMixin from "@/app/team/stages/nilRenderMixin";
import { SET_TEAM_BUTTON_MODE } from "@/app/team/modules/components/mutations/teamInteractButton";

export default {
    mounted() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onNextQuestionSelected((question) => {
                const { topicId, difficulty, selectedCellNumber } = question;

                this.$store.commit(SET_CURRENT_QUESTION_TOPIC_BY_ID, topicId);
                this.$store.commit(SET_CURRENT_TOUR_QUESTION, question);
                this.$store.commit(SET_TOUR_CELL_DIFFICULTY, difficulty);
                this.$store.commit(SET_TOUR_CELL_NUMBER, selectedCellNumber);
                this.setStage(TeamStage.CellSelected);
            })
        );

        this.$store.commit(SET_BOTTOM_HALF_MODE, BUTTON);
        this.$store.commit(SET_TEAM_BUTTON_MODE, TEAM_BUTTON_DISABLED);

        setTimeout(() => {
            this.$store.commit(SET_BOTTOM_HALF_MODE, CELL_SELECTION);
            this.$store.commit(SET_CAROUSEL_ACTIVE_COMPONENT, FIELD);
        }, 2000);
    },
    mixins: [teamStageCompMixin, nilRenderMixin],
    name: "TeamSelectingCellStage",
};
