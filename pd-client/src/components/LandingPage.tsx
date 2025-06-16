import { Link } from "@tanstack/react-router";

export function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to PromptDepot</h1>
        <div className="space-x-4">
          <Link
            to="/login"
            className="bg-primary hover:bg-primary-light px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
