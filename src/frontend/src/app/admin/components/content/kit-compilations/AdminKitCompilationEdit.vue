<template>
    <spinner v-if="dataIsLoading"></spinner>
    <admin-kit-compilation-input-form
        v-else
        :compilation-editing-mode="true"
        :current-compilation="currentKitCompilation"
        @onSubmit="editKitCompilation"
        @onReset="discardChanges"
    >
    </admin-kit-compilation-input-form>
</template>

<script>
import { mapActions } from "vuex";

import AdminKitCompilationInputForm from "@/app/admin/components/content/kit-compilations/AdminKitCompilationInputForm";
import { KitCompilationsList, CurrentKitCompilation } from "@/app/admin/components/content/ContentMixins";
import Spinner from "@/app/shared/components/Spinner";

export default {
    name: "AdminKitCompilationEdit",
    components: { AdminKitCompilationInputForm, Spinner },
    data() {
        return {
            dataIsLoading: true,
        };
    },
    mixins: [KitCompilationsList, CurrentKitCompilation],

    async created() {
        await this.setCurrentKitCompilation(this.$route.params["id"]);
        this.dataIsLoading = false;
    },

    methods: {
        ...mapActions({
            updateKitCompilation: "admin/kitCompilations/updateKitCompilation",
        }),

        async editKitCompilation(kitCompilationInput) {
            this.dataIsLoading = true;
            await this.updateKitCompilation(kitCompilationInput);
            await this.refreshKitCompilationsList();
            await this.$router.push({ name: "KitCompilations" });
        },

        async discardChanges() {
            this.dataIsLoading = true;
            await this.refreshKitCompilationsList();
            await this.$router.push({ name: "KitCompilations" });
        },
    },
};
</script>

<style scoped></style>
