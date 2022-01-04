const apiPrefix = process.env.VUE_APP_API_URL;

export const GAMEHUB_URL = `${apiPrefix}/gamehub`;

export const GAME_HOST_URL = `${apiPrefix}/game-host`;
export const GAME_HOST_AUTH_URL = `${GAME_HOST_URL}/authorize`;
export const GAME_HOST_SUBMIT_GAME_SETTINGS_URL = `${GAME_HOST_URL}/submit-game-settings`;
export const GAME_HOST_GET_GAME_URL = `${GAME_HOST_URL}/game`;

export const SCREEN_URL = `${apiPrefix}/game-screen`;
export const SCREEN_AUTH_URL = `${SCREEN_URL}/authorize`;
export const SCREEN_GET_GAME_URL = `${SCREEN_URL}/game`;

export const TEAM_URL = `${apiPrefix}/team`;
export const TEAM_AUTH_URL = `${TEAM_URL}/authorize`;
export const TEAM_SUBMIT_VOICE_URL = `${TEAM_URL}/submit-voice-data`;

export const APP_VERSION_URL = `${apiPrefix}/version`;

export * from "@/app/admin/adminApiUrls";
