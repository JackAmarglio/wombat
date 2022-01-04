<template>
    <div class="background">
        <div class="text-wrapper">
            <TeamTextDisplay text-to-display="час сплив" :text-style="textStyle" />
        </div>
    </div>
</template>

<script>
import TeamTextDisplay from "@/app/team/components/carousel/TeamTextDisplay";

export default {
    data() {
        return {
            textStyle: {
                ["font-size"]: "4em",
                ["text-align"]: "left",
                ["line-height"]: "1em",
                color: "#C8D0E7",
            },
        };
    },
    name: "TeamTimeIsUpDisplay",
    components: { TeamTextDisplay },
};
</script>

<style scoped>
.background {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    background-color: #111111;
}

.text-wrapper {
    width: 50%;
}
</style>
