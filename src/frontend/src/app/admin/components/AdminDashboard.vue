<template>
    <b-card no-body id="dashboard">
        <b-tabs align="center" card v-model="currentTabIndex">
            <b-tab title="Игры" @click="routerPush('Games')" />
            <b-tab title="Ведущие" @click="routerPush('GameHosts')" />
            <b-tab title="Вопросы" @click="routerPush('Questions')" />
            <b-tab title="Комплекты по 36" @click="routerPush('Kits')" />
            <b-tab title="Подборки" @click="routerPush('KitCompilations')" />
            <router-view />
        </b-tabs>
    </b-card>
</template>

<script>
import AdminHttpClient from "@/app/admin/services/adminHttpClient";

const routeNameToIndex = {
    Games: 0,
    GameHosts: 1,
    Questions: 2,
    Kits: 3,
    KitCompilations: 4,
};

export default {
    name: "AdminDashboard",
    data() {
        return {
            currentTabIndex: 0,
        };
    },
    async beforeCreate() {
        await AdminHttpClient.init();
    },
    created() {
        const currentRouteName = this.$router.currentRoute.name;
        this.currentTabIndex = routeNameToIndex[currentRouteName];
    },
    methods: {
        async routerPush(routeNameToPush) {
            const currentRouteName = this.$router.currentRoute.name;
            if (routeNameToPush === currentRouteName) return;
            await this.$router.push({ name: routeNameToPush });
        },
    },
};
</script>

<style scoped></style>
