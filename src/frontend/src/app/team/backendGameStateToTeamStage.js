import { ServerGameState } from "@/app/shared/signalr/ClientStateRestoreModels";
import TeamStage from "@/app/team/TeamStage";
import TeamGameEndedStage from "@/app/team/stages/TeamGameEndedStage";

function roundEndedDefaultHandler(context) {
    const { isActiveInRound } = context;

    if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

    return TeamStage.RoundEnded;
}

const backendGameStateToTeamStage = {
    [ServerGameState.Corrupted]: TeamStage.Unknown,
    [ServerGameState.Init]: TeamStage.PreGame,
    [ServerGameState.PresentingActiveTeams]: ({ isActiveInRound }) =>
        isActiveInRound ? TeamStage.AnnouncingActiveInRound : TeamStage.AnnouncingNotActiveInRound,
    [ServerGameState.PresentingRoundTopics]: ({ isActiveInRound }) =>
        isActiveInRound ? TeamStage.AnnouncingRoundTopics : TeamStage.AnnouncingNotActiveInRound,
    [ServerGameState.RoundStarted]: ({ isActiveInRound, isActiveInTour }) => {
        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        return isActiveInTour ? TeamStage.SelectingCell : TeamStage.WaitingForActiveTeamToSelectCell;
    },
    [ServerGameState.CellSelected]: ({ isActiveInRound, isActiveInTour }) => {
        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        return isActiveInTour ? TeamStage.CellSelected : TeamStage.WaitingForActiveTeamToEndItsTurn;
    },
    [ServerGameState.TimerStartedForActiveTeam]: ({ isActiveInRound, isActiveInTour }) => {
        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        return isActiveInTour
            ? TeamStage.AllowedInteractAsActiveTeam
            : TeamStage.WaitingForActiveTeamToEndItsTurn;
    },

    [ServerGameState.ActiveTeamGivesAnswer]: ({ isActiveInRound, isActiveInTour }) => {
        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        return isActiveInTour ? TeamStage.AnsweringAsActiveTeam : TeamStage.WaitingForActiveTeamToEndItsTurn;
    },

    [ServerGameState.QuestionAnsweredCorrectly]: (context) => {
        const { teamId, isActiveInRound, isActiveInTour, backendStateReentryNumber, backendTeamState } =
            context;

        const { tourActiveTeamId, lastAnsweringTeamId } = backendTeamState;

        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        if (backendStateReentryNumber !== 0) {
            // Current backend state is the same as for ServerGameState.RoundStarted
            return backendGameStateToTeamStage[ServerGameState.RoundStarted](context);
        }

        if (tourActiveTeamId === lastAnsweringTeamId) {
            return isActiveInTour
                ? TeamStage.AnsweredCorrectlyAsActiveTeam
                : TeamStage.ActiveTeamAnsweredCorrectly;
        }

        return lastAnsweringTeamId === teamId
            ? TeamStage.AnsweredCorrectlyAsOtherTeam
            : TeamStage.OtherTeamAnsweredCorrectly;
    },
    [ServerGameState.ActiveTeamGaveNoRightAnswer]: (context) => {
        const { isActiveInRound, isActiveInTour } = context;

        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        // Мы дальше не можем знать, пыталась ли команда отвечать или нет, так что, даже если и нет, то все равно TeamStage.AnsweredWrongAsActiveTeam
        return isActiveInTour
            ? TeamStage.AnsweredWrongAsActiveTeam
            : TeamStage.WaitingForTimerStartToAnswerAsOtherTeam;
    },
    [ServerGameState.TimerStartedForOtherTeams]: (context) => {
        const { isActiveInRound, isActiveInTour } = context;

        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        return isActiveInTour ? TeamStage.AnsweredWrongAsActiveTeam : TeamStage.AllowedInteractAsOtherTeam;
    },
    [ServerGameState.OtherTeamGivesAnswer]: (context) => {
        const { teamId, isActiveInRound, isActiveInTour, backendTeamState } = context;

        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        if (teamId === backendTeamState.lastAnsweringTeamId) {
            return TeamStage.AnsweringAsOtherTeam;
        }

        return isActiveInTour ? TeamStage.AnsweredWrongAsActiveTeam : TeamStage.OtherTeamAnswering;
    },
    [ServerGameState.OtherTeamGaveWrongAnswer]: (context) => {
        const { teamId, isActiveInRound, isActiveInTour, backendTeamState } = context;

        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        if (teamId === backendTeamState.lastAnsweringTeamId) {
            return TeamStage.AnsweredWrongAsOtherTeam;
        }

        return isActiveInTour
            ? TeamStage.AnsweredWrongAsActiveTeam
            : TeamStage.WaitingForTimerStartToAnswerAsOtherTeam;
    },
    [ServerGameState.OtherTeamsGaveNoRightAnswer]: (context) => {
        const { isActiveInRound, backendStateReentryNumber } = context;

        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        if (backendStateReentryNumber !== 0) {
            // Current backend state is the same as for ServerGameState.RoundStarted
            return backendGameStateToTeamStage[ServerGameState.RoundStarted](context);
        }

        return TeamStage.OtherTeamsTimerExpired;
    },
    [ServerGameState.ActiveTeamAnsweredCorrectlyToRoundEnd]: (context) => {
        const { isActiveInRound, isActiveInTour } = context;

        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        return isActiveInTour
            ? TeamStage.AnsweredCorrectlyAsActiveTeam
            : TeamStage.ActiveTeamAnsweredCorrectly;
    },
    [ServerGameState.ActiveTeamAnsweredWrongToRoundEnd]: (context) => {
        const { isActiveInRound, isActiveInTour } = context;

        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        return isActiveInTour
            ? TeamStage.AnsweredWrongAsActiveTeam
            : TeamStage.ActiveTeamAnsweredWrongToRoundEnd;
    },
    [ServerGameState.TimerForOtherTeamsStoppedToRoundEnd]: (context) => {
        const { isActiveInRound, isActiveInTour } = context;

        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        return isActiveInTour
            ? TeamStage.AnsweredWrongAsActiveTeam
            : // возможно нужно добавить новый стейж
              TeamStage.OtherTeamsTimerExpired;
    },
    [ServerGameState.OtherTeamAnsweredCorrectlyToRoundEnd]: (context) => {
        const { isActiveInRound, isActiveInTour } = context;

        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        return isActiveInTour
            ? TeamStage.AnsweredWrongAsActiveTeam
            : // возможно нужно добавить новый стейж
              TeamStage.AnsweredCorrectlyAsOtherTeam;
    },

    [ServerGameState.OtherTeamAnsweredWrongToRoundEnd]: (context) => {
        const { isActiveInRound, isActiveInTour } = context;

        if (isActiveInRound === false) return TeamStage.AnnouncingNotActiveInRound;

        if (isActiveInTour) return TeamStage.AnsweredWrongAsActiveTeam;

        // const isThisTeamAnswered = context.teamId === backendTeamState.lastAnsweringTeamId;

        // Пока так, потому что не понятно что нужно на новых стейжах
        return TeamStage.OtherTeamsTimerExpired;
    },
    /* RoundEnded flavours */
    [ServerGameState.RoundEndedAfterActiveTeamAnsweredWrong]: roundEndedDefaultHandler,
    [ServerGameState.RoundEndedAfterActiveTeamAnsweredCorrectly]: roundEndedDefaultHandler,
    [ServerGameState.RoundEndedAfterTimerForOtherTeamsExpired]: roundEndedDefaultHandler,
    [ServerGameState.RoundEndedAfterOtherTeamAnsweredWrong]: roundEndedDefaultHandler,
    [ServerGameState.RoundEndedAfterOtherTeamAnsweredCorrectly]: roundEndedDefaultHandler,
    [ServerGameState.RoundEnded]: roundEndedDefaultHandler,

    [ServerGameState.GameEnded]: TeamGameEndedStage,
};

// temp to track missing states
if (process.env.NODE_ENV === "development") {
    Object.keys(ServerGameState).forEach((k) => {
        if (!isNaN(k)) {
            const isHasAMap = backendGameStateToTeamStage[k] !== undefined;

            if (!isHasAMap) console.error("У бекенд стейта нету мапы:", ServerGameState[k]);
        }
    });
}

export default backendGameStateToTeamStage;
