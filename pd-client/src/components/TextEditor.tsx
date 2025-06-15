import { useState } from "react";

interface TextEditorProps {
  initialValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

export function TextEditor({
  initialValue = "",
  onChange,
  placeholder = "Enter your prompt here...",
}: TextEditorProps) {
  const [content, setContent] = useState(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setContent(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="w-full">
      <div className="bg-white/5 rounded-lg overflow-hidden">
        <div className="border-b border-white/10 p-2 flex gap-2">
          <button
            className="px-3 py-1 text-sm rounded hover:bg-white/10 transition-colors text-gray-200"
            onClick={() => document.execCommand("bold", false)}
          >
            Bold
          </button>
          <button
            className="px-3 py-1 text-sm rounded hover:bg-white/10 transition-colors text-gray-200"
            onClick={() => document.execCommand("italic", false)}
          >
            Italic
          </button>
          <button
            className="px-3 py-1 text-sm rounded hover:bg-white/10 transition-colors text-gray-200"
            onClick={() => document.execCommand("underline", false)}
          >
            Underline
          </button>
        </div>
        <textarea
          value={content}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full h-64 p-4 resize-none focus:outline-none text-gray-200"
          style={{ fontFamily: "monospace" }}
        />
      </div>
      <div className="mt-2 text-sm text-gray-400">
        {content.length} characters
      </div>
    </div>
  );
}
