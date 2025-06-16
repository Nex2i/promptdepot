import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAppSelector } from "../store/hooks";
import { authService } from "../lib/authService";

interface ViewWrapperProps {
  children: React.ReactNode;
  onCreateProject?: () => void;
}

export function ViewWrapper({ children, onCreateProject }: ViewWrapperProps) {
  const navigate = useNavigate();
  const { user, currentTenant } = useAppSelector((state) => state.auth);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.signOut();
      navigate({ to: "/login" });
    } catch (error) {
      console.error("Logout error:", error);
      // Navigate to login even if logout fails
      navigate({ to: "/login" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header Navigation */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Projects button */}
            <div className="flex items-center space-x-8">
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
                PromptDepot
              </h1>
              {onCreateProject && (
                <button
                  onClick={onCreateProject}
                  className="bg-primary hover:bg-primary-light px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  New Project
                </button>
              )}
            </div>

            {/* Right side - Profile Menu */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors"
              >
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </span>
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-sm font-medium">{user?.name}</div>
                  <div className="text-xs text-gray-400">
                    {currentTenant?.name}
                  </div>
                </div>
                <svg
                  className={`w-4 h-4 transition-transform ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {/* Profile Dropdown Menu */}
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <div className="text-sm font-medium">{user?.email}</div>
                      <div className="text-xs text-gray-400">
                        {currentTenant?.name} •{" "}
                        {currentTenant?.isSuperUser ? "Admin" : "Member"}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
