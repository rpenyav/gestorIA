import React, {
  createContext,
  useContext,
  useState,
  useMemo,
  useEffect,
} from "react";
import {
  createMessage,
  getMessagesByConversationId,
} from "../services/messageService";

interface Message {
  id: number;
  prompt?: string; // Mensaje enviado por el usuario
  response?: string; // Respuesta generada por el bot
  sender: "user" | "bot";
  conversation: {
    id: number;
    title: string;
    description: string;
  };
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface MessageContextProps {
  messages: Message[];
  fetchMessages: (conversationId: number) => Promise<void>;
  sendMessage: (data: {
    prompt: string;
    projectId: number;
    userId: number;
    conversationId: number;
  }) => Promise<void>;
}

const MessageContext = createContext<MessageContextProps | undefined>(
  undefined
);

export const useMessageContext = (): MessageContextProps => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};
export const MessageProvider: React.FC<{
  conversationId: number;
  children: React.ReactNode;
}> = ({ conversationId, children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const fetchMessages = async (conversationId: number) => {
    try {
      const response = await getMessagesByConversationId(conversationId);
      setMessages(response);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (data: {
    prompt: string;
    projectId: number;
    userId: number;
  }) => {
    try {
      const response = await createMessage({ ...data, conversationId });
      setMessages((prev) => [
        ...prev,
        { ...response, sender: "user" }, // Mensaje del usuario
        { prompt: response.response, sender: "bot" }, // Respuesta del bot
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <MessageContext.Provider value={{ messages, fetchMessages, sendMessage }}>
      {children}
    </MessageContext.Provider>
  );
};
