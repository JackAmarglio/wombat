<template>
    <div id="wrapper">
        <div id="content">
            <router-link to="/host">ведущий</router-link>

            <router-link to="/team">команда</router-link>

            <router-link to="/screen">экран</router-link>

            <router-link class="admin-link" to="/admin">админ</router-link>
        </div>

        <div id="wombat-logo">
            <p>wombat</p>
        </div>

        <div id="app-version">
            <p>{{ appVersion }}</p>
        </div>
    </div>
</template>

<script>
import { getAppVersionString } from "@/app/shared/appVersionProvider";

export default {
    data() {
        return {
            appVersion: "...",
        };
    },

    async mounted() {
        this.appVersion = await getAppVersionString();
    },

    name: "AppGreeter",
};
</script>

<style scoped lang="sass">
#wrapper
  display: flex
  justify-content: center
  height: 100%

  #app-version
    p
      margin: 0
      font-size: 0.7em
      color: rgba(0, 0, 0, 0.1)

    position: absolute
    bottom: 0
    right: 1em

  #wombat-logo
    text-transform: uppercase
    font-size: 1.3em
    font-weight: bold
    color: rgba(145, 105, 219, 0.25)
    position: absolute
    bottom: 0.2em
    user-select: none

    @media (max-width: 300px)
      opacity: 0
      transition: opacity

#content
  height: 100%
  width: 100%
  display: flex
  flex-direction: column
  justify-content: center
  align-items: center
  row-gap: 2.5em

  a
    color: #9169db
    font-weight: bold
    font-size: 1.5em
    user-select: none
    text-decoration: none
    transition: all ease-in-out 0.2s

  .admin-link
    margin-top: 2em
    color: #7752bb


  @media (min-width: 420px)
    flex-direction: row
    justify-content: space-around
    align-items: center

    a
      &:hover
        transform: scale(1.1)

    .admin-link
      margin: 0 0.5em

  @media (min-width: 768px)
    width: 80%

  @media (min-width: 1024px)
    width: clamp(30%, 80%, 50%)

  @media (min-width: 1400px)
    width: clamp(30%, 80%, 20%)
</style>
