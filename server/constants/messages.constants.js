export const SUCCESS_MESSAGES = {
  SERVER_RUNNING: 'Server is running',
  DB_CONNECTED: 'Database Connected Successfully',

  REGISTER_SUCCESS: 'User registered successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  SUCCESS: 'Success-full',

  //Project
  PROJECT_CREATION_SUCCESS: 'Project created successfully',
  PROJECT_LIST_SUCCESS: 'Projects fetched successfully',
  PROJECT_GET_SUCCESS: 'Project fetched successfully',
  PROJECT_DELETE_SUCCESS: 'Project deleted successfully',
  PROJECT_UPDATE_SUCCESS: 'Project updated successfully',
  PROJECT_PUBLISH_SUCCESS: 'Project publish successfully',
  PROJECT_REVISION_SUCCESS: 'Project revised successfully',
};

export const ERROR_MESSAGES = {
  //env
  MISSING_DB_URI: 'DB_URI is missing',
  MISSING_FRONTEND_URL: 'FRONTEND_URL must be a valid URL',
  ALLOWED_ORIGINS: 'Invalid or missing allowed origins configuration',
  MISSING_JWT_SECRET: 'JWT_SECRET is missing',
  MISSING_OPENROUTER_API_KEY: 'OpenRouter api key is missing',
  MISSING_OPENROUTER_MODEL: 'Model name is missing',
  MISSING_AI_MAX_CONCURRENCY: ' Max no of ai concurrency is missing',
  MISSING_OPENROUTER_BASE_URL: 'Open-router base url is missing',

  //jwt
  SESSION_TOKEN_EXPIRED: 'Session token has expired',
  INVALID_TOKEN: 'Invalid token',
  UNAUTHORIZED: 'Unauthorized access',

  //Auth
  INVALID_CREDENTIALS: 'Invalid Credentials',
  USER_NOT_FOUND: 'User not found',
  USER_EXISTS: 'User already exists',

  //Project
  PROJECT_NOT_FOUND: 'Project not found',
  PROJECT_NOT_PUBLISH: 'Project not published yet',

  //common
  INTERNAL_SERVER_ERROR: 'Internal server error',
  SOMETHING_WENT_WRONG: 'Something went wrong',
  VALIDATION_FAILED: 'Validation failed',
};
