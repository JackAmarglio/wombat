<template>
    <div id="input-form">
        <spinner v-if="dataIsLoading" />

        <div ref="input_form_card" v-else class="input-form card p-4">
            <div ref="name_+_main_form_controls" class="row header">
                <strong ref="kit_name_input" class="ml-3 pt-2 pb-2 col-8" style="text-align: left">
                    <b-form-input v-if="nameInputActive" v-model="kitInput.name"> </b-form-input>
                    <span v-else
                        >{{ kitInput.name }}
                        <b-icon-pencil-fill class="ml-3" @click="toggleKitNameInputField" />
                    </span>
                </strong>

                <div class="d-flex flex-row justify-content-end align-items-center">
                    <b-button
                        ref="discard_changes"
                        class="mr-2"
                        type="reset"
                        variant="secondary"
                        @click="resetKitInputForm"
                    >
                        Отмена
                    </b-button>

                    <b-button
                        ref="save_kit"
                        :disabled="!isKitValid"
                        class="mr-4"
                        type="submit"
                        variant="primary"
                        @click="submitKitInputForm"
                    >
                        Сохранить
                    </b-button>
                </div>
            </div>

            <stepper :formSteps="formSteps" :activeStep="activeStep" @onStepNumberClick="moveToStep">
            </stepper>

            <section ref="questions_selection_routine" class="list row pt-3">
                <div ref="left_column" class="col-md-6 col-sm-12 pt-3">
                    <div
                        ref="questions_chosen_info_+_controls"
                        class="mb-3 d-flex flex-row justify-content-between align-items-center"
                    >
                        <span ref="questions_chosen_info">
                            <b-dropdown
                                ref="questions_to_show"
                                variant="outline-secondary"
                                text="Отображение"
                                size="sm"
                            >
                                <b-dropdown-item
                                    :active="!kitsCreateAndEdit.isInRevealAllSelectedMode"
                                    @click="showAllQuestions"
                                    >Показывать все вопросы
                                </b-dropdown-item>

                                <b-dropdown-item
                                    :active="kitsCreateAndEdit.isInRevealAllSelectedMode"
                                    @click="showChosenQuestions"
                                    >Показывать только выбранные
                                </b-dropdown-item>
                            </b-dropdown>

                            <strong class="ml-3" v-if="questionsLeftToSelectInCurrentStep > 0">
                                Выбери ещё
                                <span class="color-primary">{{ questionsLeftToSelectInCurrentStep }}</span>
                            </strong>

                            <strong class="ml-3" v-if="questionsLeftToSelectInCurrentStep === 0">
                                Вопросы выбраны!
                            </strong>
                            <strong class="ml-3" v-if="questionsLeftToSelectInCurrentStep < 0">
                                Лишних вопросов:
                                {{ Math.abs(questionsLeftToSelectInCurrentStep) }}
                            </strong>
                        </span>

                        <span ref="reset_or_submit" class="ml-3 md-offset-3">
                            <b-button
                                ref="reset_chosen_for_step"
                                v-if="!kitEditingMode"
                                type="button"
                                variant="outline-secondary"
                                size="sm"
                                @click="clearActiveStepSelectedQuestions"
                            >
                                Сбросить
                            </b-button>

                            <b-button
                                ref="submit_and_move_to_next_step"
                                v-if="questionsLeftToSelectInCurrentStep === 0 && nextStepExists"
                                class="ml-2"
                                type="button"
                                variant="primary"
                                size="md"
                                @click="moveToNextStep"
                            >
                                Дальше!
                            </b-button>
                        </span>
                    </div>

                    <div v-if="!selectedTopic">
                        <b-pagination
                            v-model="currentTopicsPage"
                            :total-rows="1000"
                            :per-page="4"
                            last-class="disabled"
                            :disabled="isTopicPaginatorDisabled"
                            limit="3"
                        />
                        <br />

                        <ul class="list-with-topics list-group">
                            <li
                                v-for="topic in currentPageQuestionTopics"
                                :key="topic.id"
                                class="list-group-item question-topic-list-item-wrapper"
                                v-on:click="onTopicClick(topic)"
                            >
                                <QuestionTopicListItem
                                    :id="topic.id"
                                    :name="topic.name"
                                    :number-of-easy-questions="topic.numberOfEasyQuestions"
                                    :number-of-hard-questions="topic.numberOfHardQuestions"
                                    :number-of-medium-questions="topic.numberOfMediumQuestions"
                                />
                                <!-- Количество выбранных вопросов из темы                                -->
                                <div
                                    v-if="
                                        $store.getters['admin/kits/getTopicSelectedQuestions'](topic.id)
                                            .length > 0
                                    "
                                >
                                    <hr class="my-1" />
                                    <div
                                        class="
                                            selected-questions-number-container
                                            ml-3
                                            d-flex
                                            flex-row-reverse
                                        "
                                    >
                                        <p
                                            style="color: darkred"
                                            v-b-tooltip.hover.bottom="'Выбранно тяжелых'"
                                        >
                                            {{
                                                $store.getters["admin/kits/topicSelectedHardQuestionsNumber"](
                                                    topic.id
                                                )
                                            }}
                                        </p>
                                        <p
                                            style="color: darkorange"
                                            v-b-tooltip.hover.bottom="'Выбранно средних'"
                                        >
                                            {{
                                                $store.getters[
                                                    "admin/kits/topicSelectedMediumQuestionsNumber"
                                                ](topic.id)
                                            }}
                                        </p>
                                        <p style="color: green" v-b-tooltip.hover.bottom="'Выбранно легких'">
                                            {{
                                                $store.getters["admin/kits/topicSelectedEasyQuestionsNumber"](
                                                    topic.id
                                                )
                                            }}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <!--                    todo: всё что ниже кроме вопросов свернуть под иф с selectedTopic-->
                    <div v-if="selectedTopic">
                        <h3 class="ellipsis" v-b-tooltip.hover.bottom :title="selectedTopic.name">
                            {{ selectedTopic.name }}
                        </h3>
                    </div>

                    <div
                        ref="page_size_select_+_pagination"
                        v-if="selectedTopic !== undefined"
                        class="
                            rounded
                            p-2
                            mb-3
                            d-flex
                            flex-row
                            justify-content-start
                            align-content-center align-items-center
                        "
                        style="background: #f7f7f7; font-size: 14px"
                    >
                        <b-button variant="info" size="sm" @click="onReturnFromTopicViewClick"
                            >← К темам</b-button
                        >

                        <span
                            ref="choose_all_page"
                            class="ml-2 d-flex flex-row justify-content-end"
                            v-if="questionsToShow.length > 0"
                        >
                            <b-button
                                ref="select-all-page-questions-checkbox"
                                size="sm"
                                @click="toggleSelectAllTopicQuestionsCheckbox"
                                :variant="isAllSelectedTopicQuestionsPicked ? 'secondary' : 'dark'"
                            >
                                {{ isAllSelectedTopicQuestionsPicked ? "Снять все" : "Выбрать все" }}
                            </b-button>
                        </span>

                        <span
                            ref="sequence_toggle"
                            v-b-tooltip.hover
                            title="WIP :)"
                            class="ml-2 d-flex flex-row justify-content-end"
                        >
                            <span class="mr-2">Сначала новые</span>
                            <!--       Отключен при добавлении топиков, так как не работает пока      -->
                            <b-form-checkbox @change="reorderQuestions" disabled switch> </b-form-checkbox>
                        </span>
                        <span ref="page_size_select" v-b-tooltip.hover title="WIP :)" class="ml-2">
                            <b-icon-eye-fill font-scale="1" variant="secondary"></b-icon-eye-fill>
                            <!--       Отключен при добавлении топиков, так как не работает пока      -->
                            <select class="ml-2" disabled></select>
                        </span>
                        <span ref="pagination" class="ml-3">
                            <b-pagination
                                size="sm"
                                style="margin: 0 0"
                                v-model="selectedTopicQuestionsPage"
                                :total-rows="selectedTopicQuestionAllQuestionNumber"
                                per-page="6"
                                first-number
                                limit="3"
                                :disabled="isSelectedTopicQuestionsPaginatorDisabled"
                            />
                        </span>
                    </div>

                    <ul v-if="selectedTopic" ref="question_list" class="list-group">
                        <li
                            ref="question_preview-item"
                            v-for="(question, index) in questionsToShow"
                            class="
                                p-3
                                list-group-item
                                ellipsis
                                d-flex
                                flex-row
                                justify-content-start
                                align-items-center
                            "
                            :class="activeQuestionId === question.id ? 'active' : ''"
                            :key="question.id"
                            v-on:click="onQuestionListItemClick(question)"
                        >
                            <div>
                                <strong ref="question_select" style="display: inline-block">
                                    <b-form-checkbox
                                        :id="index.toString()"
                                        :name="index.toString()"
                                        v-model="questionSelectedCheckbox"
                                        :value="question"
                                    >
                                    </b-form-checkbox>
                                    <b-form-invalid-feedback :state="questionsLeftToSelectInCurrentStep >= 0">
                                        Лишних вопросов:
                                        {{ Math.abs(questionsLeftToSelectInCurrentStep) }}
                                    </b-form-invalid-feedback>
                                </strong>
                            </div>
                            <div>
                                <strong
                                    ref="difficulty_points"
                                    style="text-align: center; vertical-align: middle"
                                    v-for="level in questionDifficultyLevels"
                                    :key="level.points"
                                >
                                    <b-icon
                                        icon="circle-fill"
                                        font-scale="0.5"
                                        class="m-1"
                                        :style="{
                                            color:
                                                level.points > question.difficulty
                                                    ? '#f7f7f7'
                                                    : activeQuestionId === question.id
                                                    ? '#5bc0de'
                                                    : '#0275d8',
                                        }"
                                    >
                                    </b-icon>
                                </strong>
                            </div>
                            <p class="question-text">
                                ({{ question.answer }})
                                {{ question.content }}
                            </p>
                        </li>
                    </ul>
                    <div
                        ref="no_questions_fetched_for_these_params"
                        class="p-4"
                        v-if="!questionsToShow.length && selectedTopic"
                    >
                        Пусто и одиноко...
                    </div>
                </div>
                <div ref="right_column" class="col-md-6 col-sm-12 pt-3">
                    <div ref="question_details">
                        <admin-question-details
                            v-if="activeQuestion"
                            :editable="false"
                            :deletable="false"
                            :current-index="0"
                            :currentQuestion="activeQuestion"
                        />
                    </div>
                </div>
            </section>
        </div>

        <b-modal ref="detected-no-topic-questions-modal" hide-footer title="Вопросы без темы">
            <p>С вопросов, которые не имеют темы, был снят выбор</p>
        </b-modal>
    </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

import difficultyOptionsMap from "@/app/shared/difficultyOptions";
import kitsCreateAndEdit from "@/app/admin/store/modules/kitsCreateAndEdit";
import QuestionTopicListItem from "@/app/admin/components/content/question-topics/components/QuestionTopicListItem";
import { KitInputFormGeneral, KitInputFormReserve } from "@/app/admin/models/content/kits/KitInputFormTypes";

export default {
    props: ["currentKit", "kitEditingMode", "isReserveKitType"],

    data() {
        return {
            dataIsLoading: true,
            allPageSelectedCheckbox: false,
            nameInputActive: false,
            kitInput: {
                id: 0,
                name: "",
                isReserve: this.isReserveKitType,
                questions: [],
            },
            creationLabel: "",
            activeStep: 0,
            formSteps: [],
            difficultyLevels: difficultyOptionsMap,
            isTopicPaginatorDisabled: true,
            isSelectedTopicQuestionsPaginatorDisabled: false,
        };
    },

    beforeDestroy() {
        this.$store.unregisterModule(["admin", "kits", "kitsCreateAndEdit"]);
    },

    beforeMount() {
        this.$store.registerModule(["admin", "kits", "kitsCreateAndEdit"], kitsCreateAndEdit);

        this.$store.commit("admin/kits/SET_ITEMS_PER_PAGE", 4);
    },

    async mounted() {
        await this.setFormSteps();

        if (this.kitEditingMode) {
            await this.prefillKitInput();
            this.$store.commit("admin/kits/SET_ALL_SELECTED_QUESTIONS", this.kitInput.questions);
            await this.$store.dispatch("admin/kits/switchToRevealSelectedMode");

            // открыли кит в котором были вопросы без темы
            if (this.kitsCreateAndEdit.selectedQuestionsWithNoTopic.length > 0) {
                const noTopicQuestions = this.kitsCreateAndEdit.selectedQuestionsWithNoTopic;
                const allSelectedQuestions = this.$store.getters["admin/kits/allSelectedQuestions"];

                const allSelectedWithoutNoTopic = allSelectedQuestions.filter(
                    (q) => noTopicQuestions.findIndex((badQuestion) => badQuestion.id === q.id) === -1
                );

                this.kitInput.questions = allSelectedWithoutNoTopic;
                this.$store.commit("admin/kits/SET_ALL_SELECTED_QUESTIONS", this.kitInput.questions);

                this.$refs["detected-no-topic-questions-modal"].show();
            }
        }

        this.$store.commit(
            "admin/kits/SET_KIT_VALIDATION_FUNC",
            this.isReserveKitType
                ? (numOfEasy, numOfMed) => {
                      if (numOfEasy !== 20) return false;
                      if (numOfMed !== 16) return false;

                      return true;
                  }
                : (numOfEasy, numOfMed, numOfHard) => {
                      if (numOfEasy !== 20) return false;
                      if (numOfMed !== 12) return false;
                      if (numOfHard !== 4) return false;

                      return true;
                  }
        );

        await this.updateQuestionsDifficultyToShowInTopic();
        await this.goToTopicsPage(1, true);

        // await this._showChosenIfEditingMode();
        await this.setKitDefaultName();

        this.dataIsLoading = false;
        this.isTopicPaginatorDisabled = false;
    },

    computed: {
        ...mapState({
            questions: (state) => state.admin.questions.all,
            questionsCount: (state) => state.admin.questions.count,
            kitsCreateAndEdit: (state) => state.admin.kits.kitsCreateAndEdit,
        }),

        ...mapGetters({
            isAllSelectedTopicQuestionsPicked: "admin/kits/isAllSelectedTopicQuestionsPicked",
            // Все отобранные вопросы для текущей сложности
            currentDifficultyPickedQuestions: "admin/kits/currentDifficultyPickedQuestions",
        }),

        questionSelectedCheckbox: {
            get: function () {
                return this.currentDifficultyPickedQuestions;
            },
            set: function (questions) {
                this.$store.commit("admin/kits/SET_CURRENT_DIFFICULTY_SELECTED_QUESTIONS", questions);
            },
        },

        activeQuestion() {
            return this.kitsCreateAndEdit.questionDetails.activeQuestion;
        },

        activeQuestionId() {
            const activeQuestion = this.activeQuestion;

            return activeQuestion?.id || 0;
        },

        isKitValid() {
            return this.$store.getters["admin/kits/isQuestionsKitFilledCorrectly"];
        },

        selectedTopicQuestionsPage: {
            get: function () {
                return this.kitsCreateAndEdit.selectedTopicQuestionsPageNumber;
            },
            set: async function (newPage) {
                this.isSelectedTopicQuestionsPaginatorDisabled = true;
                await this.$store.dispatch("admin/kits/goToSelectedTopicQuestionsPage", { newPage });
                this.isSelectedTopicQuestionsPaginatorDisabled = false;
            },
        },

        selectedTopicQuestionAllQuestionNumber() {
            return this.$store.getters["admin/kits/topicSelectedDifficultyQuestionsNumber"];
        },

        currentTopicsPage: {
            get: function () {
                return this.kitsCreateAndEdit.currentTopicPage || 1;
            },
            set: async function (newPage) {
                this.isTopicPaginatorDisabled = true;
                await this.goToTopicsPage(newPage);
                this.isTopicPaginatorDisabled = false;
            },
        },

        selectedTopic() {
            return this.kitsCreateAndEdit.selectedTopic;
        },

        currentPageQuestionTopics() {
            return this.$store.getters["admin/kits/honorModeCurrentPageQuestionTopics"];
        },

        questionDifficultyLevels() {
            return [
                difficultyOptionsMap.get("easy"),
                difficultyOptionsMap.get("medium"),
                difficultyOptionsMap.get("hard"),
            ];
        },

        activeStepData() {
            return this.formSteps[this.activeStep];
        },

        questionsLeftToSelectInCurrentStep() {
            const { activeStepData } = this;

            if (activeStepData === undefined) return undefined;

            return activeStepData.questionsRequired - this.currentDifficultyPickedQuestions.length;
        },

        questionsToShow() {
            return this.$store.getters["admin/kits/selectedTopicQuestions"];
        },

        nextStepExists() {
            return this.activeStep !== this.formSteps.length - 1;
        },
    },

    watch: {
        kitInput: {
            deep: true,
            handler(kitInput) {
                if (!this.dataIsLoading && kitInput.name !== "") {
                    this.creationLabel = "";
                } else {
                    this.creationLabel = this.createKitName();
                }
            },
        },

        questionsLeftToSelectInCurrentStep: {
            handler(questionsLeft) {
                if (questionsLeft > 0 && this.activeStepData.isCompleted) {
                    this.activeStepData.isCompleted = false;
                }
            },
        },
    },

    methods: {
        toggleSelectAllTopicQuestionsCheckbox() {
            if (this.isAllSelectedTopicQuestionsPicked) {
                this.$store.dispatch(
                    "admin/kits/removeFromCurrentDifficultySelectedQuestion",
                    this.questionsToShow
                );
            } else {
                this.$store.dispatch(
                    "admin/kits/removeFromCurrentDifficultySelectedQuestion",
                    this.questionsToShow
                );
                this.$store.dispatch(
                    "admin/kits/addToCurrentDifficultySelectedQuestions",
                    this.questionsToShow
                );
            }

            this.$refs["select-all-page-questions-checkbox"].blur();
        },

        onQuestionListItemClick(question) {
            const { questionDetails } = this.kitsCreateAndEdit;

            if (questionDetails.activeQuestion?.id === question.id) {
                this.$store.commit("admin/kits/UNSET_ACTIVE_QUESTION");
                return;
            }

            this.$store.commit("admin/kits/SET_ACTIVE_QUESTION", question);
        },

        async onTopicClick(topic) {
            await this.$store.dispatch("admin/kits/selectTopic", topic);
        },

        onReturnFromTopicViewClick() {
            this.$store.commit("admin/kits/UNSET_SELECTED_TOPIC");
            this.$store.commit("admin/kits/UNSET_ACTIVE_QUESTION");
        },

        async goToTopicsPage(pageNum, force = false) {
            return this.$store.dispatch("admin/kits/setTopicPage", {
                newPage: pageNum,
                force,
            });
        },

        async updateQuestionsDifficultyToShowInTopic() {
            return this.$store.dispatch(
                "admin/kits/setQuestionsDifficulty",
                this.formSteps[this.activeStep].difficultyToSend
            );
        },

        //это родные методы формы изменения

        //"Round" or "Reserve" + date
        createKitName() {
            const dateString = new Date().toLocaleString("ru-RU");
            const text = this.isReserveKitType ? "Запас" : "Раунд";
            return text + " | " + dateString;
        },

        //4-12-20 config for general kit, 16-20 config for reserve kit
        setFormSteps() {
            this.formSteps = this.isReserveKitType ? KitInputFormReserve : KitInputFormGeneral;
        },

        //Editing mode: adds questions from current kit to kit input
        async prefillKitInput() {
            await this._assignKitInput();
        },

        //Helper to above
        async _assignKitInput() {
            this.kitInput = {
                id: this.currentKit.id,
                name: this.currentKit.name,
                isReserve: this.currentKit.isReserve,
                questions: this.currentKit.questions,
            };
        },

        //Creation mode: set default kit name
        async setKitDefaultName() {
            if (this.kitInput.name === "") {
                this.creationLabel = await this.createKitName();
                this.kitInput.name = this.creationLabel;
            }
        },

        //Shows kit name input (currently no button to hide input until submit)
        toggleKitNameInputField() {
            this.nameInputActive = !this.nameInputActive;
            this.setKitDefaultName();
        },

        //Shows "Chosen questions" tooltip
        async showChosenQuestions() {
            this.$store.commit("admin/kits/UNSET_ACTIVE_QUESTION");

            await this.$store.dispatch("admin/kits/switchToRevealSelectedMode");
        },

        //Shows "All questions" tooltip
        async showAllQuestions() {
            await this.$store.dispatch("admin/kits/switchOffRevealSelectedMode");
        },

        //"Clear all" button action.Clears all questions chosen for active step
        clearActiveStepSelectedQuestions() {
            this.$store.commit("admin/kits/REMOVE_CURRENT_DIFFICULTY_SELECTED_QUESTIONS");
        },

        //Refetch questions and reset first page with chosen questions if "newestFirst" param changed
        async reorderQuestions() {
            //show all questions regardless editing mode!
            await this.showAllQuestions();
        },

        //"Next" button action. Clears step data, completes step, fetches new questions
        async moveToNextStep() {
            this.completeStep();
            this.activeStep++;
            await this.updateQuestionsDifficultyToShowInTopic();
            this._clearStepData();
        },

        //Any step number click action. Clears step data, fetches new questions
        async moveToStep(number) {
            this.$store.commit("admin/kits/UNSET_SELECTED_TOPIC");
            this.$store.commit("admin/kits/UNSET_ACTIVE_QUESTION");

            this.activeStep = number;
            await this.updateQuestionsDifficultyToShowInTopic();
            this._clearStepData();
        },

        //Removes "Select all page" checkbox
        _clearAllPageSelected() {
            this.allPageSelectedCheckbox = false;
        },

        //Changes active step isCompleted bool
        completeStep() {
            this.activeStepData.isCompleted = true;
        },

        //Sets extended name and reserve status.
        //Kit input questions are set HERE.
        //Emits input to parent
        //Clears fields
        submitKitInputForm() {
            this.kitInput.questions = this.$store.getters["admin/kits/allSelectedQuestions"];

            this.$emit("onSubmit", this.kitInput);
            this.clearEverything();
        },

        //Emits event to parent
        //Clears fields
        resetKitInputForm() {
            this.$emit("onReset", this.kitInput);
            this.clearEverything();
        },

        //Cleaning

        clearEverything() {
            this._clearStepData();
            this._clearFormSteps();
            this._clearKitInput();
            this.activeStep = 0;
            this.dataIsLoading = true;
            this.nameInputActive = false;
        },

        _clearStepData() {
            this.currentQuestion = undefined;
            this._clearAllPageSelected();
        },

        _clearFormSteps() {
            this.formSteps.forEach((step) => {
                step.questionsChosen = [];
                step.isCompleted = false;
            });
        },

        _clearKitInput() {
            this.kitInput = {
                id: 0,
                name: "",
                isReserve: false,
                questions: [],
            };
        },
    },

    name: "AdminKitInputForm",

    // import судя по mdn возвращает promise, а тут он вызывается синхроно не дожидаясь результата импорта.
    components: {
        QuestionTopicListItem,
        AdminQuestionDetails: () => import("@/app/admin/components/content/questions/AdminQuestionDetails"),
        Spinner: () => import("@/app/shared/components/Spinner"),
        Stepper: () => import("@/app/shared/components/Stepper"),
    },
};
</script>

<style scoped lang="scss">
.selected-questions-number-container {
    p {
        font-size: smaller;
        font-weight: bold;
        margin-right: 1em;
        margin-bottom: 0;
    }
}

.list-with-topics {
    cursor: pointer;

    li {
        transition: background-color 0.1s;
    }

    li:hover {
        background-color: rgba(0, 0, 0, 0.1);
        transition: background-color 0.3s;
    }
}

.list {
    text-align: left;
    max-height: 100%;
    margin: auto;
}

.list-group-item {
    align-items: center;
    user-select: none;
    cursor: pointer;
}

.ellipsis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.input-form {
    width: 100%;
    min-height: 100%;
    position: relative;
}

.row {
    justify-content: flex-start;
    margin: 0 0;
}

.header {
    justify-content: space-between;
}

.question-text {
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
}
</style>
