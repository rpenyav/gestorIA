import React from "react";
import { Link, useParams } from "react-router-dom";
import { useConversationContext } from "../../context/ConversationContext";

interface ConversationListProps {
  projectId?: number;
}

const ConversationList: React.FC<ConversationListProps> = ({ projectId }) => {
  const { id } = useParams<{ id: string }>();
  const resolvedProjectId = projectId || parseInt(id!, 10); // Usar projectId si está disponible, de lo contrario tomarlo de la URL

  const { conversations } = useConversationContext();

  if (!resolvedProjectId || isNaN(resolvedProjectId)) {
    return <p>Error: ID de proyecto no válido.</p>;
  }

  return (
    <div>
      {conversations.length === 0 ? (
        <p>No hay conversaciones disponibles. Crea una nueva.</p>
      ) : (
        <ul>
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <Link
                to={`/project/${resolvedProjectId}/conversations/${conversation.id}/chatbot`}
                style={{
                  color: "blue",
                  textDecoration: "none",
                  fontWeight: "bold",
                }}
              >
                {conversation.title}
              </Link>{" "}
              - {conversation.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ConversationList;
