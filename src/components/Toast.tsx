import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { ToastMessage } from "../types";

interface ToastProps {
  toasts: ToastMessage[];
  onRemove: (id: string) => void;
}

export default function ToastContainer({ toasts, onRemove }: ToastProps) {
  return (
    <div className="fixed top-5 right-5 z-55 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            className={`pointer-events-auto flex items-start gap-3 rounded-2xl p-4 shadow-xl border backdrop-blur-md ${
              toast.type === "success"
                ? "bg-emerald-50/95 border-emerald-200 text-emerald-800 dark:bg-emerald-950/90 dark:border-emerald-800 dark:text-emerald-100"
                : toast.type === "error"
                ? "bg-rose-50/95 border-rose-200 text-rose-800 dark:bg-rose-950/90 dark:border-rose-800 dark:text-rose-100"
                : "bg-blue-50/95 border-blue-200 text-blue-800 dark:bg-blue-950/90 dark:border-blue-800 dark:text-blue-100"
            }`}
            id={`toast-${toast.id}`}
          >
            {/* Icon */}
            <div className="shrink-0 mt-0.5">
              {toast.type === "success" && <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />}
              {toast.type === "error" && <AlertCircle className="h-5 w-5 text-rose-600 dark:text-rose-400" />}
              {toast.type === "info" && <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />}
            </div>

            {/* Message */}
            <div className="flex-1 text-xs font-medium leading-relaxed">
              {toast.message}
            </div>

            {/* Close Button */}
            <button
              onClick={() => onRemove(toast.id)}
              className="shrink-0 rounded-lg p-0.5 hover:bg-black/5 dark:hover:bg-white/10 text-current/60 hover:text-current transition"
              id={`btn-close-toast-${toast.id}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
