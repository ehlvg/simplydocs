import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { marked } from "marked";
import { DocumentsContext } from "@/app/components/Document";
import markedKatex from "marked-katex-extension";
import markedFootnote from "marked-footnote";
import { Plus } from "lucide-react";
import DOMPurify from "dompurify";

export function Editor() {
  const docs = useContext(DocumentsContext);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!docs) return null;
  if (!mounted) return null;

  if (docs.documents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] animate-fade-in">
        <div className="text-center space-y-4 max-sm:max-w-[90%] mx-auto p-6 rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-medium text-gray-900 dark:text-gray-100">
            No documents yet
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Make your first document by clicking the button below.
          </p>
          <button
            onClick={() => docs.addDocument()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-100 text-blue-900 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-100 dark:hover:bg-blue-800/50 transition-all duration-200 ease-in-out"
          >
            <Plus className="w-5 h-5" />
            Create document
          </button>
        </div>
      </div>
    );
  }

  const activeDoc = docs.documents.find((d) => d.id === docs.activeDocId);
  if (!activeDoc) return null;

  marked.use(
    markedKatex({
      throwOnError: false,
    }),
    markedFootnote()
  );

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
          className={`rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-300 ease-in-out ${
            isPreviewMode
              ? "hidden md:block md:animate-fade-in"
              : "block animate-fade-in"
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
          className={`prose dark:prose-invert max-w-none p-4 overflow-auto rounded-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${
            isPreviewMode
              ? "block animate-fade-in"
              : "hidden md:block md:animate-fade-in"
          }`}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(marked(activeDoc.content)),
          }}
        />
      </div>
    </>
  );
}
