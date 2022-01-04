<template>
    <div class="wrapper">
        <h5 class="heading">Попытки команд</h5>

        <div class="attempts-container">
            <div class="attempts-wrapper">
                <div
                    v-for="{ teamId, attempts } of teamsAttempts"
                    :style="{ borderColor: teamColors.get(teamId) }"
                    class="team-attempts-box"
                    :key="teamId"
                >
                    <span>
                        {{ attempts }}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";
import teamColors from "@/app/shared/teamColors";

export default {
    data() {
        return {
            teamColors,
        };
    },
    computed: {
        ...mapGetters(["teamsAttemptsIterable"]),
        ...mapState({
            activeTeamsIds: (state) => state.team.roundActiveTeams.current,
        }),

        teamsAttempts() {
            return this.teamsAttemptsIterable.filter((t) => this.activeTeamsIds.indexOf(t.teamId) !== -1);
        },
    },
    name: "TeamAttemptsDisplay",
};
</script>

<style scoped lang="sass">
.wrapper
  height: 100%
  width: 100%

  display: flex
  flex-direction: column
  justify-content: center
  align-items: center

  .heading
    flex-shrink: 0
    padding: 1em 0
    font-size: 2em
    font-weight: bold
    color: #a6cfff


  .attempts-container
    width: 100%
    flex: 1

    display: flex
    justify-content: center
    align-items: center

    .attempts-wrapper
      display: flex
      width: 80%
      justify-content: space-evenly


      .team-attempts-box
        display: flex
        justify-content: center
        align-items: center
        border: 2px solid white

        line-height: 0
        width: 2em
        height: 2em
        border-radius: 10px
        background-color: white
        font-size: 1.5em
        font-weight: 300

        box-shadow: -3px -3px 15px #ffffff, 6px 6px 18px rgba(129, 129, 129, 0.63)
</style>
