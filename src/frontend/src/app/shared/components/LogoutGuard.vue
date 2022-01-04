<template>
    <transition name="logout" @after-enter="isModalShown = true">
        <div class="logout-confirm-modal" v-show="isActive" @click.self="isModalShown = false">
            <transition name="logout-window" @after-leave="onCancel">
                <div class="logout-modal" v-show="isModalShown">
                    <div class="logout-text">
                        <p>Деавторизуватися?</p>
                    </div>

                    <div class="logout-controls">
                        <button @click="onConfirm">Так</button>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>

<script>
import { mapState } from "vuex";
import { CLOSE_LOGOUT_GUARD } from "@/app/shared/store/modules/mutations";

export default {
    props: ["onLogoutConfirm"],

    data() {
        return {
            isModalShown: false,
        };
    },

    computed: {
        ...mapState({
            isActive: (state) => state.logoutGuard.isActive,
        }),
    },

    methods: {
        onConfirm() {
            if (this.onLogoutConfirm !== undefined) this.onLogoutConfirm();

            this.$router.push({ path: "/" });
        },

        onCancel() {
            this.isModalShown = false;
            this.$store.commit(CLOSE_LOGOUT_GUARD);
        },
    },

    name: "LogoutGuard",
};
</script>

<style scoped lang="sass">
.logout-confirm-modal
  position: absolute
  display: flex
  flex-direction: column-reverse
  align-items: center

  z-index: 100
  width: 100%
  height: 100%
  background-color: rgba(0, 0, 0, 0.7)

  .logout-modal
    will-change: transform, opacity
    padding: 1em
    margin-bottom: 2em
    border-radius: 10px
    width: 95%
    height: 15%
    max-height: 5em
    background-color: #e4ebf5

    display: flex
    align-items: center
    justify-content: space-between

    user-select: none

    p
      margin: 0
      font-size: 1.3em

    .logout-controls
      width: 25%

      button
        color: white
        border-radius: 10px
        background-color: #ff0f0f
        border: none
        padding: 0.5em
        width: 100%


// Animations

.logout-enter-active, .logout-leave-active
  transition: opacity .2s

.logout-leave-to, .logout-enter
  opacity: 0


.logout-window-enter-active, .logout-window-leave-active
  transition: transform .1s

.logout-window-enter, .logout-window-leave-to
  transform: translateY(100%)
</style>
