<template>
    <ul class="container">
        <li class="card p-2 m-3" v-for="team in teamsInTour" :key="team.id" :style="teamCellStyle(team)">
            <b>{{ teamNames[team.id] }}</b
            ><i>(Попыток: {{ team.attemptsToInteract }})</i>
        </li>
    </ul>
</template>

<script>
import colors from "@/app/shared/teamColors";

export default {
    name: "TeamsInTourViewer",
    props: {
        teamsInTour: {
            type: Array, //<TeamInRoundModel>
            required: true,
        },
        teamNames: {
            type: Object,
            required: true,
        },
        shouldHideAnsweringTeam: {
            type: Boolean,
            required: false,
            default: false,
        },
    },
    data() {
        return {
            colors: colors,
        };
    },

    methods: {
        teamCellStyle(team) {
            const shouldHideAnsweringTeam = this.shouldHideAnsweringTeam;

            function getBackgroundStyle() {
                if (shouldHideAnsweringTeam || team.isAnswering === false) return "#f7f7f7";

                return colors.get(team.id);
            }

            function getColorStyle() {
                if (shouldHideAnsweringTeam || team.isAnswering === false) return "#000000";
                return "#ffffff";
            }

            return {
                background: getBackgroundStyle(),
                color: getColorStyle(),
                border: team.active ? "2px solid " + colors.get(team.id) : "rgba(0, 0, 0, 0.125)",
                opacity: team.isAllowedToAnswer ? 1 : 0.4,
            };
        },
    },
};
</script>

<style scoped></style>
