import AppHost from "@/app/host/AppHost.vue";
import GameBoard from "@/app/host/components/GameBoard.vue";

const hostRoutes = {
    path: "/host",
    name: "host",
    component: AppHost,
    meta: { loginRouteName: "host" },
    children: [
        {
            path: "game",
            name: "HostGameBoard",
            component: GameBoard,
            meta: { requiresAuth: true },
        },
    ],
};

export default hostRoutes;
