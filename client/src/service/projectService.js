import api from '@/mock/api.js';

const project = {
  list: '/api/projects',
  get: (id) => `/api/projects/${id}`,
  create: '/api/projects',
  delete: (id) => `/api/projects/${id}`,
  chat: (id) => `/api/projects/${id}/chat`,
  updateFiles: (id) => `/api/projects/${id}/files`,
  publish: (id) => `/api/projects/${id}/publish`,
};

class ProjectService {
  // get list of projects
  async list() {
    const res = await api.get(project.list);
    return res.data;
  }

  // getting perticular project
  async getById(id) {
    const res = await api.get(project.get(id));
    return res.data;
  }

  //generate project
  async generate(prompt) {
    const res = await api.post(project.create, { prompt });
    return res.data;
  }

  async remove(id) {
    await api.delete(project.delete(id));
  }

  async projectChat(activeProjectId, prompt) {
    const res = await api.post(project.chat(activeProjectId), { prompt });
    return res.data;
  }

  async updateProjectFiles(files, id) {
    await api.put(project.updateFiles(id), { files });
  }

  async publishProject(id) {
    await api.post(project.publish(id));
  }
}

export default new ProjectService();
