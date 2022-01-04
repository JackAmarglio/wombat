<template>
    <span v-on:click="onCodeClick(team.accessCode)" style="cursor: pointer" class="ml-2">
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
    name: "TeamCodesNoConnectedCheck",
};
</script>

<style scoped></style>
