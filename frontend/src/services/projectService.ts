import api from "../api/api";

export interface Project {
  id: number;
  userId: number;
  name: string;
  description: string;
}

export const getProjectsByUserId = async (
  userId: number
): Promise<Project[]> => {
  const response = await api.get(`/projects/${userId}`);
  return response.data;
};

export const createProject = async (
  project: Omit<Project, "id">
): Promise<Project> => {
  const response = await api.post("/projects", project);
  return response.data;
};
