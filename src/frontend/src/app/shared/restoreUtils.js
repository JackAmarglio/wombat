export function transformRestoreQuestion(question) {
    return {
        questionId: question.id,
        ...question,
    };
}
