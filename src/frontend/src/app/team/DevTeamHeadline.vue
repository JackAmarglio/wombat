<!-- Used only in dev -->

<template>
    <div id="_____dev-team-headline" :style="{ backgroundColor: teamsColors.get(currentTeamId) }">
        {{ teamName }}
    </div>
</template>

<script>
import teamColors from "@/app/shared/teamColors";

export default {
    data() {
        return {
            teamsColors: teamColors,
        };
    },
    computed: {
        teamName() {
            return this.$store.getters["currentTeamName"];
        },

        currentTeamId() {
            return this.$store.state.team.id;
        },
    },
    name: "DevTeamHeadline",
};
</script>

<style scoped>
#_____dev-team-headline {
    position: absolute;
    width: 100%;
    height: 10px;
    background-color: red;
    top: 0;
    left: 0;
    z-index: 100;

    color: white;
    font-size: 8px;
}

@media (min-width: 768px) {
    #_____dev-team-headline {
        height: 20px;
        font-size: 16px;
    }
}
</style>
