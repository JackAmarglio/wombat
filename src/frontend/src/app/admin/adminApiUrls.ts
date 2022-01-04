const apiPrefix = process.env.VUE_APP_API_URL;

export const ADMIN_URL = `${apiPrefix}/admin`;

export const ADMIN_AUTH_URL = `${ADMIN_URL}/authenticate`;
export const ADMIN_TOKEN_REFRESH_URL = `${ADMIN_URL}/refresh-token`;

export const HOSTS_URL = `${ADMIN_URL}/game-hosts`;

export const QUESTIONS_URL = `${ADMIN_URL}/questions`;
export const QUESTIONS_TOPIC_LESS_URL = `${QUESTIONS_URL}/topic-less`;
export const QUESTIONS_GET_COUNT = `${QUESTIONS_URL}/count`;

export const QUESTION_TOPICS_URL = `${ADMIN_URL}/question-topics`;
export const QUESTION_TOPICS_TOPIC_LESS_INFO_URL = `${QUESTION_TOPICS_URL}/topic-less`;
export const QUESTION_TOPIC_GET_BY_NAME_URL = `${QUESTION_TOPICS_URL}/like-name`;

export const QUESTIONS_KITS_URL = `${ADMIN_URL}/questions-kits`;
export const QUESTION_QUESTIONS_KITS = `${QUESTIONS_KITS_URL}/question`;

export const KIT_COMPILATIONS_URL = `${ADMIN_URL}/kit-compilations`;
export const QUESTIONS_KITS_COMPILATIONS_URL = `${KIT_COMPILATIONS_URL}/questions-kit`;

export const GAMES_URL = `${ADMIN_URL}/games`;

export const GAME_RESTART_URL = `${ADMIN_URL}/restart-game`;
