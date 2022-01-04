<template>
    <b-card>
        <h5>Введи имя темы куда нужно переместить вопрос</h5>

        <input v-model="topicNameInput" class="mb-2" type="text" />

        <div>
            <!--        <div v-if="foundTopics.length > 0">-->
            <b-list-group>
                <b-list-group-item
                    class="topic-item"
                    v-for="topic in foundTopics"
                    :key="topic.id"
                    v-b-modal.confirm-topic-transfer
                    @click="lastSelectedTopic = topic"
                >
                    {{ topic.name }}
                </b-list-group-item>
            </b-list-group>
        </div>

        <b-modal
            id="confirm-topic-transfer"
            @ok="onTransferConfirmed"
            hide-header
            ok-variant="info"
            button-size="sm"
        >
            <h5>Переместить вопрос в выбранную тему?</h5>
        </b-modal>
    </b-card>
</template>

<script>
import QuestionTopicsService from "@/app/admin/services/content/QuestionTopicsService";
import QuestionsDataService from "@/app/admin/services/content/QuestionsDataService";

export default {
    data() {
        return {
            topicNameInput: "",
            foundTopics: [],
            timeoutToFetch: null,
            lastSelectedTopic: null,
        };
    },
    watch: {
        topicNameInput() {
            clearTimeout(this.timeoutToFetch);
            this.timeoutToFetch = setTimeout(() => this.fetchTopicsByName(), 500);
        },
    },
    methods: {
        async fetchTopicsByName() {
            const formatted = this.topicNameInput.trim();
            if (formatted.length === 0) return;

            this.foundTopics = await QuestionTopicsService.findQuestionTopicsByName(formatted);
        },
        async onTransferConfirmed() {
            await QuestionsDataService.updateQuestion({
                ...this.question,
                topicId: this.lastSelectedTopic.id,
            });
            this.$store.commit("admin/questions/REMOVE_QUESTION", this.question.id);
            this.$emit("close-transfer-window");
        },
    },
    props: ["question"],
    name: "AdminQuestionsTopicTransference",
};
</script>

<style scoped lang="sass">

.topic-item
  cursor: pointer
  transition: background-color 0.3s

.topic-item:hover
  background-color: rgba(0, 0, 0, 0.11)
  transition: background-color 0.3s
</style>
