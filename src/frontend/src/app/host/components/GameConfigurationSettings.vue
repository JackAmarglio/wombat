<template>
    <b-card no-body style="padding: 0">
        <b-card-header><strong>Настройки</strong></b-card-header>
        <div
            id="settings"
            class="d-flex flex-row justify-content-center align-items-baseline"
            style="padding: 0"
        >
            <b-form @submit.prevent="sendData">
                <div
                    id="teams_in_round_settings"
                    class="mt-3 mb-3 ml-3 mr-3 d-flex flex-row justify-content-between align-items-center"
                    style="text-align: left"
                >
                    <label class="mb-0 mr-1">Сколько команд играет в раунде? </label>
                    <b-form-radio-group
                        id="teams-in-round-number"
                        class="mb-2"
                        v-model="gameSettingsInput.teamsInRoundNumber"
                    >
                        <b-form-radio
                            v-for="(option, index) in teamsInRoundOptions"
                            :key="index"
                            :value="option"
                        >
                            {{ option }}
                        </b-form-radio>
                    </b-form-radio-group>
                </div>
                <div>
                    <div
                        id="default_tries_amount_settings"
                        class="mt-3 mb-3 ml-3 mr-4 d-flex flex-row justify-content-between align-items-center"
                        style="text-align: left"
                    >
                        <label class="mr-sm-2">Стартовый капитал попыток: </label>
                        <b-form-input
                            id="default-extra-tries"
                            v-model="gameSettingsInput.defaultExtrasTries"
                            type="number"
                            number
                            :min="defaultExtrasTriesOptions.min"
                            :max="defaultExtrasTriesOptions.max"
                            class="col-2"
                        />
                    </div>
                    <div
                        id="tries_to_cell_difficulty_settings"
                        class="mt-3 mb-3 ml-3 mr-3 d-flex flex-column justify-content-start"
                    >
                        <label class="mb-1" for="tries" style="text-align: left"
                            >Сколько попыток стоит вопрос?</label
                        >
                        <div id="tries" class="d-flex flex-row justify-content-between">
                            <div
                                id="tries_for_easy"
                                class="row d-flex flex-row justify-content-center align-items-center"
                            >
                                <label class="mb-0 mr-1">Легкий: </label>
                                <b-form-input
                                    id="tries-easy"
                                    class="col-4"
                                    v-model="gameSettingsInput.triesToCellDifficulty.triesForEasy"
                                    number
                                    type="number"
                                    :min="triesToCellDifficultyOptions.min"
                                    :max="triesToCellDifficultyOptions.max"
                                />
                            </div>
                            <div
                                id="tries_for_medium"
                                class="d-flex flex-row justify-content-center align-items-center"
                            >
                                <label class="mb-0 mr-1">Средний: </label>
                                <b-form-input
                                    id="tries-medium"
                                    class="col-4"
                                    v-model="gameSettingsInput.triesToCellDifficulty.triesForMedium"
                                    number
                                    type="number"
                                    :min="triesToCellDifficultyOptions.min"
                                    :max="triesToCellDifficultyOptions.max"
                                />
                            </div>
                            <div
                                id="tries_for_hard"
                                class="d-flex flex-row justify-content-center align-items-center"
                            >
                                <label class="mb-0 mr-1">Сложный: </label>
                                <b-form-input
                                    id="tries-medium"
                                    class="col-4"
                                    v-model="gameSettingsInput.triesToCellDifficulty.triesForHard"
                                    number
                                    type="number"
                                    :min="triesToCellDifficultyOptions.min"
                                    :max="triesToCellDifficultyOptions.max"
                                />
                            </div>
                        </div>
                    </div>
                    <div
                        id="multiple_tries_in_tour_settings"
                        class="mt-3 mb-3 ml-3 mr-4 d-flex flex-column justify-content-start"
                    >
                        <div id="enable_multiple_tries" class="d-flex flex-row justify-content-between">
                            <label class="mb-0 mr-3">
                                Разрешить остальным отвечать в туре несколько раз
                            </label>
                            <b-form-checkbox
                                id="enable-multiple"
                                v-model="gameSettingsInput.multipleExtrasTriesInTour.enabled"
                                name="check-button"
                                switch
                            >
                            </b-form-checkbox>
                        </div>
                        <div
                            id="timer_for_extras_settings"
                            class="mt-3 d-flex flex-column justify-content-start"
                            v-if="gameSettingsInput.multipleExtrasTriesInTour.enabled"
                        >
                            <div class="d-flex flex-row justify-content-start align-items-center">
                                <label class="mb-1 mr-3">Ограничивать запуски таймера</label>
                                <b-form-checkbox
                                    id="restrict-timer"
                                    v-model="
                                        gameSettingsInput.multipleExtrasTriesInTour.timerSettings
                                            .restrictTimerLaunches
                                    "
                                    name="check-button"
                                    switch
                                >
                                </b-form-checkbox>
                            </div>
                            <div
                                class="d-flex flex-row justify-content-start align-items-center"
                                v-if="
                                    gameSettingsInput.multipleExtrasTriesInTour.timerSettings
                                        .restrictTimerLaunches
                                "
                            >
                                <label class="mb-1 mr-3">Максимум запусков: </label>
                                <b-form-input
                                    id="maxLaunches"
                                    class="col-2"
                                    v-model="
                                        gameSettingsInput.multipleExtrasTriesInTour.timerSettings
                                            .timerLaunchesLimit
                                    "
                                    number
                                    type="number"
                                    :min="timerLaunchesLimitOptions.min"
                                    :max="timerLaunchesLimitOptions.max"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <b-button
                    type="submit"
                    class="mb-4"
                    variant="primary"
                    :disabled="!gameSettingsInput.teamsInRoundNumber"
                >
                    Продолжить
                </b-button>
            </b-form>
        </div>
    </b-card>
</template>

<script>
import {
    DefaultGameSettings,
    DefaultTimerSettingsWithExtraTries,
} from "@/app/host/models/GameSettingsDataModels";

export default {
    name: "GameConfigurationSettings",
    data() {
        return {
            gameSettingsInput: {
                teamsInRoundNumber: null,
                defaultExtrasTries: null,
                triesToCellDifficulty: {
                    triesForEasy: null,
                    triesForMedium: null,
                    triesForHard: null,
                },
                multipleExtrasTriesInTour: {
                    enabled: null,
                    timerSettings: {
                        restrictTimerLaunches: null,
                        timerLaunchesLimit: null,
                    },
                },
            },
            teamsInRoundOptions: [3, 4],
            defaultExtrasTriesOptions: {
                min: 2,
                max: 36,
            },
            triesToCellDifficultyOptions: {
                min: 0,
                max: 10,
            },
            timerLaunchesLimitOptions: {
                min: 3,
                max: 8,
            },
        };
    },

    created() {
        this.setDefaultGameSettings();
    },

    computed: {
        teamsInRoundNumber() {
            return this.gameSettingsInput.teamsInRoundNumber;
        },

        multipleExtrasTriesEnabled() {
            return this.gameSettingsInput.multipleExtrasTriesInTour.enabled;
        },
        timerSettings: {
            get() {
                return this.gameSettingsInput.multipleExtrasTriesInTour.timerSettings;
            },
            set(newValue) {
                Object.assign(this.gameSettingsInput.multipleExtrasTriesInTour.timerSettings, newValue);
            },
        },
        timerLaunchesRestricted() {
            return this.gameSettingsInput.multipleExtrasTriesInTour.timerSettings.restrictTimerLaunches;
        },
    },
    watch: {
        teamsInRoundNumber: {
            handler(newVal) {
                if (this.timerLaunchesRestricted === false) {
                    this.timerSettings = this.getTimerSettings(this.timerLaunchesRestricted);
                }
                switch (newVal) {
                    case 3:
                        this.gameSettingsInput.defaultExtrasTries = 2;
                        break;
                    case 4:
                        this.gameSettingsInput.defaultExtrasTries = 3;
                        break;
                }
            },
        },
        multipleExtrasTriesEnabled: {
            deep: true,
            handler(newVal) {
                this.timerSettings = this.getTimerSettings(newVal);
            },
        },
        timerLaunchesRestricted: {
            handler(newVal) {
                this.timerSettings = this.getTimerSettings(newVal);
            },
        },
    },
    methods: {
        sendData() {
            console.log(this.gameSettingsInput);
            this.$emit("onClickSendData", this.gameSettingsInput);
        },

        beforeDestroy() {
            this.setDefaultGameSettings();
        },

        getTimerSettings(restrictTimerLaunches) {
            if (restrictTimerLaunches === true) return DefaultTimerSettingsWithExtraTries;
            else
                return {
                    restrictTimerLaunches: false,
                    timerLaunchesLimit: this.teamsInRoundNumber - 1,
                };
        },

        setDefaultGameSettings() {
            Object.assign(this.gameSettingsInput, DefaultGameSettings);
        },
    },
};
</script>

<style scoped></style>
