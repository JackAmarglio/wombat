<template>
    <div>
        <div class="tutorial-tooltip" v-if="isTooltipVisible">
            <p>
                Натисни на <span>код <HostCopyCodeIcon /></span> щоб отримати лiнк
            </p>

            <div class="dismiss-tip" @click="dismissTooltip">&#215;</div>
        </div>

        <div class="screen-container">
            <h3 class="header">Код екрана</h3>

            <div class="screen-code-container" @click="onScreenCodeClick">
                <HostCopyCodeIcon class="ico" :is-active="isScreenCodeCopyIconActive" />
                <code>{{ screenCode }}</code>
            </div>
        </div>

        <div class="teams-containers">
            <h3 class="header">Коди команд</h3>

            <div class="team-container" v-for="team in teams" :key="team.id">
                <p class="team-name">{{ teamNames[team.id] }}</p>
                <p class="team-online-status" :style="teamOnlineStatusStyle(team.connected)">
                    {{ team.connected ? "online" : "offline" }}
                </p>

                <div class="code-container" @click="onTeamCodeClick(team.id, team.accessCode)">
                    <HostCopyCodeIcon class="ico" :is-active="copiedCodeTeamIds.includes(team.id)" />
                    <code> {{ team.accessCode }}</code>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HostCopyCodeIcon from "@/app/host/components/HostCopyCodeIcon";

function getTeamLoginUrlFromAccessCode(code, rolePrefix = "team") {
    return new URL(`${rolePrefix}?code=${code}`, origin);
}

export default {
    props: ["teams", "teamNames", "screenCode", "isScreenConnected"],
    data() {
        return {
            isTooltipVisible: true,
            isTeamsRoundsOrderEditMode: false,

            copiedCodeTeamIds: [],

            actionOnTeamCodeClick: null,
            actionOnScreenCodeClick: null,

            copyScreenCodeTimeout: null,
            isScreenCodeCopyIconActive: false,
        };
    },
    beforeMount() {
        if (process.env.NODE_ENV === "development") {
            this.actionOnTeamCodeClick = (code) => {
                const url = getTeamLoginUrlFromAccessCode(code);
                window.open(url.href, "_blank");
            };

            this.actionOnScreenCodeClick = (code) => {
                const url = getTeamLoginUrlFromAccessCode(code, "screen");
                window.open(url.href, "_blank");
            };
        } else {
            this.actionOnTeamCodeClick = async (code) => {
                await navigator.clipboard.writeText(getTeamLoginUrlFromAccessCode(code));
            };

            this.actionOnScreenCodeClick = async (code) => {
                await navigator.clipboard.writeText(getTeamLoginUrlFromAccessCode(code, "screen"));
            };
        }

        const shouldHideTooltip = localStorage.getItem("hostPregameTooltipDismissed") !== null;
        if (shouldHideTooltip) this.isTooltipVisible = false;
    },

    methods: {
        dismissTooltip() {
            this.isTooltipVisible = false;
            localStorage.setItem("hostPregameTooltipDismissed", "");
        },

        teamOnlineStatusStyle(isConnected) {
            return {
                color: isConnected ? "#50c40f" : "rgba(161,29,29,0.6)",
            };
        },

        onScreenCodeClick() {
            clearTimeout(this.copyScreenCodeTimeout);

            this.isScreenCodeCopyIconActive = true;
            this.actionOnScreenCodeClick(this.screenCode);

            this.copyScreenCodeTimeout = setTimeout(() => {
                this.isScreenCodeCopyIconActive = false;
            }, 1111);
        },

        onTeamCodeClick(teamId, code) {
            this.copiedCodeTeamIds.push(teamId);
            this.actionOnTeamCodeClick(code);
            setTimeout(() => {
                const index = this.copiedCodeTeamIds.indexOf(teamId);
                this.copiedCodeTeamIds.splice(index, 1);
            }, 1111);
        },
    },
    components: { HostCopyCodeIcon },
    name: "HostGameAccessCodes",
};
</script>

<style scoped lang="sass">
.tutorial-tooltip
  text-align: left
  display: flex
  justify-content: space-between
  align-items: center
  border-radius: 5px

  width: 95%
  margin: 1em auto
  padding: 1.3em
  background-color: #ffe062

  p
    margin: 0
    padding: 0

    span
      color: #e83e8c

  .dismiss-tip
    color: gray
    line-height: 0
    font-size: 2em

  @media(min-width: 768px)
    max-width: 500px

.screen-container
  display: flex
  flex-direction: column
  align-items: center

  padding: 5vh 0

  .header
    margin-bottom: 1em

  .screen-code-container
    cursor: pointer
    position: relative

    .ico
      position: absolute
      top: 50%
      left: -3ch
      transform: translateY(-50%)
      fill: rgba(0, 0, 0, 0.2)

    code
      font-size: 2em


.teams-containers
  padding: 5vh 0
  margin-bottom: 10vh
  background-color: #f9f9f9

  .header
    margin-bottom: 1em

  .team-container
    display: flex
    flex-direction: column
    align-items: center
    padding-bottom: 1em
    border-bottom: rgba(0, 0, 0, 0.25) solid 1px
    margin: 1em 0

    &:last-child
      border: none

    .team-name
      font-size: 1.3em
      margin-bottom: 0

    .team-online-status
      user-select: none
      font-size: 0.5em
      font-family: monospace

    .code-container
      cursor: pointer
      position: relative

      .ico
        position: absolute
        top: 50%
        left: -3ch
        transform: translateY(-50%)
        fill: rgba(0, 0, 0, 0.2)

      code
        font-size: 1.7em

    @media(min-width: 768px)
      width: 50%
      margin: 1em auto

@media(min-width: 768px)
  width: 75%
  margin: 0 auto
</style>
