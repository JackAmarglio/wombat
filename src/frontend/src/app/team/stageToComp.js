import TeamStage from "@/app/team/TeamStage";
import TeamAnnouncingActiveInRoundStage from "@/app/team/stages/TeamAnnouncingActiveInRoundStage";
import TeamAnnouncingNotActiveInRoundStage from "@/app/team/stages/TeamAnnouncingNotActiveInRoundStage";
import TeamAnnouncingRoundTopicsStage from "@/app/team/stages/TeamAnnouncingRoundTopicsStage";
import TeamSelectingCellStage from "@/app/team/stages/TeamSelectingCellStage";
import TeamSelectedCellStage from "@/app/team/stages/TeamSelectedCellStage";
import TeamWaitingForActiveTeamToSelectCellStage from "@/app/team/stages/TeamWaitingForActiveTeamToSelectCellStage";
import TeamAllowedInteractAsActiveTeamStage from "@/app/team/stages/TeamAllowedInteractAsActiveTeamStage";
import TeamAnsweringAsActiveTeamStage from "@/app/team/stages/TeamAnsweringAsActiveTeamStage";
import TeamWaitingForActiveTeamToEndItsTurnStage from "@/app/team/stages/TeamWaitingForActiveTeamToEndItsTurnStage";
import TeamActiveTeamAnsweredCorrectlyStage from "@/app/team/stages/TeamActiveTeamAnsweredCorrectlyStage";
import TeamInteractingAsOtherTeamStage from "@/app/team/stages/TeamInteractingAsOtherTeamStage";
import TeamAnnouncingNotEnoughAttemptsToInteractStage from "@/app/team/stages/TeamAnnouncingNotEnoughAttemptsToInteractStage";
import TeamAlreadyInteractedAsOtherTeamStage from "@/app/team/stages/TeamAlreadyInteractedAsOtherTeamStage";
import TeamAnsweringAsOtherTeamStage from "@/app/team/stages/TeamAnsweringAsOtherTeamStage";
import TeamNoOneAnsweredStage from "@/app/team/stages/TeamNoOneAnsweredStage";
import TeamAnsweredWrongAsActiveTeamStage from "@/app/team/stages/TeamAnsweredWrongAsActiveTeamStage";
import TeamAnsweredWrongAsOtherTeamStage from "@/app/team/stages/TeamAnsweredWrongAsOtherTeamStage";
import TeamWaitingAnotherOtherTeamAnsweringStage from "@/app/team/stages/TeamWaitingAnotherOtherTeamAnsweringStage";
import TeamOtherTeamAnsweredCorrectlyStage from "@/app/team/stages/TeamOtherTeamAnsweredCorrectlyStage";
import TeamNoOtherTeamThatCanAnswerStage from "@/app/team/stages/TeamNoOtherTeamThatCanAnswerStage";
import TeamRoundEndedStage from "@/app/team/stages/TeamRoundEndedStage";
import TeamGameEndedStage from "@/app/team/stages/TeamGameEndedStage";
import TeamAnsweredCorrectlyStage from "@/app/team/stages/TeamAnsweredCorrectlyStage";
import PreGameStage from "@/app/team/stages/PreGameStage";
import TeamSuspenseAfterOtherTeamInteractedStage from "@/app/team/stages/TeamSuspenseAfterOtherTeamInteractedStage";
import TeamActiveTeamAnsweredWrongToRoundEndStage from "@/app/team/stages/TeamActiveTeamAnsweredWrongToRoundEndStage";

export const teamStageToCompName = {
    [null]: "TeamUnknownStage",
    [TeamStage.Unknown]: "TeamUnknownStage",
    [TeamStage.PreGame]: PreGameStage.name,
    [TeamStage.AnnouncingActiveInRound]: TeamAnnouncingActiveInRoundStage.name,
    [TeamStage.AnnouncingNotActiveInRound]: TeamAnnouncingNotActiveInRoundStage.name,
    [TeamStage.AnnouncingRoundTopics]: TeamAnnouncingRoundTopicsStage.name,
    [TeamStage.SelectingCell]: TeamSelectingCellStage.name,
    [TeamStage.CellSelected]: TeamSelectedCellStage.name,
    [TeamStage.WaitingForActiveTeamToSelectCell]: TeamWaitingForActiveTeamToSelectCellStage.name,
    [TeamStage.AllowedInteractAsActiveTeam]: TeamAllowedInteractAsActiveTeamStage.name,
    [TeamStage.AnsweringAsActiveTeam]: TeamAnsweringAsActiveTeamStage.name,
    [TeamStage.AnsweredCorrectlyAsActiveTeam]: TeamAnsweredCorrectlyStage.name,
    [TeamStage.WaitingForActiveTeamToEndItsTurn]: TeamWaitingForActiveTeamToEndItsTurnStage.name,
    [TeamStage.ActiveTeamAnsweredCorrectly]: TeamActiveTeamAnsweredCorrectlyStage.name,
    [TeamStage.ActiveTeamAnsweredWrongToRoundEnd]: TeamActiveTeamAnsweredWrongToRoundEndStage.name,
    [TeamStage.WaitingForTimerStartToAnswerAsOtherTeam]: TeamInteractingAsOtherTeamStage.name,
    [TeamStage.SuspenseAfterOtherTeamInteract]: TeamSuspenseAfterOtherTeamInteractedStage.name,
    [TeamStage.AnnouncingNotEnoughAttemptsToInteract]: TeamAnnouncingNotEnoughAttemptsToInteractStage.name,
    [TeamStage.AlreadyInteractedAsOtherTeam]: TeamAlreadyInteractedAsOtherTeamStage.name,
    [TeamStage.AllowedInteractAsOtherTeam]: TeamInteractingAsOtherTeamStage.name,
    [TeamStage.AnsweringAsOtherTeam]: TeamAnsweringAsOtherTeamStage.name,
    [TeamStage.OtherTeamsTimerExpired]: TeamNoOneAnsweredStage.name,
    [TeamStage.AnsweredWrongAsActiveTeam]: TeamAnsweredWrongAsActiveTeamStage.name,
    [TeamStage.TimeIsUpAsActiveTeam]: TeamAnsweredWrongAsActiveTeamStage.name,
    [TeamStage.AnsweredWrongAsOtherTeam]: TeamAnsweredWrongAsOtherTeamStage.name,
    [TeamStage.OtherTeamAnswering]: TeamWaitingAnotherOtherTeamAnsweringStage.name,
    [TeamStage.AnsweredCorrectlyAsOtherTeam]: TeamAnsweredCorrectlyStage.name,
    [TeamStage.OtherTeamAnsweredCorrectly]: TeamOtherTeamAnsweredCorrectlyStage.name,
    [TeamStage.NoOtherTeamsThatCanAnswer]: TeamNoOtherTeamThatCanAnswerStage.name,
    [TeamStage.RoundEnded]: TeamRoundEndedStage.name,
    [TeamStage.GameEnded]: TeamGameEndedStage.name,
};

// temp to track missing states
if (process.env.NODE_ENV === "development") {
    Object.keys(TeamStage).forEach((k) => {
        if (isNaN(k)) return;

        const isHasComponent = teamStageToCompName[k] !== undefined;
        if (isHasComponent === false) console.error("У team stage нету компонента:", TeamStage[k]);
    });
}
