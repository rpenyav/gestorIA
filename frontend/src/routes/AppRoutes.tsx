import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import Login from "../pages/Login";
import Home from "../pages/Home";
import Layout from "../layout/Layout";
import { sidebarLinks } from "../constants/sideBarLinks";
import ProjectSelectorPage from "../pages/ChatBot/ProjectSelectorPage";
import { ProjectProvider } from "../context/ProjectContext";
import { useAuth } from "../context/AuthContext";
import ConversationRoute from "./ConversationRoute";
import MessageRoute from "./MessageRoute";
import NotFound from "../pages/NotFound";

const AppRoutes: React.FC = () => {
  const { userId, loading } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        {/* Rutas privadas */}
        {loading ? (
          <Route path="*" element={<div>Cargando...</div>} />
        ) : (
          <>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Layout title="Home Page" sidebarLinks={sidebarLinks}>
                    <Home />
                  </Layout>
                </PrivateRoute>
              }
            />
            <Route
              path="/projects"
              element={
                <PrivateRoute>
                  <ProjectProvider userId={userId!}>
                    <Layout title="Projects" sidebarLinks={sidebarLinks}>
                      <ProjectSelectorPage />
                    </Layout>
                  </ProjectProvider>
                </PrivateRoute>
              }
            />
            <Route
              path="/project/:id/conversations"
              element={
                <PrivateRoute>
                  <ConversationRoute />
                </PrivateRoute>
              }
            />
            <Route
              path="/project/:id/conversations/:conversationId/chatbot"
              element={
                <PrivateRoute>
                  <MessageRoute />
                </PrivateRoute>
              }
            />
            <Route path="/not-found" element={<NotFound />} />
            <Route path="*" element={<Navigate to="/not-found" replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
