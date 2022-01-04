import TeamStage from "@/app/team/TeamStage";
import {
    FIELD,
    NO_ONE_ANSWERED_TEXT,
    QUESTION,
    QUESTION_ANSWERING,
    TIME_IS_UP_TEXT,
    TOPIC,
    TOUR,
    ATTEMPTS,
} from "@/app/team/components/carousel/modes";

function stageToCarouselState(stage) {
    switch (stage) {
        case TeamStage.Unknown:
        case TeamStage.PreGame:
        case TeamStage.AnnouncingActiveInRound:
        case TeamStage.AnnouncingNotActiveInRound:
        case TeamStage.AnnouncingRoundTopics:
            return {
                availableComponents: [TOUR, FIELD, ATTEMPTS],
                currentStageComponent: TOUR,
            };
        case TeamStage.WaitingForActiveTeamToSelectCell:
        case TeamStage.SelectingCell:
            return {
                availableComponents: [TOUR, FIELD, ATTEMPTS],
                currentStageComponent: TOUR,
            };
        case TeamStage.CellSelected:
        case TeamStage.WaitingForActiveTeamToEndItsTurn:
        case TeamStage.AllowedInteractAsActiveTeam:
            return {
                availableComponents: [TOPIC, TOUR, FIELD, ATTEMPTS],
                currentStageComponent: TOPIC,
            };
        case TeamStage.AnsweringAsActiveTeam:
            return {
                availableComponents: [QUESTION_ANSWERING, TOPIC, TOUR, FIELD, ATTEMPTS],
                currentStageComponent: QUESTION_ANSWERING,
            };
        case TeamStage.ActiveTeamAnsweredCorrectly:
        case TeamStage.AnsweredCorrectlyAsActiveTeam:
            return {
                availableComponents: [TOPIC, TOUR, FIELD, ATTEMPTS],
                currentStageComponent: TOPIC,
            };
        case TeamStage.AllowedInteractAsOtherTeam:
            return {
                availableComponents: [QUESTION, TOUR, FIELD, ATTEMPTS],
                currentStageComponent: QUESTION,
            };
        case TeamStage.SuspenseAfterOtherTeamInteract:
        case TeamStage.WaitingForTimerStartToAnswerAsOtherTeam:
            return {
                availableComponents: [QUESTION, TOUR, FIELD, ATTEMPTS],
                currentStageComponent: QUESTION,
            };
        case TeamStage.AnsweringAsOtherTeam:
            return {
                availableComponents: [QUESTION_ANSWERING, QUESTION, TOUR, FIELD, ATTEMPTS],
                currentStageComponent: QUESTION_ANSWERING,
            };
        case TeamStage.TimeIsUpAsActiveTeam:
            return {
                availableComponents: [TIME_IS_UP_TEXT, TOUR, FIELD, ATTEMPTS],
                currentStageComponent: TIME_IS_UP_TEXT,
            };
        case TeamStage.OtherTeamsTimerExpired:
            return {
                availableComponents: [NO_ONE_ANSWERED_TEXT, TOUR, FIELD, ATTEMPTS],
                currentStageComponent: NO_ONE_ANSWERED_TEXT,
            };
        case TeamStage.AlreadyInteractedAsOtherTeam:
            return {
                availableComponents: [QUESTION, TOUR, FIELD, ATTEMPTS],
                currentStageComponent: QUESTION,
            };
        case TeamStage.ActiveTeamAnsweredWrongToRoundEnd:
            return {
                availableComponents: [FIELD, ATTEMPTS],
                currentStageComponent: FIELD,
            };
        case TeamStage.AnsweredWrongAsActiveTeam:
        case TeamStage.OtherTeamAnswering:
        case TeamStage.AnsweredCorrectlyAsOtherTeam:
        case TeamStage.AnsweredWrongAsOtherTeam:
        case TeamStage.OtherTeamAnsweredCorrectly:
        case TeamStage.NoOtherTeamsThatCanAnswer:
        case TeamStage.RoundEnded:
            return {
                availableComponents: [TOPIC, TOUR, FIELD, ATTEMPTS],
                currentStageComponent: TOUR,
            };
        default:
            throw Error(`No carousel states for ${TeamStage[stage]}`);
    }
}

const defaultAvailableComponents = [TOUR, FIELD, TOPIC, QUESTION];
const defaultCurrentStageComponent = TOUR;

export { stageToCarouselState, defaultAvailableComponents, defaultCurrentStageComponent };
