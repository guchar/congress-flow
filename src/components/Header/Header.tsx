import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useCurrentDebate } from "../../stores/debateStore";

interface HeaderProps {
  onNewDebate: () => void;
}

/**
 * Application header with logo and new debate button.
 * Clean, minimal design with Sandel Academy branding.
 */
export const Header = ({ onNewDebate }: HeaderProps) => {
  const currentDebate = useCurrentDebate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-xl border-b border-[var(--color-border-subtle)]"
    >
      <div className="px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <div className="flex items-center gap-3">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex-shrink-0"
            >
              <img 
                src="/images/sandel-logo.png" 
                alt="Sandel Academy" 
                className="h-10 w-auto"
              />
            </motion.div>
            <div>
              <h1 className="text-base font-semibold text-[var(--color-text-primary)] tracking-tight">
                Congress Flow
              </h1>
              <p className="text-xs text-[var(--color-text-tertiary)]">
                Sandel Academy
              </p>
            </div>
          </div>

          {/* Current topic (if any) */}
          {currentDebate && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="hidden md:block text-sm text-[var(--color-text-secondary)] truncate max-w-md"
            >
              {currentDebate.topic}
            </motion.div>
          )}

          {/* New Debate Button */}
          <button
            onClick={onNewDebate}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">New</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;
