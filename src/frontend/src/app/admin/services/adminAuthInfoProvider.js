const pattern = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/g;
let authInSession = false;

function _isTokenFormattedWell(string) {
    return pattern.test(string);
}

function _isTokenExpired(token) {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        // todo: replace deprecated
        atob(base64)
            .split("")
            .map(function (c) {
                return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
    );
    const payload = JSON.parse(jsonPayload);

    return Date.now() / 1000 > payload.exp;
}

function getAdminAuthToken() {
    return window.localStorage.getItem("adminAuthToken");
}

function updateAdminAuthToken(token) {
    window.localStorage.setItem(`adminAuthToken`, token);
}

function isAdminAuthTokenExists() {
    return getAdminAuthToken !== null;
}

function isLoggedIn() {
    if (authInSession) return true;
    const token = getAdminAuthToken();
    if (token === null) return false;
    if (!_isTokenFormattedWell(token)) {
        window.localStorage.removeItem("adminAuthToken");
        return false;
    }
    if (_isTokenExpired(token)) return false;

    authInSession = true;
    return true;
}

export { getAdminAuthToken, isAdminAuthTokenExists, isLoggedIn, updateAdminAuthToken };
