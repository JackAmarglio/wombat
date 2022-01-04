import TeamStage from "@/app/team/TeamStage";
import {
    RESTORE_GAME_FIELD,
    SET_CURRENT_QUESTION_TOPIC_BY_ID,
    SET_CURRENT_TOUR_QUESTION,
    SET_INTERACTED_AS_OTHER_TEAM,
    SET_IS_AFTER_RESTORE_STATUS,
    SET_LAP_NUMBER,
    SET_LAST_INTERACTED_OTHER_TEAM_ID,
    SET_ROUND_ACTIVE_TEAMS,
    SET_ROUND_END_RESULTS,
    SET_ROUND_QUESTION_TOPICS,
    SET_TEAM_REMAINING_ATTEMPTS,
    SET_TOUR_ACTIVE_TEAM_ID,
    SET_TOUR_CELL_DIFFICULTY,
    SET_TOUR_CELL_NUMBER,
} from "@/app/team/modules/mutations";
import { SET_TOUR_NUMBER } from "@/app/team/modules/mutations/tourNumber";
import { mapState } from "vuex";
import {
    PROCESS_SERVER_TEAMS_ROUNDS_ORDER,
    SET_TEAMS_MEMBERS_FROM_SERVER,
} from "@/app/shared/store/modules/mutations";

function isInteractedAsOtherTeam(backendState) {
    const { teamId, lastAnsweredOtherTeamsIds } = backendState;

    if (lastAnsweredOtherTeamsIds === undefined) return false;

    return lastAnsweredOtherTeamsIds.includes(teamId);
}

export default {
    computed: {
        ...mapState({
            backendState: (state) => state.team.backendTeamState,
            currentStage: (state) => state.team.stage.current,
        }),
    },

    methods: {
        restoreState(stage = this.currentStage) {
            const { backendState } = this;

            // noinspection JSUnreachableSwitchBranches
            switch (stage) {
                case TeamStage.Unknown:
                case TeamStage.PreGame:
                case TeamStage.AnnouncingActiveInRound:
                case TeamStage.AnnouncingNotActiveInRound:
                case TeamStage.AnnouncingRoundTopics:
                    this.$store.commit(SET_ROUND_QUESTION_TOPICS, backendState.currentRoundQuestionTopics);
                    this.$store.commit(SET_IS_AFTER_RESTORE_STATUS, true);
                    this.$store.commit(PROCESS_SERVER_TEAMS_ROUNDS_ORDER, backendState.teamsRoundsOrder);
                    this.$store.commit(SET_ROUND_ACTIVE_TEAMS, backendState.roundActiveTeamsIds);
                    this.$store.commit(SET_TEAMS_MEMBERS_FROM_SERVER, backendState.gameTeamsMembers);

                    break;
                case TeamStage.WaitingForActiveTeamToSelectCell:
                case TeamStage.SelectingCell:
                    this.restoreState(TeamStage.AnnouncingRoundTopics);

                    this._restoreTeamsAttempts();
                    this.$store.commit(SET_TOUR_NUMBER, backendState.tourNumber);
                    this.$store.commit(SET_LAP_NUMBER, backendState.lapNumber);
                    this.$store.commit(SET_TOUR_ACTIVE_TEAM_ID, backendState.tourActiveTeamId);
                    this.$store.commit(RESTORE_GAME_FIELD, backendState.cellNumberToCapturedTeamId);
                    break;
                case TeamStage.CellSelected:
                case TeamStage.AllowedInteractAsActiveTeam:
                case TeamStage.AnsweringAsActiveTeam:
                case TeamStage.AnsweredWrongAsActiveTeam:
                case TeamStage.TimeIsUpAsActiveTeam:
                case TeamStage.AnsweredCorrectlyAsActiveTeam:
                case TeamStage.WaitingForActiveTeamToEndItsTurn:
                case TeamStage.WaitingForTimerStartToAnswerAsOtherTeam:
                case TeamStage.ActiveTeamAnsweredCorrectly:
                case TeamStage.ActiveTeamAnsweredWrongToRoundEnd:
                case TeamStage.AnsweringAsOtherTeam:
                case TeamStage.AllowedInteractAsOtherTeam:
                case TeamStage.OtherTeamAnswering:
                case TeamStage.AnsweredCorrectlyAsOtherTeam:
                case TeamStage.AnsweredWrongAsOtherTeam:
                case TeamStage.OtherTeamsTimerExpired:
                case TeamStage.OtherTeamAnsweredCorrectly:
                case TeamStage.NoOtherTeamsThatCanAnswer:
                    this.restoreState(TeamStage.SelectingCell);

                    this.$store.commit(SET_TOUR_CELL_NUMBER, backendState.cellNumberInPlay);
                    this.$store.commit(SET_TOUR_CELL_DIFFICULTY, backendState.currentCellDifficulty);
                    this.$store.commit(SET_CURRENT_QUESTION_TOPIC_BY_ID, backendState.questionInPlay.topicId);
                    this.$store.commit(SET_CURRENT_TOUR_QUESTION, backendState.questionInPlay);
                    this._restoreLastInteractedOtherTeamId();
                    if (isInteractedAsOtherTeam(backendState))
                        this.$store.commit(SET_INTERACTED_AS_OTHER_TEAM);
                    break;
                case TeamStage.RoundEnded:
                    this.restoreState(TeamStage.CellSelected);

                    this.$store.commit(SET_ROUND_END_RESULTS, backendState.roundResultInfo);
                    break;
                case TeamStage.SuspenseAfterOtherTeamInteract:
                    console.warn(
                        `Should not try to restore to this stage as it's a transitional one. Stage: ${TeamStage[stage]}`
                    );
                    break;
                default:
                    throw Error(`No restore instructions for provided stage ${TeamStage[stage]}`);
            }
        },

        _restoreLastInteractedOtherTeamId() {
            const { lastAnsweredOtherTeamsIds } = this.backendState;

            if (lastAnsweredOtherTeamsIds === undefined) return;
            if (lastAnsweredOtherTeamsIds.length === 0) return;

            this.$store.commit(
                SET_LAST_INTERACTED_OTHER_TEAM_ID,
                lastAnsweredOtherTeamsIds[lastAnsweredOtherTeamsIds.length - 1]
            );
        },

        _restoreTeamsAttempts() {
            const { backendState } = this;
            const { teamIdToAttemptsToAnswerAfterActiveTeam } = backendState;

            Object.entries(teamIdToAttemptsToAnswerAfterActiveTeam).forEach(([teamId, attempts]) => {
                this.$store.commit(SET_TEAM_REMAINING_ATTEMPTS, { teamId, attempts });
            });
        },
    },
};
