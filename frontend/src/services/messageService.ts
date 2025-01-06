import api from "../api/api";

const API_BASE_URL = "/messages";

export const createMessage = async (data: {
  prompt: string;
  userId: number;
  projectId: number;
  conversationId: number;
}) => {
  const response = await api.post(`${API_BASE_URL}/create`, data);
  return response.data;
};

export const getMessagesByConversationId = async (conversationId: number) => {
  const response = await api.get(
    `${API_BASE_URL}/conversation/${conversationId}`
  );
  return response.data;
};

export const getMessageById = async (messageId: number) => {
  const response = await api.get(`${API_BASE_URL}/${messageId}`);
  return response.data;
};

export const updateMessage = async (
  messageId: number,
  data: { prompt: string; userId: number }
) => {
  const response = await api.put(`${API_BASE_URL}/${messageId}`, data);
  return response.data;
};

export const deleteMessage = async (messageId: number) => {
  const response = await api.delete(`${API_BASE_URL}/${messageId}`);
  return response.data;
};

export const createMessageWithStream = async (data: {
  prompt: string;
  userId: number;
  projectId: number;
  conversationId: number;
}): Promise<ReadableStream> => {
  const response = await api.post("/messages/create", data, {
    responseType: "stream",
  });

  if (!response.data) {
    throw new Error("No se pudo obtener el cuerpo de la respuesta");
  }

  return response.data;
};

export const streamResponse = async (data: {
  prompt: string;
  userId: number;
  projectId: number;
  conversationId: number;
}): Promise<ReadableStream> => {
  const queryParams = new URLSearchParams({
    prompt: data.prompt,
    userId: data.userId.toString(),
    projectId: data.projectId.toString(),
    conversationId: data.conversationId.toString(),
  });

  const response = await api.get(`/messages/stream?${queryParams}`, {
    responseType: "stream",
  });

  if (!response.data) {
    throw new Error("No se pudo obtener el cuerpo de la respuesta");
  }

  return response.data;
};
