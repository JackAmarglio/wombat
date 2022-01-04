import { SET_CAROUSEL_ACTIVE_COMPONENT } from "@/app/team/modules/components/mutations/carousel";
import { SET_STAGE } from "@/app/team/modules/mutations";
import {
    defaultAvailableComponents,
    defaultCurrentStageComponent,
    stageToCarouselState,
} from "@/app/team/components/carousel";

export default {
    state() {
        return {
            activeComponent: undefined,
            availableComponents: defaultAvailableComponents,
            currentStageComponent: defaultCurrentStageComponent,
        };
    },

    mutations: {
        [SET_CAROUSEL_ACTIVE_COMPONENT](state, component) {
            state.activeComponent = component;
        },

        [SET_STAGE](state, stage) {
            Object.assign(state, stageToCarouselState(stage));
        },
    },
};
