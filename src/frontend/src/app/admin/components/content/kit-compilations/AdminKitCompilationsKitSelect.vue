<template>
    <div class="ml-4 mr-4">
        <carousel :navigation-enabled="true" :pagination-enabled="false">
            <slide
                v-for="kit in kitsToChoose"
                :key="kit.id"
                @slide-click="handleKitSelected(kit)"
                style="cursor: pointer"
            >
                <admin-kit-preview
                    :kit="kit"
                    :questionsShortcut="kitQuestionsShortcut"
                    :editable="allowUpsertKits"
                    :deletable="allowUpsertKits"
                    :class="{ chosen: kit.isChosen }"
                    @on-click-edit="enterEditingPage"
                    @on-click-delete="deleteSelectedKit"
                >
                </admin-kit-preview>
            </slide>
        </carousel>
    </div>
</template>

<script>
import { Carousel, Slide } from "vue-carousel";
import AdminKitPreview from "@/app/admin/components/content/kits/AdminKitPreview";
import { KitsList, KitsListKitCRUD } from "@/app/admin/components/content/ContentMixins";

export default {
    name: "AdminKitCompilationsKitSelect",
    props: {
        kitsToChoose: {
            type: Array,
            required: true,
        },
        allowUpsertKits: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    components: {
        Carousel,
        Slide,
        AdminKitPreview,
    },

    mixins: [KitsList, KitsListKitCRUD],

    async mounted() {
        await this.refreshKitList();
        this.$forceUpdate();
    },

    methods: {
        handleKitSelected(kit) {
            this.$emit("onKitSelected", kit);
        },
    },
};
</script>

<style scoped>
.chosen {
    border: 1px #007bff solid;
    opacity: 0.4;
    background: #f8f9fa;
}
</style>
