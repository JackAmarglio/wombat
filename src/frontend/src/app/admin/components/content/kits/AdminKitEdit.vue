<template>
    <div>
        <spinner v-if="dataIsLoading"></spinner>
        <admin-kit-input-form
            v-else
            :kit-editing-mode="true"
            :current-kit="currentKit"
            :is-reserve-kit-type="isReserveKitType"
            @onSubmit="editKit"
            @onReset="discardChanges"
        >
        </admin-kit-input-form>
    </div>
</template>

<script>
import AdminKitInputForm from "@/app/admin/components/content/kits/AdminKitInputForm";
import Spinner from "@/app/shared/components/Spinner";

import { KitsList, CurrentKit } from "@/app/admin/components/content/ContentMixins";
import { mapActions } from "vuex";

export default {
    name: "AdminKitEdit",

    components: { AdminKitInputForm, Spinner },
    data() {
        return {
            dataIsLoading: true,
        };
    },
    mixins: [KitsList, CurrentKit],

    async created() {
        await this.setCurrentKit(this.$route.params["id"]);
        this.dataIsLoading = false;
    },

    computed: {
        isReserveKitType() {
            return this.currentKit.isReserve;
        },
    },

    methods: {
        ...mapActions({
            updateKit: "admin/kits/updateKit",
        }),

        async editKit(kitInput) {
            this.dataIsLoading = true;
            await this.updateKit(kitInput);
            await this.refreshKitList();
            await this.$router.push({ name: "Kits" });
        },

        async discardChanges() {
            this.dataIsLoading = true;
            await this.refreshKitList();
            await this.$router.push({ name: "Kits" });
        },
    },
};
</script>

<style scoped></style>
