<template>
    <div class="background">
        <TeamTextDisplay :text-to-display="questionContent" />
    </div>
</template>

<script>
import TeamTextDisplay from "@/app/team/components/carousel/TeamTextDisplay";

export default {
    computed: {
        questionContent() {
            const question = this.$store.state.team.questions.currentTourQuestion;
            return question === null ? "" : question.content;
        },
    },
    name: "TeamQuestionContentDisplay",
    components: { TeamTextDisplay },
};
</script>

<style scoped lang="sass">
.background
  display: flex
  justify-content: center
  align-items: center

  height: 100%
  width: 100%
</style>
