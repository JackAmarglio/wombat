import { QUESTIONS_URL, QUESTIONS_GET_COUNT, QUESTIONS_TOPIC_LESS_URL } from "@/app/shared/apiUrls";
import HttpClient from "@/app/admin/services/adminHttpClient";

class QuestionsDataService {
    getTopicQuestions(params) {
        return HttpClient.getAndReturnData(QUESTIONS_URL, params);
    }

    getTopicLessQuestions(params) {
        return HttpClient.getAndReturnData(QUESTIONS_TOPIC_LESS_URL, params);
    }

    async getQuestionsNumber() {
        return HttpClient.get(QUESTIONS_GET_COUNT);
    }

    async createQuestion(questionDetails) {
        return (await HttpClient.postAndReturnData(QUESTIONS_URL, questionDetails)).id;
    }

    async updateQuestion(questionDetails) {
        return HttpClient.put(QUESTIONS_URL, questionDetails);
    }

    async deleteQuestion(questionId) {
        return HttpClient.delete(QUESTIONS_URL, questionId);
    }

    prepareQuestionStateModel(rawQuestion, topicId) {
        const topicIdToWrite = rawQuestion.topicId === undefined ? topicId : rawQuestion.topicId;

        return {
            topicId: topicIdToWrite,
            id: rawQuestion.id,
            content: rawQuestion.content,
            answer: rawQuestion.answer,
            difficulty: rawQuestion.difficulty,
        };
    }

    prepareQuestionListForState(questionsList, topicId) {
        const topicIdFormatted = topicId === undefined ? -1 : topicId;

        return questionsList.map((question) => {
            return this.prepareQuestionStateModel(question, topicIdFormatted);
        });
    }
}

export default new QuestionsDataService();
