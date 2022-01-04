interface KitInputStep {
    questionsRequired: number;
    label: "Сложные" | "Средние" | "Легкие";
    difficultyToSend: "hard" | "medium" | "easy";
    questionsChosen: Array<QuestionStateModel>;
    isCompleted: boolean;
}

export const KitInputFormGeneral: Array<KitInputStep> = [
    {
        questionsRequired: 4,
        label: "Сложные",
        difficultyToSend: "hard",
        questionsChosen: [],
        isCompleted: false,
    },
    {
        questionsRequired: 12,
        label: "Средние",
        difficultyToSend: "medium",
        questionsChosen: [],
        isCompleted: false,
    },
    {
        questionsRequired: 20,
        label: "Легкие",
        difficultyToSend: "easy",
        questionsChosen: [],
        isCompleted: false,
    },
];

export const KitInputFormReserve: Array<KitInputStep> = [
    {
        questionsRequired: 16,
        label: "Средние",
        difficultyToSend: "medium",
        questionsChosen: [],
        isCompleted: false,
    },
    {
        questionsRequired: 20,
        label: "Легкие",
        difficultyToSend: "easy",
        questionsChosen: [],
        isCompleted: false,
    },
];
