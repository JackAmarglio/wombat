<template>
    <div class="outer-wrapper">
        <div class="d-flex flex-row justify-content-center align-items-center">
            <login-form
                :default-value="lastCode"
                class="mt-5"
                v-if="!isHostAuthenticated"
                @onSubmit="handleLogin"
                @onCancel="$router.push('/')"
            />
        </div>

        <router-view />
    </div>
</template>

<script>
import LoginForm from "@/app/shared/components/LoginForm";
import host from "@/app/host/modules/host";
import { mapActions, mapState } from "vuex";

const codeStorageKey = "hostLastSuccessfulCode";

export default {
    name: "AppHost",
    components: {
        LoginForm,
    },

    data() {
        return {
            lastCode: "",
        };
    },

    beforeRouteUpdate(to, _, next) {
        // Переход на хоста когда уже в игре работает как разлогин.
        // + Не показывает пустую страницу как раньше
        if (to.name === "host") {
            this.$store.dispatch("host/resetState");
            sessionStorage.removeItem(codeStorageKey);
        }

        next();
    },

    beforeCreate() {
        this.$store.registerModule("host", host);
    },

    beforeMount() {
        this.lastCode = sessionStorage.getItem(codeStorageKey);
    },

    computed: {
        ...mapState({
            isHostAuthenticated: (state) => state.authStatus.isAuthenticated,
        }),
    },
    methods: {
        ...mapActions({
            enterGame: "host/enterGame",
        }),
        async handleLogin(loginFormInput) {
            await this.enterGame(loginFormInput);

            if (this.isHostAuthenticated) {
                sessionStorage.setItem(codeStorageKey, loginFormInput.code);
                await this.pushToGamePage();
            }
        },

        async pushToGamePage() {
            await this.$router.push({ name: "HostGameBoard" });
        },
    },
    beforeDestroy() {
        this.$store.dispatch("host/resetState");
        this.$store.unregisterModule("host");
    },
};
</script>

<style scoped lang="sass">
.outer-wrapper
  height: 100%
</style>
