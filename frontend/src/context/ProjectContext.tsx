import React, { createContext, useContext, useState, useEffect } from "react";
import {
  Project,
  getProjectsByUserId,
  createProject,
} from "../services/projectService";

interface ProjectContextProps {
  projects: Project[];
  createNewProject: (project: Omit<Project, "id">) => Promise<void>;
  fetchProjects: (userId: number) => Promise<void>;
}

const ProjectContext = createContext<ProjectContextProps | undefined>(
  undefined
);

export const useProjectContext = (): ProjectContextProps => {
  const context = useContext(ProjectContext);
  if (!context) {
    throw new Error("useProjectContext must be used within a ProjectProvider");
  }
  return context;
};

export const ProjectProvider: React.FC<{
  userId: number;
  children: React.ReactNode;
}> = ({ userId, children }) => {
  const [projects, setProjects] = useState<Project[]>([]);

  const fetchProjects = async (userId: number) => {
    try {
      const result = await getProjectsByUserId(userId);
      setProjects(result);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const createNewProject = async (project: Omit<Project, "id">) => {
    try {
      const newProject = await createProject(project);
      setProjects((prev) => [...prev, newProject]);
    } catch (error) {
      console.error("Error creating project:", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProjects(userId);
    } else {
      console.error("No userId provided to ProjectProvider.");
    }
  }, [userId]);

  return (
    <ProjectContext.Provider
      value={{ projects, createNewProject, fetchProjects }}
    >
      {children}
    </ProjectContext.Provider>
  );
};
