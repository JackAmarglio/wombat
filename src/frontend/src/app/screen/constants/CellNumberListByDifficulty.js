import { CellDifficultyOptions } from "@/app/screen/constants/CellDifficultyOptions";

const cellNumbersByDifficulty = new Map();
cellNumbersByDifficulty.set(
    CellDifficultyOptions.Easy,
    [1, 2, 3, 4, 5, 6, 7, 12, 13, 18, 19, 24, 25, 30, 31, 32, 33, 34, 35, 36]
);
cellNumbersByDifficulty.set(CellDifficultyOptions.Medium, [8, 9, 10, 11, 14, 17, 20, 23, 26, 27, 28, 29]);
cellNumbersByDifficulty.set(CellDifficultyOptions.Hard, [15, 16, 21, 22]);
export default cellNumbersByDifficulty;
