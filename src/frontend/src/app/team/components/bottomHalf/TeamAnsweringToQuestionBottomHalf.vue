<template>
    <div class="background" :style="{ 'background-color': backgroundColor }">
        <div class="shape" v-on:mousedown="down" v-on:mouseup="up" />
    </div>
</template>

<script>
import { mapState } from "vuex";
import TeamVoiceRecorder from "@/app/team/services/TeamVoiceRecorder";
import TeamService from "@/app/team/services/TeamService";

export default {
    data() {
        return {
            holdTimeout: null,
            backgroundColor: "white",
            teamVoiceRecorder: null,
        };
    },

    beforeMount() {
        this.backgroundColor = this.$store.getters.teamColor;

        console.log(this.teamVoiceRecorder);
    },

    computed: {
        ...mapState({ gameId: (state) => state.team.gameId }),
    },

    methods: {
        down() {
            this.holdTimeout = setTimeout(() => {
                this.long();
            }, 500);
        },

        async up() {
            clearTimeout(this.holdTimeout);

            if (this.isRecording() === false) return;

            await this.teamVoiceRecorder.stopRecording();
            const voice64B = await this.teamVoiceRecorder.lastRecordedBlobAsB64();

            await TeamService.sendVoiceData(this.gameId, voice64B);
        },

        async long() {
            if (this.isRecording()) return;

            // Костыль, потому что не смог разобраться, почему только первый раз записывает, а после выдает плохой блоб
            this.teamVoiceRecorder = new TeamVoiceRecorder();

            await this.teamVoiceRecorder.startRecording();
        },

        isRecording() {
            return this.teamVoiceRecorder?.isRecording ?? false;
        },
    },
    name: "TeamAnsweringToQuestionBottomHalf",
};
</script>

<style scoped lang="sass">
.background
    height: 100%
    width: 100%
    display: flex
    align-items: center
    justify-content: center

    .shape
        background-color: white
        height: 10em
        width: 10em
        border-radius: 100px
</style>
