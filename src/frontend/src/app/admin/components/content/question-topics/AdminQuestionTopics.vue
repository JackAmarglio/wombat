<template>
    <div id="outer-wrapper" class="px-2">
        <h3 id="main-heading">Темы вопросов</h3>

        <AdminCreateQuestionTopic id="creating-topic-wrapper" v-on:handle-topic-created="handleTopicCreated" />

        <div class="pagination-wrapper d-flex justify-content-center">
            <b-pagination
                v-model="currentPage"
                :total-rows="paginatorHighThreshold"
                :per-page="itemsPerPage"
                last-class="disabled"
                :disabled="isPaginatorDisabled"
                limit="3"
            />
        </div>

        <div>
            <ul class="list-with-topics list-group">
                <li
                    v-for="topic in pageTopics"
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
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import QuestionTopicListItem from "./components/QuestionTopicListItem";
import AdminCreateQuestionTopic from "./AdminCreateQuestionTopic";
import questionTopicsBrowser from "@/app/admin/store/modules/questionTopicsBrowser";

const itemsPerPage = 6;

export default {
    data() {
        return {
            paginatorHighThreshold: 1,
            isPaginatorDisabled: true,
        };
    },
    beforeMount() {
        this.$store.registerModule(["admin", "questionTopics", "questionTopicBrowser"], questionTopicsBrowser);

        this.$store.commit("admin/questionTopics/SET_ITEMS_PER_PAGE", itemsPerPage);
        this.$store.commit("admin/questionTopics/ENABLE_ZERO_TOPIC");
    },

    beforeDestroy() {
        this.$store.unregisterModule(["admin", "questionTopics", "questionTopicBrowser"]);
    },

    async mounted() {
        await this.goToPage(1, true);

        this.isPaginatorDisabled = false;
    },

    computed: {
        pageTopics() {
            return this.$store.getters["admin/questionTopics/currentPageQuestionTopics"];
        },

        currentPage: {
            get: function () {
                return this.$store.state.admin.questionTopics.questionTopicBrowser.currentPage;
            },
            set: async function (newPage) {
                this.isPaginatorDisabled = true;
                await this.goToPage(newPage);
                this.isPaginatorDisabled = false;
            },
        },

        itemsPerPage() {
            return itemsPerPage;
        },
    },

    methods: {
        async goToPage(pageNumber, force = false) {
            await this.$store.dispatch("admin/questionTopics/setCurrentPage", {
                newPage: pageNumber,
                force,
            });
            this.updatePaginatorMaxThreshold();
        },

        updatePaginatorMaxThreshold() {
            // todo доделать говно. Сейчас оно вроде как и работает но точно не проверял

            const currentQuestionTopicsBatch = this.$store.state.admin.questionTopics.currentTopicBatch;

            if (currentQuestionTopicsBatch.length > itemsPerPage * 2) {
                this.paginatorHighThreshold = this.currentPage * itemsPerPage + itemsPerPage * 2;
                return;
            }

            if (currentQuestionTopicsBatch.length < itemsPerPage) {
                this.paginatorHighThreshold = this.currentPage * itemsPerPage;
                return;
            }

            if (currentQuestionTopicsBatch.length === itemsPerPage && this.currentTopicPage !== 1) {
                this.paginatorHighThreshold = this.currentPage * itemsPerPage;
            } else {
                this.paginatorHighThreshold = this.currentPage * itemsPerPage + itemsPerPage;
            }
        },

        async handleTopicCreated() {
            await this.goToPage(1, true);
        },

        onTopicClick(topic) {
            this.$router.push({ name: "TopicQuestions", params: { topic } });
        },
    },
    components: { QuestionTopicListItem, AdminCreateQuestionTopic },
    name: "AdminQuestionTopics",
};
</script>

<style scoped lang="sass">

#outer-wrapper
  text-align: left

  #main-heading
    text-align: center

  #creating-topic-wrapper
    margin: 0

.question-topic-list-item-wrapper
  cursor: pointer
  transition: background 0.2s

.question-topic-list-item-wrapper:hover
  background: rgba(0, 0, 0, 0.1)
  transition: background 0.2s

@media only screen and (min-width: 768px)
  #outer-wrapper
    width: 66%
    margin: 0 auto

    #main-heading
      text-align: left

    .pagination-wrapper
      justify-content: left !important
</style>
