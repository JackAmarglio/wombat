<template>
    <div class="background">
        <div class="shape">
            <span>{{ currentTeamAttempts }}</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
    computed: {
        ...mapGetters(["currentTeamAttempts"]),
    },
    name: "TeamAfterTourBottomHalf",
};
</script>

<style scoped lang="sass">
.background
  .shape
    background-color: white
    height: 10em
    width: 10em
    border-radius: 100px

    display: flex
    justify-content: center
    align-items: center

    span
      line-height: 0
      font-size: 4em
      color: #111111
      -webkit-text-stroke: 1px rgba(255, 255, 255, 0.8)
</style>
