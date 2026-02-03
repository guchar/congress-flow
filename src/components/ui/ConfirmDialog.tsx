import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

/**
 * ConfirmDialog Component
 *
 * Modern, Apple-inspired confirmation dialog.
 * Clean design with smooth animations.
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "warning",
}) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const variantStyles = {
    danger: {
      icon: "text-red-500",
      button: "bg-red-500 hover:bg-red-600 text-white",
    },
    warning: {
      icon: "text-amber-500",
      button: "bg-amber-500 hover:bg-amber-600 text-white",
    },
    info: {
      icon: "text-blue-500",
      button: "bg-blue-500 hover:bg-blue-600 text-white",
    },
  };

  const styles = variantStyles[variant];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
          />

          {/* Dialog */}
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl max-w-sm w-full overflow-hidden pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Content */}
              <div className="p-6">
                {/* Icon */}
                <div className="flex justify-center mb-4">
                  <div
                    className={`w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center ${styles.icon}`}
                  >
                    <AlertCircle className="w-6 h-6" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-center text-[var(--color-text-primary)] mb-2">
                  {title}
                </h3>

                {/* Message */}
                <p className="text-sm text-center text-[var(--color-text-secondary)] mb-6">
                  {message}
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-[var(--color-text-primary)] bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shadow-sm ${styles.button}`}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;
