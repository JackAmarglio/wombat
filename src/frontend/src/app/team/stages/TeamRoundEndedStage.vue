<template>
    <div class="wrapper">
        <h3 class="header">Результаты раунда</h3>

        <div class="results-block-wrapper">
            <div class="results-block">
                <div class="team-result-wrapper" v-for="{ teamId, points } in teamResults" :key="teamId">
                    <p class="team-name" :style="{ color: teamColors.get(teamId) }">
                        {{ teamNames[teamId] }}
                    </p>

                    <p class="team-points">{{ points }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import teamColors from "@/app/shared/teamColors";

import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import TeamStage from "@/app/team/TeamStage";
import { ROUND_ENDED, SET_ROUND_ACTIVE_TEAMS } from "@/app/team/modules/mutations";

export default {
    data() {
        return {
            teamColors: teamColors,
        };
    },

    mounted() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onActiveTeamsSelected((teamsIds) => {
                this.$store.commit(ROUND_ENDED);
                this.$store.commit(SET_ROUND_ACTIVE_TEAMS, teamsIds);

                if (teamsIds.includes(this.id)) {
                    this.setStage(TeamStage.AnnouncingActiveInRound);
                } else {
                    this.setStage(TeamStage.AnnouncingNotActiveInRound);
                }
            }),

            this.signalrClient.onGameEnded(() => {
                this.setStage(TeamStage.GameEnded);
            })
        );
    },

    computed: {
        ...mapState({
            teamNames: (state) => state.team.teamNames.all,
            teamResults: (state) => state.team.roundEndResults.teamIdToPoints,
        }),
    },

    mixins: [teamStageCompMixin],
    name: "TeamRoundEndedStage",
};
</script>

<style scoped lang="sass">
.wrapper
  height: 100%
  background-color: #111
  display: flex
  flex-direction: column
  align-items: center
  color: #c8d0e7
  user-select: none

  .header
    padding-top: 1.5em
    padding-bottom: 0.1em

  .results-block-wrapper
    flex: 1
    display: flex
    justify-content: center
    align-items: center
    width: 95%

    .results-block
      margin: 0 auto
      padding: 1em 0
      display: flex
      flex-direction: column

      .team-result-wrapper
        padding: 1.1em 0

        .team-name
          font-size: 1.2em
          margin-bottom: 0.1em

        .team-points
          color: white
          font-size: 1.5em
          font-weight: bold
          margin: 0
</style>
