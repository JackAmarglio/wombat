<template>
    <div>
        <div v-if="beforeGameStartStatus">
            Привет, Команда №{{ id }}. &nbsp; Твой цвет
            <span class="ml-2 p-2" :style="{ background: colors.get(id) }"> </span>
        </div>

        <div v-if="gameStartedStatus">
            <p class="m-4">
                Команда <strong :style="{ color: colors.get(id) }">№{{ id }}</strong>
            </p>

            <span v-if="activeInRound">
                <p class="m-4">В этом раунде ты борешься за победу. Не подведи.</p>
            </span>

            <span v-else>
                В этом раунде ты не играешь. <br />
                Пей, кушай развлекайся, пока не придет очередь
            </span>
        </div>

        <div v-if="roundStartedStatus">
            <p class="m-4">
                Команда <strong :style="{ color: colors.get(id) }">№{{ id }}</strong>
            </p>

            <div v-if="activeInRound">
                <p class="m-4">В этом раунде ты борешься за победу. Не подведи.</p>

                <div>
                    <p class="m-4"><strong>Попытки:</strong> {{ attemptsToInteract }}</p>
                    <p class="m-1" v-if="noAttemptsToInteract">Непорядок.</p>
                </div>

                <div v-if="activeInTour" class="d-flex flex-row justify-content-center align-items-center">
                    <div v-if="cellSelectionStage">Выбирай вопрос</div>
                </div>

                <div v-else>
                    <!--Team not active in tour-->
                    <div v-if="cellSelectionStage">
                        Активная команда выбирает вопрос. <br />
                        А мы подождем, мы посмотрим.
                    </div>
                </div>

                <div v-if="timeStartedStage && allowedToAnswer">
                    <p v-if="showAttemptsAtStake">
                        Если отвечаешь правильно, зарабатываешь + {{ attemptsAtStake }} к попыткам
                    </p>

                    <b-button
                        type="button"
                        class="m-8 p-4"
                        :style="{ background: colors.get(id) }"
                        :disabled="!buttonClickable"
                        @click="sendInteractionTask"
                    >
                        Ответить
                    </b-button>
                </div>
            </div>

            <div v-else>
                <p class="m-4">
                    В этом раунде ты не играешь. <br />
                    Пей, кушай развлекайся, пока не придет очередь
                </p>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";

import colors from "@/app/shared/teamColors";
import { ServerGameState } from "@/app/shared/SignalrWombat";
import difficultyOptionsMap from "@/app/shared/difficultyOptions";

export default {
    name: "GameBoard",

    data() {
        return {
            colors: colors,
            beforeGameStartStatus: true,
            gameStartedStatus: false,
            roundStartedStatus: false,
            cellSelectionStage: false,
            timeStartedStage: false,
            activeInRound: null,
            activeInTour: null,
            allowedToAnswer: false,
            isAnsweredOnce: false,
            buttonClickable: true,
            showAttemptsAtStake: false,

            attemptsAtStake: 0,
            canAnswerByRightOfMove: false,

            defaultAttemptsToAnswerAsExtra: 0,
            attemptsToInteract: 0,
            multipleExtrasTriesEnabled: false,
            triesToCellDifficulty: {
                triesForEasy: 0,
                triesForMedium: 0,
                triesForHard: 0,
            },

            restoreHappens: false,
        };
    },

    computed: {
        ...mapState({
            id: (state) => state.team.id,
            signalrClient: (state) => state.team.signalrClient,
        }),

        noAttemptsToInteract() {
            return this.attemptsToInteract <= 0;
        },
    },

    created() {
        this.signalrClient.getState().then((teamState) => this.restoreState(teamState));
    },

    mounted() {
        this.signalrClient.onGameHostStartedGame((gameConfiguration) =>
            this.handleGameStarted(gameConfiguration)
        );
        this.signalrClient.onActiveTeamsSelected((teamsIds) => this.handleTeamsToPlayRoundReceived(teamsIds));
        this.signalrClient.onNextActiveTeamSelected((teamId) => this.handleActiveTeamReceived(teamId));
        this.signalrClient.onTeamsAllowedInteract((teamsAllowedToInteractArgs) =>
            this.handleTeamsAllowedToAnswer(teamsAllowedToInteractArgs)
        );
        this.signalrClient.onTeamInteracted((teamId) => this.handleTeamInteracted(teamId));
        this.signalrClient.onTeamAnsweredCorrectly((teamId) => this.handleTeamAnsweredCorrectly(teamId));
        this.signalrClient.onTeamAnsweredWrong((teamId) => this.handleTeamAnsweredWrong(teamId));
        this.signalrClient.onNoTeamsLeftToAnswer(this.handleNoTeamsLeftToAnswer.bind(this));
        this.signalrClient.onTimerExpired((timerExpiredArgs) => this.handleTimerExpired(timerExpiredArgs));
    },

    methods: {
        restoreState(teamState) {
            this._resetUi();

            if (teamState.gameState !== ServerGameState.Init) {
                this._setGameConfiguration(teamState.gameConfiguration);
                this._setAttemptsToInteract(teamState.attemptsToInteract);
                if (teamState.currentCellDifficulty) this._setAttemptsAtStake(teamState.currentCellDifficulty);
            }

            switch (teamState.gameState) {
                case ServerGameState.Init:
                    break;
                case ServerGameState.Corrupted:
                    console.warn("Returned corrupted state");
                    break;

                //ok
                case ServerGameState.PresentingActiveTeams:
                case ServerGameState.PresentingRoundTopics:
                    this.handleTeamsToPlayRoundReceived(teamState.roundActiveTeamsIds);

                    //rewrite default in _clearDataFields();
                    this._setAttemptsToInteract(teamState.attemptsToInteract);
                    break;

                //ok
                case ServerGameState.RoundStarted:
                    this.handleTeamsToPlayRoundReceived(teamState.roundActiveTeamsIds);
                    this.handleActiveTeamReceived(teamState.tourActiveTeamId);

                    //rewrite default in _clearDataFields();
                    this._setAttemptsToInteract(teamState.attemptsToInteract);
                    break;

                //ok
                case ServerGameState.CellSelected:
                case ServerGameState.RoundEnded:
                case ServerGameState.GameEnded:
                    this.handleTeamsToPlayRoundReceived(teamState.roundActiveTeamsIds);
                    this.handleActiveTeamReceived(teamState.tourActiveTeamId);

                    //rewrite default in _clearDataFields();
                    this._setAttemptsToInteract(teamState.attemptsToInteract);

                    this._hideCellSelectionMessage();

                    if (this.activeInTour || teamState.lastAnsweredOtherTeamsIds.includes(this.id)) {
                        this._setTeamAlreadyAnsweredStatus();
                    }

                    break;

                //ok
                case ServerGameState.ActiveTeamGivesAnswer:
                    console.log("restoring ActiveTeamGivesAnswer");
                    this.handleTeamsToPlayRoundReceived(teamState.roundActiveTeamsIds);
                    this.handleActiveTeamReceived(teamState.tourActiveTeamId);

                    //rewrite default in _clearDataFields();
                    this._setAttemptsToInteract(teamState.attemptsToInteract);

                    this.handleTeamsAllowedToAnswer({
                        allowedTeams: "OnlyTourActiveTeam",
                        selectedCellNumber: 0,
                        cellDifficulty: teamState.currentCellDifficulty,
                    });
                    this.handleTeamInteracted(teamState.tourActiveTeamId);
                    break;

                //ok
                case ServerGameState.ActiveTeamGaveNoRightAnswer:
                    console.log("restoring ActiveTeamGaveNoRightAnswer");
                    this.handleTeamsToPlayRoundReceived(teamState.roundActiveTeamsIds);
                    this.handleActiveTeamReceived(teamState.tourActiveTeamId);

                    //rewrite default in _clearDataFields();
                    this._setAttemptsToInteract(teamState.attemptsToInteract);

                    this.handleTeamsAllowedToAnswer({
                        allowedTeams: "OnlyTourActiveTeam",
                        selectedCellNumber: 0,
                        cellDifficulty: teamState.currentCellDifficulty,
                    });
                    this.handleTeamInteracted(teamState.tourActiveTeamId);
                    this.handleTeamAnsweredWrong(teamState.tourActiveTeamId);
                    break;

                //ok
                case ServerGameState.QuestionAnsweredCorrectly:
                    console.log("restoring QuestionAnsweredCorrectly");
                    this._launchRestore();

                    this.handleTeamsToPlayRoundReceived(teamState.roundActiveTeamsIds);
                    this.handleActiveTeamReceived(teamState.tourActiveTeamId);
                    if (this.activeInTour || teamState.lastAnsweredOtherTeamsIds.includes(this.id)) {
                        this._hideCellSelectionMessage();
                        this._setTeamAlreadyAnsweredStatus();
                    }

                    //rewrite default in _clearDataFields();
                    this._setAttemptsToInteract(teamState.attemptsToInteract);

                    this.handleTeamsAllowedToAnswer({
                        allowedTeams: "OnlyTourActiveTeam",
                        selectedCellNumber: 0,
                        cellDifficulty: teamState.currentCellDifficulty,
                    });
                    //in restoreHappens mode attemptsToInteract won't change
                    this.handleTeamInteracted(teamState.lastAnsweringTeamId);
                    //in restoreHappens mode attemptsToInteract won't change
                    this.handleTeamAnsweredCorrectly(teamState.lastAnsweringTeamId);

                    this._finishRestore();

                    break;

                //ok
                case ServerGameState.OtherTeamsGaveNoRightAnswer:
                    console.log("restoring OtherTeamsGaveNorRightAnswer");
                    this.handleTeamsToPlayRoundReceived(teamState.roundActiveTeamsIds);
                    this.handleActiveTeamReceived(teamState.tourActiveTeamId);

                    //rewrite default in _clearDataFields();
                    this._setAttemptsToInteract(teamState.attemptsToInteract);

                    if (this.activeInTour || teamState.lastAnsweredOtherTeamsIds.includes(this.id)) {
                        this._setTeamAlreadyAnsweredStatus();
                    }

                    this.handleTimerExpired({ isExpiredForOtherTeams: true });

                    break;

                //ok
                case ServerGameState.OtherTeamGivesAnswer:
                    console.log("restoring OtherTeamsGivesAnswer");
                    this._launchRestore();
                    this.handleTeamsToPlayRoundReceived(teamState.roundActiveTeamsIds);
                    this.handleActiveTeamReceived(teamState.tourActiveTeamId);

                    //rewrite default in _clearDataFields();
                    this._setAttemptsToInteract(teamState.attemptsToInteract);

                    if (this.activeInTour || teamState.lastAnsweredOtherTeamsIds.includes(this.id)) {
                        this._setTeamAlreadyAnsweredStatus();
                    }

                    this.handleTeamsAllowedToAnswer({
                        allowedTeams: "AllTourTeamsExceptAnswered",
                        selectedCellNumber: 0,
                        cellDifficulty: teamState.currentCellDifficulty,
                    });
                    //in restoreHappens mode attemptsToInteract won't change
                    this.handleTeamInteracted(teamState.lastAnsweringTeamId);
                    this._finishRestore();

                    break;

                case ServerGameState.OtherTeamGaveWrongAnswer:
                    console.log("restoring OtherTeamGaveWrongAnswer");
                    this._launchRestore();

                    this.handleTeamsToPlayRoundReceived(teamState.roundActiveTeamsIds);
                    this.handleActiveTeamReceived(teamState.tourActiveTeamId);

                    //rewrite default in _clearDataFields();
                    this._setAttemptsToInteract(teamState.attemptsToInteract);

                    if (this.activeInTour || teamState.lastAnsweredOtherTeamsIds.includes(this.id)) {
                        this._hideCellSelectionMessage();
                        this._setTeamAlreadyAnsweredStatus();
                    }

                    this.handleTeamsAllowedToAnswer({
                        allowedTeams: "AllTourTeamsExceptAnswered",
                        selectedCellNumber: 0,
                        cellDifficulty: teamState.currentCellDifficulty,
                    });
                    //in restoreHappens mode attemptsToInteract won't change
                    this.handleTeamInteracted(teamState.lastAnsweringTeamId);
                    //in restoreHappens mode attemptsToInteract won't change
                    this.handleTeamAnsweredWrong(teamState.lastAnsweringTeamId);

                    this._finishRestore();

                    break;

                //ok
                case ServerGameState.TimerStartedForActiveTeam:
                    console.log("restoring TimerStartedForActiveTeam");
                    this.handleTeamsToPlayRoundReceived(teamState.roundActiveTeamsIds);
                    this.handleActiveTeamReceived(teamState.tourActiveTeamId);

                    //rewrite default in _clearDataFields();
                    this._setAttemptsToInteract(teamState.attemptsToInteract);

                    this.handleTeamsAllowedToAnswer({
                        allowedTeams: "OnlyTourActiveTeam",
                        selectedCellNumber: 0,
                        cellDifficulty: teamState.currentCellDifficulty,
                    });
                    break;

                //ok
                case ServerGameState.TimerStartedForOtherTeams:
                    console.log("restoring TimerStartedForOtherTeams");
                    this.handleTeamsToPlayRoundReceived(teamState.roundActiveTeamsIds);
                    this.handleActiveTeamReceived(teamState.tourActiveTeamId);
                    if (this.activeInTour || teamState.lastAnsweredOtherTeamsIds.includes(this.id)) {
                        this._setTeamAlreadyAnsweredStatus();
                    }

                    this.handleTeamsAllowedToAnswer({
                        allowedTeams: "AllTourTeamsExceptAnswered",
                        selectedCellNumber: 0,
                        cellDifficulty: teamState.currentCellDifficulty,
                    });
                    break;
            }
        },

        //#region real-time events handlers (updating data() fields and UI changes)

        handleGameConfigurationReceived(configuration) {
            console.log("game configuration received");
            this._setGameConfiguration(configuration);
            this._setAttemptsToInteract(configuration.initialNumberOfAttemptsToAnswerAfterActiveTeam);
        },

        handleGameStarted(gameConfiguration) {
            this.handleGameConfigurationReceived(gameConfiguration);
            this._hideStartPage();
            this._showWaitingForRoundStartUI();
            console.log("game started");
        },

        handleNoTeamsLeftToAnswer() {
            this._hideInteractionButton();
        },

        handleTeamsToPlayRoundReceived(teamsIds) {
            //Remove if onGameHostStartedGame will actually be listened to
            console.log("teams to play round received");
            this._startNewRound();
            this._setActiveInRound(teamsIds);
            console.log("teams to play round set");
        },

        handleActiveTeamReceived(teamId) {
            console.log("active team id received");
            this._setActiveInTour(teamId);
            this._startNewTour();
            this._showCellSelectionMessage();
            console.log("active team will select cell");
        },

        handleTeamsAllowedToAnswer(payload) {
            this._hideCellSelectionMessage();
            this._setAttemptsAtStake(payload.cellDifficulty);
            console.log("teams allowed to interact received");
            switch (payload.allowedTeams) {
                case "OnlyTourActiveTeam": {
                    if (this.activeInTour) {
                        this._setActiveTeamAttemptByRightOfMove();
                        this._hideCellSelectionMessage();
                        this._showAttemptsAtStake();
                        this._showInteractionButton();
                        console.log("answer button is active for you");
                    } else console.log("not your turn, only active team may answer");
                    break;
                }
                case "AllTourTeamsExceptAnswered": {
                    if (this.isAnsweredOnce) {
                        if (this.activeInTour) {
                            //active in tour already answered
                            this._hideInteractionButton();

                            console.log("not your turn, other teams try to answer now");
                        } else if (!this.activeInTour && this.multipleExtrasTriesEnabled) {
                            //other team already answered but feat lets answer again
                            if (this.noAttemptsToInteract) {
                                this._hideAttemptsAtStake();
                                this._hideInteractionButton();

                                console.log("you have no attempts to answer again");
                            } else {
                                //can interact
                                this._hideCellSelectionMessage();
                                this._showAttemptsAtStake();
                                this._showInteractionButton();

                                console.log(
                                    "you have " + this.attemptsToInteract + " attempts to try answering again"
                                );
                            }
                        } else if (!this.activeInTour && !this.multipleExtrasTriesEnabled) {
                            //other team already answered but no feat to answer again
                            this._hideInteractionButton();

                            console.log("not your turn, other teams try to answer now");
                        }
                    } else {
                        //other team and haven't answered yet
                        if (this.noAttemptsToInteract) {
                            //team haven`t answered yet but has no attempts to answer
                            this._hideCellSelectionMessage();

                            console.log("you have no attempts to answer");
                        } else {
                            //team haven`t answered yet and has attempts to answer
                            this._hideCellSelectionMessage();
                            this._showAttemptsAtStake();
                            this._showInteractionButton();

                            console.log("answer button for all who left is active");
                        }
                    }
                    break;
                }
                case "AllTourTeams": {
                    if (this.noAttemptsToInteract) {
                        //team haven`t answered yet but has no attempts to answer
                        this._hideCellSelectionMessage();

                        console.log("you have no attempts to answer again");
                    } else {
                        this._hideCellSelectionMessage();
                        this._showAttemptsAtStake();
                        this._showInteractionButton();

                        console.log("answer button is active for everyone");
                    }
                    break;
                }
            }
        },

        handleTeamInteracted(teamId) {
            if (teamId === this.id) {
                console.log("you clicked first");

                //team pays one try for interaction unless the attempt is by right of move ( = unless the team is active in tour)
                if (!this.restoreHappens) {
                    if (this.canAnswerByRightOfMove === false) this._decreaseAttemptsNumber(1);
                    this._setTeamAlreadyAnsweredStatus();
                }
            } else {
                console.log("other team clicked earlier :(");
            }
            this._disableInteractionButton();
        },

        handleTeamAnsweredCorrectly(teamId) {
            this._hideCellSelectionMessage();
            this._hideAttemptsAtStake();
            this._hideInteractionButton();

            if (this.id === teamId) {
                //this team answered correctly
                console.log("you  answered correctly and earned + " + this.attemptsAtStake + " attempts");

                if (!this.restoreHappens) this._increaseAttemptsNumber(this.attemptsAtStake);

                console.log("now you have " + this.attemptsToInteract + " attempts to answer in total");

                //remove some kind of "active in tour" status
                if (this.canAnswerByRightOfMove) this._burnActiveTeamAttemptByRightOfMove();
            } //some other team answered correctly
            else console.log("team " + teamId + " answered correctly");
        },

        async handleTeamAnsweredWrong(teamId) {
            this._hideCellSelectionMessage();
            this._hideAttemptsAtStake();
            this._hideInteractionButton();
            if (this.id === teamId) {
                //this team answered wrong
                console.log("you  answered wrong and earned no attempts");
                console.log("now you have " + this.attemptsToInteract + " attempts to answer in total");
                //remove some kind of "active in tour" status
                if (this.canAnswerByRightOfMove) this._burnActiveTeamAttemptByRightOfMove();
            } else {
                //some other team answered correctly
                console.log("team " + teamId + " answered wrong.");
            }
        },

        handleTimerExpired(timerExpiredArgs) {
            this._hideCellSelectionMessage();
            if (timerExpiredArgs.isExpiredForOtherTeams) {
                this._hideAttemptsAtStake();
                console.log("timer expired for other teams");
                this._hideInteractionButton();
            } else {
                if (this.activeInTour) {
                    this.isAnsweredOnce = true;
                    this._burnActiveTeamAttemptByRightOfMove();
                } else this._showAttemptsAtStake();
                console.log("timer expired");
                this._hideInteractionButton();
            }
        },

        //#endregion

        //#region button click (async signalr task)

        async sendInteractionTask() {
            await this.signalrClient.interact();
            console.log("interact task sent");
        },

        async getState() {
            const state = await this.signalrClient.getState();
            console.log(state);
        },

        //#endregion

        //#region UI stage changes helpers

        _hideStartPage() {
            this.beforeGameStartStatus = false;
        },

        _showWaitingForRoundStartUI() {
            this.gameStartedStatus = true;
        },

        _startNewRound() {
            //clear ALL data fields
            this._clearDataFields();
            this._clearRoundInfo();
            console.log("------------------NEW ROUND------------------");
            this._showWaitingForRoundStartUI();
        },

        _startNewTour() {
            this._clearDataFields();
            console.log("------------------NEW TOUR------------------");
            this.roundStartedStatus = true;
        },

        _showCellSelectionMessage() {
            this.cellSelectionStage = true;
        },

        _hideCellSelectionMessage() {
            this.cellSelectionStage = false;
        },

        _showInteractionButton() {
            this.allowedToAnswer = true;
            this.timeStartedStage = true;
            this.buttonClickable = true;
        },

        _disableInteractionButton() {
            this.buttonClickable = false;
        },

        _hideInteractionButton() {
            this.allowedToAnswer = false;
            this.timeStartedStage = false;
        },

        _showAttemptsAtStake() {
            this.showAttemptsAtStake = true;
        },

        _hideAttemptsAtStake() {
            this.showAttemptsAtStake = false;
        },

        //#endregion

        //#region data() fields changes helpers

        _launchRestore() {
            this.restoreHappens = true;
        },

        _finishRestore() {
            this.restoreHappens = false;
        },

        _setGameConfiguration(configuration) {
            this.defaultAttemptsToAnswerAsExtra = configuration.initialNumberOfAttemptsToAnswerAfterActiveTeam;
            this.multipleExtrasTriesEnabled = configuration.isTeamAllowedAnsweringMultipleTimes;
            this.triesToCellDifficulty = configuration.triesNumberToCellDifficulty;
        },

        _setAttemptsToInteract(attemptsToInteractNumber) {
            this.attemptsToInteract = attemptsToInteractNumber;
        },

        _setActiveTeamAttemptByRightOfMove() {
            this.canAnswerByRightOfMove = true;
        },

        _burnActiveTeamAttemptByRightOfMove() {
            this.canAnswerByRightOfMove = false;
        },

        _setActiveInRound(teamsIds) {
            teamsIds.includes(this.id) ? (this.activeInRound = true) : (this.activeInRound = false);
        },

        _setActiveInTour(teamId) {
            this.id === teamId ? (this.activeInTour = true) : (this.activeInTour = false);
        },

        _setTeamAlreadyAnsweredStatus() {
            this.isAnsweredOnce = true;
        },

        _setAttemptsAtStake(cellDifficultyToConvert) {
            switch (cellDifficultyToConvert) {
                case difficultyOptionsMap.get("easy").points + 1: {
                    this.attemptsAtStake = this.triesToCellDifficulty.triesForEasy;
                    break;
                }
                case difficultyOptionsMap.get("medium").points + 1: {
                    this.attemptsAtStake = this.triesToCellDifficulty.triesForMedium;
                    break;
                }
                case difficultyOptionsMap.get("hard").points + 1: {
                    this.attemptsAtStake = this.triesToCellDifficulty.triesForHard;
                    break;
                }
            }
            console.log(cellDifficultyToConvert + " attempts at stake");
        },

        _clearAttemptsAtStake() {
            this.attemptsAtStake = 0;
        },

        _increaseAttemptsNumber(plus) {
            this.attemptsToInteract += plus;
        },

        _decreaseAttemptsNumber(minus) {
            this.attemptsToInteract -= minus;
        },

        _clearDataFields() {
            this.gameStartedStatus = false;
            this.roundStartedStatus = false;
            this.cellSelectionStage = false;
            this.timeStartedStage = false;
            //this.activeInRound won't change
            //this.activeInTour: has value
            this.allowedToAnswer = false;
            this.isAnsweredOnce = false;
            this.showAttemptsAtStake = false;
            this.buttonClickable = true;

            //this.attemptsAtStake won't change
            //this.attemptsToInteract won't change
            this.showAttemptsAtStake = false;
            this._clearAttemptsAtStake();
        },

        _clearRoundInfo() {
            this.activeInRound = false;
            this.activeInTour = false;
            this.attemptsAtStake = 0;
            this._setAttemptsToInteract(this.defaultAttemptsToAnswerAsExtra);
            this._clearAttemptsAtStake();
        },

        _resetUi() {
            this._clearDataFields();
            this._clearRoundInfo();
        },

        //#endregion
    },
};
</script>

<style scoped>
ul {
    list-style-type: none;
    padding: 0;
    margin: 0 auto;
    display: grid;
    place-items: center;
    grid-auto-flow: column;
    gap: 24px;
}
</style>
