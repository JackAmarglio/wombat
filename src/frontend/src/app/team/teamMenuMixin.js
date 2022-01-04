import Vue from "vue";

let globalTeamMenu;

export default {
    data() {
        return {
            teamMenu: globalTeamMenu,
        };
    },

    beforeCreate() {
        if (globalTeamMenu === undefined) {
            globalTeamMenu = Vue.observable({
                isMenuBtnVisible: true,
                handleBackBtnPressedFunc: function () {
                    this._backBtnPressedFuncHandlers.forEach((f) => f());
                },
                _backBtnPressedFuncHandlers: [],
            });
        }
    },
};
