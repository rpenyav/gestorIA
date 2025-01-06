import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";
import { getAuthenticatedUser } from "../services/authService";

interface AuthContextType {
  userId: number | null;
  email: string | null; // Agregado para manejar el correo electrónico
  setUser: (id: number | null, email: string | null) => void; // Actualizado para aceptar dos parámetros
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [userId, setUserId] = useState<number | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getAuthenticatedUser();
        setUserId(user.id);
        setEmail(user.email);
      } catch {
        setUserId(null);
        setEmail(null);
      } finally {
        setLoading(false);
      }
    };

    const token = Cookies.get("auth_token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const setUser = (id: number | null, email: string | null) => {
    setUserId(id);
    setEmail(email);
    if (id === null) {
      Cookies.remove("auth_token"); // Limpia las cookies al cerrar sesión
    }
  };

  return (
    <AuthContext.Provider value={{ userId, email, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
