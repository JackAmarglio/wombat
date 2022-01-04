const difficultyOptionsMap = new Map();
difficultyOptionsMap.set("easy", { name: "Обычные", points: 0 });
difficultyOptionsMap.set("medium", { name: "Средние", points: 1 });
difficultyOptionsMap.set("hard", { name: "Сложные", points: 2 });
difficultyOptionsMap.set("all", { name: "Все вопросы", points: 3 });
export default difficultyOptionsMap;
