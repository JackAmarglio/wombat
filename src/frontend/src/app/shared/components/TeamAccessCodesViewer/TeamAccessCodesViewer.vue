<template>
    <b-card class="col-md-3 col-sm-12 mr-3">
        <h6 class="pb-3" style="color: #0275d8">
            <b>Коды доступа для команд</b>
        </h6>
        <div class="pb-2" v-for="team in teams" :key="team.id">
            <strong :style="getTeamNameStyle(team.id)"> {{ teamNames[team.id] }}:</strong>

            <component v-bind:is="activeCodeEl" :team="team" v-on:code-clicked="onCodeClicked"></component>
        </div>
    </b-card>
</template>

<script>
import TeamCodesNoConnectedCheck from "@/app/shared/components/TeamAccessCodesViewer/TeamCodesNoConnectedCheck";
import TeamCodesWithConnectedCheck from "@/app/shared/components/TeamAccessCodesViewer/TeamCodesWithConnectedCheck";
import teamColors from "@/app/shared/teamColors";

function getTeamLoginUrlFromAccessCode(code) {
    return new URL(`team?code=${code}`, origin);
}

export default {
    components: { TeamCodesNoConnectedCheck, TeamCodesWithConnectedCheck },
    data: function () {
        return {
            teamColors,
            activeCodeEl: "TeamCodesNoConnectedCheck",
            handleClickFunc: async () => Promise.resolve(),
        };
    },
    beforeMount() {
        this.activeCodeEl = this.checkConnected ? "TeamCodesWithConnectedCheck" : "TeamCodesNoConnectedCheck";

        if (process.env.NODE_ENV === "development") {
            this.handleClickFunc = (code) => {
                const url = getTeamLoginUrlFromAccessCode(code);
                window.open(url.href, "_blank");
            };
        } else {
            this.handleClickFunc = async (code) => {
                await navigator.clipboard.writeText(getTeamLoginUrlFromAccessCode(code));
            };
        }
    },
    props: {
        checkConnected: {
            type: Boolean,
            default: function () {
                return false;
            },
        },
        teamsIdsToHighlight: {
            type: Array,
            default: () => [],
        },
        teams: Array,
        teamNames: Object,
    },
    methods: {
        async onCodeClicked(code) {
            await this.handleClickFunc(code);
        },

        getTeamNameStyle(teamId) {
            let color = this.teamsIdsToHighlight.length > 0 ? "#4f4f4f" : "black";

            if (this.teamsIdsToHighlight.indexOf(teamId) !== -1) color = teamColors.get(teamId);

            return {
                color,
            };
        },
    },
    name: "TeamAccessCodesViewer",
};
</script>

<style scoped></style>
