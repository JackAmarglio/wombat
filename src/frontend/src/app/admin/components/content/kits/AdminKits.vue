<template>
    <div>
        <div
            ref="header"
            class="col-12 pt-2 pb-3 d-flex flex-row justify-content-between align-content-center"
        >
            <h4 ref="header_label" style="float: left">Комплекты вопросов</h4>
            <div class="d-flex flex-row justify-content-right align-items-center">
                <b-dropdown
                    ref="questions_to_show"
                    class="mr-3"
                    variant="outline-secondary"
                    :text="filterKits"
                    @toggle="toggleTooltip"
                >
                    <b-dropdown-item @click="showFilteredKits(filterKitsOptions.All)">
                        {{ filterKitsOptions.All }}
                    </b-dropdown-item>
                    <b-dropdown-item @click="showFilteredKits(filterKitsOptions.General)">
                        {{ filterKitsOptions.General }}
                    </b-dropdown-item>
                    <b-dropdown-item @click="showFilteredKits(filterKitsOptions.Reserve)">
                        {{ filterKitsOptions.Reserve }}
                    </b-dropdown-item>
                </b-dropdown>
                <b-dropdown ref="creation_button" right variant="primary" text="Создать новый">
                    <b-dropdown-item @click="enterCreationPage(false)">
                        {{ kitInputTypeOptions.General }}
                    </b-dropdown-item>
                    <b-dropdown-item @click="enterCreationPage(true)">
                        {{ kitInputTypeOptions.Reserve }}
                    </b-dropdown-item>
                </b-dropdown>
            </div>
        </div>
        <section ref="kitsList" class="d-flex flex-wrap flex-row align-items-start flex-fill">
            <admin-kit-preview
                v-for="kit in kitsList"
                :key="kit.id"
                :kit="kit"
                :questionsShortcut="kitQuestionsShortcut"
                @on-click-edit="enterEditingPage"
                @on-click-delete="deleteSelectedKit"
            >
            </admin-kit-preview>
        </section>
    </div>
</template>

<script>
import AdminKitPreview from "@/app/admin/components/content/kits/AdminKitPreview";
import { KitInputTypeOptions } from "@/app/admin/models/content/kits/KitInputTypeOptions";
import {
    KitsList,
    KitsListKitCRUD,
    KitsFiltering,
    KitsFilterDropdown,
} from "@/app/admin/components/content/ContentMixins";

export default {
    name: "AdminKits",
    components: { AdminKitPreview },
    data() {
        return {
            kitInputTypeOptions: KitInputTypeOptions,
        };
    },
    mixins: [KitsList, KitsListKitCRUD, KitsFiltering, KitsFilterDropdown],
    async mounted() {
        await this.showFilteredKits(this.filterKitsOptions.General);
    },
};
</script>

<style scoped></style>
