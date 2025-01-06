// src/components/Header.tsx
import React from "react";
import { Button } from "react-bootstrap";

interface HeaderProps {
  title: string;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, toggleSidebar }) => {
  return (
    <header
      className="header-style"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999, // Para asegurar que esté encima del sidebar
      }}
    >
      <div className="container-fluid">
        <div className="row">
          <div className="col-6">
            <h1>{title}</h1>
          </div>
          <div className="col-6 d-flex justify-content-end">
            <Button variant="light" onClick={toggleSidebar}>
              Open Sidebar
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
