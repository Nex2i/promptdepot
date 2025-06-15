import "./index.css";
import { TextEditor } from "./components/TextEditor";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="text-center py-16 px-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary-light bg-clip-text text-transparent">
          PromptDepot
        </h1>
        <p className="text-lg text-gray-400 mt-4">
          Your Central Hub for LLM Prompt Management
        </p>
      </header>

      <main className="flex-1 px-8 max-w-7xl mx-auto w-full">
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/5 rounded-2xl p-8 transition-transform hover:-translate-y-1">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Prompt Management
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Organize and version control your prompts for consistent LLM
              interactions
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 transition-transform hover:-translate-y-1">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Proxy Integration
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Seamlessly integrate with various LLM providers through a unified
              interface
            </p>
          </div>

          <div className="bg-white/5 rounded-2xl p-8 transition-transform hover:-translate-y-1">
            <h2 className="text-xl font-semibold text-primary mb-4">
              Use Case Templates
            </h2>
            <p className="text-gray-400 leading-relaxed">
              Access pre-built templates for common LLM use cases and scenarios
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-8 text-center">
            Create New Prompt
          </h2>
          <div className="max-w-4xl mx-auto">
            <TextEditor
              placeholder="Write your prompt here. Use markdown for formatting..."
              onChange={(value) => console.log("Prompt updated:", value)}
            />
          </div>
        </section>

        <section className="text-center py-16">
          <h2 className="text-2xl font-semibold mb-8">Ready to Get Started?</h2>
          <button className="bg-gradient-to-r from-primary to-primary-light text-white px-8 py-4 rounded-lg text-lg font-medium transition-transform hover:scale-105">
            Explore Prompts
          </button>
        </section>
      </main>

      <footer className="text-center py-8 border-t border-white/10">
        <p className="text-gray-400">
          © 2024 PromptDepot - Empowering LLM Development
        </p>
      </footer>
    </div>
  );
}

export default App;
