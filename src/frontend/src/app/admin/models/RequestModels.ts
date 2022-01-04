interface OffsetLimitParams {
    offset: number;
    limit: string;
}

interface ItemByIdParams {
    id: string;
}

interface QuestionListRequestParams {
    offset: number;
    limit: number;
    newestFirst: boolean;
    difficulty: 0 | 1 | 2 | 3;
}
