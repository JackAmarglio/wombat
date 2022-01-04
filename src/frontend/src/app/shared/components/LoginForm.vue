<template>
    <b-form class="col-md-3 col-sm-6" @submit="onSubmit" @reset="onReset">
        <b-form-input ref="input" placeholder="Ты не пройдешь!" v-model="loginInput.code" />

        <div class="d-flex flex-row justify-content-start pt-2">
            <b-button class="mr-2" type="submit" variant="primary" :disabled="!loginInput.code">
                Отправить
            </b-button>

            <b-button type="reset" variant="secondary"> Отмена </b-button>
        </div>
    </b-form>
</template>

<script>
export default {
    props: {
        defaultValue: {
            type: String,
            default: "",
        },
    },
    name: "LoginForm",
    data() {
        return {
            loginInput: {
                code: "",
            },
        };
    },
    mounted() {
        this.$refs.input.focus();
        this.setDefaultValue();
    },
    methods: {
        onSubmit(evt) {
            evt.preventDefault();
            this.$emit("onSubmit", this.loginInput);
        },
        onReset(evt) {
            evt.preventDefault();
            this.loginInput = {
                code: "",
            };
            this.$emit("onCancel");
        },
        setDefaultValue() {
            if (!this.defaultValue) return;
            this.loginInput.code = this.defaultValue.trim();
        },
    },
};
</script>

<style scoped></style>
