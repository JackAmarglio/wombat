import { CellDifficultyOptions } from "@/app/screen/constants/CellDifficultyOptions";

const cellColorByDifficulty = new Map();
cellColorByDifficulty.set(CellDifficultyOptions.Hard, "#6c757d");
cellColorByDifficulty.set(CellDifficultyOptions.Medium, "#b3babf");
cellColorByDifficulty.set(CellDifficultyOptions.Easy, "#dee1e3");
export default cellColorByDifficulty;
