<template>
    <span v-if="team.connected" class="ml-2">Подключилась</span>
    <!--    Еще неплохо если как-то вынести именно спан-->
    <span v-else v-on:click="onCodeClick(team.accessCode)" style="cursor: pointer" class="ml-2">
        {{ team.accessCode }}
    </span>
</template>

<script>
export default {
    props: {
        team: Object,
    },
    methods: {
        onCodeClick(code) {
            this.$emit("code-clicked", code);
        },
    },
    name: "TeamCodeWithConnectedCheck",
};
</script>

<style scoped></style>
