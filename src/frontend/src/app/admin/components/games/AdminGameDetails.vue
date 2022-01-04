<template>
    <b-card v-if="currentGame.name">
        <div class="d-flex flex-row justify-content-between">
            <div>
                <h4>{{ currentGame.name }}</h4>
            </div>
            <div>
                <a v-if="isActive" class="badge badge-danger p-2 mr-2" @click="resetGame">Перезапустить</a>
                <a class="badge badge-warning p-2 mr-2" @click="enterEditingMode">Исправить</a>
                <a class="badge badge-dark p-2" @click="deleteSelectedGame">Удалить</a>
            </div>
        </div>
        <div class="pt-2">
            <div class="pb-2">
                <label><strong>Подборка:</strong></label>
                <p v-if="currentGame.kitCompilation == null">Нет подборки</p>
                <p v-else>
                    {{ shortName(currentGame.kitCompilation.name) }}<br />
                    {{ bracketsDetails(currentGame.kitCompilation.name) }}
                </p>
            </div>
            <label>
                <strong>Код доступа ведущего:</strong>
            </label>
            <p>{{ currentGame.hostAccessCode }}</p>
        </div>
    </b-card>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

import { KitCompilationNameSubstrings } from "@/app/admin/components/content/ContentMixins";

const { mapState } = createNamespacedHelpers("admin/games");

export default {
    name: "AdminGameDetails",
    props: {
        isActive: Boolean,
    },
    mixins: [KitCompilationNameSubstrings],
    computed: {
        ...mapState({
            currentGame: (state) => state.activeGame,
        }),
    },
    methods: {
        resetGame() {
            this.$emit("onClickRestart");
        },
        enterEditingMode() {
            this.$emit("onClickEdit");
        },
        deleteSelectedGame() {
            this.$emit("onClickDelete");
        },
    },
};
</script>
