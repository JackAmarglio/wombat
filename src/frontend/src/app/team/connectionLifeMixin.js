import connectionLifeService from "@/app/shared/connectionLifeService";

export default {
    created() {
        connectionLifeService.addOnReconnectStartedHandler(this._onReconnect);
        connectionLifeService.addOnReconnectedHandler(this._onReconnected);
    },

    beforeDestroy() {
        connectionLifeService.removeOnReconnectStartedHandler(this._onReconnect);
        connectionLifeService.removeOnReconnectedHandler(this._onReconnected);
    },

    methods: {
        _onReconnect() {
            const componentReconnectHandler = this.onReconnectOccured;

            if (componentReconnectHandler === undefined) return;

            componentReconnectHandler();
        },

        _onReconnected() {
            const componentReconnectHandler = this.onReconnected;

            if (componentReconnectHandler === undefined) return;

            componentReconnectHandler();
        },
    },
};
