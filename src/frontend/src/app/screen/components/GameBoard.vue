<template>
    <div>
        <div v-if="beforeGameStartStatus">
            <b-card-body ref="codes" class="list d-flex flex-row justify-content-center align-items-baseline">
                <TeamAccessCodesViewer :teams="teams" :team-names="teamNames" />
            </b-card-body>
        </div>

        <div v-else class="card no-body">
            <b-tabs align="center" card>
                <b-tab title="Игра" active>
                    <div v-if="gameStartedStatus">
                        Раунд играют команды:
                        <ul>
                            <li
                                class="card p-2 m-3 white-text"
                                v-for="team in teamsToPlayRound"
                                :key="team.id"
                                :style="{ background: colors.get(team.id) }"
                            >
                                {{ teamNames[team.id] }}
                            </li>
                        </ul>
                    </div>

                    <div v-if="isPresentingRoundTopicsState">
                        <h1 class="display-5">Темы раунда</h1>

                        <ul class="d-flex flex-column py-5">
                            <li v-for="topic in currentRoundQuestionTopics" :key="topic.id">
                                <p class="mb-3 lead">
                                    {{ topic.name }}
                                </p>
                            </li>
                        </ul>
                    </div>

                    <div v-if="roundStartedStatus">
                        <teams-in-tour-viewer
                            :teams-in-tour="teamsToPlayRound"
                            :team-names="teamNames"
                            :should-hide-answering-team="!isAnsweringTeamVisible"
                        />

                        <div v-if="cellSelectionStage">
                            <p class="mt-3">
                                Ячейку выбирает
                                <strong :style="{ color: colors.get(activeTeam.id) }">
                                    {{ teamNames[activeTeam.id] }}
                                </strong>
                            </p>

                            <GameField :cells="cells" :activeTeamColor="colors.get(activeTeam.id)">
                            </GameField>
                        </div>

                        <div
                            v-if="questionAskingStage"
                            class="d-flex flex-row justify-content-center align-items-center"
                        >
                            <b-card
                                class="col-md-3 col-sm-8"
                                style="border: 10px solid"
                                :style="{
                                    'border-color': isAnsweringTeamVisible
                                        ? teamToAnswer
                                            ? colors.get(teamToAnswer.id)
                                            : '#000000'
                                        : '#000000',
                                }"
                            >
                                <h4>{{ activeQuestion.topicName }}</h4>

                                <p class="p-2 mt-3" v-if="shouldDisplayQuestionText">
                                    {{ activeQuestion.content }}
                                </p>

                                <b-card no-body v-if="timeStartedStage" class="mt-3">
                                    {{ timerSeconds }}
                                </b-card>

                                <p class="mt-3" v-if="teamAnswersStage">
                                    Отвечает

                                    <strong
                                        v-if="isAnsweringTeamVisible"
                                        :style="{ color: colors.get(teamToAnswer.id) }"
                                    >
                                        {{ teamNames[teamToAnswer.id] }}
                                    </strong>

                                    <strong v-else :style="{ color: 'black' }"> ... </strong>
                                </p>
                            </b-card>
                        </div>

                        <div
                            v-if="showRightAnswerStage"
                            class="row d-flex flex-row justify-content-center align-items-center"
                        >
                            <div class="mr-4 pr-4">
                                <p>Ответ на вопрос {{ selectedCellNumber }}</p>

                                <strong class="mt-2">{{ activeQuestion.answer }}</strong>
                            </div>

                            <GameField
                                class="mt-2 mr-4 ml-4 pl-4 pr-4"
                                :cells="cells"
                                :activeTeamColor="colors.get(activeTeam.id)"
                            >
                            </GameField>

                            <div class="ml-4 pl-4">
                                <span v-if="tourWinner.id">
                                    <p>Ответили</p>
                                    <strong class="mt-2" :style="{ color: colors.get(tourWinner.id) }">
                                        {{ teamNames[tourWinner.id] }}
                                    </strong>
                                </span>

                                <span v-else>Никто не ответил</span>

                                <br />

                                <div v-if="roundWinner.id" class="mt-5">
                                    Победили

                                    <strong :style="{ color: colors.get(roundWinner.id) }">
                                        {{ teamNames[roundWinner.id] }}
                                    </strong>

                                    {{ victoryType }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        v-if="roundEndedStatus"
                        class="row d-flex flex-row justify-content-center align-items-center"
                    >
                        <div class="mr-4 pr-4">
                            <strong>Раунд окончен</strong>

                            <div>
                                Победили

                                <strong :style="{ color: colors.get(roundWinner.id) }">
                                    {{ teamNames[roundWinner.id] }}
                                </strong>

                                {{ victoryType }}
                            </div>
                        </div>

                        <GameField
                            class="mt-2 mr-4 ml-4 pl-4 pr-4"
                            :cells="cells"
                            :activeTeamColor="colors.get(activeTeam.id)"
                        >
                        </GameField>

                        <div class="ml-4 pl-4">
                            <strong class="pb-3" style="color: #0275d8">
                                <b>Результаты</b>
                            </strong>

                            <div class="pb-2" v-for="team in teamsToPlayRound" :key="team.id">
                                <strong :style="{ color: colors.get(team.id) }">
                                    {{ teamNames[team.id] }}:
                                </strong>

                                <span class="ml-2">{{ team.roundScore }}</span>
                            </div>
                        </div>
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
                                    <strong :style="{ color: colors.get(team.id) }">
                                        {{ teamNames[team.id] }}:
                                    </strong>

                                    <span class="ml-2">{{ team.gameScore }}</span>
                                </div>
                            </b-card>
                        </b-card-body>
                    </div>
                </b-tab>

                <b-tab title="Коды">
                    <b-card-body
                        ref="codes"
                        class="list d-flex flex-row justify-content-center align-items-baseline"
                    >
                        <TeamAccessCodesViewer
                            :teams="teams"
                            :team-names="teamNames"
                            :teams-ids-to-highlight="teamsToPlayRound.map((t) => t.id)"
                        />
                    </b-card-body>
                </b-tab>
            </b-tabs>
        </div>

        <div>
            <audio ref="teamAudio" />
        </div>
    </div>
</template>

<script>
import { mapMutations, mapState } from "vuex";

import colors from "@/app/shared/teamColors";
import TeamService from "@/app/team/services/TeamService";
import GameField from "@/app/screen/components/GameField";
import { ServerGameState } from "@/app/shared/SignalrWombat";
import { transformRestoreQuestion } from "@/app/shared/restoreUtils";
import cellNumbersByDifficulty from "@/app/screen/constants/CellNumberListByDifficulty";
import cellColorByDifficulty from "@/app/screen/constants/CellColorByDifficulty";
import { CellDifficultyOptions } from "@/app/screen/constants/CellDifficultyOptions";
import difficultyOptionsMap from "@/app/shared/difficultyOptions";
import TeamAccessCodesViewer from "@/app/shared/components/TeamAccessCodesViewer/TeamAccessCodesViewer";
import TeamsInTourViewer from "@/app/shared/components/TeamsInTourViewer";
import { SET_BACKEND_ACTOR_STATE, SET_TEAM_NAME } from "@/app/shared/store/modules/mutations";
import { b64toBlob } from "@/app/shared/utils";

export default {
    name: "GameBoard",

    components: { TeamAccessCodesViewer, GameField, TeamsInTourViewer },

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

            beforeGameStartStatus: true,
            gameStartedStatus: false,
            isPresentingRoundTopicsState: false,
            roundStartedStatus: false,
            cellSelectionStage: false,
            questionAskingStage: false,
            shouldDisplayQuestionText: false,
            timeStartedStage: false,
            teamAnswersStage: false,
            showRightAnswerStage: false,

            teamsToPlayRound: [],
            activeTeam: {},
            activeQuestion: {},
            cells: [],
            selectedCellNumber: -1,
            attemptsAtStake: 0,
            teamToAnswer: {},

            secondsToAnswer: 5,
            timerSeconds: null,
            timerInterval: null,

            // сколько времени ждать, перед тем как показать какая из остальных команд ответила
            suspenseTimeInMs: 1100,
            // отображается ли ответившая команда. Используется чтобы ненадолго скрывать ответившую команд
            isAnsweringTeamVisible: true,

            timerLaunchesLeft: 0,
            teamsStillAllowedToAnswer: 0,

            tourWinner: {},
            roundWinner: {},
            victoryType: "",

            roundEndedStatus: false,
            gameEndedStatus: false,
        };
    },

    async created() {
        this._setInitialCellGrid();
        const backendState = await this.signalrClient.getState();

        this.$store.commit(SET_BACKEND_ACTOR_STATE, backendState);
        this.restoreState(backendState);
    },

    computed: {
        ...mapState({
            signalrClient: (state) => state.screen.signalrClient,
            teams: (state) => state.screen.gameInfo.teams,
            questions: (state) => state.screen.gameInfo.questions,
            currentRoundQuestionTopics: (state) => state.screen.roundQuestionTopics.currentRoundQuestionTopics,
            teamNames: (state) => state.teamNames.all,
        }),
    },

    mounted() {
        this.signalrClient.onGameHostStartedGame((gameConfiguration) =>
            this.handleGameStarted(gameConfiguration)
        );
        this.signalrClient.onActiveTeamsSelected((teamsIds) => this.handleTeamsToPlayRoundReceived(teamsIds));
        this.signalrClient.onPresentRoundQuestionTopics((questionTopics) =>
            this.handlePresentRoundQuestionTopics(questionTopics)
        );
        this.signalrClient.onNextActiveTeamSelected((teamId) => this.handleActiveTeamReceived(teamId));
        this.signalrClient.onCellSelected((cellNumber) => this.handleCellReceived(cellNumber));
        this.signalrClient.onNextQuestionSelected((question) => this.handleQuestionReceived(question));
        this.signalrClient.onTimerStarted((timerStartedArgs) => this.handleTimerStarted(timerStartedArgs));
        this.signalrClient.onTeamInteracted((teamId, _, timeToSuspenseInMs) =>
            this.handleTeamInteraction(teamId, timeToSuspenseInMs)
        );
        this.signalrClient.onTeamAnsweredCorrectly((args) => this.handleTeamAnsweredCorrectly(args));
        this.signalrClient.onTeamAnsweredWrong((args) => this.handleTeamAnsweredWrong(args));
        this.signalrClient.onNoTeamsLeftToAnswer(this.handleNoTeamsLeftToAnswer.bind(this));
        this.signalrClient.onTimerExpired((timerExpiredArgs) => this.handleTimerExpired(timerExpiredArgs));
        this.signalrClient.onRoundEnded((roundEndedArgs) => this.handleRoundEnded(roundEndedArgs));
        this.signalrClient.onGameEnded((gameEndedArgs) => this.handleGameEnded(gameEndedArgs));

        this.signalrClient.onTeamChangedName((teamId, newName) => {
            this.$store.commit(SET_TEAM_NAME, { teamId, name: newName });
        });

        this.signalrClient.onTeamVoiceDataRecorded(async (data) => {
            /*
                WIP as an example
            */
            const blob = await b64toBlob(data, "audio/ogg; codecs=opus");
            this.$refs.teamAudio.src = window.URL.createObjectURL(blob);
            this.$refs.teamAudio.play();
        });
    },

    watch: {
        async timerSeconds(newVal) {
            if (newVal === 0) {
                this._stopCountdown();
                console.log("visual timer stopped");
            }
        },
    },

    methods: {
        ...mapMutations({
            setCurrentRoundQuestionTopics: "screen/SET_CURRENT_ROUND_QUESTION_TOPICS",
        }),

        restoreState(screenState) {
            //#region helper variables for defining timerLaunchesLeft and teamsStillAllowedToAnswer
            const timerStartNumberLimit = screenState.gameConfiguration
                .isTimerStartNumberLimitForOtherTeamsEnabled
                ? screenState.optionalFeaturesData.remainingNumberToStartTimerForOtherTeamInTour
                : screenState.lastAnsweredOtherTeamsIds.length;

            const otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes =
                screenState.roundActiveTeamsIds.reduce((accum, teamId) => {
                    const { teamIdToAttemptsToAnswerAfterActiveTeam, tourActiveTeamId } = screenState;

                    if (teamId !== tourActiveTeamId && teamIdToAttemptsToAnswerAfterActiveTeam[teamId] > 0) {
                        accum.push(teamId);
                    }

                    return accum;
                }, []);

            //#endregion

            this.setCurrentRoundQuestionTopics(screenState.currentRoundQuestionTopics);

            if (screenState.gameState !== ServerGameState.Init) {
                console.log("restoring base configuration");
                this.restoreGameConfiguration(
                    screenState.gameConfiguration,
                    screenState.lastAnsweredOtherTeamsIds.length,
                    timerStartNumberLimit
                );

                this.restoreGameField(
                    screenState.cellNumberWithCurrentDifficulty,
                    screenState.cellNumberToCapturedTeamId
                );
            }

            console.log(`Restoring ${ServerGameState[screenState.gameState]}`);

            switch (screenState.gameState) {
                case ServerGameState.Corrupted:
                    console.warn("Returned corrupted state");
                    break;
                case ServerGameState.PresentingActiveTeams:
                    //show round started stage
                    this.restoreRoundStartedStage(screenState.roundActiveTeamsIds);
                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    break;
                case ServerGameState.PresentingRoundTopics:
                    /*
                     * Копипаста с PresentingActiveTeams
                     */

                    //show round started stage
                    this.restoreRoundStartedStage(screenState.roundActiveTeamsIds);

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    this.gameStartedStatus = false;
                    this.isPresentingRoundTopicsState = true;
                    break;
                case ServerGameState.RoundStarted:
                    //show cell selection stage
                    this.restoreActiveTeamReceived(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });
                    break;
                case ServerGameState.CellSelected:
                    //show question
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );
                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });
                    break;

                case ServerGameState.TimerStartedForActiveTeam:
                    //show question
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );
                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });
                    //show timer
                    this.restoreTimerStartedStage({ shouldDisplayQuestionText: false });

                    break;

                case ServerGameState.TimerStartedForOtherTeams: {
                    //show question
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    //restore active team fields (active team already answered)
                    this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(screenState.tourActiveTeamId);

                    //restore other teams' fields due to how they answered and game settings
                    screenState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                        this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                    });

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              screenState.gameConfiguration.roundActiveTeamsNumber -
                                  screenState.lastAnsweredOtherTeamsIds.length -
                                  1
                          );
                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    //show timer and question text
                    this.restoreTimerStartedStage({ shouldDisplayQuestionText: true });
                    break;
                }

                case ServerGameState.ActiveTeamGivesAnswer:
                    //show question
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    //show right answer and answer rate card
                    this.restoreTeamGivesAnswerStage(screenState.tourActiveTeamId);
                    break;

                case ServerGameState.OtherTeamGivesAnswer:
                    //show question
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (
                            team.id !== screenState.tourActiveTeamId &&
                            team.id !== screenState.lastAnsweringTeamId && //if team is answering now but has no attempts it should not be blocked
                            this.isTeamHasNoAttempts(team.id)
                        )
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    //restore active team fields (active team already answered)
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(screenState.tourActiveTeamId);

                    //restore other teams' fields due to how they answered and game settings
                    screenState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                        if (teamId !== screenState.lastAnsweringTeamId)
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
                              screenState.gameConfiguration.roundActiveTeamsNumber -
                                  screenState.lastAnsweredOtherTeamsIds.length -
                                  1
                          );
                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    //show right answer and answer rate card
                    this.restoreTeamGivesAnswerStage(screenState.lastAnsweringTeamId);

                    break;

                case ServerGameState.QuestionAnsweredCorrectly:
                    //show question
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    // новая активная команда была выбрана
                    // хост может выбирать ячейку
                    if (screenState.stateReentryNumber > 0) {
                        this.handleActiveTeamReceived(screenState.tourActiveTeamId);
                    } else {
                        //restore active team fields
                        //no need to restore other teams' fields if right answer was given by active team
                        this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(screenState.tourActiveTeamId);

                        //if team who gave right answer was from other teams
                        if (screenState.lastAnsweringTeamId !== this.activeTeam.id) {
                            //restore other teams' fields as their isAllowedToAnswer status might have changed
                            screenState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                                this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                            });
                        }

                        //reset teamsStillAllowedToAnswer
                        this.multipleExtrasTriesEnabled
                            ? this._setTeamsStillAllowedToAnswer(
                                  otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                              )
                            : this._setTeamsStillAllowedToAnswer(
                                  screenState.gameConfiguration.roundActiveTeamsNumber -
                                      screenState.lastAnsweredOtherTeamsIds.length -
                                      1
                              );
                        console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                        //show tour winner and right answer
                        this.restoreTourEndWithRightAnswer(screenState.lastAnsweringTeamId);
                    }
                    break;

                case ServerGameState.OtherTeamsGaveNoRightAnswer:
                    //show question
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    // никто не ответил и хост нажал на след вопрос
                    if (screenState.stateReentryNumber > 0) {
                        this.handleActiveTeamReceived(screenState.tourActiveTeamId);
                        break;
                    }

                    //restore active team fields
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(screenState.tourActiveTeamId);

                    //restore other teams' fields as their isAllowedToAnswer status might have changed
                    screenState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                        this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                    });

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              screenState.gameConfiguration.roundActiveTeamsNumber -
                                  screenState.lastAnsweredOtherTeamsIds.length -
                                  1
                          );

                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    this.restoreTourEndButNoRightAnswer(screenState.lastAnsweringTeamId);
                    break;

                case ServerGameState.OtherTeamGaveWrongAnswer:
                    //show question
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    // никто не ответил и хост нажал на след вопрос
                    if (screenState.stateReentryNumber > 0) {
                        this.handleActiveTeamReceived(screenState.tourActiveTeamId);
                        break;
                    }

                    //restore active team fields
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(screenState.tourActiveTeamId);
                    //restore other teams' fields as their isAllowedToAnswer status might have changed
                    screenState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                        this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                    });

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              screenState.gameConfiguration.roundActiveTeamsNumber -
                                  screenState.lastAnsweredOtherTeamsIds.length -
                                  1
                          );

                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);
                    // last team is nobody
                    if (
                        screenState.lastAnsweringTeamId === 0 ||
                        //all teams tried to answer
                        this.teamsStillAllowedToAnswer === 0 ||
                        //no more timer launches
                        this.timerLaunchesLimitForOtherTeams - timerStartNumberLimit === 0
                    ) {
                        //show no winner and right answer
                        this.restoreTourEndButNoRightAnswer(screenState.lastAnsweringTeamId);
                    }
                    //show timer for other teams
                    else this.restoreStartTimerForOtherTeams();
                    break;

                case ServerGameState.ActiveTeamGaveNoRightAnswer:
                    //show question
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );

                    ///restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    //restore active team fields (active team already answered)
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(screenState.tourActiveTeamId);

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              screenState.gameConfiguration.roundActiveTeamsNumber - 1
                          );
                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    //show timer for other teams
                    this.restoreStartTimerForOtherTeams();
                    break;

                case ServerGameState.ActiveTeamAnsweredCorrectlyToRoundEnd: {
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    //restore active team fields
                    //no need to restore other teams' fields if right answer was given by active team
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(screenState.tourActiveTeamId);

                    //if team who gave right answer was from other teams
                    if (screenState.lastAnsweringTeamId !== this.activeTeam.id) {
                        //restore other teams' fields as their isAllowedToAnswer status might have changed
                        screenState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                            this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                        });
                    }

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              screenState.gameConfiguration.roundActiveTeamsNumber -
                                  screenState.lastAnsweredOtherTeamsIds.length -
                                  1
                          );
                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    //show tour winner and right answer
                    this.restoreTourEndWithRightAnswer(screenState.tourActiveTeamId);

                    this._setRoundWinner(screenState.roundResultInfo.winningTeamId);
                    this._setVictoryType(screenState.roundResultInfo.victoryType);
                    break;
                }
                case ServerGameState.ActiveTeamAnsweredWrongToRoundEnd: {
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    //restore active team fields
                    //no need to restore other teams' fields if right answer was given by active team
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(screenState.tourActiveTeamId);

                    //if team who gave right answer was from other teams
                    if (screenState.lastAnsweringTeamId !== this.activeTeam.id) {
                        //restore other teams' fields as their isAllowedToAnswer status might have changed
                        screenState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                            this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                        });
                    }

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              screenState.gameConfiguration.roundActiveTeamsNumber -
                                  screenState.lastAnsweredOtherTeamsIds.length -
                                  1
                          );
                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    //show tour winner and right answer
                    this.restoreTourEndButNoRightAnswer(screenState.tourActiveTeamId);

                    this._setRoundWinner(screenState.roundResultInfo.winningTeamId);
                    this._setVictoryType(screenState.roundResultInfo.victoryType);
                    break;
                }

                case ServerGameState.TimerForOtherTeamsStoppedToRoundEnd:
                    //show question
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    // никто не ответил и хост нажал на след вопрос
                    if (screenState.stateReentryNumber > 0) {
                        this.handleActiveTeamReceived(screenState.tourActiveTeamId);
                        break;
                    }

                    //restore active team fields
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(screenState.tourActiveTeamId);

                    //restore other teams' fields as their isAllowedToAnswer status might have changed
                    screenState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                        this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                    });

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              screenState.gameConfiguration.roundActiveTeamsNumber -
                                  screenState.lastAnsweredOtherTeamsIds.length -
                                  1
                          );

                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    this.restoreTourEndButNoRightAnswer(screenState.lastAnsweringTeamId);

                    this._setRoundWinner(screenState.roundResultInfo.winningTeamId);
                    this._setVictoryType(screenState.roundResultInfo.victoryType);

                    break;

                case ServerGameState.OtherTeamAnsweredCorrectlyToRoundEnd: {
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    //restore active team fields
                    //no need to restore other teams' fields if right answer was given by active team
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(screenState.tourActiveTeamId);

                    //if team who gave right answer was from other teams
                    if (screenState.lastAnsweringTeamId !== this.activeTeam.id) {
                        //restore other teams' fields as their isAllowedToAnswer status might have changed
                        screenState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                            this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                        });
                    }

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              screenState.gameConfiguration.roundActiveTeamsNumber -
                                  screenState.lastAnsweredOtherTeamsIds.length -
                                  1
                          );
                    console.log("teams left to answer after reset: " + this.teamsStillAllowedToAnswer);

                    //show tour winner and right answer
                    this.restoreTourEndWithRightAnswer(screenState.lastAnsweringTeamId);

                    this._setRoundWinner(screenState.roundResultInfo.winningTeamId);
                    this._setVictoryType(screenState.roundResultInfo.victoryType);
                    break;
                }

                case ServerGameState.OtherTeamAnsweredWrongToRoundEnd: {
                    this.restoreQuestionAskingStage(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId,
                        screenState.cellNumberInPlay,
                        transformRestoreQuestion(screenState.questionInPlay)
                    );

                    //restore teams attempts and corresponding isAllowedToAnswer status
                    this.teamsToPlayRound.forEach((team) => {
                        this._setTeamAttemptsNumber(
                            team.id,
                            screenState.teamIdToAttemptsToAnswerAfterActiveTeam[team.id]
                        );
                        if (team.id !== screenState.tourActiveTeamId && this.isTeamHasNoAttempts(team.id))
                            this._makeTeamNotAllowedToAnswer(team.id);
                    });

                    //restore active team fields
                    //no need to restore other teams' fields if right answer was given by active team
                    this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(screenState.tourActiveTeamId);

                    //if team who gave right answer was from other teams
                    if (screenState.lastAnsweringTeamId !== this.activeTeam.id) {
                        //restore other teams' fields as their isAllowedToAnswer status might have changed
                        screenState.lastAnsweredOtherTeamsIds.forEach((teamId) => {
                            this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
                        });
                    }

                    //reset teamsStillAllowedToAnswer
                    this.multipleExtrasTriesEnabled
                        ? this._setTeamsStillAllowedToAnswer(
                              otherTeamsLeftToAnswerIdsWhenTeamAllowedAnsweringMultipleTimes.length
                          )
                        : this._setTeamsStillAllowedToAnswer(
                              screenState.gameConfiguration.roundActiveTeamsNumber -
                                  screenState.lastAnsweredOtherTeamsIds.length -
                                  1
                          );

                    //show tour winner and right answer
                    this.restoreTourEndButNoRightAnswer(screenState.lastAnsweringTeamId);
                    this._setRoundWinner(screenState.roundResultInfo.winningTeamId);
                    this._setVictoryType(screenState.roundResultInfo.victoryType);

                    break;
                }

                case ServerGameState.RoundEndedAfterActiveTeamAnsweredWrong:
                case ServerGameState.RoundEndedAfterActiveTeamAnsweredCorrectly:
                case ServerGameState.RoundEndedAfterTimerForOtherTeamsExpired:
                case ServerGameState.RoundEndedAfterOtherTeamAnsweredCorrectly:
                case ServerGameState.RoundEndedAfterOtherTeamAnsweredWrong:
                case ServerGameState.RoundEnded:
                    // restore active team
                    this.restoreActiveTeamReceived(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId
                    );

                    //show round results
                    this.handleRoundEnded(screenState.roundResultInfo);
                    break;

                case ServerGameState.GameEnded:
                    //restore active team
                    this.restoreActiveTeamReceived(
                        screenState.roundActiveTeamsIds,
                        screenState.tourActiveTeamId
                    );

                    //show game results
                    this.handleGameEnded({ ...screenState.gameResult });
                    break;
            }
        },

        //#region real-time events handlers (updating data() fields and UI changes)

        handlePresentRoundQuestionTopics(questionTopics) {
            this.gameStartedStatus = false;

            this.setCurrentRoundQuestionTopics(questionTopics);

            this.isPresentingRoundTopicsState = true;
        },

        handleGameConfigurationReceived(configuration) {
            console.log("game configuration received");
            this._setGameConfiguration(configuration);
            this._setTimerLaunchesLeft(configuration.isTimerStartNumberLimitForOtherTeamsEnabled);
            this._setTeamsStillAllowedToAnswer(configuration.timerStartNumberLimitForOtherTeams);
        },

        handleGameStarted(gameConfiguration) {
            console.log("game started event received");
            this.handleGameConfigurationReceived(gameConfiguration);
            this._hideLoginCodes();
            console.log("game started");
        },

        handleTeamsToPlayRoundReceived(teamsIds) {
            console.log("teams to play round received");
            this._startNewRound();
            this._setTeamsToPlayRound(teamsIds);
            this._showTeamsToPlayRound();
            console.log("teams to play round set");
        },

        handleActiveTeamReceived(teamId) {
            console.log("active team id received");

            this._setActiveTeam(teamId);
            this._startNewTour();
            this._letTeamAnswer(teamId);
            this._showGameField();

            console.log("active team will select cell");
        },

        handleCellReceived(cellNumber) {
            console.log("selected cell received");
            this._setSelectedCellNumber(cellNumber);
            this._activateCell();
        },

        handleQuestionReceived(question) {
            console.log("question received");
            this._setActiveQuestion(question);
            this._setAttemptsAtStake(this.activeQuestion.difficulty);
            this._openSelectedCell();
            console.log("host asks question now");
        },

        handleTimerStarted(timerStartedArgs) {
            if (this.teamsStillAllowedToAnswer !== 0) {
                console.log("timer value received");
                if (timerStartedArgs.shouldDisplayQuestionText) {
                    this._showQuestionText();
                }
                this._showTimerWindow();
                this._setInitialCountdownValue();
                this._launchCountdown();
            }
        },

        handleTeamInteraction(teamId, timeToSuspenseInMs) {
            console.log("team " + teamId + " interaction received");
            if (!this.isTeamActive(teamId)) {
                this.suspenseTimeInMs = timeToSuspenseInMs;
                this._decreaseTeamAttemptsNumber(teamId, 1);
                this.isAnsweringTeamVisible = false;
                setTimeout(() => (this.isAnsweringTeamVisible = true), this.suspenseTimeInMs);
            }

            this._setTeamAnsweringStatus(teamId);
            this._stopCountdown();
            console.log("timer stopped");

            this._setTeamToAnswer(teamId);

            this._showAnsweringTeam();
        },

        handleTeamAnsweredCorrectly(teamAnsweredArgs) {
            const { teamId, isVictoryConditionMet } = teamAnsweredArgs;

            const team = this.teamsToPlayRound.find((t) => t.id === teamId);

            team.isAnsweredOnce = true;
            team.isAllowedToAnswer = false;
            team.attemptsToInteract += this.attemptsAtStake;

            this.teamsStillAllowedToAnswer--;
            this.tourWinner = team;
            this._clearAttemptsAtStake();

            this._paintCell(teamId);
            this._increaseCellTimesPlayed();

            this._removeTeamAnsweringStatus();
            this._clearTeamToAnswer();
            this._showRightAnswer();

            if (isVictoryConditionMet) {
                const { winningTeamId, victoryType } = teamAnsweredArgs;

                this._setRoundWinner(winningTeamId);
                this._setVictoryType(victoryType);
            }
        },

        handleTeamAnsweredWrong(teamAnsweredArgs) {
            const { teamId } = teamAnsweredArgs;
            const isVictoryConditionMet =
                teamAnsweredArgs.isVictoryConditionMet === undefined
                    ? false
                    : teamAnsweredArgs.isVictoryConditionMet;

            this._setTeamIsAllowedToAnswerStatusAfterHavingAnsweredOnce(teamId);
            console.log("team " + teamId + " answered wrong from handleTeamAnsweredWrong");

            this._removeTeamAnsweringStatus();
            this._clearTeamToAnswer();

            console.log(this.teamsStillAllowedToAnswer + " teams still can answer");

            if (this.timerLaunchesLeft > 0 && !isVictoryConditionMet) {
                if (!this.isTeamActive(teamId)) this._decreaseTimerLaunches(1);
                this._showTimerForOtherTeams();
            } else {
                console.log("no more timer launches");

                this._deactivateCell();
                this._showRightAnswer();
            }

            if (isVictoryConditionMet) {
                const { winningTeamId, victoryType } = teamAnsweredArgs;

                this._setRoundWinner(winningTeamId);
                this._setVictoryType(victoryType);
            }
        },

        handleTimerExpired(timerExpiredArgs) {
            timerExpiredArgs.isExpiredForOtherTeams === true
                ? this.handleTimerExpiredForOtherTeams(timerExpiredArgs)
                : this.handleTimerExpiredForActiveTeam(timerExpiredArgs);
        },

        handleTimerExpiredForActiveTeam() {
            console.log("timer expired for active team");

            this._equalizeTimers();

            this._makeTeamNotAllowedToAnswerAfterHavingAnsweredOnce(this.activeTeam.id);
            this._showTimerForOtherTeams();
        },

        handleTimerExpiredForOtherTeams(timerExpiredArgs) {
            console.log("timer expired for other teams");

            const { isVictoryConditionMet } = timerExpiredArgs;

            this._decreaseTimerLaunches(1);
            this._clearAttemptsAtStake();

            this._deactivateCell();
            this._reduceCellDifficultyIfPossible();
            this._increaseCellTimesPlayed();

            this._showRightAnswer();

            if (isVictoryConditionMet) {
                const { roundWinningTeamId, victoryType } = timerExpiredArgs;

                this._setRoundWinner(roundWinningTeamId);
                this._setVictoryType(victoryType);
            }
        },

        handleNoTeamsLeftToAnswer() {
            if (this.timerLaunchesLeft > 0) {
                if (this.isAnyTeamNotAnsweredOnce()) this._setLastTeamIsAnsweredOnceStatus();
                if (this.isAnyTeamStillAllowedToAnswer()) this._makeLastTeamNotAllowedToAnswer();
            } else console.log("no more timer launches");

            console.log("team answered wrong from handleNoTeamsLeftToAnswer");
            if (this.isSomeTeamAnswering()) this._removeTeamAnsweringStatus();
            this._clearTeamToAnswer();
            this._decreaseTimerLaunches(1);
            this._clearAttemptsAtStake();

            this._deactivateCell();

            this._showRightAnswer();
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
            gameEndedArgs.isLastAnsweredTeamCorrect
                ? this.handleTeamAnsweredCorrectly({ teamId: gameEndedArgs.lastAnsweredTeamId })
                : this.handleTeamAnsweredWrong({ teamId: gameEndedArgs.lastAnsweredTeamId });

            this._setTeamGameScore(gameEndedArgs.teamIdToGameScore);

            setTimeout(() => this._showGameResults(), 5000);
        },

        //#endregion

        //#region UI stage changes helpers

        _hideLoginCodes() {
            this.beforeGameStartStatus = false;
        },

        _showTeamsToPlayRound() {
            this.gameStartedStatus = true;
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
            this.roundStartedStatus = true;
        },

        _showGameField() {
            this.cellSelectionStage = true;
        },

        _openSelectedCell() {
            this.cellSelectionStage = false;
            this.questionAskingStage = true;
        },

        _showTimerWindow() {
            this.timeStartedStage = true;
        },

        _showAnsweringTeam() {
            this.teamAnswersStage = true;
        },

        _showQuestionText() {
            this.shouldDisplayQuestionText = true;
        },

        _showTimerForOtherTeams() {
            //hide team who answers
            this.teamAnswersStage = false;
            //show start timer button
            this.timeStartedStage = false;
            console.log("waiting for another timer start");
        },

        _showRightAnswer() {
            //hide team who answers
            this.teamAnswersStage = false;
            //hide timer
            this.timeStartedStage = false;
            //hide question content card with start timer button
            this.questionAskingStage = false;
            //show right answer, team who answered, and game field
            this.showRightAnswerStage = true;
        },

        _showRoundResults() {
            //hide team who answers
            this.teamAnswersStage = false;
            //hide timer
            this.timeStartedStage = false;
            //hide question content card with start timer button
            this.questionAskingStage = false;
            //hide right answer
            this.showRightAnswerStage = false;
            //hide teams who play round
            this.roundStartedStatus = false;
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
            this.roundStartedStatus = false;
            //hide round results
            this.roundEndedStatus = false;
            //hide right answer
            this.showRightAnswerStage = false;
            //show game results
            this.gameEndedStatus = true;
        },

        //#endregion

        //#region timer helpers

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

        _equalizeTimers() {
            if (this.timerSeconds > 0) {
                this._stopCountdown();
                this.timerSeconds = 0;
                console.log("timer stopped from backend");
            }
        },

        //#endregion

        //#region cell grid changes helpers

        _setInitialCellGrid() {
            cellNumbersByDifficulty.forEach((numberList, difficultyPoint) => {
                numberList.forEach((number) => {
                    this.cells.push({
                        number: number,
                        active: false,
                        color: cellColorByDifficulty.get(difficultyPoint),
                        difficulty: difficultyPoint,
                        timesPlayed: 0,
                    });
                });
            });

            this.cells.sort((a, b) => {
                return a.number - b.number;
            });
        },

        _activateCell() {
            this.cells[this.selectedCellNumber - 1].active = true;
            console.log("selected cell set");
        },

        _deactivateCell() {
            this.cells[this.selectedCellNumber - 1].active = false;
            console.log("selected cell set");
        },

        _paintCell(teamId) {
            this._deactivateCell();
            this.cells[this.selectedCellNumber - 1].color = colors.get(teamId);
            console.log("cell painted");
        },

        _reduceCellDifficultyIfPossible() {
            const cell = this.cells[this.selectedCellNumber - 1];

            if (cell.difficulty > CellDifficultyOptions.Easy) {
                cell.difficulty -= 1;
                cell.color = cellColorByDifficulty.get(cell.difficulty);
            }
        },

        _increaseCellTimesPlayed() {
            this.cells[this.selectedCellNumber - 1].timesPlayed++;
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

        _setTeamsToPlayRound(teamsIds) {
            teamsIds.forEach((id) => {
                const teamsToExtend = this.teams.find((team) => team.id === id);
                const teamInRoundModel = TeamService.prepareTeamInRoundModel(teamsToExtend);
                teamInRoundModel.attemptsToInteract = this.initialNumberOfAttemptsToAnswerAfterActiveTeam;
                this.teamsToPlayRound.push(teamInRoundModel);
            });
        },

        //#region active team and check

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

        _letTeamAnswer(teamId) {
            this.teamsToPlayRound.find((team) => team.id === teamId).isAllowedToAnswer = true;
        },

        isTeamActive(teamId) {
            return this.activeTeam.id === teamId;
        },

        //#endregion

        _setActiveQuestion(question) {
            this.activeQuestion = this.questions.find((q) => q.id === question.questionId);
        },

        _setSelectedCellNumber(cellNumber) {
            this.selectedCellNumber = cellNumber;
        },

        //#region attemptsAtStake

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

        //#endregion

        _setTeamToAnswer(teamId) {
            this.teamToAnswer = this.teams.find((team) => team.id === teamId);
        },

        _clearTeamToAnswer() {
            this.teamToAnswer = {};
        },

        //#region teamsStillAllowedToAnswer

        _setTeamsStillAllowedToAnswer(teamsNumber) {
            this.teamsStillAllowedToAnswer = teamsNumber;
        },

        _decreaseTeamsStillAllowedToAnswer() {
            this.teamsStillAllowedToAnswer--;
        },

        //#endregion

        //#region timerLaunchesLeft

        _setTimerLaunchesLeft(limit) {
            this.timerLaunchesLeft = limit;
        },

        _decreaseTimerLaunches(minus) {
            this.timerLaunchesLeft -= minus;
        },

        //#endregion

        //#region team isAnswering field changes

        _setTeamAnsweringStatus(teamId) {
            this.teamsToPlayRound.find((team) => team.id === teamId).isAnswering = true;
        },

        _removeTeamAnsweringStatus() {
            const answeringTeam = this.teamsToPlayRound.find((team) => team.isAnswering === true);
            if (answeringTeam === undefined) return;

            answeringTeam.isAnswering = false;
        },

        //#endregion

        //#region team attemptsToInteract field changes and check

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

        isTeamHasNoAttempts(teamId) {
            return this.teamsToPlayRound.find((team) => team.id === teamId).attemptsToInteract === 0;
        },

        //#endregion

        //#region team isAnsweredOnce field changes

        _setTeamIsAnsweredOnceStatus(teamId) {
            this.teamsToPlayRound.find((team) => team.id === teamId).isAnsweredOnce = true;
        },

        _clearAnsweredOnceStatus() {
            this.teamsToPlayRound.forEach((team) => {
                if (team.isAnsweredOnce) team.isAnsweredOnce = false;
            });
        },

        //#endregion

        //#region team isAllowedToAnswer field changes

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

        //#endregion

        //#region possible team fields changes after having answered once

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

        //#endregion

        //#region handleNoMoreTimerLaunches helpers

        _getLastAnsweringTeamId() {
            return this.teamsToPlayRound.find((team) => !team.isAnsweredOnce).id;
        },

        _getLastAllowedToAnswerTeamId() {
            return this.teamsToPlayRound.find((team) => team.isAllowedToAnswer).id;
        },

        _setLastTeamIsAnsweredOnceStatus() {
            this._setTeamIsAnsweredOnceStatus(this._getLastAnsweringTeamId());
        },

        _makeLastTeamNotAllowedToAnswer() {
            this._makeTeamNotAllowedToAnswer(this._getLastAllowedToAnswerTeamId());
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

        //#region tour ending

        _setTourWinner(teamId) {
            this.tourWinner = this.teamsToPlayRound.find((team) => team.id === teamId);
        },

        //#endregion

        //#region round ending

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

        _sortRoundScores() {
            this.teamsToPlayRound.sort((a, b) => {
                return b.roundScore - a.roundScore;
            });
        },

        //#endregion

        //#region game ending

        _setTeamGameScore(teamIdsToGameScore) {
            this.teams.forEach((team) => {
                team.gameScore = teamIdsToGameScore[team.id];
            });
            this._sortGameScores();
        },

        _sortGameScores() {
            this.teams.sort((a, b) => {
                return b.gameScore - a.gameScore;
            });
        },

        //#endregion

        _clearDataFields() {
            this.gameStartedStatus = false;
            this.isPresentingRoundTopicsState = false;
            this.roundStartedStatus = false;
            this.cellSelectionStage = false;
            this.questionAskingStage = false;
            this.shouldDisplayQuestionText = false;
            this.timeStartedStage = false;
            this.teamAnswersStage = false;
            this.showRightAnswerStage = false;
            //this.cells are left untouched
            //this.teamsToPlayRound won't change until next round;
            //this.activeTeam has value;
            this.activeQuestion = {};
            this.selectedCellNumber = -1;
            //this.secondsToAnswer didn't change
            this.timerSeconds = null;
            this.timerInterval = null;
            this.teamToAnswer = {};
            this._setTimerLaunchesLeft(this.timerLaunchesLimitForOtherTeams);
            this._setTeamsStillAllowedToAnswer(this.teamsInRoundNumber);
            this._clearAnsweredOnceStatus();
            this._clearNotAllowedToAnswer();
            this.tourWinner = {};
            this.isAnsweringTeamVisible = true;
            this.roundEndedStatus = false;
            this.roundWinner = {};
        },

        _clearRoundInfo() {
            //clear cell grid
            this.cells = [];
            //set new cell grid
            this._setInitialCellGrid();
            //clear teams in round
            this.teamsToPlayRound = [];
            //clear active team
            this.activeTeam = [];
        },

        //#endregion

        //#region restore helpers

        restoreGameConfiguration(configuration, lastAnsweredOtherTeamsNumber, timerStartNumberLimit) {
            this._setGameConfiguration(configuration);

            configuration.isTimerStartNumberLimitForOtherTeamsEnabled //will need reset in some cases
                ? this._setTimerLaunchesLeft(timerStartNumberLimit)
                : this._setTimerLaunchesLeft(configuration.roundActiveTeamsNumber - timerStartNumberLimit);

            configuration.isTeamAllowedAnsweringMultipleTimes //will need reset in some cases
                ? this._setTeamsStillAllowedToAnswer(configuration.roundActiveTeamsNumber)
                : this._setTeamsStillAllowedToAnswer(
                      configuration.roundActiveTeamsNumber - lastAnsweredOtherTeamsNumber
                  );

            this._hideLoginCodes();
        },

        restoreGameField(cellNumberWithCurrentDifficulty, cellNumberToCapturedTeamId) {
            Object.entries(cellNumberWithCurrentDifficulty).forEach(([cellNumber, cellDifficulty]) => {
                this.cells[cellNumber - 1].difficulty = cellDifficulty;
                this.cells[cellNumber - 1].color = cellColorByDifficulty.get(cellDifficulty);
                //no chance to reassign cell.timesPlayed tho
            });

            Object.entries(cellNumberToCapturedTeamId).forEach(([cellNumber, teamId]) => {
                this.cells[cellNumber - 1].color = colors.get(teamId);
            });
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
            this._startNewTour();
            this._setActiveTeam(activeTeamId);
            this._letTeamAnswer(activeTeamId);
            this._showGameField();
        },

        restoreCellSelectionStage(cellNumber) {
            this._setSelectedCellNumber(cellNumber);
            this._activateCell();
        },

        restoreQuestionAskingStage(teamsInRoundIds, activeTeamId, cellNumber, receivedQuestion) {
            this.restoreActiveTeamReceived(teamsInRoundIds, activeTeamId);
            this.restoreCellSelectionStage(cellNumber);
            this.handleQuestionReceived(receivedQuestion);
        },

        restoreTimerStartedStage(timerStartedArgs) {
            this.handleTimerStarted(timerStartedArgs);
        },

        restoreTeamGivesAnswerStage(teamId) {
            console.log("team " + teamId + " clicked the button");
            this._setTeamAnsweringStatus(teamId);
            this._setTeamToAnswer(teamId);
            this._showAnsweringTeam();
        },

        restoreStartTimerForOtherTeams() {
            this._showTimerForOtherTeams();
        },

        restoreTourEndWithRightAnswer(teamId) {
            this._makeTeamNotAllowedToAnswer(teamId);
            this._clearAttemptsAtStake();
            this._setTourWinner(teamId);
            this._paintCell(teamId);
            this._increaseCellTimesPlayed();
            this._showRightAnswer();
        },

        restoreTourEndButNoRightAnswer(teamId) {
            if (teamId !== 0) this._makeTeamNotAllowedToAnswer(teamId);
            this._clearAttemptsAtStake();
            this._deactivateCell();
            this._increaseCellTimesPlayed();
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
