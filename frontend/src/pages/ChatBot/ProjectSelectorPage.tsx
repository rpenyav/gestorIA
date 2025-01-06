import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProjectContext } from "../../context/ProjectContext";
import { useAuth } from "../../context/AuthContext";

const ProjectSelectorPage: React.FC = () => {
  const { userId } = useAuth();
  const { projects, createNewProject } = useProjectContext();
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDescription, setNewProjectDescription] = useState("");
  const navigate = useNavigate();

  if (!userId) {
    return <p>Error: No se pudo cargar la información del usuario.</p>;
  }

  const handleCreateProject = async () => {
    try {
      await createNewProject({
        userId,
        name: newProjectName,
        description: newProjectDescription,
      });
      setNewProjectName("");
      setNewProjectDescription("");
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  const handleSelectProject = (projectId: number) => {
    navigate(`/project/${projectId}/conversations`);
  };

  return (
    <div className="row mt-5">
      <div className="col-md-8">
        {projects.length === 0 ? (
          <p>No hay proyectos disponibles. Crea uno nuevo.</p>
        ) : (
          <ul>
            {projects.map((project) => (
              <li key={project.id}>
                {project.name}
                <button
                  className="btn btn-link"
                  onClick={() => handleSelectProject(project.id)}
                >
                  Seleccionar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="col-md-4">
        <div>
          <h2>Crear Nuevo Proyecto</h2>
          <input
            type="text"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Nombre del proyecto"
            className="form-control mb-2"
          />
          <textarea
            value={newProjectDescription}
            onChange={(e) => setNewProjectDescription(e.target.value)}
            placeholder="Descripción del proyecto"
            className="form-control mb-2"
          />
          <button
            className="btn btn-primary w-100"
            onClick={handleCreateProject}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectSelectorPage;
