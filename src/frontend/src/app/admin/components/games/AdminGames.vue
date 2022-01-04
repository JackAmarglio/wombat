<template>
    <div class="list row">
        <div class="col-12 pt-2 pb-3 d-flex flex-row justify-content-between align-content center">
            <h4 style="float: left">Список игр</h4>
            <b-button type="button" v-b-toggle.input-form variant="primary" @click="enterCreationMode">
                <b-icon-plus> </b-icon-plus>
            </b-button>
        </div>

        <div class="col-md-6 col-sm-12 p-2">
            <ul id="list" class="list-group">
                <li
                    class="list-group-item"
                    :class="{ active: index === currentIndex, disabled: !generalMode }"
                    v-for="(game, index) in games"
                    :key="index"
                    @click="openItemDetails(game, index)"
                >
                    <h5 class="pt-2">{{ game.name }}</h5>
                    <div class="row">
                        <div class="ml-3">
                            <b-icon-person></b-icon-person>&nbsp;
                            {{ game.gameHostName == null ? "Не назначен" : game.gameHostName }}
                        </div>
                        <div class="ml-3">
                            <b-icon-file-text-fill variant="outline-primary"></b-icon-file-text-fill>&nbsp;
                            <span v-if="game.kitCompilationName == null">Нет подборки</span>
                            <span v-else
                                >{{ shortName(game.kitCompilationName) }}<br />
                                {{ bracketsDetails(game.kitCompilationName) }}</span
                            >
                        </div>
                    </div>
                </li>
            </ul>
            <div v-if="!games.length">Игр пока нет...</div>
        </div>

        <div class="col-md-6 col-sm-12">
            <!--todo: move to InputForm component-->
            <b-card id="input-form" v-if="creationMode || editingMode">
                <h4>
                    <span v-if="creationMode">
                        {{ creationLabel }}
                    </span>
                    {{ gameInput.name }}
                </h4>
                <b-form @submit="submitInputForm" @reset="resetInputForm">
                    <div class="pt-2 pb-3">
                        <label>
                            <strong>Название:</strong>
                        </label>
                        <b-form-input v-model="gameInput.name"> </b-form-input>
                    </div>
                    <div class="pb-3">
                        <label>
                            <strong>Ведущий:</strong>
                        </label>
                        <b-form-select v-model="gameInput.gameHost">
                            <b-form-select-option
                                class="p-1"
                                v-for="(gameHost, index) in gameHosts"
                                :key="index"
                                :value="gameHost"
                                >{{ gameHost.name }}
                            </b-form-select-option>
                        </b-form-select>
                    </div>
                    <div class="pb-3">
                        <label>
                            <strong>Подборка:</strong>
                        </label>
                        <b-form-select v-model="gameInput.kitCompilation">
                            <b-form-select-option
                                class="p-1"
                                v-for="(kitCompilation, index) in kitCompilationsList"
                                :key="index"
                                :value="kitCompilation"
                                >{{ kitCompilation.name }}
                            </b-form-select-option>
                        </b-form-select>
                    </div>
                    <b-button class="mr-2" type="submit" variant="primary"> Сохранить </b-button>
                    <b-button type="reset" variant="secondary"> Отмена </b-button>
                </b-form>
            </b-card>

            <AdminGameDetails
                v-if="currentGame !== {} && generalMode"
                @onClickRestart="restartSelectedGame"
                @onClickEdit="enterEditingMode"
                @onClickDelete="deleteSelectedGame"
                v-bind:isActive="currentGame.isActive"
            />

            <div v-if="generalMode && currentGame === {}">
                <br />
                <p>Выбери игру из списка слева</p>
            </div>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

import AdminGameDetails from "@/app/admin/components/games/AdminGameDetails";
import {
    KitCompilationNameSubstrings,
    KitCompilationsList,
} from "@/app/admin/components/content/ContentMixins";

const { mapState: mapGamesState, mapActions: mapGamesActions } = createNamespacedHelpers("admin/games");
const { mapState: mapGameHostsState, mapActions: mapGameHostsActions } =
    createNamespacedHelpers("admin/gameHosts");

export default {
    name: "AdminGames",
    components: {
        AdminGameDetails,
    },
    data() {
        return {
            generalMode: true,
            creationMode: false,
            editingMode: false,
            currentIndex: -1,
            creationLabel: "Новая игра",
            gameInput: {
                id: 0,
                name: "",
                gameHost: {
                    id: "",
                    name: "",
                },
                kitCompilation: {
                    id: 0,
                    name: "",
                    kitList: [],
                },
            },
        };
    },
    watch: {
        gameInput: {
            deep: true,
            handler(gameInput) {
                if (gameInput.name !== "") {
                    this.creationLabel = "";
                } else {
                    this.creationLabel = "Новая игра";
                }
            },
        },
    },

    mixins: [KitCompilationsList, KitCompilationNameSubstrings],

    async mounted() {
        //todo:add proper pagination when more items appear
        await this.fetchGames({ offset: 0, limit: 100 });
    },
    computed: {
        ...mapGamesState({
            games: (state) => state.all,
            currentGame: (state) => state.activeGame,
        }),

        ...mapGameHostsState({
            gameHosts: (state) => state.all,
        }),
    },

    methods: {
        ...mapGamesActions([
            "fetchGames",
            "createGame",
            "updateGame",
            "deleteGame",
            "restartGame",

            "fetchActiveGame",
            "updateActiveGame",
        ]),

        ...mapGameHostsActions(["fetchGameHosts"]),

        async openItemDetails(game, index) {
            this.currentIndex = index;
            await this.fetchActiveGame({ id: game.id });
        },

        async openNewItemDetails() {
            this.currentIndex = this.games.length - 1;
            const gameToFetch = this.games[this.currentIndex];
            await this.fetchActiveGame({
                id: gameToFetch.id,
            });
        },

        async openClosestItemDetails() {
            if (this.games[this.currentIndex]) {
                const gameToFetch = this.games[this.currentIndex];
                await this.fetchActiveGame({
                    id: gameToFetch.id,
                });
            } else {
                this.currentIndex--;
                const gameToFetch = this.games[this.currentIndex];
                await this.fetchActiveGame({
                    id: gameToFetch.id,
                });
            }
        },

        clearInputFields() {
            this.gameInput = {
                id: 0,
                name: "",
                gameHost: {
                    id: 0,
                    name: "",
                },
                kitCompilation: {
                    id: 0,
                    name: "",
                    kitList: [],
                },
            };
        },

        async prepareHostList() {
            if (!this.gameHosts.length) {
                await this.fetchGameHosts();
            }
        },

        async prepareKitCompilationList() {
            await this.refreshKitCompilationsList();
        },

        async enterCreationMode() {
            await this.prepareHostList();
            await this.prepareKitCompilationList();
            //hide details/text
            this.generalMode = false;
            this.clearInputFields();
            //show input component
            this.creationMode = true;
        },

        exitCreationMode() {
            this.clearInputFields();
            //may not open if unnecessary
            this.openNewItemDetails();
            //hide input form
            this.creationMode = false;
            //show newly open details
            this.generalMode = true;
        },

        async enterEditingMode() {
            await this.prepareHostList();
            await this.prepareKitCompilationList();
            //hide details/text
            this.generalMode = false;
            //fill input fields with current info
            await Object.assign(this.gameInput, this.currentGame);
            //show input component
            this.editingMode = true;
        },

        exitEditingMode() {
            //update details prop
            this.updateActiveGame(this.gameInput);
            this.clearInputFields();
            //hide input form
            this.editingMode = false;
            //show previously open details
            this.generalMode = true;
        },

        async submitInputForm(evt) {
            evt.preventDefault();
            if (this.creationMode) {
                //update list in store
                await this.createGame(this.gameInput);
                this.exitCreationMode();
            } else if (this.editingMode) {
                //update list in store
                await this.updateGame(this.gameInput);
                this.exitEditingMode();
            }
        },

        resetInputForm(evt) {
            evt.preventDefault();
            this.clearInputFields();
            //close input field
            this.creationMode = false;
            this.editingMode = false;
            //show previously open details/text
            this.generalMode = true;
        },

        async deleteSelectedGame() {
            //update list in store
            await this.deleteGame({ id: this.currentGame.id });
            //may not open if unnecessary
            await this.openClosestItemDetails();
        },

        async restartSelectedGame() {
            await this.restartGame({ gameId: this.currentGame.id });
            await this.fetchActiveGame({ id: this.currentGame.id });
        },
    },
};
</script>

<style scoped>
.list {
    text-align: left;
    max-width: 1200px;
    margin: auto;
}
</style>
