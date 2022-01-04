<template>
    <div class="outer-wrapper">
        <div class="text-wrapper">
            <p class="text">початок гри</p>
        </div>
    </div>
</template>

<script>
import { SET_ROUND_QUESTION_TOPICS } from "@/app/team/modules/mutations";
import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import TeamStage from "@/app/team/TeamStage";

export default {
    mounted() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onPresentRoundQuestionTopics((questionTopics) => {
                this.$store.commit(SET_ROUND_QUESTION_TOPICS, questionTopics);

                this.setStage(TeamStage.AnnouncingRoundTopics);
            })
        );
    },
    mixins: [teamStageCompMixin],
    name: "TeamAnnouncingActiveInRoundStage",
};
</script>

<style scoped lang="sass">
.outer-wrapper
  background-color: #010000
  color: #a4cdfe

  height: 100%
  display: flex
  justify-content: center
  align-items: center
  text-align: left

  .text-wrapper
    width: 75%

    .text
      user-select: none
      font-size: 5em
      line-height: 90%
</style>
