import { authService } from "./authService";

export interface Project {
  id: string;
  name: string;
  description?: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  permissions: string[];
  users: {
    userId: string;
    permissions: string[];
  }[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  tenantId: string;
}

export interface ProjectsResponse {
  message: string;
  projects: Project[];
}

export interface ProjectResponse {
  message: string;
  project: Project;
}

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export class ProjectService {
  /**
   * Get all projects the user has read access to
   */
  static async getUserProjects(): Promise<Project[]> {
    try {
      const token = await authService.getSessionToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch projects");
      }

      const data: ProjectsResponse = await response.json();
      return data.projects;
    } catch (error: any) {
      console.error("Error fetching projects:", error);
      throw error;
    }
  }

  /**
   * Create a new project
   */
  static async createProject(projectData: CreateProjectData): Promise<Project> {
    try {
      const token = await authService.getSessionToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create project");
      }

      const data: ProjectResponse = await response.json();
      return data.project;
    } catch (error: any) {
      console.error("Error creating project:", error);
      throw error;
    }
  }

  /**
   * Get a specific project by ID
   */
  static async getProjectById(projectId: string): Promise<Project> {
    try {
      const token = await authService.getSessionToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/projects/${projectId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch project");
      }

      const data: ProjectResponse = await response.json();
      return data.project;
    } catch (error: any) {
      console.error("Error fetching project:", error);
      throw error;
    }
  }
}

export const projectService = ProjectService;
