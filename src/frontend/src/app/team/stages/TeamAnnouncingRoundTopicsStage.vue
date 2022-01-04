<template>
    <div class="outer-wrapper">
        <TeamMenu />

        <div v-touch:swipe="handleSwipe" class="overlay" />

        <div class="current-topic-wrapper">
            <transition :name="transitionName">
                <div class="current-topic" :key="currentTopic.id">
                    <p>{{ currentTopic.name }}</p>
                </div>
            </transition>
        </div>

        <div class="bottom-part">
            <p>{{ currentTopicIndex + 1 }}</p>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

import "@/app/team/styles/team-carousel-transitions.sass";
import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import TeamMenu from "@/app/team/components/TeamMenu";

export default {
    data() {
        return {
            currentTopicIndex: 0,
            transitionName: "",
        };
    },

    mounted() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onNextActiveTeamSelected(this.defaultOnNextActiveTeamSelectedHandler)
        );
    },

    computed: {
        ...mapState({
            roundTopics: (state) => state.team.questionTopics.roundTopics,
        }),

        currentTopic() {
            return this.roundTopics[this.currentTopicIndex];
        },
    },
    methods: {
        handleSwipe(direction) {
            const currentTopicIndex = this.currentTopicIndex;
            const roundTopicsLength = this.roundTopics.length;

            if (direction === "left") {
                this.transitionName = "carousel-slide-left";

                if (currentTopicIndex + 1 === roundTopicsLength) {
                    this.currentTopicIndex = 0;
                    return;
                }

                this.currentTopicIndex++;
                return;
            }

            if (direction === "right") {
                this.transitionName = "carousel-slide-right";

                if (currentTopicIndex === 0) {
                    this.currentTopicIndex = roundTopicsLength - 1;
                    return;
                }

                this.currentTopicIndex--;
                return;
            }
        },
    },
    components: { TeamMenu },
    mixins: [teamStageCompMixin],
    name: "TeamAnnouncingRoundTopicsStage",
};
</script>

<style scoped lang="sass">
.outer-wrapper
  height: 100%
  background-color: #111111
  color: white
  overflow: hidden
  position: relative

  .overlay
    position: absolute
    top: 0
    left: 0
    width: 100%
    height: 100%

  .current-topic-wrapper
    position: relative
    height: 60%
    pointer-events: none

    .current-topic
      position: absolute
      top: 0

      height: 100%
      width: 100%
      display: flex
      justify-content: center
      align-items: center

      font-size: 2em
      color: #c8d0e7

  .bottom-part
    font-size: 3em
</style>
