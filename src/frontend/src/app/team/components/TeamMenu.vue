<template>
    <div>
        <TeamMenuContent v-on:close="onCloseRequest" class="menu" :class="isMenuOpenedInner ? 'active' : ''" />

        <div class="menu-btn" v-show="teamMenu.isMenuBtnVisible" @click="onOpen">☰</div>
    </div>
</template>

<script>
import TeamMenuContent from "@/app/team/components/TeamMenuContent";
import teamMenuMixin from "@/app/team/teamMenuMixin";

/*todo: replace emits with two-way binding */
export default {
    props: {
        isMenuOpened: {
            type: Boolean,
            default: undefined,
        },
    },

    data() {
        return {
            isMenuOpenedInner: false,
        };
    },

    watch: {
        isMenuOpened(val) {
            this.isMenuOpenedInner = val;
        },
    },

    methods: {
        onCloseRequest() {
            if (this.isMenuOpened === undefined) this.isMenuOpenedInner = false;
            else this.$emit("close");
        },

        onOpen() {
            if (this.isMenuOpened === undefined) this.isMenuOpenedInner = true;
            else this.$emit("tryOpen");
        },
    },
    components: { TeamMenuContent },
    mixins: [teamMenuMixin],
    name: "TeamMenu",
};
</script>

<style scoped lang="sass">
.menu
  position: absolute
  z-index: 20
  width: 100%
  height: 100%
  transform: translateX(-100%)
  transition: transform .2s

  &.active
    transform: translateX(0%)

.menu-btn
  opacity: 70%
  user-select: none
  font-size: 2em
  color: white
  position: absolute
  z-index: 10
  bottom: .5em
  left: .5em
</style>
