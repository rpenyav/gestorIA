import api from "../api/api";

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const response = await api.post("/users/login", { email, password });
  return response.data.access_token;
};

export const getAuthenticatedUser = async (): Promise<{
  id: number;
  email: string;
}> => {
  const response = await api.get("/users/me");
  return response.data;
};
