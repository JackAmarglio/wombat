<template>
    <div ref="stepper_row" class="stepper-wrapper row ml-4 pt-2 pb-2">
        <div ref="stepper" class="stepper">
            <div
                ref="step"
                class="progress-step"
                :class="{ active: index === activeStep, completed: step.isCompleted }"
                v-for="(step, index) in formSteps"
                :key="'step' + index"
                @click="moveToStep(index)"
            >
                {{ step.questionsRequired }}
                <div ref="step-subheader" class="subheader">{{ step.label }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Stepper",
    props: {
        formSteps: {
            type: Array,
            required: true,
        },
        activeStep: {
            type: Number,
            required: true,
        },
    },
    methods: {
        moveToStep(stepIndex) {
            this.$emit("onStepNumberClick", stepIndex);
        },
    },
};
</script>

<style scoped lang="scss">
$border-width: 2px;

@mixin flexbox() {
    display: flex;
    justify-content: center;
    align-items: center;
}
.stepper-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    height: calc(100% - 20px);
    position: relative;

    .stepper {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        height: 60px;
        background-color: #fff;
    }

    .progress-step {
        @include flexbox();
        position: relative;
        width: 30px;
        height: 30px;
        color: #fff;
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        background-color: #0275d8;
        border: $border-width solid;
        border-color: #f7f7f7;
        border-radius: 50%;
        font-weight: bold;
        font-size: 14px;

        .subheader {
            color: #111;
            position: absolute;
            margin: 0 auto;
            top: 40px;
            font-size: 12px;
            font-weight: 500;
        }

        &.active {
            background-color: #f7f7f7;
            color: #0275d8;
            border-color: #0275d8;
            padding: 5px;
            animation: all 400ms ease-in-out;

            .subheader {
                color: #0275d8;
            }

            &:before {
                background-color: #0275d8;
            }

            ~ .progress-step {
                color: #555;
                background-color: #f7f7f7;
            }

            ~ .progress-step::before {
                background-color: #f7f7f7;
            }
        }

        &.completed {
            background-color: #0275d8 !important;
            border-color: #0275d8 !important;
            color: #fff !important;

            &.active {
                background-color: #5bc0de !important;
            }

            &:before {
                background-color: #0275d8 !important;
            }

            .subheader {
                color: #0275d8 !important;
            }
        }

        &:not(:first-child) {
            margin-left: 20vw;

            &:before {
                content: "";
                position: absolute;
                left: -20vw;
                transform: translateX(-$border-width);
                height: $border-width;
                width: 20vw;
                background: #0275d8;
                z-index: 10;
            }
        }
    }
}
</style>
