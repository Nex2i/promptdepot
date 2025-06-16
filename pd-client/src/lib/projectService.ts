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

export interface DirectoryItem {
  id: string;
  name: string;
  description?: string;
  type: "directory" | "prompt";
  isRoot?: boolean;
  children?: DirectoryItem[];
  prompts?: DirectoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectDetails extends Omit<Project, "users"> {
  directories: DirectoryItem[];
}

export interface CreateProjectData {
  name: string;
  description?: string;
  tenantId: string;
}

export interface CreateDirectoryData {
  name: string;
  description?: string;
  parentId?: string;
}

export interface CreatePromptData {
  name: string;
  description?: string;
  directoryId: string;
}

export interface DirectoryOption {
  id: string;
  name: string;
  description?: string;
  isRoot: boolean;
  parentId?: string;
}

export interface PromptDetails extends DirectoryItem {
  directoryId: string;
  directoryName: string;
}

export interface ProjectsResponse {
  message: string;
  projects: Project[];
}

export interface ProjectResponse {
  message: string;
  project: Project;
}

export interface ProjectDetailsResponse {
  message: string;
  project: ProjectDetails;
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
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw error instanceof Error ? error : new Error(String(error));
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
    } catch (error) {
      console.error("Error creating project:", error);
      throw error instanceof Error ? error : new Error(String(error));
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
    } catch (error) {
      console.error("Error fetching project:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * Get detailed project structure with directories and prompts
   */
  static async getProjectDetails(projectId: string): Promise<ProjectDetails> {
    try {
      const token = await authService.getSessionToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/projects/${projectId}/details`,
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
        throw new Error(errorData.message || "Failed to fetch project details");
      }

      const data: ProjectDetailsResponse = await response.json();
      return data.project;
    } catch (error) {
      console.error("Error fetching project details:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * Create a new directory in a project
   */
  static async createDirectory(
    projectId: string,
    data: CreateDirectoryData
  ): Promise<DirectoryItem> {
    try {
      const token = await authService.getSessionToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/projects/${projectId}/directories`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create directory");
      }

      const responseData: { message: string; directory: DirectoryItem } =
        await response.json();
      return responseData.directory;
    } catch (error) {
      console.error("Error creating directory:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * Create a new prompt in a project
   */
  static async createPrompt(
    projectId: string,
    data: CreatePromptData
  ): Promise<DirectoryItem> {
    try {
      const token = await authService.getSessionToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/projects/${projectId}/prompts`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create prompt");
      }

      const responseData: { message: string; prompt: DirectoryItem } =
        await response.json();
      return responseData.prompt;
    } catch (error) {
      console.error("Error creating prompt:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * Get project directories
   */
  static async getProjectDirectories(
    projectId: string
  ): Promise<DirectoryOption[]> {
    try {
      const token = await authService.getSessionToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/projects/${projectId}/directories`,
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
        throw new Error(
          errorData.message || "Failed to fetch project directories"
        );
      }

      const responseData: { message: string; directories: DirectoryOption[] } =
        await response.json();
      return responseData.directories;
    } catch (error) {
      console.error("Error fetching project directories:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }

  /**
   * Get prompt details
   */
  static async getPromptDetails(
    projectId: string,
    promptId: string
  ): Promise<PromptDetails> {
    try {
      const token = await authService.getSessionToken();
      if (!token) {
        throw new Error("No authentication token available");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/projects/${projectId}/prompts/${promptId}`,
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
        throw new Error(errorData.message || "Failed to fetch prompt details");
      }

      const responseData: { message: string; prompt: PromptDetails } =
        await response.json();
      return responseData.prompt;
    } catch (error) {
      console.error("Error fetching prompt details:", error);
      throw error instanceof Error ? error : new Error(String(error));
    }
  }
}

export const projectService = ProjectService;
