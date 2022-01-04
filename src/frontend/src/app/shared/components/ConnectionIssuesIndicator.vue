<template>
    <div>
        <div class="background" :class="isFullscreen === true ? 'background-visible' : ''"></div>

        <div
            class="icon-wrapper"
            :class="isFullscreen === true ? 'icon-wrapper-centered' : ''"
            :style="isEnabled ? '' : 'display:none'"
            @click="onIconClick"
        >
            <svg class="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 60">
                <path
                    d="M18 35a3 3 0 1 0 0 6 3 3 0 1 0 0-6zm0 4a1 1 0 1 1 0-2 1 1 0 1 1 0 2zm0-8c-2.119.039-4.15.855-5.707 2.293a1 1 0 0 0 1.414 1.414A6.61 6.61 0 0 1 18 33c1.591.042 3.114.648 4.3 1.709a1 1 0 0 0 1.412-1.416C22.154 31.854 20.121 31.038 18 31zm0-5a13.56 13.56 0 0 0-8.684 3.271 1 1 0 0 0 1.368 1.458A11.62 11.62 0 0 1 18 28a11.73 11.73 0 0 1 7.318 2.731 1 1 0 0 0 1.366-1.46A13.56 13.56 0 0 0 18 26zm-11.74.673a1 1 0 0 0 1.413.067C10.593 24.362 14.234 23.043 18 23c3.765.053 7.403 1.37 10.328 3.741a1 1 0 1 0 1.345-1.481C26.389 22.538 22.266 21.033 18 21c-4.266.033-8.389 1.538-11.673 4.26a1 1 0 0 0-.067 1.413zM59.582 55.4L41.635 24.519C41.091 23.579 40.087 23 39 23s-2.09.579-2.635 1.519l-.366.63V4a4 4 0 0 0-4-4H4a4 4 0 0 0-4 4v52a4 4 0 0 0 4 4h52.948c1.095-.001 2.105-.588 2.649-1.537s.538-2.118-.015-3.063zM25.691 2l-1.283 1.368A2 2 0 0 1 22.95 4h-9.9c-.553-.001-1.08-.229-1.459-.632L10.309 2zM2 4a2 2 0 0 1 2-2h3.567l2.565 2.735A4.01 4.01 0 0 0 13.05 6h9.9c1.106-.001 2.162-.459 2.918-1.265L28.433 2H32a2 2 0 0 1 2 2v24.59L19.815 53H4a2 2 0 0 1-2-2zm0 52v-1.556A3.96 3.96 0 0 0 4 55h14.653l-.235.4a3.01 3.01 0 0 0-.2 2.6H4a2 2 0 0 1-2-2zm55.855 1.474a1.03 1.03 0 0 1-.907.526h-35.9a1.03 1.03 0 0 1-.907-.526 1.05 1.05 0 0 1 0-1.066L38.1 25.522c.187-.323.532-.522.905-.522s.718.199.905.522l17.944 30.886a1.05 1.05 0 0 1 .001 1.066zM5 12a1 1 0 0 0 .707-.293l2-2a1 1 0 0 0-1.414-1.414l-2 2A1 1 0 0 0 5 12z"
                />
                <path
                    d="M5 18a1 1 0 0 0 .707-.293l8-8a1 1 0 0 0-1.414-1.414l-8 8A1 1 0 0 0 5 18zm34 32a3 3 0 1 0 0 6 3 3 0 1 0 0-6zm0 4a1 1 0 1 1 0-2 1 1 0 1 1 0 2zm0-22a3 3 0 0 0-3 3v10a3 3 0 1 0 6 0V35a3 3 0 0 0-3-3zm1 13a1 1 0 1 1-2 0V35a1 1 0 1 1 2 0z"
                />
            </svg>
        </div>
    </div>
</template>

<script>
export default {
    props: ["isFullscreen", "isEnabled"],
    methods: {
        onIconClick() {
            if (window.confirm("Перезагрузить?")) location.reload();
        },
    },
    name: "ConnectionIssuesIndicator",
};
</script>

<style scoped lang="sass">
.icon-wrapper-centered
  top: 50% !important
  right: 50% !important
  transition: top 1s, right 1s, transform 1s
  // будет ли это по центру, если скейл 2?
  transform: translate(50%, -50%) scale(2)

.background
  position: absolute
  height: 100%
  width: 100%
  z-index: 18

  background-color: white
  opacity: 0
  pointer-events: none
  transition: opacity 1.4s

.background-visible
  opacity: 90%
  pointer-events: all

.icon-wrapper
  position: absolute

  z-index: 19
  top: 1em
  right: 1em

  .svg
    fill: #fd4c4c
    height: 1.5em
    width: 1.5em
    animation: breathe 2s infinite

@keyframes breathe
  0%
    opacity: 100%

  70%
    opacity: 50%

  100%
    opacity: 100%
</style>
