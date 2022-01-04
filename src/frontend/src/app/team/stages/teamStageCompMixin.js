import { mapState, mapGetters } from "vuex";

import defaultSignalrEventHandlersMixin from "@/app/team/stages/defaultSignalrEventHandlersMixin";
import { SET_IS_AFTER_RESTORE_STATUS, SET_STAGE } from "@/app/team/modules/mutations";
import stateRestoreMixin from "@/app/team/stateRestoreMixin";
import teamMenuMixin from "@/app/team/teamMenuMixin";

export default {
    data() {
        return {
            subscribedSignalrEvents: [],
        };
    },
    created() {
        this.ensureStateIsValid();

        if (this.isAfterRestore) {
            this.createdRightAfterRestore();
            this.$store.commit(SET_IS_AFTER_RESTORE_STATUS, false);
        }
    },
    beforeDestroy() {
        this._unSubscribeFromSignalrEvents();
        this.teamMenu.isMenuBtnVisible = true;
    },
    computed: {
        ...mapState({
            id: (state) => state.team.id,
            backendState: (state) => state.team.backendTeamState,
            cellNumber: (state) => state.team.tourActiveCell.cellNumber,
            cellDifficulty: (state) => state.team.cellDifficulty,
            tourActiveTeamId: (state) => state.team.tourActiveTeam.id,
            signalrClient: (state) => state.team.signalrClient,
            currentStage: (state) => state.team.stage.current,
            isStateValid: (state) => state.team.isStateValid,
            lastInteractedOtherTeamId: (state) => state.team.status.lastTeamIdOfInteractedOtherTeam,
            isAfterRestore: (state) => state.team.status.isAfterRestore,
        }),

        ...mapGetters({
            getAttemptsPriceForCurrentCell: "getAttemptsPriceForCurrentCell",
            teamColor: "teamColor",
            remainingAttempts: "currentTeamAttempts",
        }),
    },
    methods: {
        addSignalrSubscribeResults(...subscribeResults) {
            subscribeResults.forEach((r) => this.subscribedSignalrEvents.push(r));
        },
        setStage(newStage) {
            this.$store.commit(SET_STAGE, newStage);
        },
        _unSubscribeFromSignalrEvents() {
            // такая херня, потому что если ливнуть с команды на логин скрин или на главное меню, то модуль стора будет уже пересоздан
            // Хотя это странно, так как по идее оно должно было дать успеть вызваться lifecycke хукам
            const signalrClient = this.$store.state.team?.signalrClient;

            if (signalrClient === null || signalrClient === undefined) return;
            this.subscribedSignalrEvents.forEach((subscribeResult) => signalrClient.off(subscribeResult));
            this.subscribedSignalrEvents = [];
        },
        ensureStateIsValid() {
            if (!this.isStateValid) {
                this.restoreState();
                this.$store.commit("MARK_STATE_IS_VALID");
            }
        },

        // Called once only if component selected right after restoring from backend
        // Нужно чтобы дать понять компоненту, что он показывается сразу после рестора
        createdRightAfterRestore() {
            // mixin provides no default impl
        },
    },
    mixins: [defaultSignalrEventHandlersMixin, stateRestoreMixin, teamMenuMixin],
};
