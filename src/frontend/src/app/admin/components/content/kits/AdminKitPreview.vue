<template>
    <div
        class="m-2 card d-flex flex-column justify-content-start"
        :style="{
            border: kit.isReserve ? '2px #5bc0de solid' : '1px solid rgba( 0, 0, 0, 0.125 )',
        }"
    >
        <div class="card-header d-flex flex-fill flex-wrap flex-row justify-content-start align-items-center">
            <strong>{{ kit.name }}</strong>
            <div v-if="kit.isReserve" class="ml-3 badge badge-info">Запас</div>
        </div>
        <div class="p-4 d-flex flex-fill flex-wrap flex-row justify-content-between">
            <div class="d-flex flex-row justify-content-start align-content-center">
                <span class="mr-2" v-if="showAllQuestionsAmount"
                    >{{ kit.questionsNumber }} вопросов
                    <b-icon-check-circle-fill v-if="kitSizeChecked" variant="success">
                    </b-icon-check-circle-fill>
                    <b-icon-exclamation-circle-fill v-else variant="danger"> </b-icon-exclamation-circle-fill>
                </span>
                <span class="mr-2" v-if="showQuestionsAmountByDifficulty">
                    <span ref="hard_checked" class="mr-2">
                        {{ kit.questionsAmount.hard }} сложных
                        <b-icon-check-circle-fill v-if="hardChecked" variant="success">
                        </b-icon-check-circle-fill>
                        <b-icon-exclamation-circle-fill v-else variant="danger">
                        </b-icon-exclamation-circle-fill>
                    </span>
                    <span ref="medium_checked" class="mr-2">
                        {{ kit.questionsAmount.medium }} средних
                        <b-icon-check-circle-fill v-if="mediumChecked" variant="success">
                        </b-icon-check-circle-fill>
                        <b-icon-exclamation-circle-fill v-else variant="danger">
                        </b-icon-exclamation-circle-fill>
                    </span>
                    <span ref="easy_checked" class="mr-2">
                        {{ kit.questionsAmount.easy }} легких
                        <b-icon-check-circle-fill v-if="easyChecked" variant="success">
                        </b-icon-check-circle-fill>
                        <b-icon-exclamation-circle-fill v-else variant="danger">
                        </b-icon-exclamation-circle-fill>
                    </span>
                </span>
            </div>
            <div class="d-flex flex-row justify-content-start">
                <a v-if="editable" class="badge badge-warning p-2 ml-3 mr-2" @click="onClickEdit">
                    Исправить
                </a>
                <a v-if="deletable" class="badge badge-dark p-2" @click="onClickDelete">Удалить </a>
            </div>
        </div>
    </div>
</template>

<script>
import { HumbleKitQuestionsShortcutOptions } from "@/app/admin/models/content/shared/HumbleKitQuestionsShortcutOptions";
import {
    GeneralKitQuestionsAmount,
    ReserveKitQuestionsAmount,
    AllKitQuestionsAmount,
} from "@/app/admin/models/content/shared/KitQuestionsAmount";

export default {
    name: "AdminKitPreview",
    props: {
        kit: {
            type: Object,
            required: true,
        },
        questionsShortcut: {
            type: Number,
            required: true,
        },
        editable: {
            type: Boolean,
            required: false,
            default: true,
        },
        deletable: {
            type: Boolean,
            required: false,
            default: true,
        },
    },
    computed: {
        showAllQuestionsAmount() {
            return this.questionsShortcut === HumbleKitQuestionsShortcutOptions.AllQuestionsAmount;
        },
        showQuestionsAmountByDifficulty() {
            return this.questionsShortcut === HumbleKitQuestionsShortcutOptions.AmountByDifficulty;
        },
        kitSizeChecked() {
            if (this.showAllQuestionsAmount) return this.kit.questionsAmount === AllKitQuestionsAmount;
            else return undefined;
        },
        easyChecked() {
            if (this.showQuestionsAmountByDifficulty)
                return this.kit.isReserve
                    ? this.kit.questionsAmount.easy === ReserveKitQuestionsAmount.Easy
                    : this.kit.questionsAmount.easy === GeneralKitQuestionsAmount.Easy;
            else return undefined;
        },
        mediumChecked() {
            if (this.showQuestionsAmountByDifficulty)
                return this.kit.isReserve
                    ? this.kit.questionsAmount.medium === ReserveKitQuestionsAmount.Medium
                    : this.kit.questionsAmount.medium === GeneralKitQuestionsAmount.Medium;
            else return undefined;
        },
        hardChecked() {
            if (this.showQuestionsAmountByDifficulty)
                return this.kit.isReserve
                    ? this.kit.questionsAmount.hard === ReserveKitQuestionsAmount.Hard
                    : this.kit.questionsAmount.hard === GeneralKitQuestionsAmount.Hard;
            else return undefined;
        },
    },
    methods: {
        onClickEdit() {
            this.$emit("on-click-edit", this.kit.id);
        },
        onClickDelete() {
            this.$emit("on-click-delete", this.kit.id);
        },
    },
};
</script>

<style scoped></style>
