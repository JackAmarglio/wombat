import {
    ADD_TEAM_BUTTON_LISTENER_ONCE,
    SET_TEAM_BUTTON_MODE,
    TEAM_BUTTON_PRESSED,
} from "@/app/team/modules/components/mutations/teamInteractButton";
import { TEAM_BUTTON_DISABLED } from "@/app/team/components/bottomHalf/interactButton";

let isProcessing = false;

export default {
    state() {
        return {
            mode: TEAM_BUTTON_DISABLED,
            isEnabled: false,
            _listeners: [],
        };
    },

    mutations: {
        [SET_TEAM_BUTTON_MODE](state, mode) {
            if (state.mode === mode) return;
            state.mode = mode;
        },

        //  стоит ли вообще логику подписки перемещать сюда. тут вообщем вип, скорее всего можно как-то по-другому
        [ADD_TEAM_BUTTON_LISTENER_ONCE](state, listener) {
            state._listeners.push({ isOnce: true, callback: listener });
        },

        [TEAM_BUTTON_PRESSED](state) {
            if (isProcessing) {
                console.log("Ignored processing");
                return;
            }

            // Да, я шарю про однопоточност но быть уверенным, что микротаски снова не вызовут мутацию, не могу
            isProcessing = true;

            const { _listeners } = state;
            const newListenersList = [];

            for (let i = 0; i < _listeners.length; i++) {
                const listener = _listeners[i];
                listener.callback();

                if (listener.isOnce) continue;

                newListenersList.push(listener);
            }

            state._listeners = newListenersList;

            isProcessing = false;
        },
    },
};
