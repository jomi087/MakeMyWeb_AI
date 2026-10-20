import { User } from '../models/userModel.js';
// password select is false (by default)

export class UserRepository {
  #mapUser(user) {
    return {
      id: user._id,
      name: user.name,
      email: user.email,
    };
  }

  /**
   * Checks whether an user with the given email already exists.
   *
   * @param {string} email - The email address to check.
   * @returns {Promise<boolean>} Resolves to `true` if an user exists; otherwise `false`.
   */
  async emailExists(email) {
    const user = await User.findOne({ email });
    return !!user;
  }

  async create(payload, session = null) {
    const user = await User.create([payload], { session });
    return this.#mapUser(user[0]);
  }

  async findByEmailWithPassword(email) {
    const user = await User.findOne({ email }).select('+password');
    if (!user) return null;
    return { password: user.password, ...this.#mapUser(user) };
  }

  /**
   * @param {*} password
   * @returns {Promise<boolean>} True or false
   */
  async comparePassword(password) {
    const isMatch = await User.comparePassword(password);
    return isMatch;
  }
}
