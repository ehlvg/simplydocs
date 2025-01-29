import React, { useContext, useState } from "react";
import { Document, DocumentsContext } from "@/app/components/Document";
import { Edit2, X } from "lucide-react";

export function Tabs() {
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
    <div className="flex gap-2 p-4 overflow-x-auto border-b border-gray-200 dark:border-gray-700">
      {docs.documents.map((doc) => (
        <div
          key={doc.id}
          className={`
            group
            flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
            transition-all duration-200 ease-in-out
            animate-fade-in min-h-[2rem]
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
                className="p-1 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 opacity-0 group-hover:opacity-100 transition-all duration-200 ease-in-out"
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
            className="p-1 rounded-full hover:bg-red-200 dark:hover:bg-red-900/50 transition-all duration-200 ease-in-out"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
