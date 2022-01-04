<template>
    <div>
        <!--        Не знаю как пофиксить это уродство в prettier. Ironic-->
        <p
            style="
                 {
                    user-select: none;
                }
            "
            :style="style"
        >
            {{ textToDisplay }}
        </p>
    </div>
</template>

<script>
export default {
    props: ["textToDisplay", "textStyle"],

    beforeMount() {
        if (this.style === null) {
            if (this.textStyle !== undefined) {
                this.style = this.textStyle;
            } else {
                this.applyDefaultStyle();
            }
        }
    },

    data() {
        return {
            style: null,
        };
    },

    methods: {
        applyDefaultStyle() {
            this.style = {
                ["font-size"]: "1.5em",
            };
        },
    },
    name: "TeamTextDisplay",
};
</script>

<style scoped></style>
