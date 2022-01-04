<template>
    <div class="outer-wrapper">
        <LogoutGuard :on-logout-confirm="onLogoutConfirm" />

        <ConnectionIssuesIndicator
            :is-enabled="isThereConnectionIssues"
            :is-fullscreen="isNetworkIssuesFullscreen"
        />

        <TeamMenu
            v-on:close="isMenuOpened = false"
            v-on:tryOpen="isMenuOpened = true"
            :isMenuOpened="isMenuOpened"
        />

        <div v-if="is2HalfOverlayVisible" class="overlay">
            <div class="top-half">
                <TeamInfoCarousel />
            </div>

            <div class="bot-half">
                <TeamBottomHalf />
            </div>
        </div>

        <component v-bind:is="transformStageToComp(stage)" />
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import { ServerGameState } from "@/app/shared/SignalrWombat";
import { SET_STAGE } from "@/app/team/modules/mutations";
import backendGameStateToTeamStage from "@/app/team/backendGameStateToTeamStage";
import stageComponents from "@/app/team/stages";
import TeamStage from "@/app/team/TeamStage";
import { teamStageToCompName } from "@/app/team/stageToComp";
import TeamInfoCarousel from "@/app/team/components/carousel/TeamInfoCarousel";
import TeamBottomHalf from "@/app/team/components/bottomHalf/TeamBottomHalf";
import LogoutGuard from "@/app/shared/components/LogoutGuard";
import { OPEN_LOGOUT_GUARD } from "@/app/shared/store/modules/mutations";
import TeamService from "@/app/team/services/TeamService";
import ConnectionIssuesIndicator from "@/app/shared/components/ConnectionIssuesIndicator";
import teamGameBoardConnectionMonitorMixin from "@/app/team/teamGameBoardConnectionMonitorMixin";
import teamGameBoardTeamsNameChangeListenerMixin from "@/app/team/teamGameBoardTeamsNameChangeListenerMixin";
import teamsRoundsOrderChangeListenerMixin from "@/app/team/teamsRoundsOrderChangeListenerMixin";
import teamGameboardDevHeadline from "@/app/team/teamGameboardDevHeadline";
import TeamMenu from "@/app/team/components/TeamMenu";
import teamMenuMixin from "@/app/team/teamMenuMixin";
import teamMembersUpdateListenterMixin from "@/app/team/teamMembersUpdateListenterMixin";

const stagesWhere2HalfOverlayIsDisabled = [
    TeamStage.PreGame,
    TeamStage.AnnouncingRoundTopics,
    TeamStage.AnnouncingActiveInRound,
    TeamStage.AnnouncingNotActiveInRound,
    TeamStage.RoundEnded,
];

export default {
    data() {
        return {
            is2HalfOverlayVisible: false,
            isMenuOpened: false,
        };
    },

    async created() {
        await this.$store.dispatch("getBackendTeamState");
        console.log("Game backend team state:", this.backendState);
        console.log("Game backend game state:", ServerGameState[this.backendState.gameState]);
        this.$store.commit(SET_STAGE, this.getTeamStageFromBackendGameState());
    },

    computed: {
        ...mapState({
            stage: (state) => state.team.stage.current,
            backendState: (state) => state.team.backendTeamState,
            teamId: (state) => state.team.id,
        }),

        ...mapGetters({
            teamColor: "teamColor",
        }),
    },

    watch: {
        // либо переместить в отдельный ui vuex модуль
        stage(newStage) {
            if (newStage === undefined) return;
            this.is2HalfOverlayVisible = stagesWhere2HalfOverlayIsDisabled.indexOf(newStage) === -1;
        },
    },

    beforeRouteLeave(to, from, next) {
        if (to.name !== "team") {
            next();
            return;
        }

        if (this.$store.state.logoutGuard.isActive) {
            next();
            return;
        }

        if (this.isMenuOpened || this.stage === TeamStage.PreGame) {
            this.teamMenu.handleBackBtnPressedFunc();
            next(false);
            return;
        }

        this.$store.commit(OPEN_LOGOUT_GUARD);
        next(false);
    },

    methods: {
        transformStageToComp(stage) {
            console.log("Switching to stage:", TeamStage[stage]);
            return teamStageToCompName[stage];
        },

        getTeamStageFromBackendGameState() {
            const isActiveInRound = this.backendState.roundActiveTeamsIds.includes(this.teamId);
            const teamId = this.teamId;
            const isActiveInTour = this.backendState.tourActiveTeamId === this.teamId;
            const backendStateReentryNumber = this.backendState.stateReentryNumber;

            const context = {
                teamId,
                isActiveInRound,
                isActiveInTour,
                backendStateReentryNumber,
                backendTeamState: this.backendState,
            };

            const screenStageToDetermine = backendGameStateToTeamStage[this.backendState.gameState];

            if (typeof screenStageToDetermine === "function") {
                return screenStageToDetermine(context);
            }

            return screenStageToDetermine;
        },

        onLogoutConfirm() {
            TeamService.removeSessionCode();
            TeamService.removeMemberAuthData(this.teamId);
        },
    },

    components: {
        ...stageComponents,
        TeamInfoCarousel,
        TeamMenu,
        TeamBottomHalf,
        LogoutGuard,
        ConnectionIssuesIndicator,
    },

    mixins: [
        teamGameBoardConnectionMonitorMixin,
        teamGameBoardTeamsNameChangeListenerMixin,
        teamsRoundsOrderChangeListenerMixin,
        teamMembersUpdateListenterMixin,
        teamGameboardDevHeadline,
        teamMenuMixin,
    ],

    name: "TeamGameBoard",
};
</script>

<style scoped lang="sass">
.outer-wrapper
  height: 100%
  position: relative
  overflow: hidden

  .overlay
    position: absolute
    z-index: 9
    display: flex
    flex-direction: column

    height: 100%
    width: 100%

    .top-half
      height: 50%
      background-color: #e4ebf5

    .bot-half
      height: 50%
      position: relative
</style>
