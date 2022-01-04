<template>
    <div class="fullheight-wrapper">
        <div class="not-a-bs-container">
            <HostGameAccessCodes
                v-if="!isTeamsRoundsOrderEditMode"
                class="flex-1"
                :teams="teams"
                :team-names="teamNames"
                :screen-code="screenCode"
                :is-screen-connected="isScreenConnected"
            />

            <div class="teams-rounds-order-container flex-1" v-else>
                <div class="header">
                    <h2>Порядок раундов</h2>
                </div>

                <div class="teams-rounds-order-edit-component-wrapper">
                    <HostTeamsRoundsOrderEdit
                        class="teams-rounds-order-edit-component"
                        :mark-rounds-with-teams="markRoundsWithAllTeamsLoggedIn"
                    />
                </div>
            </div>

            <div class="sticky-inputs-container">
                <div class="button-container">
                    <button
                        class="settings-btn"
                        @click="isTeamsRoundsOrderEditMode = !isTeamsRoundsOrderEditMode"
                    >
                        ⚙
                    </button>

                    <button
                        class="start-game-btn"
                        @click="onGameStartButtonClick"
                        :disabled="isStartGameBtnDisabled"
                    >
                        Розпочати гру
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HostTeamsRoundsOrderEdit from "@/app/host/components/HostTeamsRoundsOrderEdit";
import HostGameAccessCodes from "@/app/host/components/HostGameAccessCodes";

export default {
    data() {
        return {
            isTeamsRoundsOrderEditMode: false,
        };
    },
    computed: {
        isStartGameBtnDisabled() {
            const isTeamsRoundsOrderHasUnsavedChanges =
                this.$store.state.host.teamsRoundsOrder.hasNotSyncChanges;

            return isTeamsRoundsOrderHasUnsavedChanges;
        },
    },
    methods: {
        markRoundsWithAllTeamsLoggedIn(teamsIds) {
            const roundTeams = this.teams.filter((t) => teamsIds.indexOf(t.id) !== -1);

            return !roundTeams.some((t) => t.connected === false);
        },
    },
    props: ["teams", "teamNames", "screenCode", "isScreenConnected", "onGameStartButtonClick"],
    name: "HostBeforeGameStartStage",
    components: {
        HostGameAccessCodes,
        HostTeamsRoundsOrderEdit,
    },
};
</script>

<style scoped lang="sass">
.flex-1
  flex: 1

.fullheight-wrapper
  position: absolute
  width: 100%
  min-height: 100%

  .not-a-bs-container
    width: 100%
    min-height: 100vh
    padding-bottom: 10vh
    position: relative

    display: flex
    flex-direction: column

  .teams-rounds-order-container
    margin-bottom: 10vh

    .header
      height: 10vh
      background-color: #1e1e1e
      color: white

      display: flex
      justify-content: center
      align-items: center

      h2
        margin: 0


    .teams-rounds-order-edit-component-wrapper
      display: flex
      justify-content: center

      .teams-rounds-order-edit-component
        width: 100%

        @media(min-width: 768px)
          width: 50ch


  .sticky-inputs-container
    display: flex
    justify-content: center
    position: sticky

    bottom: 2vh


    .button-container
      width: fit-content
      position: relative

      .start-game-btn
        font-size: 1.2em
        color: white
        border: none
        width: 20ch
        height: 3em
        background-color: rgba(80, 196, 15, 1)
        border-radius: 10px
        transition: background-color .5s, color .5s

        &:disabled
          color: #dadada
          background-color: rgb(61, 152, 12)


        @media(min-width: 768px)
          height: 2.5em


      .settings-btn
        position: absolute

        border: none
        background-color: #e4e5ea
        border-radius: 10px
        font-size: 1.5em

        right: -3rem
        top: 50%
        transform: translateY(-50%)
        height: 2.5rem
        width: 2.5rem

        @media(min-width: 768px)
          right: 0
          left: -3rem

    @media(min-width: 768px)
      position: fixed
      right: 2ch
      bottom: 2ch
</style>
