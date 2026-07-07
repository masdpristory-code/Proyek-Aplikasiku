import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Copy, Check } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: string;
  onCopy: () => void;
  isCopied: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  content,
  onCopy,
  isCopied,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            id="modal-backdrop"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 15 }}
            transition={{ type: "spring", duration: 0.4 }}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl transition-colors duration-300 dark:bg-slate-900"
            id="modal-container"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
              <h3 className="font-sans text-lg font-bold text-slate-800 dark:text-white" id="modal-title">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800 dark:hover:text-slate-300"
                id="btn-close-modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Body */}
            <div className="max-h-[60vh] overflow-y-auto px-6 py-6 text-slate-600 dark:text-slate-300">
              <div className="prose prose-slate dark:prose-invert max-w-none">
                {content.split("\n").map((line, index) => {
                  if (line.startsWith("### ")) {
                    return (
                      <h4 key={index} className="mt-4 mb-2 font-sans text-base font-bold text-blue-600 dark:text-blue-400">
                        {line.replace("### ", "")}
                      </h4>
                    );
                  }
                  if (line.startsWith("* **") || line.startsWith("- **")) {
                    const match = line.match(/^[\*\-]\s+\*\*(.*?)\*\*:\s*(.*)/);
                    if (match) {
                      return (
                        <p key={index} className="my-1.5 text-sm">
                          <strong className="text-slate-800 dark:text-slate-100">{match[1]}:</strong> {match[2]}
                        </p>
                      );
                    }
                  }
                  if (line.startsWith("1. ") || line.startsWith("2. ") || line.startsWith("3. ")) {
                    return (
                      <p key={index} className="mt-3 mb-1 font-sans text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {line}
                      </p>
                    );
                  }
                  if (line.trim().startsWith("*") || line.trim().startsWith("-")) {
                    return (
                      <li key={index} className="ml-4 list-disc text-sm py-0.5">
                        {line.replace(/^[\*\-]\s*/, "")}
                      </li>
                    );
                  }
                  if (line.trim() === "") {
                    return <div key={index} className="h-2" />;
                  }
                  return (
                    <p key={index} className="my-1.5 text-sm leading-relaxed">
                      {line}
                    </p>
                  );
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-100 bg-slate-50 px-6 py-4 dark:border-slate-800 dark:bg-slate-900/50">
              <button
                onClick={onCopy}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-500/15 hover:bg-blue-700 active:scale-95 transition"
                id="btn-copy-modal-content"
              >
                {isCopied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Tersalin!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Salin Ide</span>
                  </>
                )}
              </button>
              <button
                onClick={onClose}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                id="btn-close-modal-footer"
              >
                Tutup
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
