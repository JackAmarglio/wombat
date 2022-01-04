import { mapGetters, mapMutations } from "vuex";
import { SET_TEAM_NAME } from "@/app/shared/store/modules/mutations";

export default {
    mounted() {
        this.$store.state.team.signalrClient.onTeamChangedName((teamId, name) => {
            this.setTeamName({ teamId: teamId, name: name });
        });
    },

    methods: {
        ...mapMutations({
            setTeamName: SET_TEAM_NAME,
        }),

        ...mapGetters(["currentTeamName"]),
    },
};
