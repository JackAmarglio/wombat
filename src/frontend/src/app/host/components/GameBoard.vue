<template>
    <div class="position: relative">
        <HostPostRoundTeamsRoundsOrderEdit
            v-if="isPostRoundTeamsRoundsOrderEditActive"
            @close="isPostRoundTeamsRoundsOrderEditActive = false"
            :round-number="currentRoundNumber"
        />

        <div
            v-if="defineGameSettings"
            style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
        >
            <game-configuration-settings @onClickSendData="sendGameSettings"></game-configuration-settings>
        </div>

        <HostBeforeGameStartStage
            v-if="beforeGameStartStatus"
            is-screen-connected="false"
            :team-names="teamNames"
            :teams="teams"
            :screen-code="screen.accessCode"
            :on-game-start-button-click="startGame"
        />

        <div v-if="!defineGameSettings && !beforeGameStartStatus" class="card no-body">
            <b-tabs align="center" card>
                <b-tab title="Игра" active>
                    <div v-if="gameStartedStatus">
                        Раунд играют команды:
                        <ul class="container">
                            <li
                                class="card p-2 m-3 white-text"
                                v-for="team in teamsToPlayRound"
                                :key="team.id"
                                :style="{ background: colors.get(team.id) }"
                            >
                                {{ teamNames[team.id] }}
                            </li>
                        </ul>

                        <b-button
                            type="button"
                            variant="primary"
                            class="m-3"
                            @click="this._sendContextActionTask"
                        >
                            Перейти к темам раунда
                        </b-button>
                    </div>

                    <div v-if="isPresentingRoundTopicsState">
                        <h4>Темы раунда</h4>

                        <ul class="d-flex flex-column py-5">
                            <li v-for="topic in currentRoundQuestionTopics" :key="topic.id">
                                <p class="mb-3">
                                    {{ topic.name }}
                                </p>
                            </li>
                        </ul>

                        <b-button
                            type="button"
                            variant="primary"
                            class="m-3"
                            @click="this._sendContextActionTask"
                        >
                            Задать первый вопрос
                        </b-button>
                    </div>

                    <div v-if="roundStartedStatus">
                        <teams-in-tour-viewer :teams-in-tour="teamsToPlayRound" :team-names="teamNames" />

                        <div v-if="cellSelectionStage">
                            <p class="m-3">
                                Ячейку выбирает
                                <strong :style="{ color: colors.get(activeTeam.id) }">
                                    {{ teamNames[activeTeam.id] }}
                                </strong>
                            </p>

                            <b-input-group prepend="Ячейка" class="col-4" style="margin: 0 auto">
                                <b-form-input placeholder="№" v-model="cell"></b-form-input>
                                <b-input-group-append>
                                    <b-button class="mr-2" type="submit" variant="primary" @click="selectCell">
                                        <b-icon-arrow-right></b-icon-arrow-right>
                                    </b-button>
                                </b-input-group-append>
                            </b-input-group>
                        </div>

                        <div
                            v-if="questionAskingStage"
                            class="d-flex flex-column justify-content-center align-items-center"
                        >
                            <p class="m-3 strong">Вопрос для {{ questionFor }}</p>

                            <b-card class="col-md-3 col-sm-8">
                                <div v-if="isAnnouncingQuestionTopicStep">
                                    <!--    todo: Лучше брать только ид топика, и получать по нему топик из стейта  -->
                                    <p>{{ activeQuestion.topicName }}</p>

                                    <b-button
                                        v-if="!timeStartedStage"
                                        class="mt-3"
                                        type="button"
                                        variant="primary"
                                        @click="isAnnouncingQuestionTopicStep = false"
                                    >
                                        К тексту вопроса
                                    </b-button>
                                </div>

                                <div v-else>
                                    <p>
                                        {{ activeQuestion.content }}
                                    </p>

                                    <b-button
                                        v-if="!timeStartedStage"
                                        class="mt-3"
                                        type="button"
                                        variant="primary"
                                        @click="startTimer"
                                    >
                                        Запустить время
                                    </b-button>

                                    <b-card v-if="timeStartedStage">
                                        <p>{{ timerSeconds }}</p>

                                        <b-button type="button" variant="primary" @click="endTimer">
                                            Закончить досрочно
                                        </b-button>
                                    </b-card>

                                    <b-card
                                        class="mt-1 mb-1"
                                        style="border: none"
                                        v-if="
                                            !activeTeamStillGaveNoAnswer &&
                                            !timeStartedStage &&
                                            multipleExtrasTriesEnabled &&
                                            isTimerStartNumberLimitForOtherTeamsEnabled
                                        "
                                    >
                                        <hr class="mt-1 mb-2" />

                                        <p class="mb-2">
                                            Запусков таймера осталось:
                                            <strong>{{ timerLaunchesLeft }}</strong>
                                        </p>

                                        <b-button
                                            type="button"
                                            size="sm"
                                            variant="outline-secondary"
                                            v-if="timerLaunchesLeft > 0"
                                            @click="skipExtraTimerLaunches"
                                        >
                                            Пропустить запуски
                                        </b-button>
                                    </b-card>
                                </div>
                            </b-card>
                        </div>

                        <div
                            v-if="teamAnswersStage"
                            class="d-flex flex-column justify-content-center align-items-center"
                        >
                            <p>Отвечает {{ interactedTeamMemberName }}</p>
                            <p class="m-3 strong">Правильный ответ:</p>

                            <b-card class="col-md-3 col-sm-8">
                                <p>{{ activeQuestion.answer }}</p>

                                <div class="d-flex flex-row justify-content-center align-items-center">
                                    <b-button
                                        class="mr-2"
                                        type="submit"
                                        variant="secondary"
                                        @click="rateWrongAnswer"
                                    >
                                        <b-icon-hand-thumbs-down></b-icon-hand-thumbs-down>
                                    </b-button>

                                    <b-button
                                        class="mr-2"
                                        type="submit"
                                        variant="primary"
                                        @click="rateCorrectAnswer"
                                    >
                                        <b-icon-hand-thumbs-up></b-icon-hand-thumbs-up>
                                    </b-button>
                                </div>
                            </b-card>
                        </div>

                        <div
                            v-if="showRightAnswerStage"
                            class="d-flex flex-column justify-content-center align-items-center"
                        >
                            <p class="m-3 strong">
                                <span v-if="tourWinner.name">
                                    Ответили
                                    <strong :style="{ color: colors.get(tourWinner.id) }">
                                        {{ teamNames[tourWinner.id] }}
                                    </strong>
                                </span>
                                <span v-else>Никто не ответил</span>
                            </p>

                            <p v-if="roundWinner.id">
                                Победила
                                <strong :style="{ color: colors.get(roundWinner.id) }">
                                    {{ teamNames[roundWinner.id] }}
                                </strong>
                                {{ victoryType }}
                            </p>

                            <b-card class="col-md-3 col-sm-8">
                                <p>{{ activeQuestion.answer }}</p>
                                <b-button class="mt-3" type="button" variant="primary" @click="startTour">
                                    {{ roundWinner.id ? "Закончить раунд" : "Следующий вопрос" }}
                                </b-button>

                                <br />
                                <b-button
                                    v-if="shouldDisplayTeamsRoundsOrderEditButton"
                                    class="mt-1"
                                    @click="
                                        isPostRoundTeamsRoundsOrderEditActive =
                                            !isPostRoundTeamsRoundsOrderEditActive
                                    "
                                >
                                    Изменить порядок команд
                                </b-button>
                            </b-card>
                        </div>
                    </div>

                    <div v-if="roundEndedStatus">
                        <p>Раунд окончен</p>

                        <h4>Победили {{ teamNames[roundWinner.id] }} {{ victoryType }}</h4>

                        <b-card-body
                            ref="teamRoundScoresList"
                            class="list d-flex flex-row justify-content-center align-items-baseline"
                        >
                            <b-card class="col-md-3 col-sm-12 mr-3">
                                <h6 class="pb-3" style="color: #0275d8">
                                    <b>Результаты</b>
                                </h6>

                                <div class="pb-2" v-for="team in teamsToPlayRound" :key="team.id">
                                    <strong :style="{ color: colors.get(team.id) }"
                                        >{{ teamNames[team.id] }}:</strong
                                    >
                                    <span class="ml-2">{{ team.roundScore }}</span>
                                </div>
                            </b-card>
                        </b-card-body>

                        <p v-if="currentRoundNumber >= roundsInGame">Игра окончена</p>

                        <b-button
                            ref="startNewRoundButton"
                            class="mt-3"
                            type="button"
                            variant="primary"
                            @click="startRound"
                        >
                            {{
                                currentRoundNumber >= roundsInGame
                                    ? "Показать результаты игры"
                                    : "Следующий раунд"
                            }}
                        </b-button>
                    </div>

                    <div v-if="gameEndedStatus">
                        <p>Игра окончена</p>

                        <b-card-body
                            ref="teamGameScoresList"
                            class="list d-flex flex-row justify-content-center align-items-baseline"
                        >
                            <b-card class="col-md-3 col-sm-12 mr-3">
                                <h6 class="pb-3" style="color: #0275d8">
                                    <b>Результаты</b>
                                </h6>

                                <div class="pb-2" v-for="team in teams" :key="team.id">
                                    <strong :style="{ color: colors.get(team.id) }"
                                        >{{ teamNames[team.id] }}:</strong
                                    >
                                    <span class="ml-2">{{ team.gameScore }}</span>
                                </div>
                            </b-card>
                        </b-card-body>

                        <b-button
                            ref="exitGameBoard"
                            class="mt-3"
                            type="button"
                            variant="primary"
                            @click="confirmGameEnding"
                        >
                            Завершить игру
                        </b-button>
                    </div>
                </b-tab>

                <b-tab title="Коды">
                    <HostGameAccessCodes
                        is-screen-connected="false"
                        :team-names="teamNames"
                        :teams="teams"
                        :screen-code="screen.accessCode"
                    />
                </b-tab>
            </b-tabs>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

import colors from "@/app/shared/teamColors";
import TeamService from "@/app/team/services/TeamService";
import { ServerGameState } from "@/app/shared/SignalrWombat";
import { transformRestoreQuestion } from "@/app/shared/restoreUtils";
import GameConfigurationSettings from "@/app/host/components/GameConfigurationSettings";
import difficultyOptionsMap from "@/app/shared/difficultyOptions";
import TeamsInTourViewer from "@/app/shared/components/TeamsInTourViewer";
import {
    PROCESS_SERVER_TEAMS_ROUNDS_ORDER,
    SET_BACKEND_ACTOR_STATE,
    SET_TEAM_NAME,
    SET_TEAMS_MEMBERS_FROM_SERVER,
    UPSERT_TEAM_MEMBER,
} from "@/app/shared/store/modules/mutations";
import HostBeforeGameStartStage from "@/app/host/components/HostBeforeGameStartStage";
import HostPostRoundTeamsRoundsOrderEdit from "@/app/host/components/HostPostRoundTeamsRoundsOrderEdit";
import HostGameAccessCodes from "@/app/host/components/HostGameAccessCodes";

export default {
    name: "GameBoard",
    components: {
        HostGameAccessCodes,
        HostPostRoundTeamsRoundsOrderEdit,
        HostBeforeGameStartStage,
        GameConfigurationSettings,
        TeamsInTourViewer,
    },
    data() {
        return {
            colors: colors,
            teamsInRoundNumber: null,
            initialNumberOfAttemptsToAnswerAfterActiveTeam: 0,
            multipleExtrasTriesEnabled: false,
            isTimerStartNumberLimitForOtherTeamsEnabled: false,
            timerLaunchesLimitForOtherTeams: 0,
            triesToCellDifficulty: {
                triesForEasy: 0,
                triesForMedium: 0,
                triesForHard: 0,
            },
            roundsInGame: 0,

            defineGameSettings: true,
            beforeGameStartStatus: false,
            gameStartedStatus: false,
            isPresentingRoundTopicsState: false,
            roundStartedStatus: false,
            cellSelectionStage: false,
            questionAskingStage: false,
            isAnnouncingQuestionTopicStep: true,
            timeStartedStage: false,
            teamAnswersStage: false,
            showRightAnswerStage: false,
            isPostRoundTeamsRoundsOrderEditActive: false,

            teamsToPlayRound: [],
            activeTeam: {},
            interactedTeamMemberId: 0,
            activeQuestion: {},
            questionFor: "",
            cell: "",

            attemptsAtStake: 0,

            secondsToAnswer: 6,
            timerSeconds: null,
            timerInterval: null,
            teamsStillAllowedToAnswer: null,
            timerLaunchesLeft: null,

            tourWinner: {},
            roundWinner: {},
            victoryType: "",
            roundEndedStatus: false,
            gameEndedStatus: false,
            currentRoundNumber: 0,
        };
    },

    computed: {
        ...mapState({
            screen: (state) => state.host.gameInfo.screen,
            teams: (state) => state.host.gameInfo.teams,
            signalrClient: (state) => state.host.signalrClient,
            questions: (state) => state.host.gameInfo.questions,
            currentRoundQuestionTopics: (state) => state.host.roundQuestionTopics.currentRoundQuestionTopics,
            teamNames: (state) => state.host.teamNames.all,
        }),

        activeTeamStillGaveNoAnswer() {
            return this.teamsInRoundNumber === this.teamsStillAllowedToAnswer;
        },

        shouldDisplayTeamsRoundsOrderEditButton() {
            if (this.roundWinner.id === undefined) return false;
            if (this.currentRoundNumber >= this.roundsInGame) return false;

            return true;
        },

        interactedTeamMemberName() {
            const teamsMembers = this.$store.state.host.teamsMembers.current;
            const interactedTeamMembers = teamsMembers[this.answeringTeam.id];
            return interactedTeamMembers.find((m) => m.id === this.interactedTeamMemberId).name;
        },

        answeringTeam() {
            return this.teamsToPlayRound.find((t) => t.isAnswering === true) ?? null;
        },
    },

    async created() {
        const state = await this.signalrClient.getState();

        // todo: host vuex module should not be namespaced
        this.$store.commit(`host/${SET_BACKEND_ACTOR_STATE}`, state);
        await this.restoreState(state);
    },

    mounted() {
        this.signalrClient.onTeamConnected((teamId) => this._setTeamConnectedStatus(teamId));
        this.signalrClient.onActiveTeamsSelected((teamsIds) => this.handleTeamsToPlayRoundReceived(teamsIds));
        this.signalrClient.onPresentRoundQuestionTopics((questionTopics) =>
            this.handlePresentRoundQuestionTopics(questionTopics)
        );
        this.signalrClient.onNextActiveTeamSelected((teamId) => this.handleActiveTeamReceived(teamId));
        this.signalrClient.onNextQuestionSelected((question) => this.handleQuestionReceived(question));
        this.signalrClient.onTeamInteracted((teamId, memberId) =>
            this.handleTeamInteraction(teamId, memberId)
        );
        this.signalrClient.onTeamAnsweredCorrectly((args) => this.handleTeamAnsweredCorrectly(args));
        this.signalrClient.onTeamAnsweredWrong((args) => this.handleTeamAnsweredWrong(args));
        this.signalrClient.onTimerExpired((timerExpiredArgs) => this.handleTimerExpired(timerExpiredArgs));
        this.signalrClient.onNoTeamsLeftToAnswer(() => this.handleNoTeamsLeftToAnswer());
        this.signalrClient.onRoundEnded((roundEndedArgs) => this.handleRoundEnded(roundEndedArgs));
        this.signalrClient.onGameEnded((gameEndedArgs) => this.handleGameEnded(gameEndedArgs));

        this.signalrClient.onTeamsRoundsOrderUpdated((order) => {
            this.$store.commit(`host/${PROCESS_SERVER_TEAMS_ROUNDS_ORDER}`, order);
        });

        this.signalrClient.onTeamChangedName((teamId, newName) => {
            this.$store.commit(`host/${SET_TEAM_NAME}`, { teamId, name: newName });
        });

        this.signalrClient.onTeamAddedOrUpdatedTeamMember(({ teamId, memberId, memberName }) => {
            this.$store.commit(`host/${UPSERT_TEAM_MEMBER}`, { teamId, memberId, memberName });
        });

        console.log("Get backend host state func:", this.getState);
    },

    watch: {
        async timerSeconds(newVal) {
            if (newVal === 0) {
                await this.endTimer();
            }
        },
    },

    methods: {
        ...mapActions({
            submitGameSettings: "host/submitGameSettings",
        }),

        ...mapMutations({
            setCurrentRoundQuestionTopics: "host/SET_CURRENT_ROUND_QUESTION_TOPICS",
        }),

        async getState() {
            const state = await this.signalrClient.getState();
            console.log({
                gameStateAsString: ServerGameState[state.gameState],
                ...state,
            });
        },

        restoreState(hostState) {
            this._clearDataFields();
            this._clearRoundInfo();

            //#region helper variables for defining timerLaunchesLeft and teamsStillAllowedToAnswer
            const timerStartNumberLimit = hostState.gameConfiguration
                .isTimerStartNumberLimitForOtherTeamsEnabled
                ? hostState.optionalFeaturesData.remainingNumberToStartTimerForOtherTeamInTour
                : hostState.lastAnsweredOtherTeamsIds.length;

            const otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes = [];

            hostState.roundActiveTeamsIds.forEach((teamId) => {
                if (
                    //team has more than one attempt left
                    hostState.teamIdToAttemptsToAnswerAfterActiveTeam[teamId] > 0 &&
                    //team is not tour active
                    teamId !== hostState.tourActiveTeamId
                )
                    otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.push(teamId);
            });

            //#endregion

            if (hostState.gameState !== ServerGameState.Init) {
                console.log("restoring base configuration");
                this.restoreGameConfiguration(
                    hostState.gameConfiguration,
                    hostState.roundActiveTeamsNumber,
                    hostState.lastAnsweredOtherTeamsIds.length,
                    timerStartNumberLimit
                );
            }

            this.$store.commit(`host/${PROCESS_SERVER_TEAMS_ROUNDS_ORDER}`, hostState.teamsRoundsOrder);
            this.$store.commit(`host/${SET_TEAMS_MEMBERS_FROM_SERVER}`, hostState.gameTeamsMembers);

            this.setCurrentRoundQuestionTopics(hostState.currentRoundQuestionTopics);

            this._showTourInProgressUI();

            this.roundsInGame = hostState.roundsNumber;
            this.currentRoundNumber = hostState.currentRoundNumber;
            this.interactedTeamMemberId = hostState.lastAnsweringTeamMemberId;

            switch (hostState.gameState) {
                case ServerGameState.Corrupted:
                    console.warn("Returned corrupted state");
                    break;

                case ServerGameState.Init:
                    console.log("restoring Init");
                    if (hostState.roundActiveTeamsNumber !== 0) {
                        this.restoreGameStartedStage();
                    } else {
                        this._showGameConfiguration();
                    }
                    break;

                case ServerGameState.PresentingActiveTeams:
                    console.log("restoring PresentingActiveTeams");
                    this._hideTourInProgressUI();
                    //show round started stage
                    this.restoreRoundStartedStage(hostState.roundActiveTeamsIds);
                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    break;
                case ServerGameState.PresentingRoundTopics:
                    /*
                     * Кописаста с ServerGameState.PresentingActiveTeams
                     */
                    this._hideTourInProgressUI();

                    //show round started stage
                    this.restoreRoundStartedStage(hostState.roundActiveTeamsIds);

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    this.gameStartedStatus = false;
                    this.isPresentingRoundTopicsState = true;

                    break;
                case ServerGameState.RoundStarted:
                    console.log("restoring RoundStarted");
                    //show cell selection stage
                    this.restoreCellSelectionStage(hostState.roundActiveTeamsIds, hostState.tourActiveTeamId);
                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });
                    break;

                case ServerGameState.CellSelected:
                    console.log("restoring CellSelected");
                    //show question
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );
                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });
                    break;

                case ServerGameState.TimerStartedForActiveTeam:
                    console.log("restoring TimerStartedForActiveTeam");
                    //show question
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );
                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });
                    //show timer
                    this.restoreTimerStartedStage();

                    break;

                case ServerGameState.TimerStartedForOtherTeams:
                    console.log("restoring TimerStartedForOtherTeams");
                    //show question
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );
                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });
                    //restore active team fields (active team already answered)
                    this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(hostState.tourActiveTeamId);

                    //restore other teams' fields due to how they answered and game settings
                    hostState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                        this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                    });

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              hostState.roundActiveTeamsNumber - hostState.lastAnsweredOtherTeamsIds.length - 1
                          );
                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    //show timer
                    this.restoreTimerStartedStage();

                    break;

                case ServerGameState.ActiveTeamGivesAnswer:
                    console.log("restoring ActiveTeamGivesAnswer");

                    //show question
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );
                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });
                    //show right answer and answer rate card
                    this.restoreTeamGivesAnswerStage(hostState.tourActiveTeamId);
                    break;

                case ServerGameState.ActiveTeamGaveNoRightAnswer:
                    console.log("restoring ActiveTeamGaveNoRightAnswer");
                    //show question
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    //restore active team fields (active team already answered)
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(hostState.tourActiveTeamId);

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(hostState.roundActiveTeamsNumber - 1);
                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    //show timer for other teams
                    this.restoreStartTimerForOtherTeams();
                    break;

                case ServerGameState.OtherTeamGivesAnswer:
                    console.log("restoring OtherTeamGivesAnswer");
                    //show question
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );
                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (
                            team.id !== hostState.tourActiveTeamId &&
                            team.id !== hostState.lastAnsweringTeamId && //if team is answering now but has no attempts it should not be blocked
                            this.isTeamHasNoAttempts(team.id)
                        )
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });
                    //restore active team fields (active team already answered)
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(hostState.tourActiveTeamId);
                    //restore other teams' fields due to how they answered and game settings
                    hostState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                        if (teamId !== hostState.lastAnsweringTeamId)
                            this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                    });

                    //reset timerLaunchesLeft
                    //backend has already counted launches left but frontend hasn't
                    this._setTimerLaunchesLeft(this.timerLaunchesLeft + 1);
                    console.log("timer launches left after reset: " + this.timerLaunchesLeft);

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              hostState.roundActiveTeamsNumber - hostState.lastAnsweredOtherTeamsIds.length - 1
                          );
                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    //show right answer and answer rate card
                    this.restoreTeamGivesAnswerStage(hostState.lastAnsweringTeamId);

                    break;

                case ServerGameState.QuestionAnsweredCorrectly:
                    console.log("restoring QuestionAnsweredCorrectly");
                    //show question
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );
                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    // новая активная команда была выбрана
                    // хост может выбирать ячейку
                    if (hostState.stateReentryNumber > 0) {
                        this.handleActiveTeamReceived(hostState.tourActiveTeamId);
                    } else {
                        //restore active team fields
                        //no need to restore other teams' fields if right answer was given by active team
                        this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(hostState.tourActiveTeamId);
                        //if team who gave right answer was from other teams
                        if (hostState.lastAnsweringTeamId !== this.activeTeam.id) {
                            //restore other teams' fields as their isAllowedToAnswer status might have changed
                            hostState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                                this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                            });
                        }

                        //reset teamsStillAllowedToAnswer
                        this.multipleExtrasTriesEnabled
                            ? this._setTeamsStillAllowedToAnswer(
                                  otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                              )
                            : this._setTeamsStillAllowedToAnswer(
                                  hostState.roundActiveTeamsNumber -
                                      hostState.lastAnsweredOtherTeamsIds.length -
                                      1
                              );
                        console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                        //show tour winner and right answer
                        this.restoreTourEndWithRightAnswer(hostState.lastAnsweringTeamId);
                    }
                    break;

                case ServerGameState.OtherTeamsGaveNoRightAnswer:
                    console.log("restoring OtherTeamsGaveNoRightAnswer");
                    //show question
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );
                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });
                    // никто не ответил и хост нажал на след вопрос
                    if (hostState.stateReentryNumber > 0) {
                        this.handleActiveTeamReceived(hostState.tourActiveTeamId);
                        break;
                    }

                    //restore active team fields
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(hostState.tourActiveTeamId);
                    //restore other teams' fields as their isAllowedToAnswer status might have changed
                    hostState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                        this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                    });

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              hostState.roundActiveTeamsNumber - hostState.lastAnsweredOtherTeamsIds.length - 1
                          );

                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    this.restoreTourEndButNoRightAnswer(hostState.lastAnsweringTeamId);
                    break;

                case ServerGameState.OtherTeamGaveWrongAnswer:
                    console.log("restoring OtherTeamGaveWrongAnswer");
                    //show question
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );
                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    // никто не ответил и хост нажал на след вопрос
                    if (hostState.stateReentryNumber > 0) {
                        this.handleActiveTeamReceived(hostState.tourActiveTeamId);
                        break;
                    }

                    //restore active team fields
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(hostState.tourActiveTeamId);
                    //restore other teams' fields as their isAllowedToAnswer status might have changed
                    hostState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                        this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                    });

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              hostState.roundActiveTeamsNumber - hostState.lastAnsweredOtherTeamsIds.length - 1
                          );

                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    if (ServerGameState.OtherTeamGaveWrongAnswer) {
                        // last team is nobody
                        if (
                            hostState.lastAnsweringTeamId === 0 ||
                            //all teams tried to answer
                            this.teamsStillAllowedToAnswer === 0 ||
                            //no more timer launches
                            this.timerLaunchesLimitForOtherTeams - timerStartNumberLimit === 0
                        ) {
                            //show no winner and right answer
                            this.restoreTourEndButNoRightAnswer(hostState.lastAnsweringTeamId);
                        }
                        //show timer for other teams
                        else this.restoreStartTimerForOtherTeams();
                    } else this.restoreTourEndButNoRightAnswer(hostState.lastAnsweringTeamId);
                    break;

                case ServerGameState.ActiveTeamAnsweredCorrectlyToRoundEnd: {
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              hostState.roundActiveTeamsNumber - hostState.lastAnsweredOtherTeamsIds.length - 1
                          );

                    this.restoreTourEndWithRightAnswer(hostState.tourActiveTeamId);
                    this._setRoundWinner(hostState.roundResultInfo.winningTeamId);
                    this._setVictoryType(hostState.roundResultInfo.victoryType);

                    break;
                }
                case ServerGameState.ActiveTeamAnsweredWrongToRoundEnd: {
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              hostState.roundActiveTeamsNumber - hostState.lastAnsweredOtherTeamsIds.length - 1
                          );

                    this.restoreTourEndButNoRightAnswer(hostState.tourActiveTeamId);
                    this._setRoundWinner(hostState.roundResultInfo.winningTeamId);
                    this._setVictoryType(hostState.roundResultInfo.victoryType);

                    break;
                }
                case ServerGameState.TimerForOtherTeamsStoppedToRoundEnd: {
                    //show question
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    // никто не ответил и хост нажал на след вопрос
                    if (hostState.stateReentryNumber > 0) {
                        this.handleActiveTeamReceived(hostState.tourActiveTeamId);
                        break;
                    }

                    //restore active team fields
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(hostState.tourActiveTeamId);

                    //restore other teams' fields as their isAllowedToAnswer status might have changed
                    hostState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                        this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                    });

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              hostState.roundActiveTeamsNumber - hostState.lastAnsweredOtherTeamsIds.length - 1
                          );

                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    this.restoreTourEndButNoRightAnswer(hostState.lastAnsweringTeamId);
                    this._setRoundWinner(hostState.roundResultInfo.winningTeamId);
                    this._setVictoryType(hostState.roundResultInfo.victoryType);

                    break;
                }
                case ServerGameState.OtherTeamAnsweredCorrectlyToRoundEnd: {
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              hostState.roundActiveTeamsNumber - hostState.lastAnsweredOtherTeamsIds.length - 1
                          );

                    this.restoreTourEndWithRightAnswer(hostState.lastAnsweringTeamId);
                    this._setRoundWinner(hostState.roundResultInfo.winningTeamId);
                    this._setVictoryType(hostState.roundResultInfo.victoryType);

                    break;
                }

                case ServerGameState.OtherTeamAnsweredWrongToRoundEnd: {
                    this.restoreQuestionAskingStage(
                        hostState.roundActiveTeamsIds,
                        hostState.tourActiveTeamId,
                        transformRestoreQuestion(hostState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            hostState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== hostState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              hostState.roundActiveTeamsNumber - hostState.lastAnsweredOtherTeamsIds.length - 1
                          );

                    this.restoreTourEndButNoRightAnswer(hostState.lastAnsweringTeamId);
                    this._setRoundWinner(hostState.roundResultInfo.winningTeamId);
                    this._setVictoryType(hostState.roundResultInfo.victoryType);

                    break;
                }
                case ServerGameState.RoundEndedAfterActiveTeamAnsweredWrong:
                case ServerGameState.RoundEndedAfterActiveTeamAnsweredCorrectly:
                case ServerGameState.RoundEndedAfterTimerForOtherTeamsExpired:
                case ServerGameState.RoundEndedAfterOtherTeamAnsweredCorrectly:
                case ServerGameState.RoundEndedAfterOtherTeamAnsweredWrong:
                case ServerGameState.RoundEnded:
                    console.log("restoring RoundEnded");
                    // restore active team
                    this.restoreActiveTeamReceived(hostState.roundActiveTeamsIds, hostState.tourActiveTeamId);
                    //show round results
                    this.handleRoundEnded(hostState.roundResultInfo);
                    break;

                case ServerGameState.GameEnded:
                    console.log("restoring GameEnded");
                    //restore active team
                    this.restoreActiveTeamReceived(hostState.roundActiveTeamsIds, hostState.tourActiveTeamId);
                    //show game results
                    this.handleGameEnded({ ...hostState.gameResult });
                    break;
            }
        },

        //#region real-time events handlers (updating data() fields and UI changes)

        handlePresentRoundQuestionTopics(questionTopics) {
            this.gameStartedStatus = false;

            this.setCurrentRoundQuestionTopics(questionTopics);

            this.isPresentingRoundTopicsState = true;
        },

        handleTeamsToPlayRoundReceived(teamsIds) {
            console.log("teams to play round received");
            this._startNewRound();
            this._setTeamsToPlayRound(teamsIds);
            console.log("teams to play round set");
            this._showTeamsToPlayRound();
        },

        handleActiveTeamReceived(teamId) {
            console.log("active team id received");
            this._setActiveTeam(teamId);
            this._startNewTour();
            this._letTeamAnswer(teamId);
            this._showCellInputForm();
            this.isPresentingRoundTopicsState = false;
            console.log("active team will select cell");
        },

        handleQuestionReceived(question) {
            console.log("question received");
            this._setActiveQuestion(question);
            this._setAttemptsAtStake(this.activeQuestion.difficulty);
            this._showQuestionForActiveTeam();
            console.log("question is shown");
        },

        handleNoTeamsLeftToAnswer() {
            if (this.timerLaunchesLeft > 0) {
                if (this.isAnyTeamNotAnsweredOnce()) this._setLastTeamIsAnsweredOnceStatus();
                if (this.isAnyTeamStillAllowedToAnswer()) this._makeLastTeamNotAllowedToAnswer();
            } else console.log("no more timer launches");
            console.log("team answered wrong from handleNoTeamsLeftToAnswer");
            if (this.isSomeTeamAnswering()) this._removeTeamAnsweringStatus();
            this._decreaseTimerLaunches(1);
            this._clearAttemptsAtStake();
            this._showRightAnswer();
        },

        handleTimerExpired(timerExpiredArgs) {
            const { isExpiredForOtherTeams } = timerExpiredArgs;

            isExpiredForOtherTeams === true
                ? this.handleTimerExpiredForOtherTeams(timerExpiredArgs)
                : this.handleTimerExpiredForActiveTeam(timerExpiredArgs);
        },

        handleTimerExpiredForActiveTeam() {
            console.log("timer expired for active team");

            this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(this.activeTeam.id);
            this._showTimerForOtherTeams();
        },

        handleTimerExpiredForOtherTeams(timerExpiredArgs) {
            const { isVictoryConditionMet } = timerExpiredArgs;

            console.log("timer expired for other teams");

            this._decreaseTimerLaunches(1);
            this._clearAttemptsAtStake();
            this._showRightAnswer();

            if (isVictoryConditionMet) {
                const { roundWinningTeamId, victoryType } = timerExpiredArgs;

                this._setRoundWinner(roundWinningTeamId);
                this._setVictoryType(victoryType);
            }
        },

        handleTeamInteraction(teamId, memberId) {
            console.log(`Member ${memberId} from team ${teamId} interacted`);
            if (!this.isTeamActive(teamId)) this._decreaseTeamAttemptsNumber(teamId, 1);

            this.interactedTeamMemberId = memberId;
            this._setTeamAnsweringStatus(teamId);
            this._stopCountdown();
            this._showTeamAnswerCard();
        },

        handleTeamAnsweredCorrectly(teamAnsweredArgs) {
            const { teamId, isVictoryConditionMet } = teamAnsweredArgs;

            const team = this.teamsToPlayRound.find((t) => t.id === teamId);

            team.isAnsweredOnce = true;
            team.isAllowedToAnswer = false;
            team.attemptsToInteract += this.attemptsAtStake;

            this.teamsStillAllowedToAnswer--;
            this.attemptsAtStake = 0;
            this.tourWinner = team;
            // todo: obsolete?
            this._removeTeamAnsweringStatus();

            this._showRightAnswer();
            if (isVictoryConditionMet === true) {
                const { winningTeamId, victoryType } = teamAnsweredArgs;

                this.roundWinner = this.teamsToPlayRound.find((t) => t.id === winningTeamId);
                this._setVictoryType(victoryType);
            }
        },

        async handleTeamAnsweredWrong(teamAnsweredArgs) {
            const { teamId } = teamAnsweredArgs;
            const isVictoryConditionMet =
                teamAnsweredArgs.isVictoryConditionMet === undefined
                    ? false
                    : teamAnsweredArgs.isVictoryConditionMet;

            this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);

            console.log("team " + teamId + " answered wrong from handleTeamAnsweredWrong");

            this._removeTeamAnsweringStatus();

            console.log(this.teamsStillAllowedToAnswer + " teams still can answer");

            if (this.timerLaunchesLeft > 0 && !isVictoryConditionMet) {
                if (!this.isTeamActive(teamId)) this._decreaseTimerLaunches(1);
                this._showTimerForOtherTeams();
            } else {
                console.log("no more timer launches");
                this._showRightAnswer();
            }

            if (isVictoryConditionMet) {
                const { winningTeamId, victoryType } = teamAnsweredArgs;

                this.roundWinner = this.teamsToPlayRound.find((t) => t.id === winningTeamId);
                this._setVictoryType(victoryType);
            }
        },

        handleRoundEnded(roundEndedArgs) {
            const { lastAnsweredTeamId, isLastAnsweredTeamCorrect } = roundEndedArgs;

            if (lastAnsweredTeamId !== 0)
                isLastAnsweredTeamCorrect
                    ? this.handleTeamAnsweredCorrectly({ teamId: roundEndedArgs.lastAnsweredTeamId })
                    : this.handleTeamAnsweredWrong({ teamId: roundEndedArgs.lastAnsweredTeamId });

            this._setRoundWinner(roundEndedArgs.winningTeamId);
            this._setVictoryType(roundEndedArgs.victoryType);
            this._setTeamRoundScore(roundEndedArgs.teamIdsToRightAnswerNumber);
            this._showRoundResults();
        },

        handleGameEnded(gameEndedArgs) {
            this._setTeamGameScore(gameEndedArgs.teamIdToGameScore);
            this._showGameResults();
        },

        //#endregion

        //#region button click actions (signalr tasks sending + UI changes, mostly async)

        async sendGameSettings(gameSettingsInput) {
            await this.submitGameSettings(gameSettingsInput);
            this._setGameConfigurationFromGameSettingsInput(gameSettingsInput);
            this._setTimerLaunchesLeft(
                gameSettingsInput.multipleExtrasTriesInTour.timerSettings.timerLaunchesLimit
            );
            this._setTeamsStillAllowedToAnswer(gameSettingsInput.teamsInRoundNumber);
            this._hideGameConfiguration();
            this._showLoginCodes();
        },

        async startGame() {
            await this._sendGameStartedTask();
            this._hideLoginCodes();
        },

        async startTour() {
            await this._sendContextActionTask();
        },

        async startRound() {
            this.currentRoundNumber++;
            await this._sendContextActionTask();
        },

        async selectCell() {
            const availableToSelect = await this._sendSelectCellTask();
            console.log("selectCell task sent");

            if (availableToSelect === false) {
                this._clearCellInputForm();
                console.warn("you can not select this cell");
            } else {
                this._hideCellInputForm();
            }
        },

        async rateCorrectAnswer() {
            console.log("team answer is right");
            await this._sendTeamAnswerIsCorrectTask();
        },

        async rateWrongAnswer() {
            console.log("team answer is wrong");
            await this._sendTeamAnswerIsWrongTask();
        },

        async startTimer() {
            await this._sendStartTimerTask();
            this._showTimerWindow();
            this._setInitialCountdownValue();
            this._launchCountdown();
            console.log("real timer launched");
        },

        async endTimer() {
            this._stopCountdown();
            this.timerSeconds = 0;
            console.log("real timer stopped");
            await this._sendStopTimerTask();
        },

        async skipExtraTimerLaunches() {
            while (this.timerLaunchesLeft >= 0) {
                await this.startTimer();
                await this.endTimer();
                this.timerLaunchesLeft--;
            }
        },

        confirmGameEnding() {
            return this.signalrClient.confirmGameEnding();
        },

        async copyTeamCodeToClipboard(code) {
            await navigator.clipboard.writeText(new URL(`team?code=${code}`, origin));
        },

        //#endregion

        //#region real-time tasks sending helpers (async)

        async _sendGameStartedTask() {
            await this.signalrClient.startGame();
            console.log("startGame task sent");
        },

        async _sendContextActionTask() {
            await this.signalrClient.contextAction();
            console.log("context action task sent");
        },

        async _sendSelectCellTask() {
            return await this.signalrClient.selectCell(parseInt(this.cell, 10));
        },

        async _sendTeamAnswerIsCorrectTask() {
            await this.signalrClient.reviewTeamAnswer(true);
            console.log("team answer review sent");
        },

        async _sendTeamAnswerIsWrongTask() {
            await this.signalrClient.reviewTeamAnswer(false);
            console.log("team answer review sent");
        },

        async _sendStartTimerTask() {
            await this.signalrClient.startTimer();
            console.log("start timer task sent");
        },

        async _sendStopTimerTask() {
            await this.signalrClient.stopTimer();
            console.log("stop timer task sent");
        },

        //#endregion

        //#region UI stage changes helpers

        _showGameConfiguration() {
            this.defineGameSettings = true;
        },

        _hideGameConfiguration() {
            this.defineGameSettings = false;
        },

        _showLoginCodes() {
            this.beforeGameStartStatus = true;
        },

        _hideLoginCodes() {
            this.beforeGameStartStatus = false;
        },

        _showTeamsToPlayRound() {
            this.gameStartedStatus = true;
        },

        _showTourInProgressUI() {
            this.roundStartedStatus = true;
        },

        _hideTourInProgressUI() {
            this.roundStartedStatus = false;
        },

        _startNewRound() {
            //clear ALL data fields
            this._clearDataFields();
            this._clearRoundInfo();
            console.log("------------------NEW ROUND------------------");
        },

        _startNewTour() {
            this._clearDataFields();
            console.log("------------------NEW TOUR------------------");
            this._showTourInProgressUI();
        },

        _showCellInputForm() {
            this.cellSelectionStage = true;
        },

        _clearCellInputForm() {
            this.cell = "";
        },

        _hideCellInputForm() {
            this.cellSelectionStage = false;
        },

        _showQuestionForActiveTeam() {
            this.questionFor = this.activeTeam.name;
            this.questionAskingStage = true;
        },

        _showTeamAnswerCard() {
            //hide question+timer card
            this.questionAskingStage = false;
            //show answer card
            this.teamAnswersStage = true;
        },

        _hideTeamAnswerCard() {
            //hide answer card
            this.teamAnswersStage = false;
            //show question+timer card
            this.questionAskingStage = true;
        },

        _showTimerForOtherTeams() {
            //change question+timer card heading
            this.questionFor = "всех команд";
            if (this.teamAnswersStage) this._hideTeamAnswerCard();
            //show start timer button
            this.timeStartedStage = false;
            console.log("waiting for another timer start");
        },

        _showRightAnswer() {
            //hide timer
            this.timeStartedStage = false;

            //hide answer card
            this.teamAnswersStage = false;

            //hide question content card with start timer button
            this.questionAskingStage = false;

            //show right answer, team who answered, and button to start next tour
            this.showRightAnswerStage = true;

            /*
                Сбрасываем, только тогда, когда вопрос был сыгран, для того, чтобы снова не показывать тему хосту,
                когда отвечают команды после активной.
                (То есть, только один раз показывать тему вопроса)
            */
            this.isAnnouncingQuestionTopicStep = true;
        },

        _showRoundResults() {
            //hide timer
            this.timeStartedStage = false;
            //hide answer card
            this.teamAnswersStage = false;
            //hide question content card with start timer button
            this.questionAskingStage = false;
            //hide teams who play round
            this._hideTourInProgressUI();
            //show round results
            this.roundEndedStatus = true;
        },

        _showGameResults() {
            //hide timer
            this.timeStartedStage = false;
            //hide answer card
            this.teamAnswersStage = false;
            //hide question content card with start timer button
            this.questionAskingStage = false;
            //hide teams who play round
            this._hideTourInProgressUI();
            this.roundEndedStatus = false;
            //show game results
            this.gameEndedStatus = true;
        },

        //#endregion

        //#region timer helpers

        _showTimerWindow() {
            this.timeStartedStage = true;
        },

        _setInitialCountdownValue() {
            this.timerSeconds = this.secondsToAnswer;
        },

        _launchCountdown() {
            this.timerInterval = setInterval(() => {
                this.timerSeconds -= 1;
            }, 1000);
        },

        _stopCountdown() {
            clearInterval(this.timerInterval);
        },

        //#endregion

        //#region data() fields change helpers

        _setGameConfiguration(configuration) {
            this.teamsInRoundNumber = configuration.roundActiveTeamsNumber;
            this.initialNumberOfAttemptsToAnswerAfterActiveTeam =
                configuration.initialNumberOfAttemptsToAnswerAfterActiveTeam;
            this.triesToCellDifficulty = configuration.triesNumberToCellDifficulty;
            this.multipleExtrasTriesEnabled = configuration.isTeamAllowedAnsweringMultipleTimes;
            this.isTimerStartNumberLimitForOtherTeamsEnabled =
                configuration.isTimerStartNumberLimitForOtherTeamsEnabled;
            this.timerLaunchesLimitForOtherTeams = configuration.timerStartNumberLimitForOtherTeams;
        },

        _setGameConfigurationFromGameSettingsInput(gameSettingsInput) {
            this.teamsInRoundNumber = gameSettingsInput.teamsInRoundNumber;
            this.initialNumberOfAttemptsToAnswerAfterActiveTeam = gameSettingsInput.defaultExtrasTries;
            this.triesToCellDifficulty = gameSettingsInput.triesToCellDifficulty;
            this.multipleExtrasTriesEnabled = gameSettingsInput.multipleExtrasTriesInTour.enabled;
            this.isTimerStartNumberLimitForOtherTeamsEnabled =
                gameSettingsInput.multipleExtrasTriesInTour.timerSettings.restrictTimerLaunches;
            this.timerLaunchesLimitForOtherTeams =
                gameSettingsInput.multipleExtrasTriesInTour.timerSettings.timerLaunchesLimit;

            // adhoc to update state value
            this.$store.state.host.teamsRoundsOrder.roundActiveTeamsNumber = this.teamsInRoundNumber;
        },

        _setTimerLaunchesLeft(limit) {
            this.timerLaunchesLeft = limit;
        },

        _decreaseTimerLaunches(minus) {
            this.timerLaunchesLeft -= minus;
        },

        _setTeamConnectedStatus(teamId) {
            this.$store.commit("host/SET_TEAM_CONNECTION_STATUS", teamId);
        },

        _setTeamsToPlayRound(teamsIds) {
            teamsIds.forEach((id) => {
                const teamsToExtend = this.teams.find((team) => team.id === id);
                const teamInRoundModel = TeamService.prepareTeamInRoundModel(teamsToExtend);
                teamInRoundModel.attemptsToInteract = this.initialNumberOfAttemptsToAnswerAfterActiveTeam;
                this.teamsToPlayRound.push(teamInRoundModel);
            });
        },

        _setActiveTeam(teamId) {
            this._removeLastActiveTeamStatusIfPossible();
            const receivedActiveTeam = this.teamsToPlayRound.find((team) => team.id === teamId);
            receivedActiveTeam.active = true;
            this.activeTeam = receivedActiveTeam;
        },

        _removeLastActiveTeamStatusIfPossible() {
            if (this.teamsToPlayRound.some((team) => team.active))
                this.teamsToPlayRound.find((team) => team.active).active = false;
        },

        _setActiveQuestion(question) {
            this.activeQuestion = this.questions.find((q) => q.id === question.questionId);
        },

        _setTeamsStillAllowedToAnswer(number) {
            this.teamsStillAllowedToAnswer = number;
        },

        _decreaseTeamsStillAllowedToAnswer() {
            this.teamsStillAllowedToAnswer--;
        },

        _getLastAnsweringTeamId() {
            return this.teamsToPlayRound.find((team) => !team.isAnsweredOnce).id;
        },

        _getLastAllowedToAnswerTeamId() {
            return this.teamsToPlayRound.find((team) => team.isAllowedToAnswer).id;
        },

        _setTeamIsAnsweredOnceStatus(teamId) {
            this.teamsToPlayRound.find((team) => team.id === teamId).isAnsweredOnce = true;
        },

        _setLastTeamIsAnsweredOnceStatus() {
            this._setTeamIsAnsweredOnceStatus(this._getLastAnsweringTeamId());
        },

        _clearAnsweredOnceStatus() {
            this.teamsToPlayRound.forEach((team) => {
                if (team.isAnsweredOnce) team.isAnsweredOnce = false;
            });
        },

        _setAttemptsAtStake(questionDifficulty) {
            switch (questionDifficulty) {
                case difficultyOptionsMap.get("easy").points: {
                    this.attemptsAtStake = this.triesToCellDifficulty.triesForEasy;
                    break;
                }
                case difficultyOptionsMap.get("medium").points: {
                    this.attemptsAtStake = this.triesToCellDifficulty.triesForMedium;
                    break;
                }
                case difficultyOptionsMap.get("hard").points: {
                    this.attemptsAtStake = this.triesToCellDifficulty.triesForHard;
                    break;
                }
            }
            console.log(this.attemptsAtStake + " attempts at stake");
        },

        _clearAttemptsAtStake() {
            this.attemptsAtStake = 0;
        },

        _setTeamAnsweringStatus(teamId) {
            this.teamsToPlayRound.find((team) => team.id === teamId).isAnswering = true;
        },

        _removeTeamAnsweringStatus() {
            const team = this.teamsToPlayRound.find((team) => team.isAnswering === true);
            if (team !== undefined) team.isAnswering = false;
        },

        _setTeamAttemptsNumber(teamId, attemptsNumber) {
            this.teamsToPlayRound.find((team) => team.id === teamId).attemptsToInteract = attemptsNumber;
        },

        _increaseTeamAttemptsNumber(teamId, plus) {
            this.teamsToPlayRound.find((team) => team.id === teamId).attemptsToInteract += plus;
            console.log("team`s attempt number increased");
        },

        _decreaseTeamAttemptsNumber(teamId, minus) {
            if (this.teamsToPlayRound.find((team) => team.id === teamId).attemptsToInteract > 0)
                this.teamsToPlayRound.find((team) => team.id === teamId).attemptsToInteract -= minus;
            console.log("team`s attempt number decreased");
        },

        _letTeamAnswer(teamId) {
            this.teamsToPlayRound.find((team) => team.id === teamId).isAllowedToAnswer = true;
        },

        _makeLastTeamNotAllowedToAnswer() {
            this._makeTeamNotAllowedToAnswer(this._getLastAllowedToAnswerTeamId());
        },

        _makeTeamNotAllowedToAnswer(teamId) {
            this.teamsToPlayRound.find((team) => team.id === teamId).isAllowedToAnswer = false;
            this._decreaseTeamsStillAllowedToAnswer();
        },

        _clearNotAllowedToAnswer() {
            this.teamsToPlayRound.forEach((team) => {
                if (team.isAllowedToAnswer === false && this.isTeamHasNoAttempts(team.id) === false)
                    team.isAllowedToAnswer = true;
            });
        },

        _setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId) {
            this._setTeamIsAnsweredOnceStatus(teamId);
            if (this.multipleExtrasTriesEnabled === false) this._makeTeamNotAllowedToAnswer(teamId);
            else if (this.isTeamHasNoAttempts(teamId) || this.isTeamActive(teamId))
                this._makeTeamNotAllowedToAnswer(teamId);
        },

        _makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(teamId) {
            this._setTeamIsAnsweredOnceStatus(teamId);
            this._makeTeamNotAllowedToAnswer(teamId);
        },

        _setTourWinner(teamId) {
            this.tourWinner = this.teamsToPlayRound.find((team) => team.id === teamId);
        },

        _setRoundWinner(winningTeamId) {
            this.roundWinner = this.teamsToPlayRound.find((team) => team.id === winningTeamId);
        },

        _setVictoryType(victoryType) {
            switch (victoryType) {
                case "CapturedCells": {
                    this.victoryType = " собрав квадрат.";
                    break;
                }
                case "More answers": {
                    this.victoryType = " по количеству ответов";
                    break;
                }
            }
        },

        _setTeamRoundScore(teamIdsToRightAnswerNumber) {
            this.teamsToPlayRound.forEach((team) => {
                team.roundScore = teamIdsToRightAnswerNumber[team.id];
            });
            this._sortRoundScores();
        },

        _setTeamGameScore(teamIdsToGameScore) {
            console.log(teamIdsToGameScore);
            this.teams.forEach((team) => {
                team.gameScore = teamIdsToGameScore[team.id];
            });
            this._sortGameScores();
        },

        _sortRoundScores() {
            this.teamsToPlayRound.sort((a, b) => {
                return b.roundScore - a.roundScore;
            });
        },

        _sortGameScores() {
            this.teams.sort((a, b) => {
                return b.gameScore - a.gameScore;
            });
        },

        _clearDataFields() {
            //game configuration fields won't shange
            this.gameStartedStatus = false;
            this.roundStartedStatus = false;
            this.cellSelectionStage = false;
            this.questionAskingStage = false;
            this.timeStartedStage = false;
            this.teamAnswersStage = false;
            this.showRightAnswerStage = false;
            //this.teamsToPlayRound won't change until next round
            //this.activeTeam has value;
            this.activeQuestion = {};
            this.questionFor = "";
            this.cell = "";
            //this.secondsToAnswer didn't change;
            this.timerSeconds = null;
            this.timerInterval = null;
            this._setTimerLaunchesLeft(this.timerLaunchesLimitForOtherTeams);
            this._setTeamsStillAllowedToAnswer(this.teamsInRoundNumber);
            this._clearAnsweredOnceStatus();
            this._clearNotAllowedToAnswer();
            this.tourWinner = {};
            this.roundEndedStatus = false;
            this.roundWinner = {};
        },

        _clearRoundInfo() {
            this.teamsToPlayRound = [];
            this.activeTeam = [];
        },

        //#endregion

        //#region data fields checks

        isTeamHasNoAttempts(teamId) {
            return this.teamsToPlayRound.find((team) => team.id === teamId).attemptsToInteract === 0;
        },

        isTeamActive(teamId) {
            return this.activeTeam.id === teamId;
        },

        isAnyTeamNotAnsweredOnce() {
            return this.teamsToPlayRound.some((team) => !team.isAnsweredOnce);
        },

        isAnyTeamStillAllowedToAnswer() {
            return this.teamsToPlayRound.some((team) => team.isAllowedToAnswer);
        },

        isSomeTeamAnswering() {
            return this.teamsToPlayRound.some((team) => team.isAnswering);
        },

        //#endregion

        //#region restore helpers

        restoreGameConfiguration(
            configuration,
            roundActiveTeamsNumber,
            lastAnsweredOtherTeamsNumber,
            timerStartNumberLimit
        ) {
            this._setGameConfiguration(configuration);
            configuration.isTimerStartNumberLimitForOtherTeamsEnabled //will need reset in some cases
                ? this._setTimerLaunchesLeft(timerStartNumberLimit)
                : this._setTimerLaunchesLeft(roundActiveTeamsNumber - timerStartNumberLimit);
            configuration.isTeamAllowedAnsweringMultipleTimes //will need reset in some cases
                ? this._setTeamsStillAllowedToAnswer(roundActiveTeamsNumber)
                : this._setTeamsStillAllowedToAnswer(roundActiveTeamsNumber - lastAnsweredOtherTeamsNumber);

            this._hideGameConfiguration();
            this._hideLoginCodes();
        },

        restoreGameStartedStage() {
            this._hideGameConfiguration();
            this._showLoginCodes();
        },

        restoreRoundStartedStage(teamsInRoundIds) {
            this._setTeamsToPlayRound(teamsInRoundIds);
            this._showTeamsToPlayRound();
        },

        restoreActiveTeamReceived(teamsInRoundIds, activeTeamId) {
            this._setTeamsToPlayRound(teamsInRoundIds);
            this._setActiveTeam(activeTeamId);
            this._letTeamAnswer(activeTeamId);
        },

        restoreCellSelectionStage(teamsInRoundIds, activeTeamId) {
            this.restoreActiveTeamReceived(teamsInRoundIds, activeTeamId);
            this._showCellInputForm();
        },

        restoreQuestionAskingStage(teamsInRoundIds, activeTeamId, receivedQuestion) {
            this.restoreActiveTeamReceived(teamsInRoundIds, activeTeamId);
            this.handleQuestionReceived(receivedQuestion);
        },

        restoreTimerStartedStage() {
            this._showTimerWindow();
            this._setInitialCountdownValue();
            this._launchCountdown();
            console.log("real timer launched");
        },

        restoreTeamGivesAnswerStage(teamId) {
            console.log("team " + teamId + " clicked the button");
            this._setTeamAnsweringStatus(teamId);
            this._showTeamAnswerCard();
        },

        restoreStartTimerForOtherTeams() {
            this._showTimerForOtherTeams();
        },

        restoreTourEndWithRightAnswer(teamId) {
            this._makeTeamNotAllowedToAnswer(teamId);
            this._clearAttemptsAtStake();
            this._setTourWinner(teamId);
            this._showRightAnswer();
        },

        restoreTourEndButNoRightAnswer(teamId) {
            if (teamId !== 0) this._makeTeamNotAllowedToAnswer(teamId);
            this._clearAttemptsAtStake();
            this._showRightAnswer();
        },

        //#endregion
    },
};
</script>

<style scoped>
.list {
    text-align: left;
    max-width: 1200px;
    margin: 0 auto;
}

ul {
    list-style-type: none;
    padding: 0;
    margin: 0 auto;
    display: grid;
    place-items: center;
    grid-auto-flow: column;
    gap: 10px;
}

.white-text {
    color: white;
}
</style>
