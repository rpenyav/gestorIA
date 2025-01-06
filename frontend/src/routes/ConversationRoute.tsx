import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { ConversationProvider } from "../context/ConversationContext";
import Layout from "../layout/Layout";
import ProjectConversationsPage from "../pages/ChatBot/ProjectConversationsPage";
import { sidebarLinks } from "../constants/sideBarLinks";

const ConversationRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>(); // Obtén el parámetro `id`
  const projectId = parseInt(id!, 10);

  if (isNaN(projectId)) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <ConversationProvider projectId={projectId}>
      <Layout title="Conversations" sidebarLinks={sidebarLinks}>
        <ProjectConversationsPage />
      </Layout>
    </ConversationProvider>
  );
};

export default ConversationRoute;
