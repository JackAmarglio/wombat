// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isLoggedIn, getAdminAuthToken, updateAdminAuthToken } from "./adminAuthInfoProvider.js";

function isLoggedIn(): boolean;
function getAdminAuthToken(): string;
function updateAdminAuthToken(token: string): void;
