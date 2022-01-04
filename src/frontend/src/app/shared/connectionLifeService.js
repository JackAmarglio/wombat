class ConnectionLifeService {
    constructor() {
        this._signalRClient = null;
        this._timeoutBeforeNotifyingOfReconnect = null;
        this._defaultTimeoutMsBeforeNotifying = 2222;
        this._onReconnectStartedHandlers = [];
        this._onReconnectedHandlers = [];

        this.isConnectionLive = true;
    }

    init(signalRClient) {
        this._signalRClient = signalRClient;

        this._signalRClient.onReconnecting(() => this._onReconnecting());
        this._signalRClient.onReconnected(() => this._onReconnected());
    }

    addOnReconnectStartedHandler(handler) {
        this._onReconnectStartedHandlers.push(handler);
    }

    addOnReconnectedHandler(handler) {
        this._onReconnectedHandlers.push(handler);
    }

    removeOnReconnectStartedHandler(handler) {
        const index = this._onReconnectStartedHandlers.indexOf(handler);
        if (index === -1) return;
        this._onReconnectStartedHandlers.splice(index, 1);
    }

    removeOnReconnectedHandler(handler) {
        const index = this._onReconnectedHandlers.indexOf(handler);
        if (index === -1) return;
        this._onReconnectedHandlers.splice(index, 1);
    }

    _onReconnecting() {
        this.isConnectionLive = false;
        this._timeoutBeforeNotifyingOfReconnect = setTimeout(
            () => this._onReconnectionTimeoutOut(),
            this._defaultTimeoutMsBeforeNotifying
        );
    }

    _onReconnected() {
        this.isConnectionLive = true;
        clearTimeout(this._timeoutBeforeNotifyingOfReconnect);
        this._onReconnectedHandlers.forEach((h) => h());
    }

    _onReconnectionTimeoutOut() {
        this._onReconnectStartedHandlers.forEach((h) => h());
    }
}

const instance = new ConnectionLifeService();

export default instance;
