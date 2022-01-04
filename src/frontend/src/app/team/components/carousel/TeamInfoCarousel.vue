<template>
    <div class="outer-wrapper">
        <div class="overlay" v-touch:swipe="handleSwipe" />

        <div class="carousel">
            <transition :name="carouselTransitionName">
                <keep-alive>
                    <component class="current-component" :is="currentVueComp" />
                </keep-alive>
            </transition>
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

import "@/app/team/styles/team-carousel-transitions.sass";
import TeamTextDisplay from "@/app/team/components/carousel/TeamTextDisplay";
import TeamLapNumberDisplay from "@/app/team/components/carousel/TeamLapNumberDisplay";
import TeamGameFieldDisplay from "@/app/team/components/carousel/TeamGameFieldDisplay";
import TeamAnsweringTopHalf from "@/app/team/components/carousel/TeamAnsweringTopHalf";
import {
    TOUR,
    FIELD,
    TOPIC,
    QUESTION,
    QUESTION_ANSWERING,
    TIME_IS_UP_TEXT,
    NO_ONE_ANSWERED_TEXT,
    ATTEMPTS,
} from "@/app/team/components/carousel/modes";
import TeamTopicTextDisplay from "@/app/team/components/carousel/TeamTopicTextDisplay";
import TeamQuestionContentDisplay from "@/app/team/components/carousel/TeamQuestionContentDisplay";
import { SET_CAROUSEL_ACTIVE_COMPONENT } from "@/app/team/modules/components/mutations/carousel";
import TeamTimeIsUpDisplay from "@/app/team/components/carousel/TeamTimeIsUpDisplay";
import TeamNoOneAnsweredDisplay from "@/app/team/components/carousel/TeamNoOneAnsweredDisplay";
import TeamAttemptsDisplay from "@/app/team/components/carousel/TeamAttemptsDisplay";

const compToVueCompName = {
    [TOUR]: TeamLapNumberDisplay.name,
    [FIELD]: TeamGameFieldDisplay.name,
    [TOPIC]: TeamTopicTextDisplay.name,
    [QUESTION]: TeamQuestionContentDisplay.name,
    [QUESTION_ANSWERING]: TeamAnsweringTopHalf.name,
    [TIME_IS_UP_TEXT]: TeamTimeIsUpDisplay.name,
    [NO_ONE_ANSWERED_TEXT]: TeamNoOneAnsweredDisplay.name,
    [ATTEMPTS]: TeamAttemptsDisplay.name,
};

export default {
    data() {
        return {
            /*
            подумать, нужна ли сейчас вообще эта пропа, или можно сразу использовать availableComponents
            Раньше, нельзя просто было использовать availableComponents, так как изменение последнего сразу же ререндерило компоненты в карусели,
            А сейчас ничего в рендере не зависит от availableComponents, но возможно какая-то еще логика использует именно это пропу
*/
            currentVisibleComponents: [],
            currentComp: null,
            carouselTransitionName: "",

            compToVueCompName: compToVueCompName,

            isScrollHandlingDisabled: false,
            isHandlingSwipe: false,
        };
    },
    computed: {
        ...mapState({
            activeComponent: (state) => state.team.ui.carousel.activeComponent,
            currentStageComponent: (state) => state.team.ui.carousel.currentStageComponent,
            availableComponents: (state) => state.team.ui.carousel.availableComponents,
        }),

        currentVueComp() {
            return this.compToVueCompName[this.currentComp];
        },
    },

    mounted() {
        this.currentVisibleComponents = [...this.availableComponents];
        this.currentComp = this.currentVisibleComponents[0];

        console.log("carousel vuex state:", this.$store.state.team.ui.carousel);
        console.log("carousel vue comp:", this);
    },
    methods: {
        ...mapMutations({
            setActiveComponent: SET_CAROUSEL_ACTIVE_COMPONENT,
        }),

        handleSwipe(dir) {
            if (dir === "top" || dir === "bottom") return;

            if (this.isScrollHandlingDisabled || this.isHandlingSwipe) return;
            this.isHandlingSwipe = true;

            const currentComp = this.currentComp;
            const currentCompIndex = this.currentVisibleComponents.indexOf(currentComp);

            let nextComp;

            switch (dir) {
                case "right": {
                    nextComp =
                        currentCompIndex === 0
                            ? this.currentVisibleComponents[this.currentVisibleComponents.length - 1]
                            : this.currentVisibleComponents[currentCompIndex - 1];

                    this.carouselTransitionName = "carousel-slide-right";
                    break;
                }
                case "left": {
                    nextComp =
                        currentCompIndex === this.currentVisibleComponents.length - 1
                            ? this.currentVisibleComponents[0]
                            : this.currentVisibleComponents[currentCompIndex + 1];

                    this.carouselTransitionName = "carousel-slide-left";
                    break;
                }
            }

            this.setActiveComponent(nextComp);
        },

        updateCarouselTransitionNameWhenSettingNextComp(nextComp) {
            // carouselTransitionName has been already set in handleSwipe method
            if (this.isHandlingSwipe) return;

            const prevCompIndex = this.currentVisibleComponents.indexOf(this.currentComp);
            const nextCompIndex = this.currentVisibleComponents.indexOf(nextComp);

            this.carouselTransitionName =
                nextCompIndex < prevCompIndex ? "carousel-slide-right" : "carousel-slide-left";
        },
    },

    watch: {
        async availableComponents(comps) {
            this.isScrollHandlingDisabled = true;

            await this.$nextTick();
            const currentCompNewIndex = comps.indexOf(this.currentComp);
            const isNewCompsIncludeCurrent = currentCompNewIndex !== -1;

            this.currentVisibleComponents = comps;

            if (isNewCompsIncludeCurrent) {
                if (this.currentStageComponent !== this.currentComp) {
                    this.setActiveComponent(this.currentStageComponent);
                }
            } else {
                this.setActiveComponent(this.currentStageComponent);
            }

            this.isScrollHandlingDisabled = false;
        },

        activeComponent(nextComp) {
            if (nextComp === undefined) return;
            this.updateCarouselTransitionNameWhenSettingNextComp(nextComp);

            this.isHandlingSwipe = false;
            this.currentComp = nextComp;
        },
    },
    name: "TeamInfoCarousel",
    components: {
        TeamAnsweringTopHalf,
        TeamGameFieldDisplay,
        TeamLapNumberDisplay,
        TeamTextDisplay,
        TeamTopicTextDisplay,
        TeamQuestionContentDisplay,
        TeamTimeIsUpDisplay,
        TeamNoOneAnsweredDisplay,
        TeamAttemptsDisplay,
    },
};
</script>

<style scoped lang="sass">
.outer-wrapper
  height: 100%
  overflow: hidden
  position: relative

  .overlay
    position: absolute
    top: 0
    left: 0
    z-index: 10
    width: 100%
    height: 100%

  .carousel
    height: 100%
    position: relative
    overflow: hidden

    .current-component
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
</style>
