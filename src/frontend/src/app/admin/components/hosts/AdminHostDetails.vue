<template>
    <b-card>
        <div class="d-flex flex-row justify-content-between">
            <div>
                <h4>{{ currentGameHost.name }}</h4>
            </div>
            <div>
                <a class="badge badge-warning p-2 mr-2" @click="enterEditingMode">Исправить</a>
                <a class="badge badge-dark p-2" @click="deleteSelectedGameHost">Удалить</a>
            </div>
        </div>
        <div class="pt-2 pb-3">
            <label><strong>Имя:</strong></label>
            <p>{{ currentGameHost.name }}</p>
        </div>
    </b-card>
</template>

<script>
export default {
    name: "AdminHostDetails",
    props: {
        currentGameHost: Object,
    },

    methods: {
        enterEditingMode() {
            this.$emit("onClickEdit");
        },
        deleteSelectedGameHost() {
            this.$emit("onClickDelete");
        },
    },
};
</script>

<style scoped></style>
