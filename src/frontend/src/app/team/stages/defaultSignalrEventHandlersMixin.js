import { SET_LAP_NUMBER, SET_ROUND_END_RESULTS, SET_TOUR_ACTIVE_TEAM_ID } from "@/app/team/modules/mutations";
import TeamStage from "@/app/team/TeamStage";
import { INCREASE_TOUR_NUMBER } from "@/app/team/modules/mutations/tourNumber";

export default {
    methods: {
        defaultOnNextActiveTeamSelectedHandler(selectedActiveTeamId) {
            this.$store.commit(SET_TOUR_ACTIVE_TEAM_ID, selectedActiveTeamId);
            this.$store.commit(INCREASE_TOUR_NUMBER);
            this._updateLapNumber();

            if (selectedActiveTeamId === this.id) {
                this.setStage(TeamStage.SelectingCell);
            } else {
                this.setStage(TeamStage.WaitingForActiveTeamToSelectCell);
            }
        },

        defaultOnRoundEndedHandler(roundEndedArgs) {
            this.$store.commit(SET_ROUND_END_RESULTS, roundEndedArgs);

            this.setStage(TeamStage.RoundEnded);
        },

        // по грязному переписано отсюда:
        // https://github.com/matryosha/Wombat/blob/2336118adad0a43a73afb47fc5f9590cce259dde/src/backend/Wombat.Application.Core/GameSession/ActiveGame.cs#L111
        _updateLapNumber() {
            const tourNumber = this.$store.state.team.tourNumber.current;
            const activeTeamsNumber = this.$store.state.team.backendTeamState.numberOfTeamsInRound;
            let result = 0;

            const shouldDecrease = tourNumber % activeTeamsNumber === 0;

            const wholePartsNumber = ~~(tourNumber / activeTeamsNumber);

            result = wholePartsNumber + 1;
            if (shouldDecrease) result -= 1;

            this.$store.commit(SET_LAP_NUMBER, result);
        },
    },
};
