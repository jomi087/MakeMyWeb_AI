export const SUCCESS_MESSAGES = {
  //Auth
  LOGIN_SUCCESS: 'Welcome back',
  ACCOUNT_CREATED: 'Account Created Successfully',
  LOGOUT_SUCCESS: 'Logout successfully',

  // Project
  PROJECT_GENERATION_STARTED: 'AI Agent is planning structure...',
  PROJECT_DELETE_SUCCESS: 'Project deleted successfully',
  PROJECT_REVISION_SUCCESS: (version) => `Updated to version ${version}`,

  WEBSITE_PUBLISHED: 'Website published successfully',

};

export const ERROR_MESSAGES = {
  //Auth
  LOGIN_FAILED: 'Login failed',
  REGISTRATION_FAILED: 'Registration failed',
  LOGOUT_FAILED: 'Logout failed',

  //Project
  PROJECT_LIST_FAILED: 'Failed to load projects list',
  PROJECT_GET_FAILED: 'Failed to load project',
  PROJECT_GENERATATION_FAILED: 'Failed to generate project',
  PROJECT_DELETE_FAILED: 'Failed to delete project',
  PROJECT_REVISION_FAILED: 'Revision request failed',
  REVISION_PATCH_FAILED: (count) => `${count} revision patch(es) failed`,

  WEBSITE_PUBLISH_FAILED: 'Failed to publish website. Please try again.',


  SOMETHING_WENT_WRONG: 'Something went wrong',
};
