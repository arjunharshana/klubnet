import React from "react";
import { AlertTriangle, X, Info } from "lucide-react";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = false,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop (Darkens the background) */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={!isLoading ? onClose : undefined}
      ></div>

      {/* Modal Box */}
      <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-2xl shadow-2xl w-full max-w-md relative z-10 transform transition-all animate-in fade-in zoom-in-95 duration-200">
        {/* Top-Right Close Button */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute top-4 right-4 text-muted-light hover:text-foreground-light dark:text-muted-dark dark:hover:text-foreground-dark transition-colors disabled:opacity-50"
        >
          <X size={20} />
        </button>

        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            {/* Dynamic Icon (Red Warning or Purple Info) */}
            <div
              className={`shrink-0 size-12 rounded-full flex items-center justify-center ${
                isDanger
                  ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-primary/10 text-primary dark:bg-primary/20"
              }`}
            >
              {isDanger ? <AlertTriangle size={24} /> : <Info size={24} />}
            </div>

            {/* Modal Text */}
            <div className="flex-1 mt-1">
              <h3 className="text-xl font-bold text-foreground-light dark:text-foreground-dark mb-2">
                {title}
              </h3>
              <p className="text-sm text-muted-light dark:text-muted-dark leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 mt-2">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 text-sm font-bold rounded-xl text-muted-light dark:text-muted-dark hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className={`px-5 py-2.5 text-sm font-bold rounded-xl text-white transition-all shadow-md flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ${
                isDanger
                  ? "bg-red-600 hover:bg-red-700 shadow-red-600/20"
                  : "bg-primary hover:bg-primary-hover shadow-primary/25"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
