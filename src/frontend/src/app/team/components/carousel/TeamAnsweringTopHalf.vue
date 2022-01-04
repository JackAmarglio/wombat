<template>
    <div class="background" :style="{ 'background-color': bg }" />
</template>

<script>
export default {
    data() {
        return {
            bg: "white",
        };
    },

    beforeMount() {
        this.bg = this.$store.getters.teamColor;
    },

    name: "TeamAnsweringTopHalf",
};
</script>

<style scoped>
.background {
    height: 100%;
    width: 100%;
}
</style>
