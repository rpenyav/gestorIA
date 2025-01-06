import React, { useState } from "react";
import { useConversationContext } from "../../context/ConversationContext";
import { useAuth } from "../../context/AuthContext";
import { useParams, Link } from "react-router-dom";
import ConversationList from "./ConversationList";

const ProjectConversationsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = parseInt(id!, 10);

  const { conversations, createNewConversation } = useConversationContext();
  const { userId } = useAuth();
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleCreateConversation = async () => {
    if (!userId) {
      console.error("El usuario no está definido");
      return;
    }

    if (!projectId || isNaN(projectId)) {
      console.error("El ID del proyecto no es válido");
      return;
    }

    try {
      await createNewConversation({
        userId,
        title: newTitle,
        description: newDescription,
        projectId, // Usamos el projectId correcto aquí
      });
      setNewTitle("");
      setNewDescription("");
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  return (
    <div className="row mt-5">
      <div className="col-md-8">
        <ConversationList />
      </div>
      <div className="col-md-4">
        <div>
          <h2>Crear Nueva Conversación</h2>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Título de la conversación"
            className="form-control mb-2"
          />
          <textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Descripción de la conversación"
            className="form-control mb-2"
          />
          <button
            className="btn btn-primary w-100"
            onClick={handleCreateConversation}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectConversationsPage;
