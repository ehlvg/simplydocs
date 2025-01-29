import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "next-themes";
import CodeMirror from "@uiw/react-codemirror";
import { markdown } from "@codemirror/lang-markdown";
import { marked } from "marked";
import { DocumentsContext } from "@/app/components/Document";
import markedKatex from "marked-katex-extension";
import markedFootnote from "marked-footnote";

export function Editor() {
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
          dangerouslySetInnerHTML={{ __html: marked(activeDoc.content) }}
        />
      </div>
    </>
  );
}
