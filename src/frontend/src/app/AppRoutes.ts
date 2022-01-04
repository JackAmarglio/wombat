import Vue from "vue";
import VueRouter, { RouteConfig } from "vue-router";

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import AppGreeter from "@/app/shared/components/AppGreeter.vue";
import adminRoutes from "@/app/admin/AdminRoutes";
import hostRoutes from "@/app/host/HostRoutes";
import teamRoutes from "@/app/team/TeamRoutes";
import screenRoutes from "@/app/screen/ScreenRoutes";
import store from "@/app/AppStore";

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
    {
        path: "/",
        name: "AppGreeter",
        component: AppGreeter,
    },
    ...adminRoutes,
    hostRoutes,
    teamRoutes,
    screenRoutes,
];

const router = new VueRouter({
    mode: "history",
    routes,
});

router.beforeEach((to, from, next) => {
    function userAuthenticated() {
        return store.state.authStatus.isAuthenticated;
    }

    function isComingFromOutsideApp() {
        return from.name === null;
    }

    function routeCanBeRenderedOnlyFromParent() {
        return to.matched.some((record) => record.meta.parentOnly);
    }

    function routeRequireAuth(): boolean {
        return to.matched.some((record) => record.meta.requiresAuth);
    }

    function goToParent() {
        next({ name: to.meta?.parentName });
    }

    function getLoginRouteName() {
        const allMetaJoined = to.matched.reduce((p, c) => {
            return { ...p, ...c.meta };
        }, {}) as { loginRouteName: string };
        return allMetaJoined.loginRouteName ?? "AppGreeter";
    }

    function goToLogin() {
        const loginRouteName = getLoginRouteName();
        next({ name: loginRouteName });
    }

    if (routeRequireAuth()) {
        if (userAuthenticated()) {
            next();
        } else {
            goToLogin();
        }
        // todo: Admin should also use "requireAuth" in meta. Currently auth handled separately in pre-route guard
    } else if (routeCanBeRenderedOnlyFromParent()) {
        if (isComingFromOutsideApp()) {
            goToParent();
        } else {
            next();
        }
    } else {
        next();
    }
});

export default router;
