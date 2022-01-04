<template>
    <b-card>
        <div class="d-flex flex-row justify-content-between">
            <div>
                <h4>Вопрос {{ currentIndex + 1 }}</h4>
            </div>
            <div>
                <a v-if="editable" class="badge badge-warning p-2 mr-2" @click="enterEditingMode">Исправить</a>
                <a v-if="deletable" class="badge badge-dark p-2" @click="deleteSelectedQuestion">Удалить</a>
            </div>
        </div>
        <div class="pt-2 pb-3">
            <p>
                <strong>Айди:</strong>
                <span class="ml-2" style="color: #0275d8">{{ currentQuestion.id }}</span>
            </p>
            <label><strong>Контент:</strong></label>
            <p>{{ currentQuestion.content }}</p>
            <label><strong>Ответ:</strong></label>
            <p>{{ currentQuestion.answer }}</p>
            <label
                ><strong>Сложность:</strong>
                <span class="ml-2">{{ difficulty }}</span>
            </label>
        </div>
    </b-card>
</template>

<script>
import difficultyOptionsMap from "@/app/shared/difficultyOptions";

export default {
    name: "AdminQuestionDetails",
    props: {
        currentIndex: {
            type: Number,
            required: true,
        },
        currentQuestion: {
            type: Object,
            required: true,
        },
        editable: {
            type: Boolean,
            required: false,
            default: true,
        },
        deletable: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    computed: {
        difficulty() {
            const values = [
                difficultyOptionsMap.get("easy"),
                difficultyOptionsMap.get("medium"),
                difficultyOptionsMap.get("hard"),
            ];
            let difficultyToShow = null;
            if (this.currentQuestion.difficulty === undefined) {
                difficultyToShow = "Не назначена";
            } else {
                values.forEach((value) => {
                    if (value.points === this.currentQuestion.difficulty) {
                        difficultyToShow = value.name;
                    }
                });
            }
            return difficultyToShow;
        },

        topic() {
            let topicToShow = null;
            if (this.currentQuestion.topic === undefined || this.currentQuestion.topic === "") {
                topicToShow = "Без темы";
            } else {
                topicToShow = this.currentQuestion.topic;
            }
            return topicToShow;
        },
    },

    methods: {
        enterEditingMode() {
            this.$emit("onClickEdit");
        },
        deleteSelectedQuestion() {
            this.$emit("onClickDelete");
        },
    },
};
</script>

<style scoped></style>
