<template>
    <section class="list row">
        <TopicDetailsHeading :topic="topic" class="py-2" />

        <div class="col-12 pt-2 pb-3 d-flex flex-row justify-content-between align-content-center">
            <h4>Список вопросов</h4>
            <b-button type="button" v-b-toggle.input-form variant="primary" @click="enterCreationMode">
                <b-icon-plus />
            </b-button>
        </div>

        <div class="col-md-6 col-sm-12">
            <div class="row pb-3">
                <div class="ml-3 pt-2">
                    <h6>
                        <b-icon-eye-fill font-scale="1" variant="secondary"></b-icon-eye-fill>
                        <select class="ml-2" v-model="pageSize" @change="changePageSize($event)">
                            <option v-for="size in pageSizes" :key="size" :value="size">
                                {{ size }}
                            </option>
                        </select>
                    </h6>
                </div>
                <b-pagination
                    class="ml-3"
                    size="md"
                    v-model="page"
                    :total-rows="questionsCount"
                    :per-page="pageSize"
                    first-number
                    last-number
                    @change="changePage"
                ></b-pagination>
                <span class="ml-3">
                    <b-dropdown id="dropdown-1" :text="chosenDifficulty">
                        <b-dropdown-item @click="filterByDifficulty(noDifficulty)">
                            Все вопросы
                        </b-dropdown-item>
                        <b-dropdown-divider></b-dropdown-divider>
                        <b-dropdown-item
                            v-for="level in questionDifficultyLevels"
                            :key="level.points"
                            @click="filterByDifficulty(level)"
                        >
                            {{ level.name }}
                        </b-dropdown-item>
                    </b-dropdown>
                </span>
            </div>
            <ul id="list" class="list-group">
                <li
                    class="
                        p-3
                        list-group-item
                        ellipsis
                        d-flex
                        flex-row
                        justify-content-start
                        align-items-center align-content-center
                    "
                    :class="{ active: index + requestParams.offset === currentIndex }"
                    v-for="(question, index) in questions"
                    :key="question.id"
                    @click="onQuestionClick(question, index + requestParams.offset)"
                >
                    <div>
                        <span v-for="level in questionDifficultyLevels" :key="level.points">
                            <b-icon
                                icon="circle-fill"
                                font-scale="0.5"
                                class="m-1"
                                :style="{
                                    color:
                                        level.points > question.difficulty
                                            ? '#f7f7f7'
                                            : index + requestParams.offset === currentIndex
                                            ? '#5bc0de'
                                            : '#0275d8',
                                }"
                            ></b-icon>
                        </span>
                    </div>
                    <div class="ml-2">
                        <strong>{{ index + 1 + requestParams.offset }}.</strong>
                    </div>
                    <p class="question-text">
                        ({{ question.answer }})
                        {{ question.content }}
                    </p>
                    <b-btn
                        class="transfer-question-button"
                        :style="isInTransferMode ? 'display: none' : ''"
                        variant="warning"
                        size="sm"
                        v-b-tooltip.hover.right="'Переместить в другую тему'"
                        @click.stop="onQuestionTransferClick"
                    >
                        ⇄
                    </b-btn>
                </li>
            </ul>
            <div v-if="!questions.length">Вопросов пока нет...</div>
        </div>

        <div class="col-md-6 col-sm-12">
            <!--todo: move to InputForm component-->
            <b-card id="input-form" v-if="creationMode || editingMode">
                <h5>
                    <span v-if="creationMode">Вопрос {{ questionsCount + 1 }}</span>

                    <span v-else>Вопрос {{ currentIndex + 1 }}</span>
                </h5>
                <b-form @submit="submitInputForm" @reset="resetInputForm">
                    <div class="pt-1 pb-2">
                        <label>
                            <strong>Контент:</strong>
                        </label>
                        <b-form-textarea rows="2" max-rows="6" v-model="questionInput.content">
                        </b-form-textarea>
                    </div>
                    <div class="pb-2">
                        <label>
                            <strong>Ответ:</strong>
                        </label>
                        <b-form-textarea rows="2" max-rows="3" v-model="questionInput.answer">
                        </b-form-textarea>
                    </div>
                    <div class="pb-2">
                        <label>
                            <strong>Сложность:</strong>
                        </label>
                        <select class="ml-2" v-model="questionInput.difficulty">
                            <option
                                v-for="level in questionDifficultyLevels"
                                :key="level.points"
                                :value="level.points"
                            >
                                {{ level.name }}
                            </option>
                        </select>
                    </div>
                    <b-button class="mr-2" type="submit" variant="primary"> Сохранить </b-button>
                    <b-button type="reset" variant="secondary"> Отмена </b-button>
                </b-form>
            </b-card>

            <admin-question-details
                v-if="currentQuestion && generalMode"
                :current-index="currentIndex"
                :currentQuestion="currentQuestion"
                @onClickEdit="enterEditingMode"
                @onClickDelete="deleteSelectedQuestion"
            />

            <admin-questions-topic-transference
                v-if="isInTransferMode"
                :question="currentQuestion"
                @close-transfer-window="onCloseTransferWindow"
            />

            <div v-if="generalMode && !currentQuestion">
                <br />
                <p>Выбери вопрос из списка слева</p>
            </div>
        </div>
    </section>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

import difficultyOptionsMap from "@/app/shared/difficultyOptions";
import TopicDetailsHeading from "@/app/admin/components/content/questions/components/TopicDetailsHeading";
import AdminQuestionsTopicTransference from "@/app/admin/components/content/questions/components/AdminQuestionsTopicTransference";

const { mapState, mapActions } = createNamespacedHelpers("admin/questions");

export default {
    name: "AdminQuestions",
    props: ["topic"],
    components: {
        AdminQuestionsTopicTransference,
        TopicDetailsHeading,
        AdminQuestionDetails: () => import("./AdminQuestionDetails"),
    },
    data() {
        return {
            generalMode: true,
            isInTransferMode: false,
            creationMode: false,
            editingMode: false,
            currentIndex: -1,
            currentQuestion: undefined,
            creationLabel: "Новый вопрос",
            questionInput: {
                id: 0,
                topicId: 0,
                content: "",
                answer: "",
                difficulty: 0,
            },
            requestParams: {
                topicId: 0,
                offset: 0,
                limit: 0,
                newestFirst: false,
                difficulty: 3,
            },
            page: 1,
            pageSize: 6,
            pageSizes: [3, 5, 6, 10],
            difficultyOptions: difficultyOptionsMap,
            chosenDifficulty: null,
            questionsCount: 0,
        };
    },

    async mounted() {
        this.requestParams.topicId = this.topic.id;
        this.questionInput.topicId = this.topic.id;
        this.questionsCount =
            this.topic.numberOfEasyQuestions +
            this.topic.numberOfMediumQuestions +
            this.topic.numberOfHardQuestions;

        await this.fetchPaginatedQuestions();
        this.clearDifficultyFilter();
    },
    computed: {
        ...mapState({
            questions: (state) => state.all,
        }),
        questionDifficultyLevels() {
            return [
                difficultyOptionsMap.get("easy"),
                difficultyOptionsMap.get("medium"),
                difficultyOptionsMap.get("hard"),
            ];
        },
        noDifficulty() {
            return difficultyOptionsMap.get("all");
        },
    },

    methods: {
        ...mapActions(["fetchQuestions", "createQuestion", "updateQuestion", "deleteQuestion"]),

        clearDifficultyFilter() {
            this.chosenDifficulty = this.noDifficulty.name;
        },

        setChosenDifficulty(text) {
            this.chosenDifficulty = text;
        },

        filterByDifficulty(level) {
            this.setDifficultyRequestParam(level.points);
            this.fetchQuestions(this.requestParams);
            this.setChosenDifficulty(level.name);
        },

        setDifficultyRequestParam(param) {
            this.requestParams.difficulty = param;
        },

        fetchPaginatedQuestions() {
            this.setOffsetLimitRequestParams();
            this.fetchQuestions(this.requestParams);
        },

        setOffsetLimitRequestParams() {
            this.page === 1
                ? (this.requestParams.offset = 0)
                : (this.requestParams.offset = (this.page - 1) * this.pageSize);
            this.requestParams.limit = this.pageSize;
        },

        changePage(pageNumber) {
            this.page = pageNumber;

            this.isInTransferMode = false;
            this.closeItemDetails();
            this.fetchPaginatedQuestions();
        },

        changePageSize(evt) {
            this.pageSize = evt.target.value;
            //return to start
            this.page = 1;
            this.closeItemDetails();
            this.fetchPaginatedQuestions();
        },

        onQuestionClick(question, index) {
            this.isInTransferMode = false;
            this.generalMode = true;
            this.editingMode = false;
            this.creationMode = false;

            this.currentIndex = index;
            this.currentQuestion = question;
        },

        openNewItemDetails() {
            this.currentIndex = this.questionsCount - 1;
            this.currentQuestion = this.questions[this.questions.length - 1];
        },

        openClosestItemDetails() {
            let nextItem = this.currentIndex - this.requestParams.offset;
            if (this.questions[nextItem]) {
                this.currentQuestion = this.questions[nextItem];
            } else {
                nextItem--;
                this.currentIndex--;
                this.currentQuestion = this.questions[nextItem];
            }
        },

        closeItemDetails() {
            this.currentIndex = -1;
            this.currentQuestion = undefined;
        },

        clearInputFields() {
            this.questionInput = {
                id: 0,
                topicId: this.topic.id,
                content: "",
                answer: "",
            };
        },

        enterCreationMode() {
            //hide details/text
            this.generalMode = false;
            this.clearInputFields();
            this.closeItemDetails();
            //show input component
            this.creationMode = true;
        },

        exitCreationMode() {
            this.clearInputFields();
            //may not open if unnecessary
            this.openNewItemDetails();
            //hide input form
            this.creationMode = false;
            //show newly open details
            this.generalMode = true;
            this.fetchPaginatedQuestions();
        },

        enterEditingMode() {
            //hide details/text
            this.generalMode = false;
            //fill input fields with current info
            Object.assign(this.questionInput, this.currentQuestion);
            //show input component
            this.editingMode = true;
        },

        exitEditingMode() {
            //update details prop
            Object.assign(this.currentQuestion, this.questionInput);

            this.clearInputFields();
            //hide input form
            this.editingMode = false;
            //show previously open details
            this.generalMode = true;
            this.fetchPaginatedQuestions();
        },

        async submitInputForm(evt) {
            evt.preventDefault();

            if (this.creationMode) {
                //update list in store
                await this.createQuestion(this.questionInput);
                this.exitCreationMode();
            } else if (this.editingMode) {
                //update list in store
                await this.updateQuestion(this.questionInput);
                this.exitEditingMode();
            }
        },

        resetInputForm(evt) {
            evt.preventDefault();
            this.clearInputFields();
            //close input field
            this.creationMode = false;
            this.editingMode = false;
            //show previously open details/text
            this.generalMode = true;
        },

        async deleteSelectedQuestion() {
            //update list in store
            await this.deleteQuestion(this.currentQuestion.id);
            //may not open if unnecessary
            this.openClosestItemDetails();
            await this.fetchPaginatedQuestions();
        },

        onQuestionTransferClick() {
            this.creationMode = false;
            this.generalMode = false;
            this.isInTransferMode = true;
        },

        onCloseTransferWindow() {
            this.isInTransferMode = false;
            this.currentQuestion = null;
            this.currentIndex = -1;
        },
    },
    beforeRouteEnter(to, _, next) {
        if (to.params.topic === undefined) {
            next({ name: "Questions" });
        } else {
            next();
        }
    },
};
</script>

<style scoped>
.list {
    text-align: left;
    max-width: 1200px;
    max-height: 100%;
    margin: auto;
}

#list > li.active > .transfer-question-button {
    display: block;
}

#list > li.active .question-text {
    margin: 0 1.5rem 0 0;
}

.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.question-text {
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
}

.transfer-question-button {
    display: none;
    position: absolute;

    margin-left: auto;
    margin-right: 5px;
    left: 0;
    right: 0;
}
</style>
