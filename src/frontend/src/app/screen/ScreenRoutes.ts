import AppScreen from "@/app/screen/AppScreen.vue";
import GameBoard from "@/app/screen/components/GameBoard.vue";

const screenRoutes = {
    path: "/screen",
    name: "screen",
    component: AppScreen,
    meta: { loginRouteName: "screen" },
    children: [
        {
            path: "game",
            name: "ScreenGameBoard",
            component: GameBoard,
            meta: { requiresAuth: true },
        },
    ],
};

export default screenRoutes;
