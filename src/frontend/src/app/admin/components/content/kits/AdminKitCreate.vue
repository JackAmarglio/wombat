<template>
    <div>
        <spinner v-if="dataIsLoading"></spinner>
        <admin-kit-input-form
            :is-reserve-kit-type="isReserveKitType"
            @onSubmit="addKit"
            @onReset="discardChanges"
        >
        </admin-kit-input-form>
    </div>
</template>

<script>
import { mapActions } from "vuex";

import AdminKitInputForm from "@/app/admin/components/content/kits/AdminKitInputForm";
import Spinner from "@/app/shared/components/Spinner";
import { KitsList } from "@/app/admin/components/content/ContentMixins";

export default {
    name: "AdminKitCreate",

    components: { AdminKitInputForm, Spinner },

    mixins: [KitsList],

    data() {
        return {
            dataIsLoading: true,
            isReserveKitType: false,
        };
    },

    async created() {
        this.isReserveKitType = this.$route.params["isReserveKitType"];
        this.dataIsLoading = false;
    },

    methods: {
        ...mapActions({
            createKit: "admin/kits/createKit",
        }),

        async addKit(kitInput) {
            this.dataIsLoading = true;
            await this.createKit(kitInput);
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
