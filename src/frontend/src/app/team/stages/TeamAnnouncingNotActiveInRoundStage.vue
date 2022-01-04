<template>
    <div class="outer-wrapper">
        <div class="text-wrapper">
            <p class="text">не активна</p>
        </div>
    </div>
</template>

<script>
import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import { ROUND_ENDED, SET_ROUND_ACTIVE_TEAMS } from "@/app/team/modules/mutations";
import TeamStage from "@/app/team/TeamStage";

export default {
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
    mixins: [teamStageCompMixin],
    name: "TeamAnnouncingNotActiveInRoundStage",
};
</script>

<style scoped lang="sass">
.outer-wrapper
  background-color: #010000
  color: #a4cdfe

  height: 100%
  display: flex
  justify-content: center
  align-items: center
  text-align: left

  .text-wrapper
    width: 75%

    .text
      user-select: none
      font-size: 5em
      line-height: 90%
</style>
