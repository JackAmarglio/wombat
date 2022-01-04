interface QuestionStateModel {
    id: string;
    topic: string;
    content: string;
    answer: string;
    difficulty: 0 | 1 | 2 | 3;
}

interface QuestionsStoreModuleState {
    questions: Array<QuestionStateModel>;
    questionsCount: number;
}
