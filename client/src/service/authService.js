import api from '@/mock/api.js';

const auth = {
  check: '/api/auth/me',
  login: '/api/auth/login',
  register: '/api/auth/register',
};

class AuthService {
  async check() {
    const res = await api.get(auth.check);
    return res.data.user;
  }

  async login(email, password) {
    const res = await api.post(auth.login, {
      email,
      password
    });
    return res.data.user;
  }

  async register(name, email, password) {
    const res = await api.post(auth.register, {
      name,
      email,
      password
    });
    return res.data.user;
  }
}

export default new AuthService();
