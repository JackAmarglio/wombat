<template>
    <div class="flex-column d-flex">
        <h5>{{ name }}</h5>

        <div class="questions-number-container d-flex ml-3">
            <p style="color: green" v-b-tooltip.hover.bottom="'Легкие вопросы'">
                {{ numberOfEasyQuestions }}
            </p>
            <p style="color: darkorange" v-b-tooltip.hover.bottom="'Средние вопросы'">
                {{ numberOfMediumQuestions }}
            </p>
            <p style="color: darkred" v-b-tooltip.hover.bottom="'Тяжелые вопросы'">
                {{ numberOfHardQuestions }}
            </p>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        id: Number,
        name: String,
        numberOfEasyQuestions: Number,
        numberOfMediumQuestions: Number,
        numberOfHardQuestions: Number,
    },
    name: "QuestionTopicListItem",
};
</script>

<style scoped lang="sass">

h5
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap

.questions-number-container
  p
    font-size: smaller
    margin-right: 1em
    margin-bottom: 0
</style>
