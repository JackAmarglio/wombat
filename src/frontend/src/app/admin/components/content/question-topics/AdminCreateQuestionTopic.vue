<template>
    <div id="outer-wrapper">
        <div v-if="isInactive" class="create-new-btn-wrapper d-flex justify-content-center p-3">
            <b-btn variant="success" v-on:click="makeActive">Создать новую тему</b-btn>
        </div>

        <div v-else class="opened-state p-4">
            <label class="w-100">
                <span class="text-center">Имя новой темы: </span>
                <br />
                <input v-model="inputTopicName" class="w-100" type="text" />
            </label>

            <div class="controls w-100 d-flex justify-content-between">
                <b-btn variant="outline-secondary" size="sm" class="mt-4" v-on:click="onCancel">Отмена</b-btn>
                <b-btn variant="success" size="sm" class="mt-4" v-on:click="onCreate">Создать</b-btn>
            </div>
        </div>
    </div>
</template>

<script>
import QuestionTopicsService from "@/app/admin/services/content/QuestionTopicsService";

export default {
    data() {
        return {
            isInactive: true,
            inputTopicName: "",
        };
    },
    methods: {
        makeActive() {
            this.isInactive = false;
        },
        onCancel() {
            this.isInactive = true;
        },
        async onCreate() {
            const newTopicName = this.inputTopicName.trim();

            if (newTopicName === "") return;

            const newTopicId = await QuestionTopicsService.createQuestionTopic(newTopicName);

            this.$emit("handle-topic-created", { id: newTopicId, name: newTopicId });

            this.isInactive = true;
            this.inputTopicName = "";
        },
    },
    name: "AdminCreateQuestionTopic",
};
</script>

<style scoped lang="sass">
#outer-wrapper
  text-align: left

@media only screen and (min-width: 768px)
  .create-new-btn-wrapper
    justify-content: left !important

@media only screen and (min-width: 1500px)
  .opened-state
    width: 30%
</style>
