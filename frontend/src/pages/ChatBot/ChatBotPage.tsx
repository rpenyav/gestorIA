import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useMessageContext } from "../../context/MessageContext";
import { useConversationContext } from "../../context/ConversationContext";
import { Button, Form, InputGroup, ListGroup } from "react-bootstrap";
import ConversationList from "./ConversationList";

const ChatBotPage: React.FC = () => {
  const { id: projectId, conversationId } = useParams<{
    id: string;
    conversationId: string;
  }>();
  const { userId } = useAuth();
  const { messages, fetchMessages, sendMessage } = useMessageContext();
  const { conversations } = useConversationContext();

  const [currentMessage, setCurrentMessage] = useState("");

  // Buscar la conversación actual
  const currentConversation = conversations.find(
    (conversation) => conversation.id === parseInt(conversationId!, 10)
  );

  // Cargar mensajes al cargar el componente
  useEffect(() => {
    if (conversationId) {
      fetchMessages(parseInt(conversationId, 10));
    }
  }, [conversationId]);

  // Manejar el envío de mensajes
  const handleSendMessage = async () => {
    if (!userId || !projectId || !conversationId || !currentMessage.trim()) {
      console.error("Faltan parámetros necesarios");
      return;
    }

    try {
      await sendMessage({
        prompt: currentMessage,
        userId,
        projectId: parseInt(projectId, 10),
        conversationId: 0,
      });
      setCurrentMessage(""); // Limpia el input después de enviar
    } catch (error) {
      console.error("Error enviando mensaje:", error);
    }
  };

  return (
    <div className="row">
      <div className="col-md-8">
        <div
          className="chat-container"
          style={{ maxWidth: "600px", margin: "auto" }}
        >
          <h2 className="text-center mb-4">
            {currentConversation?.title || "ChatBot"}
          </h2>
          <p className="text-center">
            {currentConversation?.description || "Detalles no disponibles"}
          </p>

          <ListGroup
            variant="flush"
            style={{ height: "400px", overflowY: "auto" }}
          >
            {messages.map((message, index) => (
              <ListGroup.Item
                key={index}
                className={
                  message.sender === "user" ? "text-end" : "text-start"
                }
                style={{
                  backgroundColor:
                    message.sender === "user" ? "#d1ecf1" : "#f8d7da",
                  borderRadius: "10px",
                  marginBottom: "10px",
                }}
              >
                {message.prompt || message.response}
              </ListGroup.Item>
            ))}
          </ListGroup>

          <InputGroup className="mb-3">
            <Form.Control
              placeholder="Escribe tu mensaje..."
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <Button variant="primary" onClick={handleSendMessage}>
              Enviar
            </Button>
          </InputGroup>
        </div>
      </div>
      <div className="col-md-4">
        <ConversationList />
      </div>
    </div>
  );
};

export default ChatBotPage;
