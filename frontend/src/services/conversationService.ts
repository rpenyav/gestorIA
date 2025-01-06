// ConversationService.ts

import api from "../api/api";

export interface Conversation {
  id: number;
  projectId: number;
  userId: number;
  title: string;
  description: string;
}

export const getConversationsByProjectId = async (
  projectId: number
): Promise<Conversation[]> => {
  const response = await api.get(`/conversations/project/${projectId}`);
  return response.data;
};

export const createConversation = async (
  conversation: Omit<Conversation, "id">
): Promise<Conversation> => {
  const response = await api.post(`/conversations`, conversation);
  return response.data;
};
