<template>
    <div>
        <spinner v-if="dataIsLoading"></spinner>
        <admin-kit-compilation-input-form
            :compilation-creation-mode="true"
            @onSubmit="addKitCompilation"
            @onReset="discardChanges"
        >
        </admin-kit-compilation-input-form>
    </div>
</template>

<script>
import { mapActions } from "vuex";

import AdminKitCompilationInputForm from "@/app/admin/components/content/kit-compilations/AdminKitCompilationInputForm";
import Spinner from "@/app/shared/components/Spinner";
import { KitCompilationsList } from "@/app/admin/components/content/ContentMixins";

export default {
    name: "AdminKitCompilationCreate",

    components: { AdminKitCompilationInputForm, Spinner },

    mixins: [KitCompilationsList],

    data() {
        return {
            dataIsLoading: true,
        };
    },

    async created() {
        this.dataIsLoading = false;
    },

    methods: {
        ...mapActions({
            createKitCompilation: "admin/kitCompilations/createKitCompilation",
        }),

        async addKitCompilation(kitCompilationInput) {
            this.dataIsLoading = true;
            await this.createKitCompilation(kitCompilationInput);
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
