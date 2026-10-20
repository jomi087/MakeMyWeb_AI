export const NAME_MIN_LENGTH = 3;
export const NAME_MAX_LENGTH = 50;
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 32;
export const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).*$/;

// export const SALT_ROUNDS = 10;

// authentication sessions
export const AUTH_SESSION_TOKEN_EXPIRY = '30d';
export const AUTH_SESSION_COOKIE_AGE = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
