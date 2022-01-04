<template>
    <div>
        <div
            v-for="{ initRoundNumber, teamsIds } in battleOrderToShow"
            :key="initRoundNumber"
            class="order-container"
        >
            <p class="battle-number-header" :class="battleNumberHeaderAdditionClass(initRoundNumber)">
                Бiй {{ shouldHideExactOrder ? "X" : initRoundNumber }}
            </p>

            <div class="battle-teams-ids-container">
                <span
                    class="battle-team-id"
                    :class="teamId === orderTeamId ? 'battle-team-id-current' : ''"
                    :style="{ color: teamColors.get(orderTeamId) }"
                    v-for="orderTeamId in teamsIds"
                    :key="orderTeamId"
                >
                    {{ orderTeamId }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import TeamStage from "@/app/team/TeamStage";
import teamColors from "@/app/shared/teamColors";

/*
 from https://stackoverflow.com/a/2450976 but no in-place
*/
function shuffleArray(inputArray) {
    const array = [...inputArray];

    let currentIndex = array.length,
        randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex !== 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
}

export default {
    data() {
        return {
            teamColors,
        };
    },
    computed: {
        ...mapState({
            battleOrder: (state) => state.team.teamsRoundsOrder.current,
            teamId: (state) => state.team.id,
            stage: (state) => state.team.stage.current,
        }),

        battleOrderToShow() {
            if (this.shouldHideExactOrder) {
                return this.shuffledBattleOrder;
            }

            return this.battleOrder;
        },

        shuffledBattleOrder() {
            return shuffleArray(this.battleOrder);
        },

        shouldHideExactOrder() {
            return this.stage === TeamStage.PreGame;
        },
    },
    methods: {
        battleNumberHeaderAdditionClass(initRound) {
            const roundTeamsIds = this.battleOrder.find((i) => i.initRoundNumber === initRound).teamsIds;
            if (roundTeamsIds.indexOf(this.teamId) === -1) return "battle-number-header-not-active";

            return "";
        },
    },
    name: "TeamMenuBattleOrder",
};
</script>

<style scoped lang="sass">
.order-container
  margin-bottom: 1.5em
  padding: 0 0.7em

  .battle-number-header
    font-size: 0.5em
    margin: 0

  .battle-number-header-not-active
    color: #5d5d5d

  .battle-teams-ids-container
    margin: 0 auto
    width: 75%

    display: flex
    justify-content: space-around

    .battle-team-id-current
      font-weight: bold
</style>
