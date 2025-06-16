import React, { useState } from "react";
import { useParams, Link } from "@tanstack/react-router";
import {
  ChevronRightIcon,
  ChevronDownIcon,
  FolderIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import {
  useProjectDetails,
  useCreateDirectory,
  useCreatePrompt,
  usePromptDetails,
} from "../hooks/useProjects";
import { type DirectoryItem } from "../lib/projectService";
import { CreateDirectoryModal } from "./CreateDirectoryModal";
import { CreatePromptModal } from "./CreatePromptModal";

interface ProjectViewState {
  expandedDirectories: Set<string>;
  selectedItem: DirectoryItem | null;
  showCreateDirectoryModal: boolean;
  showCreatePromptModal: boolean;
}

export function ProjectView() {
  const params = useParams({ strict: false });
  const projectId = params.projectId as string;
  const [state, setState] = useState<ProjectViewState>({
    expandedDirectories: new Set(),
    selectedItem: null,
    showCreateDirectoryModal: false,
    showCreatePromptModal: false,
  });

  // Use TanStack Query to fetch project details
  const {
    data: project,
    isLoading,
    error,
    isError,
  } = useProjectDetails(projectId);

  // Create mutations
  const createDirectoryMutation = useCreateDirectory();
  const createPromptMutation = useCreatePrompt();

  // Fetch prompt details when a prompt is selected
  const { data: selectedPromptDetails, isLoading: isLoadingPromptDetails } =
    usePromptDetails(
      projectId,
      state.selectedItem?.type === "prompt" ? state.selectedItem.id : "",
      state.selectedItem?.type === "prompt"
    );

  // Auto-expand root directories when project data loads
  React.useEffect(() => {
    if (project?.directories) {
      const rootDirectories = project.directories
        .filter((dir) => dir.isRoot)
        .map((dir) => dir.id);

      setState((prev) => ({
        ...prev,
        expandedDirectories: new Set(rootDirectories),
      }));
    }
  }, [project]);

  const toggleDirectory = (directoryId: string) => {
    setState((prev) => {
      const newExpanded = new Set(prev.expandedDirectories);
      if (newExpanded.has(directoryId)) {
        newExpanded.delete(directoryId);
      } else {
        newExpanded.add(directoryId);
      }
      return { ...prev, expandedDirectories: newExpanded };
    });
  };

  const selectItem = (item: DirectoryItem) => {
    setState((prev) => ({ ...prev, selectedItem: item }));
  };

  const handleCreateDirectory = () => {
    setState((prev) => ({ ...prev, showCreateDirectoryModal: true }));
  };

  const handleCreatePrompt = () => {
    setState((prev) => ({ ...prev, showCreatePromptModal: true }));
  };

  const handleCloseCreateDirectoryModal = () => {
    setState((prev) => ({ ...prev, showCreateDirectoryModal: false }));
  };

  const handleCloseCreatePromptModal = () => {
    setState((prev) => ({ ...prev, showCreatePromptModal: false }));
  };

  // Determine default parent directory for new directories
  const getDefaultParentDirectoryId = (): string | undefined => {
    if (state.selectedItem?.type === "directory") {
      return state.selectedItem.id;
    }
    // If no directory is selected or a prompt is selected, return undefined (root level)
    return undefined;
  };

  // Determine default directory for new prompts
  const getDefaultDirectoryId = (): string | undefined => {
    if (state.selectedItem?.type === "directory") {
      return state.selectedItem.id;
    }
    // If a prompt is selected, we need to find its directory
    // For now, return the first available directory or undefined
    if (project?.directories && project.directories.length > 0) {
      // Find first root directory
      const rootDir = project.directories.find((dir) => dir.isRoot);
      return rootDir?.id;
    }
    return undefined;
  };

  const renderDirectoryTree = (
    items: DirectoryItem[],
    depth: number = 0
  ): React.JSX.Element[] => {
    return items.map((item) => (
      <div key={item.id} className="select-none">
        <div
          className={`flex items-center py-1 px-2 cursor-pointer hover:bg-white/5 rounded ${
            state.selectedItem?.id === item.id ? "bg-primary/20" : ""
          }`}
          style={{ paddingLeft: `${depth * 1 + 0.5}rem` }}
          onClick={() => {
            if (item.type === "directory") {
              toggleDirectory(item.id);
            }
            selectItem(item);
          }}
        >
          {item.type === "directory" && (
            <>
              {state.expandedDirectories.has(item.id) ? (
                <ChevronDownIcon className="h-4 w-4 mr-1 text-gray-400" />
              ) : (
                <ChevronRightIcon className="h-4 w-4 mr-1 text-gray-400" />
              )}
              <FolderIcon className="h-4 w-4 mr-2 text-blue-400" />
            </>
          )}
          {item.type === "prompt" && (
            <>
              <div className="w-4 mr-1" /> {/* Spacer for alignment */}
              <DocumentTextIcon className="h-4 w-4 mr-2 text-green-400" />
            </>
          )}
          <span className="text-sm truncate">{item.name}</span>
          {item.isRoot && (
            <span className="ml-2 text-xs bg-primary/20 text-primary px-1 rounded">
              root
            </span>
          )}
        </div>

        {/* Render children if directory is expanded */}
        {item.type === "directory" &&
          state.expandedDirectories.has(item.id) &&
          item.children &&
          item.children.length > 0 && (
            <div className="ml-2">
              {renderDirectoryTree(item.children, depth + 1)}
            </div>
          )}

        {/* Render prompts if directory is expanded */}
        {item.type === "directory" &&
          state.expandedDirectories.has(item.id) &&
          item.prompts &&
          item.prompts.length > 0 && (
            <div className="ml-2">
              {renderDirectoryTree(item.prompts, depth + 1)}
            </div>
          )}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <span className="ml-3 text-gray-400">Loading project...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-500/10 border border-red-500 text-red-300 px-6 py-4 rounded">
          <h2 className="font-semibold mb-2">Error loading project</h2>
          <p>{error instanceof Error ? error.message : "An error occurred"}</p>
          <div className="mt-4">
            <Link to="/projects" className="text-primary hover:underline">
              ← Back to Projects
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Project not found</h2>
          <Link to="/projects" className="text-primary hover:underline">
            ← Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-900">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-between mb-2">
            <Link
              to="/projects"
              className="text-primary hover:underline text-sm"
            >
              ← Back to Projects
            </Link>
          </div>
          <h1 className="text-xl font-bold truncate">{project.name}</h1>
          {project.description && (
            <p className="text-gray-400 text-sm mt-1 line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        {/* Directory Tree */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-semibold text-gray-300 mb-3 uppercase tracking-wide">
            Project Structure
          </h3>
          {project.directories.length > 0 ? (
            <div className="space-y-1">
              {renderDirectoryTree(project.directories)}
            </div>
          ) : (
            <div className="text-gray-500 text-sm italic">
              No directories found
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Content Header */}
        <div className="p-6 border-b border-gray-700 bg-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                {state.selectedItem
                  ? state.selectedItem.name
                  : "Select an item"}
              </h2>
              {state.selectedItem && (
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                  <span className="capitalize">{state.selectedItem.type}</span>
                  <span>•</span>
                  <span>
                    Created:{" "}
                    {new Date(
                      state.selectedItem.createdAt
                    ).toLocaleDateString()}
                  </span>
                  {state.selectedItem.updatedAt !==
                    state.selectedItem.createdAt && (
                    <>
                      <span>•</span>
                      <span>
                        Updated:{" "}
                        {new Date(
                          state.selectedItem.updatedAt
                        ).toLocaleDateString()}
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleCreateDirectory}
                className="bg-primary hover:bg-primary-light px-4 py-2 rounded-lg font-medium transition-colors"
              >
                New Directory
              </button>
              <button
                onClick={handleCreatePrompt}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-medium transition-colors"
              >
                New Prompt
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          {state.selectedItem ? (
            <div className="bg-white/5 rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">
                  {state.selectedItem.type === "directory"
                    ? "Directory Details"
                    : "Prompt Details"}
                </h3>
                {state.selectedItem.description && (
                  <p className="text-gray-300 mb-4">
                    {state.selectedItem.description}
                  </p>
                )}
              </div>

              {state.selectedItem.type === "directory" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-2">Subdirectories</h4>
                    <div className="space-y-1">
                      {state.selectedItem.children?.length ? (
                        state.selectedItem.children.map((child) => (
                          <div key={child.id} className="text-sm text-gray-400">
                            📁 {child.name}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          No subdirectories
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Prompts</h4>
                    <div className="space-y-1">
                      {state.selectedItem.prompts?.length ? (
                        state.selectedItem.prompts.map((prompt) => (
                          <div
                            key={prompt.id}
                            className="text-sm text-gray-400"
                          >
                            📄 {prompt.name}
                          </div>
                        ))
                      ) : (
                        <div className="text-sm text-gray-500 italic">
                          No prompts
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {state.selectedItem.type === "prompt" && (
                <div>
                  <h4 className="font-semibold mb-2">Prompt Content</h4>
                  {isLoadingPromptDetails ? (
                    <div className="bg-gray-800 rounded p-4">
                      <div className="animate-pulse">
                        <div className="h-4 bg-gray-600 rounded mb-2"></div>
                        <div className="h-4 bg-gray-600 rounded mb-2"></div>
                        <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                      </div>
                    </div>
                  ) : selectedPromptDetails ? (
                    <div className="bg-gray-800 rounded p-4">
                      <div className="mb-4">
                        <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                          {selectedPromptDetails.directoryName}
                        </span>
                      </div>
                      <pre className="text-gray-300 whitespace-pre-wrap font-mono text-sm">
                        {selectedPromptDetails.content}
                      </pre>
                    </div>
                  ) : (
                    <div className="bg-gray-800 rounded p-4">
                      <p className="text-gray-400 italic">
                        Failed to load prompt content
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <FolderIcon className="h-16 w-16 mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                Select a directory or prompt
              </h3>
              <p className="text-gray-400">
                Choose an item from the sidebar to view its details
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Directory Modal */}
      <CreateDirectoryModal
        isOpen={state.showCreateDirectoryModal}
        onClose={handleCloseCreateDirectoryModal}
        projectId={projectId}
        defaultParentId={getDefaultParentDirectoryId()}
        createMutation={createDirectoryMutation}
      />

      {/* Create Prompt Modal */}
      <CreatePromptModal
        isOpen={state.showCreatePromptModal}
        onClose={handleCloseCreatePromptModal}
        projectId={projectId}
        defaultDirectoryId={getDefaultDirectoryId()}
        createMutation={createPromptMutation}
      />
    </div>
  );
}
