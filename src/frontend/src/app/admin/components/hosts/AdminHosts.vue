<template>
    <div class="list row">
        <div class="col-12 pt-2 pb-3 d-flex flex-row justify-content-between align-content center">
            <h4 style="float: left">Список ведущих</h4>
            <b-button type="button" v-b-toggle.input-form variant="primary" @click="enterCreationMode">
                <b-icon-plus> </b-icon-plus>
            </b-button>
        </div>

        <div class="col-md-6 col-sm-12 p-2">
            <ul id="list" class="list-group">
                <li
                    class="list-group-item"
                    :class="{ active: index === currentIndex, disabled: !generalMode }"
                    v-for="(gameHost, index) in gameHosts"
                    :key="index"
                    @click="openItemDetails(gameHost, index)"
                >
                    {{ gameHost.name }}
                </li>
            </ul>
            <div v-if="!gameHosts.length">Ведущих пока нет...</div>
        </div>

        <div class="col-md-6 col-sm-12">
            <!--todo: move to InputForm component-->
            <b-card id="input-form" v-if="creationMode || editingMode">
                <h4>
                    <span v-if="creationMode">
                        {{ creationLabel }}
                    </span>
                    {{ gameHostInput.name }}
                </h4>
                <b-form @submit="submitInputForm" @reset="resetInputForm">
                    <div class="pt-2 pb-3">
                        <label>
                            <strong>Имя:</strong>
                        </label>
                        <b-form-input v-model="gameHostInput.name"> </b-form-input>
                    </div>
                    <b-button class="mr-2" type="submit" variant="primary"> Сохранить </b-button>
                    <b-button type="reset" variant="secondary"> Отмена </b-button>
                </b-form>
            </b-card>

            <admin-host-details
                v-if="currentGameHost && generalMode"
                :currentGameHost="currentGameHost"
                @onClickEdit="enterEditingMode"
                @onClickDelete="deleteSelectedGameHost"
            />

            <div v-if="generalMode && !currentGameHost">
                <br />
                <p>Выбери ведущего из списка слева</p>
            </div>
        </div>
    </div>
</template>

<script>
import { createNamespacedHelpers } from "vuex";

import AdminHostDetails from "@/app/admin/components/hosts/AdminHostDetails";

const { mapState, mapActions } = createNamespacedHelpers("admin/gameHosts");

export default {
    name: "AdminHosts",
    components: {
        AdminHostDetails,
    },
    data() {
        return {
            generalMode: true,
            creationMode: false,
            editingMode: false,
            currentIndex: -1,
            currentGameHost: undefined,
            creationLabel: "Новый ведущий",
            gameHostInput: {
                id: 0,
                name: "",
            },
        };
    },
    watch: {
        gameHostInput: {
            deep: true,
            handler(gameHostInput) {
                if (gameHostInput.name !== "") {
                    this.creationLabel = "";
                } else {
                    this.creationLabel = "Новый ведущий";
                }
            },
        },
    },
    async mounted() {
        return await this.fetchGameHosts({ offset: 0, limit: 100 });
    },
    computed: {
        ...mapState({
            gameHosts: (state) => state.all,
        }),
    },

    methods: {
        ...mapActions(["fetchGameHosts", "createGameHost", "updateGameHost", "deleteGameHost"]),

        openItemDetails(gameHost, index) {
            this.currentIndex = index;
            this.currentGameHost = gameHost;
        },

        openNewItemDetails() {
            this.currentIndex = this.gameHosts.length - 1;
            this.currentGameHost = this.gameHosts[this.currentIndex];
        },

        openClosestItemDetails() {
            if (this.gameHosts[this.currentIndex]) {
                this.currentGameHost = this.gameHosts[this.currentIndex];
            } else {
                this.currentIndex--;
                this.currentGameHost = this.gameHosts[this.currentIndex];
            }
        },

        clearInputFields() {
            this.gameHostInput = {
                id: 0,
                name: "",
            };
        },

        enterCreationMode() {
            //hide details/text
            this.generalMode = false;
            //prepare clean input fields
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

        enterEditingMode() {
            //hide details/text
            this.generalMode = false;
            //fill input fields with current info
            Object.assign(this.gameHostInput, this.currentGameHost);
            //show input component
            this.editingMode = true;
        },

        exitEditingMode() {
            //update details prop
            Object.assign(this.currentGameHost, this.gameHostInput);

            this.clearInputFields();
            //hide input form
            this.editingMode = false;
            //show previously open details
            this.generalMode = true;
        },

        async submitInputForm(evt) {
            evt.preventDefault();

            if (this.creationMode) {
                //update host list in store (rough)
                await this.createGameHost(this.gameHostInput);
                this.exitCreationMode();
            } else if (this.editingMode) {
                //update host list in store (rough)
                await this.updateGameHost(this.gameHostInput);
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

        async deleteSelectedGameHost() {
            //update host list in store
            await this.deleteGameHost(this.currentGameHost.id);
            //may not open if unnecessary
            this.openClosestItemDetails();
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
