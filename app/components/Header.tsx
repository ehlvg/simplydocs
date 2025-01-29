import {useTheme} from "next-themes";
import React, {useContext, useState} from "react";
import {DocumentsContext} from "@/app/components/Document";
import {Download, Info, Moon, Plus, Sun} from "lucide-react";
import {Onboarding} from "@/app/components/Onboarding";

export function Header() {
    const {theme, setTheme} = useTheme();
    const docs = useContext(DocumentsContext);
    const [showOnboarding, setShowOnboarding] = useState(false);

    if (!docs) return null;

    const activeDoc = docs.documents.find((d) => d.id === docs.activeDocId);

    const exportMarkdown = () => {
        if (!activeDoc) return;

        const blob = new Blob([activeDoc.content], {type: "text/markdown"});
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
                    <Plus className="w-5 h-5"/>
                </button>
                {activeDoc && (
                    <button
                        onClick={exportMarkdown}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                        <Download className="w-5 h-5"/>
                    </button>
                )}
            </div>
            <div className="flex items-center gap-4">
                <button
                    onClick={() => setShowOnboarding(true)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    <Info className="w-5 h-5"/>
                </button>
                <button
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                    {theme === "dark" ? (
                        <Sun className="w-5 h-5"/>
                    ) : (
                        <Moon className="w-5 h-5"/>
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