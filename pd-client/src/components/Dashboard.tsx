import { useState } from "react";
import { useAppSelector } from "../store/hooks";
import { useProjects, useCreateProject } from "../hooks/useProjects";
import { CreateProjectModal } from "./CreateProjectModal";
import { ViewWrapper } from "./ViewWrapper";

export function Dashboard() {
  const { user, currentTenant } = useAppSelector((state) => state.auth);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Use TanStack Query for project data
  const { data: projects = [], isLoading, error, refetch } = useProjects();

  const createProjectMutation = useCreateProject();

  const handleProjectClick = (project: any) => {
    setSelectedProject(project);
  };

  const handleCreateProject = () => {
    setShowCreateProjectModal(true);
  };

  const handleCloseCreateProjectModal = () => {
    setShowCreateProjectModal(false);
  };

  const handleRetryFetch = () => {
    refetch();
  };

  return (
    <ViewWrapper onCreateProject={handleCreateProject}>
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-gray-400">
          Get started by creating your first project in {currentTenant?.name}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-gray-400">Loading projects...</span>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4 text-red-400">
              Error Loading Projects
            </h2>
            <p className="text-gray-400 mb-8">
              {error instanceof Error ? error.message : "An error occurred"}
            </p>
            <button
              onClick={handleRetryFetch}
              className="bg-primary hover:bg-primary-light px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {!isLoading && !error && projects.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project)}
              className={`bg-white/5 rounded-lg p-6 cursor-pointer transition-all hover:bg-white/10 hover:-translate-y-1 ${
                selectedProject?.id === project.id ? "ring-2 ring-primary" : ""
              }`}
            >
              <h3 className="text-xl font-semibold mb-3">{project.name}</h3>
              <p className="text-gray-400 mb-4 line-clamp-2">
                {project.description || "No description provided"}
              </p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  Created: {new Date(project.createdAt).toLocaleDateString()}
                </span>
                <span className="text-primary">
                  {project.permissions.length} permission
                  {project.permissions.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Projects State */}
      {!isLoading && !error && projects.length === 0 && (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-6 bg-gray-800 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-4">No projects yet</h2>
            <p className="text-gray-400 mb-8">
              Projects help you organize and manage your prompts. Create your
              first project to get started.
            </p>
            <button
              onClick={handleCreateProject}
              className="bg-primary hover:bg-primary-light px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Create Your First Project
            </button>
          </div>
        </div>
      )}

      {/* Selected Project Info */}
      {selectedProject && !isLoading && (
        <div className="mt-8 bg-white/5 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Selected Project</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Project Details</h3>
              <p className="mb-1">
                <strong>Name:</strong> {selectedProject.name}
              </p>
              <p className="mb-1">
                <strong>Description:</strong>{" "}
                {selectedProject.description || "No description"}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Metadata</h3>
              <p className="mb-1">
                <strong>Created:</strong>{" "}
                {new Date(selectedProject.createdAt).toLocaleString()}
              </p>
              <p className="mb-1">
                <strong>Updated:</strong>{" "}
                {new Date(selectedProject.updatedAt).toLocaleString()}
              </p>
              <p>
                <strong>Permissions:</strong>{" "}
                {selectedProject.permissions.join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Create Project Modal */}
      <CreateProjectModal
        isOpen={showCreateProjectModal}
        onClose={handleCloseCreateProjectModal}
        createMutation={createProjectMutation}
      />
    </ViewWrapper>
  );
}
