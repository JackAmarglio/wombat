<template>
    <div class="wrapper" v-touch:swipe.left="closeMenu">
        <transition name="fade" mode="out-in">
            <div class="menu-links" v-if="views.isMenuView" key="links">
                <a @click.prevent="setMode(modes.nameChanging)" :style="{ color: teamColors.get(teamId) }">
                    {{ currentTeamName }}
                </a>
                <a @click.prevent="">{{ gameStatusText }}</a>
                <a @click.prevent="setMode(modes.battlesOrder)">Порядок боiв</a>
                <a @click.prevent="setMode(modes.isRulesView)">Правила</a>
            </div>

            <div class="name-changing" v-if="views.isChangingNameView" key="name">
                <div class="text-wrapper" v-if="!isEditingTeamName">
                    <div class="text" @click="onTeamNameTextClick">
                        {{ currentTeamName }}
                    </div>
                </div>

                <div v-else class="input-wrapper">
                    <textarea
                        :maxlength="maxTeamNameLenght"
                        rows="3"
                        ref="nameInput"
                        v-model="teamNameInput"
                        @keydown.enter.prevent="$refs.nameInput.blur()"
                        v-on:blur="onTeamNameEditFinished"
                    />
                </div>
            </div>

            <div class="battle-order" v-if="views.isBattlesOrderView" key="order">
                <TeamMenuBattleOrder />
            </div>

            <div class="rules" v-if="views.isRulesView" key="rules">
                <p>pravila</p>
            </div>
        </transition>

        <div class="back-btn" v-show="isBackButtonVisible" @click="onBackBtnClick">￩</div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import TeamStage from "@/app/team/TeamStage";
import teamColors from "@/app/shared/teamColors";
import TeamMenuBattleOrder from "@/app/team/components/TeamMenuBattleOrder.vue";
import teamMenuMixin from "@/app/team/teamMenuMixin";

const modes = {
    menu: 1,
    nameChanging: 2,
    battlesOrder: 3,
    isRulesView: 4,
};

export default {
    props: {
        isBackBtnVisibleOnRoot: {
            type: Boolean,
            default: true,
        },
    },

    beforeMount() {
        this.teamMenu._backBtnPressedFuncHandlers.push(this.onBackBtnClick);
    },

    beforeDestroy() {
        this.teamMenu._backBtnPressedFuncHandlers.splice(
            this.teamMenu._backBtnPressedFuncHandlers.indexOf(this.onBackBtnClick),
            1
        );
    },
    data() {
        return {
            // better names for modes/views?
            modes,
            views: {
                isMenuView: true,
                isChangingNameView: false,
                isBattlesOrderView: false,
                isRulesView: false,
            },
            lastMode: modes.menu,
            currentMode: modes.menu,

            maxTeamNameLenght: 19,
            isEditingTeamName: false,
            teamNameInput: "",

            teamColors,
        };
    },

    computed: {
        ...mapGetters(["currentTeamName", "isTeamActiveInRound"]),

        gameStatusText() {
            const stage = this.$store.state.team.stage.current;

            if (stage === TeamStage.PreGame) return "Гра не почалася";

            return this.isTeamActiveInRound ? "Активна" : "Не активна";
        },

        teamId() {
            return this.$store.state.team.id;
        },

        isBackButtonVisible() {
            if (this.isBackBtnVisibleOnRoot) return true;

            if (this.currentMode === modes.menu) return false;

            return true;
        },
    },

    methods: {
        setMode(mode) {
            Object.keys(this.views).forEach((k) => {
                this.views[k] = false;
            });

            switch (mode) {
                case 1:
                    this.views.isMenuView = true;
                    break;
                case 2:
                    this.views.isChangingNameView = true;
                    break;
                case 3:
                    this.views.isBattlesOrderView = true;
                    break;
                case 4:
                    this.views.isRulesView = true;
                    break;
            }

            this.lastMode = this.currentMode;
            this.currentMode = mode;
        },

        onTeamNameTextClick() {
            this.teamNameInput = this.currentTeamName;

            this.isEditingTeamName = true;
            this.$nextTick(() => {
                this.$refs.nameInput.focus();
            });
        },

        async onTeamNameEditFinished() {
            const newName = this.teamNameInput.trim();

            if (newName === this.currentTeamName || newName.length === 0) {
                this.isEditingTeamName = false;
                return;
            }

            // todo: validation?

            this.isEditingTeamName = false;
            await this.$store.dispatch("changeCurrentTeamName", newName);
        },

        onBackBtnClick() {
            if (this.currentMode === modes.menu) {
                this.closeMenu();
                return;
            }

            this.setMode(this.lastMode);
        },

        closeMenu() {
            this.$emit("close");
            this.setMode(modes.menu);
            this.lastMode = modes.menu;
        },
    },
    components: { TeamMenuBattleOrder },
    mixins: [teamMenuMixin],
    name: "TeamMenuContent",
};
</script>

<style scoped lang="sass">
$text-color: #E4EBF5
$background-color: #010000
$text-default-size: 3em

.wrapper
  color: $text-color
  background-color: $background-color
  height: 100%
  width: 100%

  display: flex
  justify-content: center
  align-items: center

  .menu-links
    display: flex
    flex-direction: column
    justify-content: space-around
    height: 90%
    width: 70%

    text-align: left
    font-size: $text-default-size
    line-height: 1.2em
    word-break: break-word

    a
      user-select: none

      &:hover, &:link, &:visited, &:active
        color: $text-color
        text-decoration: none

  .name-changing
    width: 100%
    height: 100%
    font-size: $text-default-size
    display: flex

    .text-wrapper
      height: 100%
      margin: auto
      display: flex

      .text
        margin: auto 10px
        word-break: break-word
        user-select: none

    .input-wrapper
      width: 70%
      margin: auto

      textarea
        color: $text-color
        background-color: $background-color
        padding: 0
        margin: 0
        border: none
        max-width: 100%
        overflow-wrap: anywhere
        outline: none
        resize: none

        &:focus-visible, &:focus
          border: none
          outline: none

  .battle-order
    user-select: none
    overflow-y: scroll

    width: 100%
    height: 100%
    text-align: left

    padding-top: 100px
    font-size: $text-default-size

  .rules
    text-align: left
    width: 100%
    height: 100%

    font-size: $text-default-size
    padding: 1em


.back-btn
  opacity: 70%
  user-select: none
  font-size: 3em
  color: white
  position: absolute
  z-index: 10
  bottom: .1em
  right: .5em

.fade-enter, .fade-leave-to
  opacity: 0

.fade-enter-active, .fade-leave-active
  transition: opacity .1s
</style>
