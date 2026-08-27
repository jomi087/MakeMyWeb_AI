import api from '@/mock/api.js';

const project = {
  list: '/api/projects',
  get: (id) => `/api/projects/${id}`,
  create: '/api/projects',
  delete: (id) => `/api/projects/${id}`
};

class ProjectService {
  // get list of projects
  async list() {
    const res = await api.get(project.list);
    return res.data;
  }

  // getting perticular project
  async getById(id) {
    const res = await api.get(project.get(id))
    return res.data;
  }

  //generate project
  async generate(prompt) {
    const res = await api.post(project.create, { prompt })
    return res.data
  }

  async remove(id) {
    await api.delete(project.delete(id))
  }
}

export default new ProjectService();

