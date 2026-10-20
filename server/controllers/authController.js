import { AUTH_SESSION_COOKIE_AGE } from '../constants/auth.constants.js';
import { HTTP_STATUS } from '../constants/http.constants.js';
import { SUCCESS_MESSAGES } from '../constants/messages.constants.js';
import { sendSuccess } from '../utils/apiResponse.js';

export class AuthController {
  /**
   * @param {import("../service/authService.js").AuthService} authService
   */

  constructor(authService) {
    this.authService = authService;
  }

  #setSessionCookie(res, token) {
    res.cookie('authSessionToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: AUTH_SESSION_COOKIE_AGE,
    });
  }

  register = async (req, res) => {
    let { name, email, password } = req.body;
    email = email.toLowerCase(); // Convert email to lowercase

    const { userInfo, token } = await this.authService.register(
      name,
      email,
      password
    );
    this.#setSessionCookie(res, token);

    sendSuccess(res, HTTP_STATUS.CREATED, SUCCESS_MESSAGES.REGISTER_SUCCESS, {
      userInfo,
    });
  };

  login = async (req, res) => {
    let { email, password } = req.body;
    email = email.toLowerCase(); // Convert email to lowercase

    const { token, userInfo } = await this.authService.login(email, password);

    this.#setSessionCookie(res, token);

    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGIN_SUCCESS, {
      userInfo,
    });
  };

  logout = async (req, res) => {
    res.clearCookie('authSessionToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.LOGOUT_SUCCESS);
  };

  userInfo = async (req, res) => {
    const userInfo = await this.authService.userInfo(req.user.userId);

    sendSuccess(res, HTTP_STATUS.OK, SUCCESS_MESSAGES.SUCCESS, { userInfo });
  };
}
