import React, {createContext, useEffect, useState} from "react";

export interface Document {
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

export const DocumentsContext = createContext<DocumentsContextType | null>(null);

export function DocumentsProvider({children}: { children: React.ReactNode }) {
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
            documents.map((doc) => (doc.id === id ? {...doc, content} : doc))
        );
    };

    const renameDocument = (id: string, title: string) => {
        setDocuments(
            documents.map((doc) => (doc.id === id ? {...doc, title} : doc))
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