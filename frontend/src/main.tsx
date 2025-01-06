import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.scss";
import AppRoutes from "./routes/AppRoutes.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  </StrictMode>
);
