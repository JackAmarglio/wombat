import TeamGameEndedStage from "@/app/team/stages/TeamGameEndedStage";
import TeamRoundEndedStage from "@/app/team/stages/TeamRoundEndedStage";
import TeamNoOtherTeamThatCanAnswerStage from "@/app/team/stages/TeamNoOtherTeamThatCanAnswerStage";
import TeamOtherTeamAnsweredCorrectlyStage from "@/app/team/stages/TeamOtherTeamAnsweredCorrectlyStage";
import TeamWaitingAnotherOtherTeamAnsweringStage from "@/app/team/stages/TeamWaitingAnotherOtherTeamAnsweringStage";
import TeamAnsweredWrongAsOtherTeamStage from "@/app/team/stages/TeamAnsweredWrongAsOtherTeamStage";
import TeamAnsweredWrongAsActiveTeamStage from "@/app/team/stages/TeamAnsweredWrongAsActiveTeamStage";
import TeamNoOneAnsweredStage from "@/app/team/stages/TeamNoOneAnsweredStage";
import TeamAnsweringAsOtherTeamStage from "@/app/team/stages/TeamAnsweringAsOtherTeamStage";
import TeamAnnouncingNotEnoughAttemptsToInteractStage from "@/app/team/stages/TeamAnnouncingNotEnoughAttemptsToInteractStage";
import TeamAlreadyInteractedAsOtherTeamStage from "@/app/team/stages/TeamAlreadyInteractedAsOtherTeamStage";
import TeamInteractingAsOtherTeamStage from "@/app/team/stages/TeamInteractingAsOtherTeamStage";
import TeamActiveTeamAnsweredCorrectlyStage from "@/app/team/stages/TeamActiveTeamAnsweredCorrectlyStage";
import TeamWaitingForActiveTeamToEndItsTurnStage from "@/app/team/stages/TeamWaitingForActiveTeamToEndItsTurnStage";
import TeamWaitingForActiveTeamToSelectCellStage from "@/app/team/stages/TeamWaitingForActiveTeamToSelectCellStage";
import TeamAnsweringAsActiveTeamStage from "@/app/team/stages/TeamAnsweringAsActiveTeamStage";
import TeamAllowedInteractAsActiveTeamStage from "@/app/team/stages/TeamAllowedInteractAsActiveTeamStage";
import TeamSelectedCellStage from "@/app/team/stages/TeamSelectedCellStage";
import TeamSelectingCellStage from "@/app/team/stages/TeamSelectingCellStage";
import TeamAnnouncingRoundTopicsStage from "@/app/team/stages/TeamAnnouncingRoundTopicsStage";
import TeamAnnouncingNotActiveInRoundStage from "@/app/team/stages/TeamAnnouncingNotActiveInRoundStage";
import TeamAnnouncingActiveInRoundStage from "@/app/team/stages/TeamAnnouncingActiveInRoundStage";
import TeamUnknownStage from "@/app/team/stages/TeamUnknownStage";
import TeamAnsweredCorrectlyStage from "@/app/team/stages/TeamAnsweredCorrectlyStage";
import PreGameStage from "@/app/team/stages/PreGameStage";
import TeamSuspenseAfterOtherTeamInteractedStage from "@/app/team/stages/TeamSuspenseAfterOtherTeamInteractedStage";
import TeamActiveTeamAnsweredWrongToRoundEndStage from "@/app/team/stages/TeamActiveTeamAnsweredWrongToRoundEndStage";

const stageComponents = {
    TeamUnknownStage,
    PreGameStage,
    TeamAnnouncingActiveInRoundStage,
    TeamAnnouncingNotActiveInRoundStage,
    TeamAnnouncingRoundTopicsStage,
    TeamSelectingCellStage,
    TeamSelectedCellStage,
    TeamAllowedInteractAsActiveTeamStage,
    TeamAnsweringAsActiveTeamStage,
    TeamWaitingForActiveTeamToSelectCellStage,
    TeamWaitingForActiveTeamToEndItsTurnStage,
    TeamActiveTeamAnsweredCorrectlyStage,
    TeamActiveTeamAnsweredWrongToRoundEndStage,
    TeamInteractingAsOtherTeamStage,
    TeamSuspenseAfterOtherTeamInteractedStage,
    TeamAlreadyInteractedAsOtherTeamStage,
    TeamAnnouncingNotEnoughAttemptsToInteractStage,
    TeamAnsweringAsOtherTeamStage,
    TeamAnsweredCorrectlyStage,
    TeamNoOneAnsweredStage,
    TeamAnsweredWrongAsActiveTeamStage,
    TeamAnsweredWrongAsOtherTeamStage,
    TeamWaitingAnotherOtherTeamAnsweringStage,
    TeamOtherTeamAnsweredCorrectlyStage,
    TeamNoOtherTeamThatCanAnswerStage,
    TeamRoundEndedStage,
    TeamGameEndedStage,
};

export default stageComponents;
