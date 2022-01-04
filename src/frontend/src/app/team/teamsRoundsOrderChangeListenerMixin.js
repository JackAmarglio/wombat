import { PROCESS_SERVER_TEAMS_ROUNDS_ORDER } from "@/app/shared/store/modules/mutations";

export default {
    mounted() {
        this.$store.state.team.signalrClient.onTeamsRoundsOrderUpdated((order) => {
            this.$store.commit(PROCESS_SERVER_TEAMS_ROUNDS_ORDER, order);
        });
    },
};
