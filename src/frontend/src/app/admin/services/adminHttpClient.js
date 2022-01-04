import axios from "axios";

import { ADMIN_AUTH_URL, ADMIN_TOKEN_REFRESH_URL } from "@/app/shared/apiUrls";
import {
    getAdminAuthToken,
    updateAdminAuthToken,
    isLoggedIn,
} from "@/app/admin/services/adminAuthInfoProvider";

class AdminHttpClient {
    constructor() {
        this.axiosSettings = {
            headers: {},
        };
        this.axios = axios.create();
        this.isAccessTokenAcquired = false;
        this._timeoutToRefreshToken = setTimeout(this._refreshAccessTokenIfExists.bind(this), 3600000);
    }

    async authenticate(login, pass) {
        let loginResponse;
        try {
            loginResponse = await this.axios.post(ADMIN_AUTH_URL, {
                login: login,
                password: pass,
            });
        } catch (e) {
            return false;
        }
        if (loginResponse.status !== 200) return false;
        const token = loginResponse.data["authToken"];
        this._setAxiosAuthHeader(token);
        this.isAccessTokenAcquired = true;

        updateAdminAuthToken(token);

        return true;
    }

    async get(url, data, options = { idInUrl: false }) {
        let urlToFetch = url;
        let axiosParams = data;

        const { idInUrl } = options;
        if (idInUrl) {
            urlToFetch = `${url}/${data.id}`;
            axiosParams = {};
        }

        let getResponse;
        try {
            getResponse = await this.axios.get(urlToFetch, {
                params: axiosParams,
                ...this.axiosSettings,
            });
        } catch (e) {
            this._throwIfReAuthRequired(e.response);
            throw e;
        }

        return getResponse;
    }

    async put(url, data) {
        let putResponse;

        try {
            putResponse = await this.axios.put(url, data, this.axiosSettings);
        } catch (e) {
            this._throwIfReAuthRequired(e.response);
            throw e;
        }
        return putResponse;
    }

    async delete(url, entityId) {
        let delResponse;

        try {
            delResponse = await this.axios.delete(`${url}/${entityId}`, this.axiosSettings);
        } catch (e) {
            this._throwIfReAuthRequired(e.response);
            throw e;
        }
        return delResponse;
    }

    async getAndReturnData(url, data) {
        const getResult = await this.get(url, data);
        return getResult.data;
    }

    async post(url, data) {
        let postResponse;

        try {
            postResponse = await this.axios.post(url, data, this.axiosSettings);
        } catch (e) {
            this._throwIfReAuthRequired(e.response);
            throw e;
        }
        return postResponse;
    }

    async postAndReturnData(url, data) {
        const postResult = await this.post(url, data);
        return postResult.data;
    }

    async init() {
        if (this.isAccessTokenAcquired) return;
        this._tryGetAccessTokenFromProvider();
        await this._refreshAccessTokenIfExists();
    }

    _setAxiosAuthHeader(token) {
        this.axiosSettings.headers = { Authorization: `Bearer ${token}` };
    }

    _throwIfReAuthRequired(axiosResponse) {
        if (axiosResponse.status === 401 && this.isAccessTokenAcquired) {
            // либо нужна авторизация либо нет доступа
            // но в случае админа это должно быть всегда первое
            throw new Error("Admin authentication required");
        }
    }

    _tryGetAccessTokenFromProvider() {
        if (isLoggedIn() === false) return;
        const token = getAdminAuthToken();

        this._setAxiosAuthHeader(token);
        this.isAccessTokenAcquired = true;
    }

    async _refreshAccessTokenIfExists() {
        if (!this.isAccessTokenAcquired === false) {
            const newToken = (await this.getAndReturnData(ADMIN_TOKEN_REFRESH_URL)).authToken;
            this._setAxiosAuthHeader(newToken);
            updateAdminAuthToken(newToken);
        }

        clearTimeout(this._timeoutToRefreshToken);
        this._timeoutToRefreshToken = setTimeout(this._refreshAccessTokenIfExists.bind(this), 3600000);
    }
}

const client = new AdminHttpClient();

export default client;
