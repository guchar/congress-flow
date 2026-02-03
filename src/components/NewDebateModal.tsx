import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Gavel, AlertCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { useDebateStore } from "../stores/debateStore";

interface NewDebateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Modal for creating a new debate round.
 * Captures the debate topic/resolution and initializes the debate store.
 */
export const NewDebateModal = ({ isOpen, onClose }: NewDebateModalProps) => {
  const [topic, setTopic] = useState("");
  const [error, setError] = useState<string | null>(null);
  const createDebate = useDebateStore((state) => state.createDebate);
  const currentDebate = useDebateStore((state) => state.currentDebate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedTopic = topic.trim();
    if (!trimmedTopic) {
      setError("Please enter a debate topic");
      return;
    }

    if (trimmedTopic.length < 10) {
      setError("Topic should be at least 10 characters");
      return;
    }

    createDebate(trimmedTopic);
    setTopic("");
    setError(null);
    onClose();
  };

  const handleClose = () => {
    setTopic("");
    setError(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 300,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[var(--color-accent)]/10">
                    <Gavel className="w-5 h-5 text-[var(--color-accent)]" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      New Debate
                    </h2>
                    <p className="text-sm text-[var(--color-text-tertiary)]">
                      Enter the resolution to begin flowing
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="absolute top-4 right-4 p-2 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6">
                {/* Info if debate exists */}
                {currentDebate && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 rounded-xl bg-blue-50"
                  >
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-blue-700">
                        Your current debate will be saved and available in the
                        sidebar.
                      </p>
                    </div>
                  </motion.div>
                )}

                <Input
                  label="Debate Topic / Resolution"
                  placeholder="e.g., Resolved: The United States should abolish the Electoral College"
                  value={topic}
                  onChange={(e) => {
                    setTopic(e.target.value);
                    if (error) setError(null);
                  }}
                  error={error ?? undefined}
                  autoFocus
                />

                <p className="mt-2 text-xs text-[var(--color-text-tertiary)]">
                  Enter the full resolution or topic being debated. This will
                  appear at the top of your flow sheet.
                </p>

                {/* Actions */}
                <div className="flex justify-end gap-3 mt-6">
                  <Button type="button" variant="ghost" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    leftIcon={<Gavel className="w-4 h-4" />}
                  >
                    Start Debate
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NewDebateModal;
