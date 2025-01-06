import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface LayoutProps {
  title: string;
  sidebarLinks: Array<{
    label: string;
    route?: string;
    dynamic?: boolean;
    baseRoute?: string;
    dynamicParam?: string;
    suffix?: string;
  }>;
  dynamicParams?: { [key: string]: string }; // Parámetros dinámicos para construir rutas
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({
  title,
  sidebarLinks,
  dynamicParams,
  children,
}) => {
  // Inicializar el estado desde localStorage directamente
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(() => {
    const storedState = localStorage.getItem("sidebarOpen");
    return storedState === "true"; // Predeterminado `false` si no existe en localStorage
  });

  const toggleSidebar = () => {
    const newState = !isSidebarOpen;
    setIsSidebarOpen(newState);
    localStorage.setItem("sidebarOpen", newState.toString()); // Guardar en localStorage
  };

  // Construir rutas dinámicas y garantizar que 'route' sea un string
  const processedLinks = sidebarLinks.map((link) => {
    let route = link.route || "";
    if (link.dynamic && link.baseRoute && link.dynamicParam && dynamicParams) {
      const dynamicValue = dynamicParams[link.dynamicParam];
      route = `${link.baseRoute}/${dynamicValue}/${link.suffix || ""}`;
    }
    return {
      label: link.label,
      route, // Garantizamos que siempre sea un string
    };
  });

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <Sidebar
        links={processedLinks}
        isOpen={isSidebarOpen}
        onToggle={toggleSidebar}
      />
      <Header title={title} toggleSidebar={toggleSidebar} />
      <main
        style={{
          paddingTop: "50px",
          paddingLeft: isSidebarOpen ? "250px" : "0",
          transition: "padding-left 0.3s ease",
        }}
      >
        <div className="container mt-2">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
