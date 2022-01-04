import {
    QUESTION_TOPICS_URL,
    QUESTION_TOPICS_TOPIC_LESS_INFO_URL,
    QUESTION_TOPIC_GET_BY_NAME_URL,
} from "@/app/shared/apiUrls";
import HttpClient from "@/app/admin/services/adminHttpClient";

class QuestionTopicsService {
    async getQuestionTopics({ offset, limit, newestFirst }) {
        return (await HttpClient.get(QUESTION_TOPICS_URL, { offset, limit, newestFirst })).data.questionTopics;
    }

    async getQuestionTopic(topicId) {
        return (await HttpClient.get(QUESTION_TOPICS_URL, { id: topicId }, { idInUrl: true })).data;
    }

    async getTopicLessMeta() {
        return (await HttpClient.get(QUESTION_TOPICS_TOPIC_LESS_INFO_URL)).data.topicLessQuestionsInfo;
    }

    async createQuestionTopic(topicName) {
        return (await HttpClient.post(QUESTION_TOPICS_URL, { name: topicName })).data;
    }

    updateTopic(topicToUpdate) {
        return HttpClient.put(QUESTION_TOPICS_URL, topicToUpdate);
    }

    deleteQuestionTopic(topicId) {
        return HttpClient.delete(QUESTION_TOPICS_URL, topicId);
    }

    async findQuestionTopicsByName(nameString) {
        return (await HttpClient.get(QUESTION_TOPIC_GET_BY_NAME_URL, { nameString })).data;
    }
}

const instance = new QuestionTopicsService();

export default instance;
