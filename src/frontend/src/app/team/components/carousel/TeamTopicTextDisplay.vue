<template>
    <div class="background">
        <TeamTextDisplay :text-to-display="topicName" :text-style="topicStyle" />
    </div>
</template>

<script>
import TeamTextDisplay from "@/app/team/components/carousel/TeamTextDisplay";

export default {
    data() {
        return {
            topicStyle: {
                ["font-size"]: "2em",
                color: "#C8D0E7",
            },
        };
    },

    computed: {
        topicName() {
            const topic = this.$store.state.team.questionTopics.current;
            return topic === null ? "" : topic.name;
        },
    },
    name: "TeamTopicTextDisplay",
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
  background-color: #111111
</style>
