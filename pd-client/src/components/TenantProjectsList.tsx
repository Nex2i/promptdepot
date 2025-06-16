import { useNavigate } from "@tanstack/react-router";
import { useAppSelector } from "../store/hooks";
import { useProjects } from "../hooks/useProjects";
import type { Project } from "../lib/projectService";

export function TenantProjectsList() {
  const { user } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();

  // Use TanStack Query for project data
  const { data: projects = [], isLoading, error } = useProjects();

  const handleProjectClick = (project: Project) => {
    // Navigate to project view
    navigate({ to: `/projects/${project.id}` });
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
            {error instanceof Error ? error.message : "An error occurred"}
          </div>
        )}

        {/* Projects Grid */}
        {!isLoading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleProjectClick(project)}
                className="bg-white/5 rounded-lg p-6 cursor-pointer transition-all hover:bg-white/10 hover:-translate-y-1 hover:ring-2 hover:ring-primary"
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
                    {project.permissions?.length || 0} permission
                    {project.permissions?.length !== 1 ? "s" : ""}
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
      </div>
    </div>
  );
}
