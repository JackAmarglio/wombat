<template>
    <div class="m-2 card d-flex flex-column justify-content-start">
        <div
            class="card-header d-flex flex-fill flex-wrap flex-column justify-content-start align-items-start"
        >
            <strong class="ml-1">{{ kitCompilation.name }}</strong>
        </div>
        <div class="p-4 d-flex flex-fill flex-wrap flex-row justify-content-between">
            <div class="d-flex flex-row justify-content-start align-content-center">
                <span class="mr-2"
                    >В основе: <strong class="mr-2">{{ generalKits.length }}</strong>
                    <b-icon-check-circle-fill v-if="generalKits.length > 0" variant="success">
                    </b-icon-check-circle-fill>
                    <b-icon-exclamation-circle-fill v-else variant="danger"> </b-icon-exclamation-circle-fill>
                </span>
                <span class="mr-2"
                    >Запас
                    <b-icon-check-circle-fill v-if="reserveKit.length >= 1" variant="success" class="mr-2">
                    </b-icon-check-circle-fill>
                    <b-icon-exclamation-circle-fill v-else variant="danger" class="mr-2">
                    </b-icon-exclamation-circle-fill>
                </span>
            </div>
            <div class="d-flex flex-row justify-content-start">
                <a class="badge badge-warning p-2 ml-3 mr-2" @click="onClickEdit"> Исправить </a>
                <a class="badge badge-dark p-2" @click="onClickDelete">Удалить </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "AdminKitCompilationPreview",
    props: ["kitCompilation"],
    computed: {
        generalKits() {
            return this.kitCompilation.kitList.filter((kit) => !kit.isReserve);
        },
        reserveKit() {
            return this.kitCompilation.kitList.filter((kit) => kit.isReserve);
        },
    },
    methods: {
        onClickEdit() {
            this.$emit("on-click-edit", this.kitCompilation.id);
        },
        onClickDelete() {
            this.$emit("on-click-delete", this.kitCompilation.id);
        },
    },
};
</script>

<style scoped></style>
