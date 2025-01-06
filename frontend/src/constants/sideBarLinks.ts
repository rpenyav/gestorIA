export const sidebarLinks = [
  { label: "Home", route: "/" },
  { label: "Projects", route: "/projects" }, // Enlace directo a Projects
  { label: "Chat Bot", route: "/chatbot" },
  { label: "Dashboard", route: "/dashboard" },
  { label: "Settings", route: "/settings" },
  { label: "Profile", route: "/profile" },
  {
    label: "Conversations",
    dynamic: true, // Ruta dinámica
    baseRoute: "/project",
    dynamicParam: "id", // Parámetro dinámico
    suffix: "conversations", // Sufijo de la ruta
  },
];
