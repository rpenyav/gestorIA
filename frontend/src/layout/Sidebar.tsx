import React from "react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
  links: Array<{
    label: string; // Texto que aparecerá en el enlace
    route?: string; // Ruta de navegación
    dynamic?: boolean; // Indica si es una ruta dinámica
    baseRoute?: string; // Ruta base para enlaces dinámicos
  }>;
  isOpen: boolean; // Indica si el sidebar está abierto o cerrado
  onToggle: () => void; // Función para alternar el estado del sidebar
}

const Sidebar: React.FC<SidebarProps> = ({ links, isOpen, onToggle }) => {
  const location = useLocation(); // Hook para obtener la URL actual

  return (
    <aside
      style={{
        position: "fixed",
        top: "50px",
        left: 0,
        height: "calc(100% - 50px)",
        width: "250px",
        backgroundColor: "#343a40",
        transform: isOpen ? "translateX(0)" : "translateX(-100%)",
        transition: "transform 0.3s ease",
        zIndex: 1000,
      }}
    >
      <div style={{ padding: "20px", color: "white" }}>
        <button onClick={onToggle} className="btn btn-light mb-4">
          {isOpen ? "Close" : "Open"}
        </button>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {links.map((link, index) => {
            const isActive = link.dynamic
              ? location.pathname.startsWith(link.baseRoute || "")
              : location.pathname === link.route;

            return (
              <li key={index} style={{ margin: "10px 0" }}>
                <Link
                  to={link.route || "#"}
                  style={{
                    color: isActive ? "yellow" : "white", // Color diferente para el enlace activo
                    textDecoration: "none",
                    fontWeight: isActive ? "bold" : "normal", // Negrita para el enlace activo
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
