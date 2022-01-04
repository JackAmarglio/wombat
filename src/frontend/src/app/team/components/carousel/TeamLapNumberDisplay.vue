<template>
    <div class="wrapper">
        <p class="text">
            коло <span>{{ lapNumber }}</span>
        </p>
    </div>
</template>

<script>
export default {
    computed: {
        lapNumber() {
            const lapNumber = this.$store.state.team.lapNumber.current;

            // Из-за того что по дефолту в стейте 0, который по-идее не должен быть виден. Так что это если в будущем вылезет.
            return lapNumber === 0 ? 1 : lapNumber;
        },
    },
    name: "TeamLapNumberDisplay",
};
</script>

<style scoped lang="sass">
.wrapper
  width: 100%
  height: 100%

  display: flex
  justify-content: center
  align-items: center

.text
  font-size: 3em
  font-weight: bold
  color: #a6cfff
</style>
