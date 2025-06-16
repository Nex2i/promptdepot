import { useState, useEffect } from "react";
import { useAppSelector } from "../store/hooks";
import { type CreateProjectData } from "../lib/projectService";
import { type UseMutationResult } from "@tanstack/react-query";
import { type Project } from "../lib/projectService";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  createMutation: UseMutationResult<Project, Error, CreateProjectData, unknown>;
}

export function CreateProjectModal({
  isOpen,
  onClose,
  createMutation,
}: CreateProjectModalProps) {
  const { currentTenant } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  const [validationErrors, setValidationErrors] = useState({
    name: "",
  });

  // Clear errors and form when modal opens
  useEffect(() => {
    if (isOpen) {
      setValidationErrors({ name: "" });
      setFormData({ name: "", description: "" });
      createMutation.reset(); // Clear any previous mutation state
    }
  }, [isOpen, createMutation]);

  // Close modal on successful creation
  useEffect(() => {
    if (createMutation.isSuccess) {
      onClose();
    }
  }, [createMutation.isSuccess, onClose]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear validation error when user starts typing
    if (validationErrors.name && field === "name") {
      setValidationErrors((prev) => ({ ...prev, name: "" }));
    }
  };

  const validateForm = () => {
    const errors = { name: "" };

    if (!formData.name.trim()) {
      errors.name = "Project name is required";
    } else if (formData.name.trim().length < 3) {
      errors.name = "Project name must be at least 3 characters";
    }

    setValidationErrors(errors);
    return !errors.name;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!currentTenant?.id) {
      return;
    }

    const projectData: CreateProjectData = {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      tenantId: currentTenant.id,
    };

    createMutation.mutate(projectData);
  };

  const handleClose = () => {
    if (!createMutation.isPending) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Create New Project</h2>
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
          {/* Project Name */}
          <div className="mb-4">
            <label
              htmlFor="projectName"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Project Name *
            </label>
            <input
              id="projectName"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className={`w-full px-3 py-2 bg-gray-700 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors ${
                validationErrors.name
                  ? "border-red-500"
                  : "border-gray-600 focus:border-primary"
              }`}
              placeholder="Enter project name"
              disabled={createMutation.isPending}
            />
            {validationErrors.name && (
              <p className="mt-1 text-sm text-red-400">
                {validationErrors.name}
              </p>
            )}
          </div>

          {/* Project Description */}
          <div className="mb-6">
            <label
              htmlFor="projectDescription"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Description (Optional)
            </label>
            <textarea
              id="projectDescription"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="Enter project description"
              disabled={createMutation.isPending}
            />
          </div>

          {/* Error Message */}
          {createMutation.error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg">
              <p className="text-sm text-red-400">
                {createMutation.error.message || "Failed to create project"}
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
                {createMutation.isPending ? "Creating..." : "Create Project"}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
