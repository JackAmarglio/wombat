<template>
    <div class="wrapper-team-gameboard">
        <div class="d-flex flex-row justify-content-center align-items-center">
            <login-form
                class="mt-5"
                v-if="!isTeamAuthenticated"
                @onSubmit="handleLogin"
                @onCancel="$router.push('/')"
            />
        </div>

        <router-view style="height: 100%" />
    </div>
</template>

<script>
import LoginForm from "@/app/shared/components/LoginForm";
import team from "@/app/team/modules/team";
import { mapActions, mapState } from "vuex";
import logoutGuard from "@/app/shared/store/modules/logoutGuard";
import TeamService from "@/app/team/services/TeamService";
import Vue from "vue";
import { SET_AUTHENTICATION_STATE } from "@/app/shared/store/modules/mutations/authStatus";

export default {
    name: "AppTeam",
    components: {
        LoginForm,
    },
    data() {
        return {
            lastCode: null,
        };
    },
    created() {
        this.registerVuexModules();
        this.lastCode = TeamService.getLastSessionCode();
    },

    beforeRouteUpdate(to, from, next) {
        const isFromAuthLocations = from.name === "TeamGameBoard" || from.name === "TeamMemberSelect";
        const isGoingToTeamGameBoard = to.name === "TeamGameBoard";

        if (isFromAuthLocations && !isGoingToTeamGameBoard) {
            // Не сильно нравится то, как оно сейчас реализовано, но пока сойдет
            // чтобы просто обнулять стейт

            this.$store.state.team.signalrClient.disconnect();

            TeamService.removeSessionCode();
            TeamService.removeMemberAuthData(this.$store.state.team.id);

            this.unregisterVuexModules();
            this.registerVuexModules();

            this.$store.commit(SET_AUTHENTICATION_STATE, { isAuthenticated: false });
        }

        next();
    },

    async mounted() {
        // vue hot reload is not supported
        if (!this.$store.hasModule("team")) {
            location.reload();
        }

        const queryCode = this.$route.query.code;
        if (queryCode !== undefined) {
            await this.handleLogin({
                code: queryCode,
            });

            return;
        }

        if (process.env.NODE_ENV === "development") return;

        if (this.lastCode !== null) {
            await this.handleLogin({ code: this.lastCode });
        }
    },
    computed: {
        ...mapState({
            isTeamAuthenticated: (state) => state.authStatus.isAuthenticated,
        }),
    },
    methods: {
        ...mapActions({
            enterGame: "enterGame",
        }),
        async handleLogin(loginFormInput) {
            await this.enterGame(loginFormInput);
            if (this.isTeamAuthenticated) {
                await this.pushToGamePage();
                TeamService.saveSessionCode(loginFormInput.code);
            }
        },

        async pushToGamePage() {
            await this.$router.push({ name: "TeamMemberSelect" });
        },

        registerVuexModules() {
            if (!this.$store.hasModule("team")) this.$store.registerModule("team", team);
            if (!this.$store.hasModule("logoutGuard")) this.$store.registerModule("logoutGuard", logoutGuard);
        },

        unregisterVuexModules() {
            this.$store.unregisterModule("team");
            this.$store.unregisterModule("logoutGuard");
        },
    },
    beforeDestroy() {
        this.unregisterVuexModules();
        this.$store.commit(SET_AUTHENTICATION_STATE, { isAuthenticated: false });
    },
};

Vue.directive("hide-team-menu-open-btn", {
    bind: function (_, __, vnode) {
        const { context } = vnode;
        const { teamMenu } = context;

        if (teamMenu === undefined) {
            return;
        }

        teamMenu.isMenuBtnVisible = false;
    },
});
</script>

<style lang="sass">
body
 overscroll-behavior: contain

.wrapper-team-gameboard
  height: 100%
</style>
