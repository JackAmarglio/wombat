<template>
    <div>
        <div
            ref="header"
            class="col-12 pt-2 pb-3 d-flex flex-row justify-content-between align-content-center"
        >
            <h4 ref="header_label" style="float: left">Подборки комплектов</h4>
            <b-button ref="creation_button" variant="primary" @click="enterCreationPage">
                Новая подборка
            </b-button>
        </div>
        <section ref="kitCompilationsList" class="d-flex flex-wrap flex-row align-items-start flex-fill">
            <admin-kit-compilation-preview
                v-for="kitCompilation in kitCompilationsList"
                :key="kitCompilation.id"
                :kit-compilation="kitCompilation"
                @on-click-edit="enterEditingPage"
                @on-click-delete="deleteSelectedKitCompilation"
            >
            </admin-kit-compilation-preview>
        </section>
    </div>
</template>

<script>
import { mapActions } from "vuex";

import AdminKitCompilationPreview from "@/app/admin/components/content/kit-compilations/AdminKitCompilationPreview";
import { KitCompilationsList } from "@/app/admin/components/content/ContentMixins";

export default {
    name: "AdminKitCompilations",
    components: { AdminKitCompilationPreview },
    mixins: [KitCompilationsList],
    async mounted() {
        await this.refreshKitCompilationsList();
    },
    methods: {
        ...mapActions({
            deleteKitCompilation: "admin/kitCompilations/deleteKitCompilation",
        }),

        async enterCreationPage() {
            await this.$router.push({ name: "KitCompilationCreation" });
        },

        async enterEditingPage(kitCompilationId) {
            await this.$router.push({
                name: "KitCompilationEditing",
                params: { id: kitCompilationId },
            });
        },

        async deleteSelectedKitCompilation(kitCompilationId) {
            await this.deleteKitCompilation({ id: kitCompilationId });
            await this.refreshKitCompilationsList();
        },
    },
};
</script>

<style scoped></style>
