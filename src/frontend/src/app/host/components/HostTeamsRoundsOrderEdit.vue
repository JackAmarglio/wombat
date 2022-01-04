<template>
    <div class="outer-wrapper">
        <draggable
            group="rounds"
            v-model="teamsRoundsOrder"
            class="teams-rounds-order-container"
            :move="onRoundMove"
            filter=".static"
        >
            <div
                v-for="({ initRoundNumber, teamsIds }, index) in teamsRoundsOrder"
                :key="index"
                class="teams-rounds-order-item"
                :class="getTeamsRoundsOrderItemClasses(index)"
                :style="teamsRoundsOrderItemAdditionalStyle(index, teamsIds)"
            >
                <div v-if="playedRoundsDisabled && index < roundNumber" class="disabled-overlay"></div>

                <div class="round-number">{{ index + 1 }}</div>

                <draggable
                    group="teams"
                    :value="teamsIds"
                    class="teams-ids-container"
                    :move="onTeamIdMove"
                    @choose="onTeamIdChoose"
                    @end="onTeamIdMoveEnd"
                    @input="(value) => onTeamIdInputChange(initRoundNumber, value)"
                >
                    <div
                        v-for="teamId in teamsIds"
                        :key="`${teamId};${initRoundNumber}`"
                        class="team-id-item"
                        :style="{ backgroundColor: teamColors.get(teamId) }"
                    >
                        {{ teamId }}
                    </div>
                </draggable>
            </div>
        </draggable>
    </div>
</template>

<script>
import { mapActions } from "vuex";
import draggable from "vuedraggable";

import teamColors from "@/app/shared/teamColors";

export default {
    name: "HostTeamsRoundsOrderEdit",
    props: {
        playedRoundsDisabled: Boolean,
        // workaround as there is no separate vuex module to keep the state in
        roundNumber: {
            type: Number,
            default: 0,
        },
        markRoundsWithTeams: {
            type: Function,
            default: () => false,
        },
    },
    data: () => ({
        teamColors,
        teamIdChangesToCommit: [],
    }),
    computed: {
        teamsRoundsOrder: {
            get() {
                return this.$store.state.host.teamsRoundsOrder.current;
            },
            set(value) {
                this.$store.dispatch("host/setAndUpdateCurrentTeamsRoundsOrder", value);
            },
        },
    },

    methods: {
        ...mapActions({
            setAndPostTeamsRoundsOrder: "host/setAndUpdateCurrentTeamsRoundsOrder",
        }),

        getTeamsRoundsOrderItemClasses(index) {
            if (this.playedRoundsDisabled === false) return "";
            return index < this.roundNumber ? "static no-border" : "";
        },

        onRoundMove(evt) {
            const futureIndex = evt.draggedContext.futureIndex;
            if (futureIndex < this.roundNumber) return false;

            return true;
        },

        onTeamIdInputChange(initRoundNumber, value) {
            this.teamIdChangesToCommit.push({ initRoundNumber, teamsIds: value });
        },

        onTeamIdMove(evt) {
            // check no duplicate
            if (evt.relatedContext.list.includes(evt.draggedContext.element)) {
                // to allow drag element return to origin
                if (evt.from !== evt.to) return false;
            }

            return true;
        },

        onTeamIdChoose(evt) {
            console.log(evt);
        },

        onTeamIdMoveEnd() {
            if (this.teamIdChangesToCommit.length === 0) return;

            const updatedTeamsRoundsOrder = [...this.teamsRoundsOrder];

            for (const change of this.teamIdChangesToCommit) {
                const changedIndex = updatedTeamsRoundsOrder.findIndex(
                    (i) => i.initRoundNumber === change.initRoundNumber
                );

                updatedTeamsRoundsOrder[changedIndex].teamsIds = change.teamsIds;
            }

            this.setAndPostTeamsRoundsOrder(updatedTeamsRoundsOrder);

            this.teamIdChangesToCommit = [];
        },

        teamsRoundsOrderItemAdditionalStyle(round, teamsIds) {
            let borderColor = "";

            if (this.markRoundsWithTeams(teamsIds)) borderColor = "#00d900";
            if (this.$store.getters["host/isTeamsIdsValid"](teamsIds) === false) borderColor = "red";

            return {
                borderColor,
            };
        },
    },
    components: { draggable },
};
</script>

<style scoped lang="sass">

.no-border
  border: none !important

.outer-wrapper
  height: 100%
  overflow: hidden

.teams-rounds-order-container
  height: 100%
  overflow-y: auto

.teams-rounds-order-item
  position: relative
  width: 85%
  background-color: #f9f9f9
  text-align: left
  padding: 0.5em
  margin: 1em
  border: #b9b9b9 1px solid
  border-radius: 2em

  display: flex

  .disabled-overlay
    position: absolute
    width: 100%
    height: 100%
    background-color: #0909091c
    top: 0
    left: 0
    border-radius: 2em
    border: #b9b9b9 1px solid

  .round-number
    min-width: 3ch
    padding: 0.5rem
    font-size: 2em

  .teams-ids-container
    display: flex
    justify-content: center
    align-items: center

    width: 100%

    .team-id-item
      display: flex
      justify-content: center
      align-items: center

      border-radius: 10px
      margin-right: 1em
      color: white
      width: 2.75em
      height: 2.75em
      padding: 0.5em
</style>
