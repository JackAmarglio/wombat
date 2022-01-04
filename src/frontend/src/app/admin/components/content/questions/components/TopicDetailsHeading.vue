<template>
    <div id="outer-wrapper">
        <h3
            id="topic-name-header"
            v-if="!isInEditMode"
            ref="topicName"
            v-on:click="topicNameFullyVisible = !topicNameFullyVisible"
            :style="topicNameFullyVisible ? '' : 'white-space: nowrap'"
        >
            {{ topicName }}
        </h3>

        <div v-else>
            <input v-model="topicName" />
            <b-button size="sm" variant="success" class="ml-3" v-on:click="onConfirmNameChange">✔</b-button>
            <b-button size="sm" variant="danger" class="mx-2" v-on:click="onDiscardNameChange">⨯</b-button>
        </div>

        <div v-if="!isInEditMode && !isZeroTopicMode">
            <b-button class="ml-1" variant="outline-primary" size="sm" v-on:click="onEditClick">✎</b-button>
            <b-button class="mx-1" variant="danger" size="sm" v-b-modal.confirm-topic-delete-modal>🗑</b-button>
        </div>

        <b-modal
            id="confirm-topic-delete-modal"
            @ok="onDeleteConfirmed"
            hide-header
            ok-variant="danger"
            button-size="sm"
        >
            <h3>Точно удалить тему?</h3>
            <br />
            <p>Все вопросы из этой темы не удалятся, а просто останутся без темы</p>
        </b-modal>
    </div>
</template>

<script>
import QuestionTopicsService from "@/app/admin/services/content/QuestionTopicsService";

export default {
    props: ["topic"],
    beforeMount() {
        this.topicName = this.topic.name;

        // смотрим вопросы без темы
        if (this.topic.id === -1) {
            this.isZeroTopicMode = true;
        }
    },
    data() {
        return {
            topicName: "",
            topicNameFullyVisible: false,
            isInEditMode: false,
            isZeroTopicMode: false,
        };
    },
    methods: {
        onEditClick() {
            this.isInEditMode = true;
        },
        async onDeleteConfirmed() {
            await QuestionTopicsService.deleteQuestionTopic(this.topic.id);
            await this.$router.push({ name: "Questions" });
        },
        onDiscardNameChange() {
            this.isInEditMode = false;
            this.topicName = this.topic.name;
        },
        async onConfirmNameChange() {
            await QuestionTopicsService.updateTopic({
                id: this.topic.id,
                name: this.topicName,
            });
            this.isInEditMode = false;
        },
    },
    name: "TopicDetailsHeading",
};
</script>

<style scoped lang="sass">

#outer-wrapper
  width: 100%

  display: flex
  justify-content: space-between
  align-items: baseline

#topic-name-header
  overflow: hidden
  text-overflow: ellipsis

  margin-bottom: 0
</style>
