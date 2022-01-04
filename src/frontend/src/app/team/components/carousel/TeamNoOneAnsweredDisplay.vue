<template>
    <div class="background">
        <div class="text-wrapper">
            <TeamTextDisplay text-to-display="ніхто не відповів" :text-style="textStyle" />
        </div>
    </div>
</template>

<script>
import TeamTextDisplay from "@/app/team/components/carousel/TeamTextDisplay";

export default {
    data() {
        return {
            textStyle: {
                ["font-size"]: "3em",
                ["text-align"]: "left",
                ["line-height"]: "1em",
                color: "#C8D0E7",
            },
        };
    },
    name: "TeamNoOneAnsweredDisplay",
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
