import { useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  fetchProjectsStart,
  fetchProjectsSuccess,
  fetchProjectsFailure,
  selectProject,
} from "../store/slices/dashboardSlice";

export function TenantProjectsList() {
  const dispatch = useAppDispatch();
  const { projects, isLoading, error, selectedProject } = useAppSelector(
    (state) => state.dashboard
  );
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Fetch projects on component mount
    const fetchProjects = async () => {
      dispatch(fetchProjectsStart());

      try {
        // TODO: Replace with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Mock projects data
        const mockProjects = [
          {
            id: "1",
            name: "AI Assistant Prompts",
            description: "Collection of prompts for AI assistant interactions",
            tenantId: "tenant-1",
            createdAt: "2024-01-15T10:00:00Z",
            updatedAt: "2024-01-20T15:30:00Z",
          },
          {
            id: "2",
            name: "Code Review Prompts",
            description: "Prompts for automated code review assistance",
            tenantId: "tenant-1",
            createdAt: "2024-01-10T09:00:00Z",
            updatedAt: "2024-01-18T14:20:00Z",
          },
          {
            id: "3",
            name: "Content Generation",
            description: "Marketing and content creation prompt templates",
            tenantId: "tenant-1",
            createdAt: "2024-01-05T11:30:00Z",
            updatedAt: "2024-01-15T16:45:00Z",
          },
        ];

        dispatch(fetchProjectsSuccess(mockProjects));
      } catch (err) {
        dispatch(fetchProjectsFailure("Failed to fetch projects"));
      }
    };

    fetchProjects();
  }, [dispatch]);

  const handleProjectClick = (project: any) => {
    dispatch(selectProject(project));
  };

  return (
    <div className="min-h-screen px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Projects</h1>
              <p className="text-gray-400 mt-2">Manage your prompt projects</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-400">
                Welcome, {user?.name}
              </span>
              <button className="bg-primary hover:bg-primary-light px-4 py-2 rounded-lg font-medium transition-colors">
                New Project
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-gray-400">Loading projects...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-300 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className={`bg-white/5 rounded-lg p-6 cursor-pointer transition-all hover:bg-white/10 hover:-translate-y-1 ${
                  selectedProject?.id === project.id
                    ? "ring-2 ring-primary"
                    : ""
                }`}
              >
                <h3 className="text-xl font-semibold mb-3">{project.name}</h3>
                <p className="text-gray-400 mb-4 line-clamp-2">
                  {project.description}
                </p>
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>
                    Created: {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <span>
                    Updated: {new Date(project.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && projects.length === 0 && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">No projects yet</h2>
            <p className="text-gray-400 mb-6">
              Create your first project to get started
            </p>
            <button className="bg-primary hover:bg-primary-light px-6 py-3 rounded-lg font-medium transition-colors">
              Create Project
            </button>
          </div>
        )}

        {/* Selected Project Info */}
        {selectedProject && (
          <div className="mt-8 bg-white/5 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Selected Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Project Details</h3>
                <p>
                  <strong>Name:</strong> {selectedProject.name}
                </p>
                <p>
                  <strong>Description:</strong> {selectedProject.description}
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Metadata</h3>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(selectedProject.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Updated:</strong>{" "}
                  {new Date(selectedProject.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
