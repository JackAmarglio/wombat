<template>
    <TeamMenuContent :is-back-btn-visible-on-root="false" v-hide-team-menu-open-btn />
</template>

<script>
import TeamStage from "@/app/team/TeamStage";
import teamStageCompMixin from "@/app/team/stages/teamStageCompMixin";
import TeamMenuContent from "@/app/team/components/TeamMenuContent";
import { SET_ROUND_ACTIVE_TEAMS } from "@/app/team/modules/mutations";

export default {
    components: { TeamMenuContent },
    mounted() {
        this.addSignalrSubscribeResults(
            this.signalrClient.onActiveTeamsSelected((teamsIds) => {
                this.$store.commit(SET_ROUND_ACTIVE_TEAMS, teamsIds);

                if (teamsIds.includes(this.id)) {
                    this.setStage(TeamStage.AnnouncingActiveInRound);
                } else {
                    this.setStage(TeamStage.AnnouncingNotActiveInRound);
                }
            })
        );
    },
    mixins: [teamStageCompMixin],
    name: "PreGameStage",
};
</script>

<style scoped lang="sass"></style>
