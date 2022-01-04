<template>
    <div id="wrapper">
        <form v-on:submit.prevent="authenticate">
            <div>
                <label id="login-label" for="login">Логин админа:</label><br />
                <input
                    type="text"
                    id="login"
                    name="login"
                    ref="loginInputRef"
                    v-model="login"
                    :placeholder="loginPlaceHolder"
                /><br />
                <label id="pass-label" for="pass">Пароль:</label><br />
                <input ref="passInputRef" type="password" id="pass" name="pass" v-model="pass" />
                <br />
                <input :disabled="submitButtonDisabled" type="submit" id="btn-submit" value="Войти" />
                <input class="ml-4" type="button" @click="$router.push('/')" value="Вернуться" />
            </div>
        </form>
    </div>
</template>

<script>
import AdminHttpClient from "@/app/admin/services/adminHttpClient";

export default {
    name: "AdminLogin",
    data: function () {
        return {
            login: "",
            loginPlaceHolder: "",
            pass: "",
            submitButtonDisabled: false,
        };
    },
    beforeMount() {
        const lastAdminLogin = this.getLastSuccessfulAdminLogin();
        if (lastAdminLogin === null) return;
        this.loginPlaceHolder = lastAdminLogin;
    },
    mounted() {
        if (this.loginPlaceHolder === "") this.$refs.loginInputRef.focus();
        else this.$refs.passInputRef.focus();
    },
    methods: {
        async authenticate() {
            this.submitButtonDisabled = true;
            const loginToAuth = this.login === "" ? this.loginPlaceHolder : this.login;

            const isLoggedInSuccessful = await AdminHttpClient.authenticate(loginToAuth, this.pass);
            if (isLoggedInSuccessful) {
                await this.$router.push({ name: "Games" });
                this.saveSuccessfulAdminLogin(loginToAuth);
            }

            this.submitButtonDisabled = false;
        },
        saveSuccessfulAdminLogin(login) {
            window.localStorage.setItem("last-admin-login", login);
        },
        getLastSuccessfulAdminLogin() {
            return window.localStorage.getItem("last-admin-login");
        },
    },
};
</script>

<style scoped lang="sass">
#wrapper, form
    height: 100%

#wrapper
    // чтобы не перекрывать кнопки сверху
    // так как wrapper и from боксы по ширине как раз перекрывают все кнопки
    pointer-events: none
    position: absolute
    top: 0
    right: 0
    bottom: 0
    left: 0

form
    display: flex
    justify-content: center
    align-items: center

    // включаем ивенты внутри маленького дива, так как в #wrapper и в form они выключены из-за их размера
    div
        pointer-events: all

label
    margin-top: 1em

#btn-submit
    margin-top: 1em
</style>
