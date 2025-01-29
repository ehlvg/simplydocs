"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Onboarding({ isOpen, onClose }: OnboardingProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-h-[80%] overflow-y-auto max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-2xl mx-4"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <h1 className="text-4xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600">
                  Welcome to simply.doc
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-8">
                  Your elegant Markdown editing companion
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
              >
                <Feature
                  title="Clean Interface"
                  description="Distraction-free writing environment with a modern design"
                />
                <Feature
                  title="Real-time Preview"
                  description="See your markdown rendered instantly as you type"
                />
                <Feature
                  title="Dark Mode"
                  description="Easy on the eyes with automatic dark mode support"
                />
              </motion.div>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={onClose}
                className="mx-auto block px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </div>
  );
}
