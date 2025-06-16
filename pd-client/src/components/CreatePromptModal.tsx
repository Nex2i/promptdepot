import { useState, useEffect } from "react";
import { useProjectDirectories } from "../hooks/useProjects";
import {
  type CreatePromptData,
  type DirectoryOption,
} from "../lib/projectService";
import { type UseMutationResult } from "@tanstack/react-query";
import { type DirectoryItem } from "../lib/projectService";

interface CreatePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  defaultDirectoryId?: string;
  createMutation: UseMutationResult<
    DirectoryItem,
    Error,
    { projectId: string; data: CreatePromptData },
    unknown
  >;
}

export function CreatePromptModal({
  isOpen,
  onClose,
  projectId,
  defaultDirectoryId,
  createMutation,
}: CreatePromptModalProps) {
  const { data: directories = [] } = useProjectDirectories(projectId, isOpen);

  const [formData, setFormData] = useState<CreatePromptData>({
    name: "",
    description: "",
    directoryId: defaultDirectoryId || "",
  });

  const [validationErrors, setValidationErrors] = useState({
    name: "",
    directoryId: "",
  });

  // Update form when defaultDirectoryId changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        description: "",
        directoryId: defaultDirectoryId || "",
      });
      setValidationErrors({ name: "", directoryId: "" });
      createMutation.reset();
    }
  }, [isOpen, defaultDirectoryId]);

  // Close modal on successful creation
  useEffect(() => {
    if (createMutation.isSuccess) {
      onClose();
    }
  }, [createMutation.isSuccess, onClose]);

  const handleInputChange = (field: keyof CreatePromptData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (field === "name" && validationErrors.name) {
      setValidationErrors((prev) => ({ ...prev, name: "" }));
    } else if (field === "directoryId" && validationErrors.directoryId) {
      setValidationErrors((prev) => ({ ...prev, directoryId: "" }));
    }
  };

  const validateForm = () => {
    const errors = { name: "", directoryId: "" };

    if (!formData.name.trim()) {
      errors.name = "Prompt name is required";
    } else if (formData.name.trim().length < 1) {
      errors.name = "Prompt name must not be empty";
    }

    if (!formData.directoryId) {
      errors.directoryId = "Please select a directory for the prompt";
    }

    setValidationErrors(errors);
    return !errors.name && !errors.directoryId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const promptData: CreatePromptData = {
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
      directoryId: formData.directoryId,
    };

    createMutation.mutate({ projectId, data: promptData });
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      onClose();
    }
  };

  const getDirectoryDisplayName = (directory: DirectoryOption): string => {
    if (directory.isRoot) {
      return `${directory.name} (root)`;
    }
    return directory.name;
  };

  const buildDirectoryPath = (directory: DirectoryOption): string => {
    // For simplicity, just show the directory name
    // In a more complex implementation, you could build the full path
    return getDirectoryDisplayName(directory);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Create New Prompt</h2>
          <button
            onClick={handleClose}
            disabled={createMutation.isPending}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex flex-col overflow-hidden"
        >
          <div className="p-6 overflow-y-auto flex-1">
            {/* Prompt Name and Directory Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* Prompt Name */}
              <div>
                <label
                  htmlFor="promptName"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Prompt Name *
                </label>
                <input
                  id="promptName"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    validationErrors.name
                      ? "border-red-500"
                      : "border-gray-600 focus:border-primary"
                  }`}
                  placeholder="Enter prompt name"
                  disabled={createMutation.isPending}
                />
                {validationErrors.name && (
                  <p className="mt-1 text-sm text-red-400">
                    {validationErrors.name}
                  </p>
                )}
              </div>

              {/* Directory Selection */}
              <div>
                <label
                  htmlFor="promptDirectory"
                  className="block text-sm font-medium text-gray-300 mb-2"
                >
                  Directory *
                </label>
                <select
                  id="promptDirectory"
                  value={formData.directoryId}
                  onChange={(e) =>
                    handleInputChange("directoryId", e.target.value)
                  }
                  className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                    validationErrors.directoryId
                      ? "border-red-500"
                      : "border-gray-600 focus:border-primary"
                  }`}
                  disabled={createMutation.isPending}
                >
                  <option value="">Select a directory</option>
                  {directories.map((directory) => (
                    <option key={directory.id} value={directory.id}>
                      {buildDirectoryPath(directory)}
                    </option>
                  ))}
                </select>
                {validationErrors.directoryId && (
                  <p className="mt-1 text-sm text-red-400">
                    {validationErrors.directoryId}
                  </p>
                )}
              </div>
            </div>

            {/* Prompt Description */}
            <div className="mb-4">
              <label
                htmlFor="promptDescription"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Description (Optional)
              </label>
              <textarea
                id="promptDescription"
                value={formData.description || ""}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={2}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Enter prompt description"
                disabled={createMutation.isPending}
              />
            </div>
          </div>

          {/* Error Message */}
          {createMutation.error && (
            <div className="mx-6 mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-sm text-red-400">
                {createMutation.error.message || "Failed to create prompt"}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-700 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={createMutation.isPending}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {createMutation.isPending && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>
                {createMutation.isPending ? "Creating..." : "Create Prompt"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
