"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { marked } from "marked";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { Sun, Moon, Download, Plus, X, Edit2, Info } from "lucide-react";
import { useTheme } from "next-themes";
import { Onboarding } from "./components/Onboarding";

interface Document {
  id: string;
  title: string;
  content: string;
}

interface DocumentsContextType {
  documents: Document[];
  activeDocId: string | null;
  addDocument: () => void;
  removeDocument: (id: string) => void;
  updateDocument: (id: string, content: string) => void;
  renameDocument: (id: string, title: string) => void;
  setActiveDocument: (id: string) => void;
}

const DocumentsContext = createContext<DocumentsContextType | null>(null);

function DocumentsProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>(() => {
    const saved = localStorage.getItem("documents");
    return saved ? JSON.parse(saved) : [];
  });
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("documents", JSON.stringify(documents));
  }, [documents]);

  const addDocument = () => {
    const newDoc: Document = {
      id: Date.now().toString(),
      title: `Document ${documents.length + 1}`,
      content: "",
    };
    setDocuments([...documents, newDoc]);
    setActiveDocId(newDoc.id);
  };

  const removeDocument = (id: string) => {
    setDocuments(documents.filter((doc) => doc.id !== id));
    if (activeDocId === id) {
      setActiveDocId(documents[0]?.id ?? null);
    }
  };

  const updateDocument = (id: string, content: string) => {
    setDocuments(
      documents.map((doc) => (doc.id === id ? { ...doc, content } : doc))
    );
  };

  const renameDocument = (id: string, title: string) => {
    setDocuments(
      documents.map((doc) => (doc.id === id ? { ...doc, title } : doc))
    );
  };

  const value = {
    documents,
    activeDocId,
    addDocument,
    removeDocument,
    updateDocument,
    renameDocument,
    setActiveDocument: setActiveDocId,
  };

  return (
    <DocumentsContext.Provider value={value}>
      {children}
    </DocumentsContext.Provider>
  );
}

function Header() {
  const { theme, setTheme } = useTheme();
  const docs = useContext(DocumentsContext);
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (!docs) return null;

  const activeDoc = docs.documents.find((d) => d.id === docs.activeDocId);

  const exportMarkdown = () => {
    if (!activeDoc) return;

    const blob = new Blob([activeDoc.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${activeDoc.title}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        <button
          onClick={() => docs.addDocument()}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
        {activeDoc && (
          <button
            onClick={exportMarkdown}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Download className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={() => setShowOnboarding(true)}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Info className="w-5 h-5" />
        </button>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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

function Tabs() {
  const docs = useContext(DocumentsContext);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  if (!docs) return null;

  const handleRename = (doc: Document) => {
    setEditingId(doc.id);
    setEditingTitle(doc.title);
  };

  const saveRename = () => {
    if (editingId && editingTitle.trim()) {
      docs.renameDocument(editingId, editingTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="flex gap-2 p-2 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
      {docs.documents.map((doc) => (
        <div
          key={doc.id}
          className={`
            group
            flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
            transition-colors
            ${
              doc.id === docs.activeDocId
                ? "bg-blue-100 dark:bg-blue-900/30"
                : "hover:bg-gray-100 dark:hover:bg-gray-800"
            }
          `}
          onClick={() => docs.setActiveDocument(doc.id)}
        >
          {editingId === doc.id ? (
            <input
              type="text"
              value={editingTitle}
              onChange={(e) => setEditingTitle(e.target.value)}
              onBlur={saveRename}
              onKeyDown={(e) => e.key === "Enter" && saveRename()}
              className="bg-transparent border-none outline-none font-sofia-sans"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <>
              <span className="truncate">{doc.title}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRename(doc);
                }}
                className="p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              docs.removeDocument(doc.id);
            }}
            className="p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function Editor() {
  const docs = useContext(DocumentsContext);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!docs || !docs.activeDocId) return null;
  if (!mounted) return null;

  const activeDoc = docs.documents.find((d) => d.id === docs.activeDocId);
  if (!activeDoc) return null;

  return (
    <>
      <div className="flex items-center justify-end p-2 md:hidden">
        <button
          onClick={() => setIsPreviewMode(!isPreviewMode)}
          className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-800"
        >
          {isPreviewMode ? "Edit" : "Preview"}
        </button>
      </div>
      <div className="grid md:grid-cols-2 gap-4 p-4 h-[calc(100%-12rem)]">
        <div
          className={`rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden ${
            isPreviewMode ? "hidden md:block" : "block"
          }`}
        >
          <CodeMirror
            value={activeDoc.content}
            height="100%"
            id="editor"
            extensions={[markdown()]}
            onChange={(value) => docs.updateDocument(activeDoc.id, value)}
            className="h-full"
            theme={theme === "dark" ? "dark" : "light"}
          />
        </div>
        <div
          id="preview"
          className={`prose dark:prose-invert max-w-none p-4 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 ${
            isPreviewMode ? "block" : "hidden md:block"
          }`}
          dangerouslySetInnerHTML={{ __html: marked(activeDoc.content) }}
        />
      </div>
    </>
  );
}

export default function App() {
  const [mounted, setMounted] = useState(false);
  const [showInitialOnboarding, setShowInitialOnboarding] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
    if (!hasSeenOnboarding) {
      setShowInitialOnboarding(true);
      localStorage.setItem("hasSeenOnboarding", "true");
    }
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <DocumentsProvider>
      <div className="h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sofia-sans">
        <Header />
        <Tabs />
        <Editor />
        <Onboarding
          isOpen={showInitialOnboarding}
          onClose={() => setShowInitialOnboarding(false)}
        />
      </div>
    </DocumentsProvider>
  );
}
