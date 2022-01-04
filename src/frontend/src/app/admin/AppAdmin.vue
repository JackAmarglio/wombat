<template>
    <div class="wrapper">
        <AdminDashboard class="dashboard" />

        <div id="home-btn-container">
            <div class="home-btn" @click="$router.push('/')">⌂</div>
        </div>
    </div>
</template>

<script>
import AdminDashboard from "@/app/admin/components/AdminDashboard.vue";
import AdminModule from "@/app/admin/store/index";

export default {
    beforeDestroy() {
        this.$store.unregisterModule("admin");
    },
    beforeMount() {
        this.$store.registerModule("admin", AdminModule);
    },
    name: "AppAdmin",
    components: {
        AdminDashboard,
    },
};
</script>

<style scoped lang="sass">
.wrapper
  display: flex
  flex-direction: column
  height: 100%

  .dashboard
    flex-grow: 1

  #home-btn-container
    background-color: rgb(247, 247, 247)
    padding: 0.5em 0
    display: flex
    justify-content: center
    font-size: 2em

    .home-btn
      background-color: #fefefe
      user-select: none
      line-height: 1.2
      font-weight: lighter
      padding: 0 1em
      border: rgba(145, 105, 219, 0.8) solid 1px
      border-radius: 10px
      color: rgba(145, 105, 219, 0.9)
      transition: background-color 0.5s
      cursor: pointer

      &:hover
        background-color: rgba(118, 63, 198, 0.2)

    @media (min-width: 768px)
      position: absolute
      top: 0.2em
      left: 1em
      padding: 0

      .home-btn
        padding: 0 0.3em
</style>
