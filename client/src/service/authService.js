import api from "@/mock/api.js"

const auth = {
  check: '/api/auth/me',
}


class AuthService {
  async check() {
    const res = await api.get(auth.check)
    return res.data.user;
  }
}

export default new AuthService();
