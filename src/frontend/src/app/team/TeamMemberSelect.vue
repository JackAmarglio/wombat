<template>
    <div style="height: 100%; overflow-y: hidden">
        <div class="creating-member-container-wrapper" v-if="displayMode === modes.creatingNewTeamMember">
            <div class="creating-member-container">
                <h2 class="header">Войти в игру как</h2>

                <input class="member-name-input" type="text" v-model="newMemberNameInput" />

                <br />

                <!--            Не понимаю почему тут IDEA жалуется, что в disabled "is not a valid value for disabled"-->
                <input
                    class="submit-btn btn-base"
                    type="button"
                    @click="onMemberNameSaveBtnClick"
                    value="СТАРТ"
                    :disabled="!isNewMemberNameInputValid || isMemberSaveBtnDisabled"
                />

                <input
                    v-if="isGotoExistingMembersBtnVisible"
                    class="goto-existing-members-btn btn-base"
                    type="button"
                    value="👥"
                    @click="displayMode = modes.selectingExistingMember"
                />
            </div>
        </div>

        <div class="selecting-existing-member-container" v-if="displayMode === modes.selectingExistingMember">
            <h2 class="header">Войти в игру как</h2>

            <div class="members-list-container">
                <div
                    class="member-list-item-container"
                    v-for="member in teamMembers"
                    :key="member.id"
                    @click="onMemberClick(member.id)"
                >
                    {{ member.name }}
                </div>
            </div>

            <input
                class="create-new-btn"
                type="button"
                value="Войти как новый"
                @click="displayMode = modes.creatingNewTeamMember"
            />
        </div>
    </div>
</template>

<script>
import { mapState } from "vuex";
import { SET_CURRENT_MEMBER_ID } from "@/app/team/modules/mutations";
import TeamService from "@/app/team/services/TeamService";

const modes = {
    creatingNewTeamMember: 1,
    selectingExistingMember: 2,
};

export default {
    data() {
        return {
            modes: modes,
            displayMode: null,

            newMemberNameInput: "",
            isMemberSaveBtnDisabled: false,
        };
    },

    async beforeMount() {
        if (this.tryRestoreMemberAuthData() === true) {
            await this.$router.replace({ name: "TeamGameBoard" });
            return;
        }

        this.displayMode = modes.creatingNewTeamMember;

        if (this.displayMode === modes.creatingNewTeamMember) {
            const defaultNames = (await import("@/app/team/predefinedTeamMembersNames")).default;
            const defaultNamesLength = defaultNames.length;
            const randIndex = Math.floor(Math.random() * defaultNamesLength);

            this.newMemberNameInput = defaultNames[randIndex];
        }
    },

    computed: {
        ...mapState({
            signalrClient: (state) => state.team.signalrClient,
            gameId: (state) => state.team.gameId,
            teamId: (state) => state.team.id,
        }),

        isNewMemberNameInputValid() {
            // 2 is arbitrary number
            return this.newMemberNameInput.trim().length > 2;
        },

        teamMembers() {
            const teamsMembers = this.$store.state.team.teamsMembers.current;

            return teamsMembers[this.teamId];
        },

        isGotoExistingMembersBtnVisible() {
            return this.teamMembers.length > 0;
        },
    },

    methods: {
        async onMemberNameSaveBtnClick() {
            this.isMemberSaveBtnDisabled = true;

            const newMemberName = this.newMemberNameInput.trim();
            const newMemberId = await this.signalrClient.addTeamMember(newMemberName);

            this.$store.commit(SET_CURRENT_MEMBER_ID, newMemberId);
            this.isMemberSaveBtnDisabled = false;
            this.displayMode = modes.selectingExistingMember;

            TeamService.saveMemberAuthData({
                memberId: newMemberId,
                gameId: this.gameId,
                teamId: this.teamId,
            });

            await this.$router.replace({ name: "TeamGameBoard" });
        },

        tryRestoreMemberAuthData() {
            const teamAuthData = TeamService.getDeviceMemberAuthData(this.teamId);

            if (teamAuthData === null) return false;

            const { memberId, gameId, teamId, expireDate } = teamAuthData;
            if (expireDate < Date.now()) return false;
            if (gameId !== this.gameId) return false;
            if (teamId !== this.teamId) return false;

            // Если сохраненный учасник есть только в localStorage, а в игре его нет
            if (!this.teamMembers.find((m) => m.id === memberId)) return false;

            this.$store.commit(SET_CURRENT_MEMBER_ID, memberId);

            return true;
        },

        async onMemberClick(memberId) {
            this.$store.commit(SET_CURRENT_MEMBER_ID, memberId);
            TeamService.saveMemberAuthData({
                memberId: memberId,
                gameId: this.gameId,
                teamId: this.teamId,
            });

            await this.$router.replace({ name: "TeamGameBoard" });
        },
    },
    name: "TeamMemberSelect",
};
</script>

<style scoped lang="sass">
.creating-member-container-wrapper
  height: 100%
  display: flex
  align-items: center
  background-color: black


  .creating-member-container
    user-select: none
    width: 100%
    color: white

    .header
      padding-bottom: 1em

    .member-name-input
      &:focus
        outline: none

      text-align: center
      color: ghostwhite
      background-color: rgba(0, 0, 0, 0)
      border: none
      margin: 0
      padding: 0

      font-size: 1.5em

    .btn-base
      padding: 0.3em 0

      background-color: rgba(0, 0, 0, 0)
      color: #d5d5d5
      border: none


      border-radius: 10px
      font-size: 1.3em
      font-weight: 300

    .submit-btn
      &:disabled
        border: rgb(253, 76, 76) solid 1px

      margin-top: 2em
      width: 12ch
      border: rgba(80, 196, 15, 0.7) solid 1px

    .goto-existing-members-btn
      margin-left: 10px
      width: 4ch
      border: rgba(241, 241, 241, 0.25) solid 1px

.selecting-existing-member-container
  height: 100%
  background-color: black
  color: white
  user-select: none

  display: flex
  flex-direction: column
  align-items: center

  .header
    padding: 1em 0

  .members-list-container
    width: 100%
    padding: 1em
    text-align: left
    overflow: auto

    .member-list-item-container
      margin-bottom: 1em
      font-size: 1.3em
      padding: 1rem
      border: rgba(241, 241, 241, 0.5) solid 1px
      border-radius: 5px

  .create-new-btn
    width: 25ch
    margin: 1em
    padding: 0.3em 0
    font-size: 1.3em
    font-weight: 300

    background-color: rgba(1, 1, 1, 0)
    border: rgba(80, 196, 15, 0.7) 1px solid
    border-radius: 10px

    color: white
</style>
