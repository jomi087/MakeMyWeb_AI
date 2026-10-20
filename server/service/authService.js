import { HTTP_STATUS } from '../constants/http.constants.js';
import { ERROR_MESSAGES } from '../constants/messages.constants.js';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError.js';
import { AUTH_SESSION_TOKEN_EXPIRY } from '../constants/auth.constants.js';
import { env } from '../config/env.js';

export class AuthService {
  /**
   * @param {import("../repositories/userRepository.js").UserRepository} userRepository
   */
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  #generateAuthSessionToken(payload) {
    return jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: AUTH_SESSION_TOKEN_EXPIRY,
    });
  }

  async userInfo(userId) {
    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async register(name, email, password) {
    const existingUser = await this.userRepository.emailExists(email);

    if (existingUser) {
      throw new AppError(HTTP_STATUS.CONFLICT, ERROR_MESSAGES.USER_EXISTS);
    }

    const newUser = await this.userRepository.create({
      name,
      email,
      password,
    });

    const payload = {
      userId: newUser.id.toString(),
      email: newUser.email,
    };

    const token = this.#generateAuthSessionToken(payload);

    return {
      token,
      userInfo: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    };
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmailWithPassword(email);

    if (!user) {
      throw new AppError(HTTP_STATUS.NOT_FOUND, ERROR_MESSAGES.USER_NOT_FOUND);
    }

    const passwordMatch = await this.userRepository.comparePassword(password);

    if (!passwordMatch) {
      throw new AppError(
        HTTP_STATUS.UNAUTHORIZED,
        ERROR_MESSAGES.INVALID_CREDENTIALS
      );
    }

    const payload = {
      userId: user.id.toString(),
      email: user.email,
    };

    const token = this.#generateAuthSessionToken(payload);

    return {
      token,
      userInfo: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }
}
