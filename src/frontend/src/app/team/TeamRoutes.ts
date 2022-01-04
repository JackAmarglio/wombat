import AppTeam from "@/app/team/AppTeam.vue";
// import TeamGameBoard from @/app/team/components/TeamGameBoard.vue;

const teamRoutes = {
    path: "/team",
    name: "team",
    component: AppTeam,
    meta: { loginRouteName: "team" },
    children: [
        {
            path: "member-select",
            name: "TeamMemberSelect",
            component: () => import("@/app/team/TeamMemberSelect.vue"),
            meta: { requiresAuth: true },
        },
        {
            path: "game",
            name: "TeamGameBoard",
            component: () => import("@/app/team/components/TeamGameBoard.vue"),
            meta: { requiresAuth: true },
        },
    ],
};

export default teamRoutes;
