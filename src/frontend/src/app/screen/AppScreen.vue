<template>
    <div>
        <div class="d-flex flex-row justify-content-center align-items-center">
            <login-form
                class="mt-5"
                v-if="!isScreenAuthenticated"
                @onSubmit="handleLogin"
                @onCancel="$router.push('/')"
            />
        </div>

        <router-view />
    </div>
</template>

<script>
import LoginForm from "@/app/shared/components/LoginForm";
import screen from "@/app/screen/modules/screen";
import { mapActions, mapState } from "vuex";
import teamNames from "@/app/shared/store/modules/teamNames";

export default {
    name: "AppHost",
    components: {
        LoginForm,
    },

    beforeRouteUpdate(to, _, next) {
        // Если переходим "назад" когда уже залогинены. Копия с хоста
        if (to.name === "screen") {
            this.$store.dispatch("screen/resetState");
        }

        next();
    },

    beforeCreate() {
        this.$store.registerModule("screen", screen);
        this.$store.registerModule("teamNames", teamNames);
    },

    async mounted() {
        const queryCode = this.$route.query.code;

        if (queryCode !== undefined) {
            await this.handleLogin({
                code: queryCode,
            });
        }
    },
    computed: {
        ...mapState({
            isScreenAuthenticated: (state) => state.authStatus.isAuthenticated,
        }),
    },
    methods: {
        ...mapActions({
            enterGame: "screen/enterGame",
        }),
        async handleLogin({ code }) {
            await this.enterGame(code);

            if (this.isScreenAuthenticated) {
                await this.pushToGamePage();
            }
        },

        async pushToGamePage() {
            await this.$router.push({ name: "ScreenGameBoard" });
        },
    },
    beforeDestroy() {
        this.$store.dispatch("screen/resetState");
        this.$store.unregisterModule("screen");
        this.$store.unregisterModule("teamNames");
    },
};
</script>

<style scoped lang="sass"></style>
