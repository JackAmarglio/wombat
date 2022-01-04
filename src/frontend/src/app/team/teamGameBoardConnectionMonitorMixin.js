import { SET_IS_AFTER_RESTORE_STATUS, SET_STAGE } from "@/app/team/modules/mutations";
import TeamStage from "@/app/team/TeamStage";
import connectionLifeMixin from "@/app/team/connectionLifeMixin";
import stateRestoreMixin from "@/app/team/stateRestoreMixin";

export default {
    data() {
        return {
            isThereConnectionIssues: false,
            isNetworkIssuesFullscreen: false,
            timeoutBeforeNetworkIssueIconFullscreen: null,
        };
    },

    methods: {
        onReconnectOccured() {
            this.isThereConnectionIssues = true;
            this.timeoutBeforeNetworkIssueIconFullscreen = setTimeout(() => {
                if (this.isThereConnectionIssues === false) return;

                this.isNetworkIssuesFullscreen = true;
                this.isMenuOpened = false;
            }, 3333);
        },

        async onReconnected() {
            // todo: юзкейс, когда связь пропала ненадолго и более вероятно что ввостанавливать стейт не нужно.
            // Но пока это никак не затрекать, в будущем возможно будет чек по стейту бека
            // if (!this.isThereConnectionIssues) {
            //
            // }

            clearTimeout(this.timeoutBeforeNetworkIssueIconFullscreen);

            // todo: костыль, мб лучше добавить отдельный стейт для этого. Нужно чтобы затригерить вьюшные lifecycle хуки
            this.$store.commit(SET_STAGE, TeamStage.Unknown);

            await this.$store.dispatch("getBackendTeamState");
            const newStage = this.getTeamStageFromBackendGameState();

            this.$store.commit(SET_IS_AFTER_RESTORE_STATUS, true);

            // todo: могут быть проблемы, так как стейт в грязном состоянии, то некоторые штуки могут рабоать неправильно. Например tourSelectedCell
            this.restoreState(newStage);

            this.$store.commit(SET_STAGE, newStage);

            this.isThereConnectionIssues = false;
            this.isNetworkIssuesFullscreen = false;
        },
    },

    mixins: [connectionLifeMixin, stateRestoreMixin],
};
