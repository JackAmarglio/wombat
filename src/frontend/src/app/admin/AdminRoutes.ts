import AppAdmin from "@/app/admin/AppAdmin.vue";
import AdminKits from "@/app/admin/components/content/kits/AdminKits.vue";
import AdminKitCreate from "@/app/admin/components/content/kits/AdminKitCreate.vue";
import AdminKitEdit from "@/app/admin/components/content/kits/AdminKitEdit.vue";
import AdminKitCompilations from "@/app/admin/components/content/kit-compilations/AdminKitCompilations.vue";
import AdminKitCompilationCreate from "@/app/admin/components/content/kit-compilations/AdminKitCompilationCreate.vue";
import AdminKitCompilationEdit from "@/app/admin/components/content/kit-compilations/AdminKitCompilationEdit.vue";
import AdminLogin from "@/app/admin/components/AdminLogin.vue";

import { isLoggedIn } from "@/app/admin/services/adminAuthInfoProvider";
import { RawLocation, Route } from "vue-router";
import AdminQuestionTopics from "@/app/admin/components/content/question-topics/AdminQuestionTopics.vue";
import AdminQuestions from "@/app/admin/components/content/questions/AdminQuestions.vue";
import AdminGames from "@/app/admin/components/games/AdminGames.vue";
import AdminHosts from "@/app/admin/components/hosts/AdminHosts.vue";

type NavigationGuardNext = (to?: RawLocation | false | void) => void;

const adminRoutes = [
    {
        path: "/admin",
        component: AppAdmin,
        beforeEnter: (_to: Route, _from: Route, next: NavigationGuardNext) => {
            if (!isLoggedIn()) next("/admin-login");
            else next();
        },
        children: [
            {
                path: "",
                redirect: "games",
            },
            {
                path: "games",
                name: "Games",
                component: AdminGames,
            },
            {
                path: "hosts",
                name: "GameHosts",
                component: AdminHosts,
            },
            {
                path: "questions",
                name: "Questions",
                component: AdminQuestionTopics,
            },
            {
                path: "topic-questions",
                name: "TopicQuestions",
                component: AdminQuestions,
                props: true,
            },
            {
                path: "kits",
                name: "Kits",
                component: AdminKits,
            },
            {
                path: "kits/new",
                name: "KitCreation",
                component: AdminKitCreate,
                props: true,
                meta: {
                    parentOnly: true,
                    parentName: "Kits",
                },
            },
            {
                path: "kits/:id/edit/",
                name: "KitEditing",
                component: AdminKitEdit,
                meta: {
                    // хотя вроде бы он норм грузиться даже если на него запрос был
                    parentOnly: true,
                    parentName: "Kits",
                },
            },
            {
                path: "kit-compilations",
                name: "KitCompilations",
                component: AdminKitCompilations,
            },
            {
                path: "kit-compilations/new",
                name: "KitCompilationCreation",
                component: AdminKitCompilationCreate,
                props: true,
                meta: {
                    parentOnly: true,
                    parentName: "KitCompilations",
                },
            },
            {
                path: "kit-compilations/:id/edit/",
                name: "KitCompilationEditing",
                component: AdminKitCompilationEdit,
                meta: {
                    parentOnly: true,
                    parentName: "KitCompilations",
                },
            },
        ],
    },
    {
        path: "/admin-login",
        name: "AdminLogin",
        component: AdminLogin,
    },
];

export default adminRoutes;
