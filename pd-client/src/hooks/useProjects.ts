import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  projectService,
  type Project,
  type CreateProjectData,
} from "../lib/projectService";

// Query keys for consistent cache management
export const projectKeys = {
  all: ["projects"] as const,
  lists: () => [...projectKeys.all, "list"] as const,
  detail: (id: string) => [...projectKeys.all, "detail", id] as const,
  detailWithStructure: (id: string) =>
    [...projectKeys.all, "detail-structure", id] as const,
  directories: (id: string) => [...projectKeys.all, "directories", id] as const,
} as const;

/**
 * Hook to fetch all projects for the current user
 */
export function useProjects() {
  return useQuery({
    queryKey: projectKeys.lists(),
    queryFn: () => projectService.getUserProjects(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch a specific project by ID
 */
export function useProject(projectId: string, enabled = true) {
  return useQuery({
    queryKey: projectKeys.detail(projectId),
    queryFn: () => projectService.getProjectById(projectId),
    enabled: enabled && !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch detailed project structure with directories and prompts
 */
export function useProjectDetails(projectId: string, enabled = true) {
  return useQuery({
    queryKey: projectKeys.detailWithStructure(projectId),
    queryFn: () => projectService.getProjectDetails(projectId),
    enabled: enabled && !!projectId,
    staleTime: 2 * 60 * 1000, // 2 minutes (shorter for structure data)
  });
}

/**
 * Hook to create a new project
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (projectData: CreateProjectData) =>
      projectService.createProject(projectData),
    onSuccess: (newProject) => {
      // Invalidate and refetch projects list
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });

      // Optionally add the new project to the cache
      queryClient.setQueryData<Project[]>(projectKeys.lists(), (oldData) => {
        if (oldData) {
          return [...oldData, newProject];
        }
        return [newProject];
      });
    },
  });
}

/**
 * Hook to prefetch a project (useful for hover states)
 */
export function usePrefetchProject() {
  const queryClient = useQueryClient();

  return (projectId: string) => {
    queryClient.prefetchQuery({
      queryKey: projectKeys.detail(projectId),
      queryFn: () => projectService.getProjectById(projectId),
      staleTime: 5 * 60 * 1000,
    });
  };
}

/**
 * Hook to create a new directory
 */
export function useCreateDirectory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      projectService.createDirectory(projectId, data),
    onSuccess: (newDirectory, { projectId }) => {
      // Invalidate project details to refresh the structure
      queryClient.invalidateQueries({
        queryKey: projectKeys.detailWithStructure(projectId),
      });
      queryClient.invalidateQueries({
        queryKey: projectKeys.directories(projectId),
      });
    },
  });
}

/**
 * Hook to create a new prompt
 */
export function useCreatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, data }: { projectId: string; data: any }) =>
      projectService.createPrompt(projectId, data),
    onSuccess: (newPrompt, { projectId }) => {
      // Invalidate project details to refresh the structure
      queryClient.invalidateQueries({
        queryKey: projectKeys.detailWithStructure(projectId),
      });
    },
  });
}

/**
 * Hook to fetch project directories (for dropdowns)
 */
export function useProjectDirectories(projectId: string, enabled = true) {
  return useQuery({
    queryKey: projectKeys.directories(projectId),
    queryFn: () => projectService.getProjectDirectories(projectId),
    enabled: enabled && !!projectId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch prompt details with content
 */
export function usePromptDetails(
  projectId: string,
  promptId: string,
  enabled = true
) {
  return useQuery({
    queryKey: [
      ...projectKeys.detailWithStructure(projectId),
      "prompt",
      promptId,
    ],
    queryFn: () => projectService.getPromptDetails(projectId, promptId),
    enabled: enabled && !!projectId && !!promptId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
