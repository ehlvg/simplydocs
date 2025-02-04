import { useTheme } from "next-themes";
import React, { useContext, useState, useRef } from "react";
import { DocumentsContext } from "@/app/components/Document";
import { Download, Info, Moon, Plus, Sun, Upload } from "lucide-react";
import { Onboarding } from "@/app/components/Onboarding";

export function Header() {
  const { theme, setTheme } = useTheme();
  const docs = useContext(DocumentsContext);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!docs) return null;

  const activeDoc = docs.documents.find((d) => d.id === docs.activeDocId);

  const exportMarkdown = async () => {
    if (!activeDoc) return;

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: `${activeDoc.title}.md`,
        types: [
          {
            description: "Markdown",
            accept: { "text/markdown": [".md"] },
          },
        ],
      });

      const writable = await handle.createWritable();
      await writable.write(activeDoc.content);
      await writable.close();
    } catch (err) {
      // User cancelled or API not supported
      console.log("File save cancelled or not supported");
    }
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && docs) {
      docs.importDocument(file);
    }
    e.target.value = ""; // Reset input
  };

  return (
    <header className="flex items-center justify-between p-4 rounded-lg m-4 border border-gray-200 dark:border-gray-700 bg-blue-50 dark:bg-blue-900/30">
      <div className="flex items-center gap-4">
        <input
          type="file"
          accept=".md"
          onChange={handleFileImport}
          className="hidden"
          ref={fileInputRef}
        />
        <button
          onClick={() => docs.addDocument()}
          className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-200 ease-in-out hover:scale-110"
          title="New document"
        >
          <Plus className="w-5 h-5" />
        </button>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-200 ease-in-out hover:scale-110"
          title="Import markdown"
        >
          <Upload className="w-5 h-5" />
        </button>
        {activeDoc && (
          <button
            onClick={exportMarkdown}
            className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-200 ease-in-out hover:scale-110"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
      </div>
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 flex align-center items-center text-center">
        simply.doc
      </h1>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowOnboarding(true)}
          className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-200 ease-in-out hover:scale-110"
        >
          <Info className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-800 transition-all duration-200 ease-in-out hover:scale-110"
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </button>
      </div>
      <Onboarding
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
      />
    </header>
  );
}
