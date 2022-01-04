<template>
    <div class="wrapper">
        <HostTeamsRoundsOrderEdit
            class="rounds-order-edit"
            played-rounds-disabled
            :round-number="roundNumber"
        />

        <div
            class="input-container"
            :class="isCloseInputDisabled ? 'input-container-disabled' : ''"
            @click="onClose"
        >
            <button @click="onClose">Закрыть</button>
        </div>
    </div>
</template>

<script>
import HostTeamsRoundsOrderEdit from "@/app/host/components/HostTeamsRoundsOrderEdit";
import { mapGetters, mapState } from "vuex";

export default {
    props: ["roundNumber"],
    computed: {
        ...mapState({
            hasUnsyncChanges: (state) => state.host.teamsRoundsOrder.hasNotSyncChanges,
            syncError: (state) => state.host.teamsToPlayRound.syncError,
        }),

        ...mapGetters({
            isTeamsRoundsOrderValid: "host/isTeamsRoundsOrderValid",
        }),

        isCloseInputDisabled() {
            if (this.isTeamsRoundsOrderValid === false) return true;
            if (this.syncError) return true;

            return false;
        },
    },
    methods: {
        onClose() {
            this.$emit("close");
        },
    },
    name: "HostPostRoundTeamsRoundsOrderEdit",
    components: { HostTeamsRoundsOrderEdit },
};
</script>

<style scoped lang="sass">
.wrapper
  position: absolute
  z-index: 10
  overflow-y: hidden

  display: flex
  flex-direction: column

  width: 100%
  height: 100%

  background-color: #ffffff
  user-select: none

  .rounds-order-edit
    flex: 1
    height: 90%

  .input-container
    padding: 1em
    background-color: #f1f1f1

    border-top: #d3d3d3 solid 1px
    transition: background-color .5s

    button
      border: none
      background-color: #f1f1f1
      font-size: 1.5em
      transition: background-color .5s, color .5s

  .input-container-disabled
    pointer-events: none

    background-color: #A6A6A6FF
    border-top: #ff4444 solid 1px

    button
      background-color: #A6A6A6FF
      color: #6c6c6c
</style>
