import {
    SET_TEAM_MEMBERS,
    SET_TEAMS_MEMBERS_FROM_SERVER,
    UPSERT_TEAM_MEMBER,
} from "@/app/shared/store/modules/mutations";

function createTeamMember(id, name) {
    return { id, name };
}

export default {
    store() {
        return {
            current: {}, // {1: [{id: 1, name: "member name"}], ...}
        };
    },

    mutations: {
        [SET_TEAMS_MEMBERS_FROM_SERVER](state, members) {
            state.current = members;
        },

        [SET_TEAM_MEMBERS](state, { teamId, members }) {
            state.current = {
                ...state.current,
                [teamId]: members.map((m) => {
                    return { id: m.id, name: m.name };
                }),
            };
        },

        [UPSERT_TEAM_MEMBER](state, { teamId, memberId, memberName }) {
            const teamsMember = state.current[teamId];
            const updatedMember = createTeamMember(memberId, memberName);

            const existingMemberIndex = teamsMember.findIndex((m) => m.id === memberId);
            if (existingMemberIndex === -1) {
                teamsMember.push(updatedMember);
                return;
            }

            teamsMember[existingMemberIndex] = updatedMember;
        },
    },
};
