import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Trash2,
  FileText,
  Plus,
} from "lucide-react";
import {
  useDebateStore,
  useSavedDebates,
  useIsSidebarOpen,
  useCurrentDebate,
} from "../../stores/debateStore";
import type { DebateRound } from "../../types";

/**
 * Format a date for display
 */
const formatDate = (date: Date | string) => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Get a preview of the debate (first few arguments)
 */
const getDebatePreview = (debate: DebateRound) => {
  const totalArgs = debate.speakers.reduce(
    (sum, s) => sum + s.arguments.length,
    0,
  );
  const totalSpeakers = debate.speakers.length;
  return `${totalSpeakers} speaker${totalSpeakers !== 1 ? "s" : ""} · ${totalArgs} note${totalArgs !== 1 ? "s" : ""}`;
};

interface SavedDebateItemProps {
  debate: DebateRound;
  isActive: boolean;
  onLoad: () => void;
  onDelete: () => void;
}

/**
 * Individual saved debate item
 */
const SavedDebateItem = ({
  debate,
  isActive,
  onLoad,
  onDelete,
}: SavedDebateItemProps) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={`
        group relative p-3 rounded-xl cursor-pointer transition-all duration-200
        ${
          isActive
            ? "bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20"
            : "hover:bg-[var(--color-bg-tertiary)]"
        }
      `}
      onClick={onLoad}
    >
      <div className="flex items-start gap-3">
        <div
          className={`
          p-2 rounded-lg
          ${isActive ? "bg-[var(--color-accent)]/20" : "bg-[var(--color-bg-tertiary)]"}
        `}
        >
          <FileText
            className={`w-4 h-4 ${isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-tertiary)]"}`}
          />
        </div>
        <div className="flex-1 min-w-0">
          <h4
            className={`
            text-sm font-medium truncate
            ${isActive ? "text-[var(--color-accent)]" : "text-[var(--color-text-primary)]"}
          `}
          >
            {debate.topic}
          </h4>
          <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
            {formatDate(debate.updatedAt)} · {getDebatePreview(debate)}
          </p>
        </div>
      </div>

      {/* Delete button - only show on hover, not for active */}
      {!isActive && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute top-2 right-2 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-50 transition-all"
          aria-label="Delete debate"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-400" />
        </button>
      )}
    </motion.div>
  );
};

interface SavedFlowsSidebarProps {
  onNewDebate: () => void;
}

/**
 * SavedFlowsSidebar Component
 *
 * Collapsible sidebar showing all saved debate flows.
 * Click to load, hover to show delete.
 */
export const SavedFlowsSidebar = ({ onNewDebate }: SavedFlowsSidebarProps) => {
  const savedDebates = useSavedDebates();
  const currentDebate = useCurrentDebate();
  const isSidebarOpen = useIsSidebarOpen();
  const { loadDebate, deleteSavedDebate, toggleSidebar } = useDebateStore();

  return (
    <motion.div
      initial={false}
      animate={{ width: isSidebarOpen ? 280 : 48 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="h-full bg-white flex flex-col border-r border-[var(--color-border-subtle)] relative"
    >
      {/* Toggle button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 z-10 p-1 rounded-full bg-white shadow-md border border-[var(--color-border-subtle)] hover:bg-[var(--color-bg-tertiary)] transition-colors"
        aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
      >
        {isSidebarOpen ? (
          <ChevronLeft className="w-4 h-4 text-[var(--color-text-tertiary)]" />
        ) : (
          <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)]" />
        )}
      </button>

      {isSidebarOpen ? (
        <>
          {/* Header */}
          <div className="p-4">
            <h2 className="text-sm font-semibold text-[var(--color-text-primary)]">
              Saved Flows
            </h2>
            <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">
              {savedDebates.length} debate{savedDebates.length !== 1 ? "s" : ""}
            </p>
          </div>

          {/* New Debate Button */}
          <div className="px-4 mb-2">
            <button
              onClick={onNewDebate}
              className="w-full py-2 px-3 flex items-center justify-center gap-2 text-sm font-medium text-[var(--color-accent)] rounded-xl hover:bg-[var(--color-accent)]/5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Debate
            </button>
          </div>

          {/* Saved Debates List */}
          <div className="flex-1 overflow-y-auto px-3 pb-4">
            <AnimatePresence mode="popLayout">
              {savedDebates.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <FileText className="w-8 h-8 text-[var(--color-text-disabled)] mx-auto mb-2" />
                  <p className="text-sm text-[var(--color-text-tertiary)]">
                    No saved debates yet
                  </p>
                  <p className="text-xs text-[var(--color-text-disabled)] mt-1">
                    Create a debate to get started
                  </p>
                </motion.div>
              ) : (
                <div className="space-y-2">
                  {savedDebates.map((debate) => (
                    <SavedDebateItem
                      key={debate.id}
                      debate={debate}
                      isActive={currentDebate?.id === debate.id}
                      onLoad={() => loadDebate(debate.id)}
                      onDelete={() => {
                        if (confirm(`Delete "${debate.topic}"?`)) {
                          deleteSavedDebate(debate.id);
                        }
                      }}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </div>
        </>
      ) : (
        // Collapsed state - just show icon
        <div className="flex-1 flex flex-col items-center pt-16">
          <FileText className="w-5 h-5 text-[var(--color-text-tertiary)]" />
          {savedDebates.length > 0 && (
            <span className="mt-2 text-xs font-medium text-[var(--color-text-tertiary)]">
              {savedDebates.length}
            </span>
          )}
        </div>
      )}
    </motion.div>
  );
};

export default SavedFlowsSidebar;
