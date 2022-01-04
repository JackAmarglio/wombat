<template>
    <div
        id="input-form"
        v-if="compilationCreationMode || compilationEditingMode"
        @submit="submitCompilationInputForm"
        @reset="resetCompilationInputForm"
    >
        <spinner v-if="dataIsLoading"> </spinner>
        <div ref="input_form_card" v-else class="input-form card">
            <div ref="name_+_main_form_controls" class="row header p-3">
                <strong
                    ref="kit_compilation_name_input"
                    class="ml-3 pt-2 pb-2 col-6 d-flex flex-row align-items-center"
                    style="text-align: left"
                >
                    <b-form-input v-if="nameInputActive" v-model="kitCompilationInput.name"> </b-form-input>
                    <span v-else>{{ kitCompilationInput.name }} </span>
                    <span>
                        <b-icon-pencil-fill
                            class="ml-3 inline"
                            :style="{ color: nameInputActive ? '#f8f9fa' : '#007bff' }"
                            @click="toggleNameInputField"
                        >
                        </b-icon-pencil-fill>
                    </span>
                </strong>
                <div class="d-flex flex-row justify-content-end align-items-center">
                    <b-button
                        ref="discard_changes"
                        class="mr-2"
                        type="reset"
                        variant="secondary"
                        @click="resetCompilationInputForm"
                    >
                        <!--Those in parent container won't work (same code in KitInputForm and no problems tho)-->
                        Отмена
                    </b-button>
                    <b-button
                        ref="save_kit"
                        class="mr-4"
                        type="submit"
                        variant="primary"
                        :disabled="!formReadyToSubmit"
                        @click="submitCompilationInputForm"
                    >
                        <!--Those in parent container won't work-->
                        Сохранить
                    </b-button>
                </div>
            </div>
            <b-tabs pills align="center" active-nav-item-class="text-primary bg-light" content-class="mt-3">
                <b-tab title="Раунды" variant="info" @click="showGeneralKitsInputStage">
                    <div ref="table-wrapper" class="ml-4 mr-4 mb-3">
                        <table ref="general-chosen" class="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">№</th>
                                    <th scope="col">Имя</th>
                                    <th scope="col">Сложные</th>
                                    <th scope="col">Средние</th>
                                    <th scope="col">Легкие</th>
                                    <th scope="col">
                                        <b-icon-trash-fill></b-icon-trash-fill>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(kit, index) in kitListInputManager.generalKits" :key="kit.id">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>{{ shortName(kit.name) }}</td>
                                    <td>{{ firstQuestionBlockFromName(kit.name) }}</td>
                                    <td>{{ mediumQuestionBlockFromName(kit.name) }}</td>
                                    <td>{{ lastQuestionBlockFromName(kit.name) }}</td>
                                    <td>
                                        <b-icon-trash @click="removeFromKitList(kit)"></b-icon-trash>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <hr />
                    <admin-kit-compilations-kit-select
                        :kits-to-choose="generalKitsToChooseFrom"
                        :allow-upsert-kits="allowUpsertKitsFromCompilation"
                        @onKitSelected="toggleAddToKitList"
                    >
                    </admin-kit-compilations-kit-select>
                </b-tab>
                <b-tab title="Запас" @click="showReserveKitsInputStage">
                    <div ref="table-wrapper" class="ml-4 mr-4 mb-3">
                        <table ref="general-chosen" class="table table-bordered">
                            <thead>
                                <tr>
                                    <th scope="col">№</th>
                                    <th scope="col">Имя</th>
                                    <th scope="col">Средние</th>
                                    <th scope="col">Легкие</th>
                                    <th scope="col">
                                        <b-icon-trash-fill></b-icon-trash-fill>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(kit, index) in kitListInputManager.reserveKits" :key="kit.id">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>{{ shortName(kit.name) }}</td>
                                    <td>{{ firstQuestionBlockFromName(kit.name) }}</td>
                                    <td>{{ lastQuestionBlockFromName(kit.name) }}</td>
                                    <td>
                                        <b-icon-trash @click="removeFromKitList(kit)"></b-icon-trash>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <hr />
                    <admin-kit-compilations-kit-select
                        :kits-to-choose="reserveKitsToChooseFrom"
                        :allow-upsert-kits="allowUpsertKitsFromCompilation"
                        @onKitSelected="toggleAddToKitList"
                    >
                    </admin-kit-compilations-kit-select>
                </b-tab>
            </b-tabs>
        </div>
    </div>
</template>

<script>
import last from "lodash.last";

import { KitListInputManager } from "@/app/admin/models/content/kit-compilations/KitCompilationInput";
import { KitCompilationInputStageOptions } from "@/app/admin/models/content/kit-compilations/KitCompilationInputStageOptions";
import KitsDataService from "@/app/admin/services/content/KitsDataService";
import {
    KitCompilationsList,
    KitNameSubstrings,
    KitsFiltering,
    KitsList,
} from "@/app/admin/components/content/ContentMixins";

export default {
    name: "AdminKitCompilationInputForm",
    components: {
        AdminKitCompilationsKitSelect: () =>
            import("@/app/admin/components/content/kit-compilations/AdminKitCompilationsKitSelect"),
        Spinner: () => import("@/app/shared/components/Spinner"),
    },

    props: {
        currentCompilation: {
            type: Object,
            required: false,
        },
        compilationCreationMode: {
            type: Boolean,
            required: false,
            default: false,
        },
        compilationEditingMode: {
            type: Boolean,
            required: false,
            default: false,
        },
    },

    data() {
        return {
            //contains this.kitsList from KitsList mixin but kits with isChosen field
            extendedKitsList: [],
            //aka formSteps in KitInputForm
            kitListInputManager: {},
            //aka activeStep in KitInputForm
            inputStage: "",
            kitCompilationInput: {
                id: 0,
                name: "",
                kitList: [],
            },
            allowUpsertKitsFromCompilation: false,
            nameInputActive: false,
            creationLabel: "Новая подборка",
            dataIsLoading: true,
        };
    },

    mixins: [KitCompilationsList, KitsList, KitsFiltering, KitNameSubstrings],

    watch: {
        kitCompilationInput: {
            deep: true,
            handler(kitCompilationInput) {
                if (kitCompilationInput.name === "" && !this.nameInputActive) {
                    this._setCompilationDefaultName();
                }
            },
        },
    },

    async mounted() {
        this._setGeneralKitsInputStage();
        await this.setKitListInputManager();
        if (this.compilationCreationMode) {
            this._setCompilationDefaultName();
        }
        if (this.compilationEditingMode) {
            await this.prefillCompilationInput();
        }
        await this.fetchKitsForInputStage();
        await this.setExtendedKitsList();
        if (this.compilationEditingMode) {
            await this.presetChosenKitsInKitListToChooseFrom();
        }
        this.dataIsLoading = false;
    },

    computed: {
        generalKitsToChooseFrom() {
            return this.extendedKitsList.filter((kit) => !kit.isReserve);
        },
        reserveKitsToChooseFrom() {
            return this.extendedKitsList.filter((kit) => kit.isReserve);
        },
        formReadyToSubmit() {
            return (
                this.kitListInputManager.generalKits.length >= this.kitListInputManager.generalKitsMinimum &&
                this.kitListInputManager.reserveKits.length >= this.kitListInputManager.reserveKitsMinimum
            );
        },
    },

    methods: {
        _setCompilationDefaultName() {
            this.kitCompilationInput.name = this.creationLabel;
        },

        toggleNameInputField() {
            this.nameInputActive = !this.nameInputActive;
        },

        async showGeneralKitsInputStage() {
            this._setGeneralKitsInputStage();
            await this.fetchKitsForInputStage();
            await this.setExtendedKitsList();
            if (this.compilationEditingMode) {
                await this.presetChosenKitsInKitListToChooseFrom();
            }
        },

        async showReserveKitsInputStage() {
            this._setReserveKitsInputStage();
            await this.fetchKitsForInputStage();
            await this.setExtendedKitsList();
            if (this.compilationEditingMode) {
                await this.presetChosenKitsInKitListToChooseFrom();
            }
        },

        _setGeneralKitsInputStage() {
            this.inputStage = KitCompilationInputStageOptions.GeneralKits;
        },

        _setReserveKitsInputStage() {
            this.inputStage = KitCompilationInputStageOptions.ReserveKits;
        },

        async fetchKitsForInputStage() {
            switch (this.inputStage) {
                case KitCompilationInputStageOptions.GeneralKits:
                    await this.fetchFilteredKits(this.filterKitsOptions.General);
                    break;
                case KitCompilationInputStageOptions.ReserveKits:
                    await this.fetchFilteredKits(this.filterKitsOptions.Reserve);
                    break;
            }
        },

        setKitListInputManager() {
            this.kitListInputManager = KitListInputManager;
        },

        //Adds isChosen field to kits in carousel
        async setExtendedKitsList() {
            this.extendedKitsList = await KitsDataService.prepareKitListForCompilations(this.kitsList);
        },

        //Editing mode: adds kits from current compilation to local compilation input
        async prefillCompilationInput() {
            await this._assignCompilationInput();
            this.prefillKitListManagerFromCompilationInput();
        },

        //Helper to above
        async _assignCompilationInput() {
            this.kitCompilationInput = {
                id: this.currentCompilation.id,
                name: this.currentCompilation.name,
                kitList: this.currentCompilation.kitList,
            };
        },

        //Editing mode: adds general and reserve kits to separate lists in kitListInputManager
        prefillKitListManagerFromCompilationInput() {
            this.kitListInputManager.generalKits = this.currentCompilation.kitList.filter(
                (kit) => !kit.isReserve
            );
            this.kitListInputManager.reserveKits = this.currentCompilation.kitList.filter(
                (kit) => kit.isReserve
            );
        },

        //Checks whether kit is already added to dedicated list in kitListInputManager
        existsInKitList(kit) {
            switch (this.inputStage) {
                case KitCompilationInputStageOptions.GeneralKits:
                    return this.kitListInputManager.generalKits.some((k) => k.id === kit.id);
                case KitCompilationInputStageOptions.ReserveKits:
                    return this.kitListInputManager.reserveKits.some((k) => k.id === kit.id);
            }
        },

        //Toggles isChosen field in chosen kits in carousel
        presetChosenKitsInKitListToChooseFrom() {
            switch (this.inputStage) {
                case KitCompilationInputStageOptions.GeneralKits:
                    this.kitCompilationInput.kitList.forEach((kit) => {
                        if (!kit.isReserve) this.extendedKitsList.find((k) => k.id === kit.id).isChosen = true;
                    });
                    break;
                case KitCompilationInputStageOptions.ReserveKits:
                    this.kitCompilationInput.kitList.forEach((kit) => {
                        if (kit.isReserve) this.extendedKitsList.find((k) => k.id === kit.id).isChosen = true;
                    });
                    break;
            }
        },

        //Toggler for below
        toggleAddToKitList(kit) {
            this.existsInKitList(kit) ? this.removeFromKitList(kit) : this.addToKitList(kit);
        },

        //Removes kit from dedicated list in kitListInputManager
        //Toggles isChosen field in dedicated kit in carousel
        removeFromKitList(kit) {
            this.extendedKitsList.find((k) => k.id === kit.id).isChosen = false;
            switch (this.inputStage) {
                case KitCompilationInputStageOptions.GeneralKits:
                    this.kitListInputManager.generalKits.splice(
                        this.kitListInputManager.generalKits.findIndex((k) => k.id === kit.id),
                        1
                    );
                    break;
                case KitCompilationInputStageOptions.ReserveKits:
                    this.kitListInputManager.reserveKits.splice(
                        this.kitListInputManager.reserveKits.findIndex((k) => k.id === kit.id),
                        1
                    );
                    break;
            }
        },

        //Adds kit to dedicated list in kitListInputManager
        //Toggles isChosen field in dedicated kit in carousel
        addToKitList(kit) {
            this.extendedKitsList.find((k) => k.id === kit.id).isChosen = true;
            switch (this.inputStage) {
                case KitCompilationInputStageOptions.GeneralKits:
                    this.kitListInputManager.generalKits.push(kit);
                    break;

                case KitCompilationInputStageOptions.ReserveKits:
                    this.kitListInputManager.reserveKits.push(kit);
                    break;
            }
        },

        //sets safe name and kit list, emits event, clears everything
        submitCompilationInputForm(evt) {
            evt.preventDefault();
            this._setCompilationSafeName();
            this._setCompilationKitList();
            this.$emit("onSubmit", this.kitCompilationInput);
            this.clearEverything();
        },

        //Extends compilation name with kit short names in brackets
        _setCompilationSafeName() {
            if (this.kitCompilationInput.name.includes("|")) {
                this.kitCompilationInput.name = this.shortName(this.kitCompilationInput.name);
            }
            let KitNames = "(";
            this.kitListInputManager.generalKits.forEach((kit) => {
                kit.id !== last(this.kitListInputManager.generalKits).id
                    ? (KitNames += this.shortName(kit.name) + ", ")
                    : (KitNames += this.shortName(kit.name) + " | ");
            });
            this.kitListInputManager.reserveKits.forEach((kit) => {
                kit.id !== last(this.kitListInputManager.reserveKits).id
                    ? (KitNames += this.shortName(kit.name) + ", ")
                    : (KitNames += this.shortName(kit.name) + ")");
            });
            this.kitCompilationInput.name += " ";
            this.kitCompilationInput.name += KitNames;
        },

        //Clears input (!) and puts data from input manager
        _setCompilationKitList() {
            this.kitCompilationInput.kitList = [];
            this.kitCompilationInput.kitList = [
                ...this.kitCompilationInput.kitList,
                ...this.kitListInputManager.generalKits,
                ...this.kitListInputManager.reserveKits,
            ];
        },

        //emits event, clears everything
        resetCompilationInputForm(evt) {
            evt.preventDefault();
            this.$emit("onReset", this.kitCompilationInput);
            this.clearEverything();
        },

        clearEverything() {
            this._clearKitListInputManager();
            this._clearKitCompilationInput();
            this.extendedKitsList = [];
            this.allowUpsertKitsFromCompilation = false;
            this.nameInputActive = false;
            this.creationLabel = "Новая подборка";
            this.dataIsLoading = true;
        },

        _clearKitListInputManager() {
            this.kitListInputManager.generalKits = [];
            this.kitListInputManager.reserveKits = [];
        },

        _clearKitCompilationInput() {
            this.kitCompilationInput = {
                id: 0,
                name: "",
                kitList: [],
            };
        },
    },
};
</script>

<style scoped lang="scss">
@mixin flexbox() {
    display: flex;
    justify-content: center;
    align-items: center;
}

.input-form {
    width: 100%;
    min-height: 100%;
    position: relative;
}

.row {
    justify-content: flex-start;
    margin: 0 0;
}

.header {
    justify-content: space-between;
}

.chosen {
    border: 1px #007bff solid;
    opacity: 0.4;
    background: #f8f9fa;
}
</style>
