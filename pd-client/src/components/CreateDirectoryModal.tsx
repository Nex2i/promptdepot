import { useState, useEffect } from "react";
import { useProjectDirectories } from "../hooks/useProjects";
import {
  type CreateDirectoryData,
  type DirectoryOption,
} from "../lib/projectService";
import { type UseMutationResult } from "@tanstack/react-query";
import { type DirectoryItem } from "../lib/projectService";

interface CreateDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  defaultParentId?: string;
  createMutation: UseMutationResult<
    DirectoryItem,
    Error,
    { projectId: string; data: CreateDirectoryData },
    unknown
  >;
}

export function CreateDirectoryModal({
  isOpen,
  onClose,
  projectId,
  defaultParentId,
  createMutation,
}: CreateDirectoryModalProps) {
  const { data: directories = [] } = useProjectDirectories(projectId, isOpen);

  const [formData, setFormData] = useState<CreateDirectoryData>({
    name: "",
    description: "",
    parentId: defaultParentId,
  });

  const [validationErrors, setValidationErrors] = useState({
    name: "",
  });

  // Update form when defaultParentId changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: "",
        description: "",
        parentId: defaultParentId,
      });
      setValidationErrors({ name: "" });
      createMutation.reset();
    }
  }, [isOpen, defaultParentId]);

  // Close modal on successful creation
  useEffect(() => {
    if (createMutation.isSuccess) {
      onClose();
    }
  }, [createMutation.isSuccess, onClose]);

  const handleInputChange = (
    field: keyof CreateDirectoryData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors.name && field === "name") {
      setValidationErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const validateForm = () => {
    const errors = { name: "" };

    if (!formData.name.trim()) {
      errors.name = "Directory name is required";
    } else if (formData.name.trim().length < 1) {
      errors.name = "Directory name must not be empty";
    }

    setValidationErrors(errors);
    return !errors.name;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const directoryData: CreateDirectoryData = {
      name: formData.name.trim(),
      description: formData.description?.trim() || undefined,
      parentId: formData.parentId || undefined,
    };

    createMutation.mutate({ projectId, data: directoryData });
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
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Create New Directory</h2>
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
        <form onSubmit={handleSubmit} className="p-6">
          {/* Directory Name */}
          <div className="mb-4">
            <label
              htmlFor="directoryName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Directory Name *
            </label>
            <input
              id="directoryName"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                validationErrors.name
                  ? "border-red-500"
                  : "border-gray-600 focus:border-primary"
              }`}
              placeholder="Enter directory name"
              disabled={createMutation.isPending}
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-400">
                {validationErrors.name}
              </p>
            )}
          </div>

          {/* Parent Directory Selection */}
          <div className="mb-4">
            <label
              htmlFor="parentDirectory"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Parent Directory
            </label>
            <select
              id="parentDirectory"
              value={formData.parentId || ""}
              onChange={(e) => handleInputChange("parentId", e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              disabled={createMutation.isPending}
            >
              <option value="">Root Level</option>
              {directories.map((directory) => (
                <option key={directory.id} value={directory.id}>
                  {buildDirectoryPath(directory)}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-400">
              Leave empty to create at root level
            </p>
          </div>

          {/* Directory Description */}
          <div className="mb-6">
            <label
              htmlFor="directoryDescription"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Description (Optional)
            </label>
            <textarea
              id="directoryDescription"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="Enter directory description"
              disabled={createMutation.isPending}
            />
          </div>

          {/* Error Message */}
          {createMutation.error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-sm text-red-400">
                {createMutation.error.message || "Failed to create directory"}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3">
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
              className="px-6 py-2 bg-primary hover:bg-primary-light text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            >
              {createMutation.isPending && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              <span>
                {createMutation.isPending ? "Creating..." : "Create Directory"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
