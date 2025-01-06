import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { ConversationProvider } from "../context/ConversationContext";
import { MessageProvider } from "../context/MessageContext";
import Layout from "../layout/Layout";
import ChatBotPage from "../pages/ChatBot/ChatBotPage";
import { sidebarLinks } from "../constants/sideBarLinks";

const MessageRoute: React.FC = () => {
  const { id: projectId, conversationId } = useParams<{
    id: string;
    conversationId: string;
  }>();

  // Validación: Verifica si los parámetros son estrictamente numéricos
  const isValidNumber = (value: string | undefined): boolean =>
    value !== undefined && /^[0-9]+$/.test(value);

  if (!isValidNumber(projectId) || !isValidNumber(conversationId)) {
    return <Navigate to="/not-found" replace />;
  }

  const parsedProjectId = parseInt(projectId!, 10);
  const parsedConversationId = parseInt(conversationId!, 10);

  return (
    <ConversationProvider projectId={parsedProjectId}>
      <MessageProvider conversationId={parsedConversationId}>
        <Layout title="ChatBot" sidebarLinks={sidebarLinks}>
          <ChatBotPage />
        </Layout>
      </MessageProvider>
    </ConversationProvider>
  );
};

export default MessageRoute;
