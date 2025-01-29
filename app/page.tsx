"use client";

import React, {useEffect, useState} from "react";
import {Onboarding} from "./components/Onboarding";
import {Editor} from "@/app/components/Editor";
import {DocumentsProvider} from "@/app/components/Document";
import {Header} from "@/app/components/Header";
import {Tabs} from "@/app/components/Tabs";

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
