// ConversationContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getConversationsByProjectId,
  createConversation,
  Conversation,
} from "../services/conversationService";

interface ConversationContextProps {
  conversations: Conversation[];
  fetchConversations: (projectId: number) => Promise<void>;
  createNewConversation: (
    conversation: Omit<Conversation, "id">
  ) => Promise<void>;
}

const ConversationContext = createContext<ConversationContextProps | undefined>(
  undefined
);

export const useConversationContext = (): ConversationContextProps => {
  const context = useContext(ConversationContext);
  if (!context) {
    throw new Error(
      "useConversationContext must be used within a ConversationProvider"
    );
  }
  return context;
};

export const ConversationProvider: React.FC<{
  projectId: number;
  children: React.ReactNode;
}> = ({ projectId, children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = async (projectId: number) => {
    const result = await getConversationsByProjectId(projectId);
    setConversations(result);
  };

  const createNewConversation = async (
    conversation: Omit<Conversation, "id">
  ) => {
    const newConversation = await createConversation(conversation);
    setConversations((prev) => [...prev, newConversation]);
  };

  useEffect(() => {
    fetchConversations(projectId);
  }, [projectId]);

  return (
    <ConversationContext.Provider
      value={{ conversations, fetchConversations, createNewConversation }}
    >
      {children}
    </ConversationContext.Provider>
  );
};
