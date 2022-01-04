import { mapMutations } from "vuex";
import { UPSERT_TEAM_MEMBER } from "@/app/shared/store/modules/mutations";

export default {
    beforeMount() {
        this.$store.state.team.signalrClient.onTeamAddedOrUpdatedTeamMember(
            ({ teamId, memberId, memberName }) => {
                this.upsertTeamMember({ teamId, memberId, memberName });
            }
        );
    },

    methods: {
        ...mapMutations({
            upsertTeamMember: UPSERT_TEAM_MEMBER,
        }),
    },
};
