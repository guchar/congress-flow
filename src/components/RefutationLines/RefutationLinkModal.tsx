import { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Link2, Check } from 'lucide-react';
import { useDebateStore } from '../../stores/debateStore';
import type { Argument, Side } from '../../types';
import { SIDES } from '../../types';

export interface RefutationLinkModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback to close the modal */
  onClose: () => void;
  /** The source argument that will refute others */
  sourceArgument: Argument | null;
  /** The side of the source argument */
  sourceSide: Side | null;
}

/**
 * Modal for creating refutation links between arguments.
 * Shows arguments from the opposite side that can be linked.
 */
export function RefutationLinkModal({
  isOpen,
  onClose,
  sourceArgument,
  sourceSide,
}: RefutationLinkModalProps) {
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getArgumentsBySide = useDebateStore((state) => state.getArgumentsBySide);
  const linkRefutation = useDebateStore((state) => state.linkRefutation);
  const unlinkRefutation = useDebateStore((state) => state.unlinkRefutation);

  // Get arguments from the opposite side
  const oppositeArguments = useMemo(() => {
    if (!sourceSide) return [];
    const oppositeSide = sourceSide === SIDES.AFFIRMATIVE ? SIDES.NEGATIVE : SIDES.AFFIRMATIVE;
    return getArgumentsBySide(oppositeSide);
  }, [sourceSide, getArgumentsBySide]);

  // Pre-select arguments that are already linked
  const existingLinks = useMemo(() => {
    if (!sourceArgument) return new Set<string>();
    return new Set(sourceArgument.refutes);
  }, [sourceArgument]);

  // Initialize selected targets with existing links when modal opens
  useState(() => {
    if (isOpen && sourceArgument) {
      setSelectedTargets(new Set(sourceArgument.refutes));
    }
  });

  const toggleTarget = useCallback((argumentId: string) => {
    setSelectedTargets((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(argumentId)) {
        newSet.delete(argumentId);
      } else {
        newSet.add(argumentId);
      }
      return newSet;
    });
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!sourceArgument) return;

    setIsSubmitting(true);

    try {
      // Find what needs to be added and removed
      const toAdd = [...selectedTargets].filter((id) => !existingLinks.has(id));
      const toRemove = [...existingLinks].filter((id) => !selectedTargets.has(id));

      // Apply changes
      for (const targetId of toAdd) {
        linkRefutation(sourceArgument.id, targetId);
      }

      for (const targetId of toRemove) {
        unlinkRefutation(sourceArgument.id, targetId);
      }

      onClose();
    } finally {
      setIsSubmitting(false);
    }
  }, [sourceArgument, selectedTargets, existingLinks, linkRefutation, unlinkRefutation, onClose]);

  const handleClose = useCallback(() => {
    setSelectedTargets(new Set());
    onClose();
  }, [onClose]);

  // Reset selection when modal opens with new source
  const handleAnimationStart = useCallback(() => {
    if (isOpen && sourceArgument) {
      setSelectedTargets(new Set(sourceArgument.refutes));
    }
  }, [isOpen, sourceArgument]);

  if (!sourceArgument || !sourceSide) {
    return null;
  }

  const oppositeSideName = sourceSide === SIDES.AFFIRMATIVE ? 'Negative' : 'Affirmative';
  const hasChanges =
    [...selectedTargets].some((id) => !existingLinks.has(id)) ||
    [...existingLinks].some((id) => !selectedTargets.has(id));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
            onAnimationStart={handleAnimationStart}
          >
            <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border)]">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10">
                    <Link2 className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      Link Refutations
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)]">
                      Select {oppositeSideName} arguments this refutes
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </button>
              </div>

              {/* Source argument preview */}
              <div className="px-6 py-4 bg-[var(--color-bg-tertiary)] border-b border-[var(--color-border)]">
                <p className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wide mb-2">
                  Source Argument
                </p>
                <p className="text-sm text-[var(--color-text-primary)] line-clamp-2">
                  {sourceArgument.content}
                </p>
              </div>

              {/* Target arguments list */}
              <div className="max-h-80 overflow-y-auto">
                {oppositeArguments.length === 0 ? (
                  <div className="px-6 py-8 text-center">
                    <p className="text-[var(--color-text-secondary)]">
                      No {oppositeSideName} arguments available to link.
                    </p>
                  </div>
                ) : (
                  <ul className="divide-y divide-[var(--color-border)]">
                    {oppositeArguments.map((argument) => {
                      const isSelected = selectedTargets.has(argument.id);
                      const wasExisting = existingLinks.has(argument.id);

                      return (
                        <li key={argument.id}>
                          <button
                            onClick={() => toggleTarget(argument.id)}
                            className={`w-full px-6 py-4 text-left transition-colors flex items-start gap-4 ${
                              isSelected
                                ? 'bg-cyan-500/10'
                                : 'hover:bg-[var(--color-bg-tertiary)]'
                            }`}
                          >
                            <div
                              className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                                isSelected
                                  ? 'border-cyan-400 bg-cyan-400'
                                  : 'border-[var(--color-border)]'
                              }`}
                            >
                              {isSelected && <Check className="w-3 h-3 text-black" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-[var(--color-text-primary)] line-clamp-2">
                                {argument.content}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-xs text-[var(--color-text-secondary)] capitalize">
                                  {argument.type}
                                </span>
                                {wasExisting && (
                                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400">
                                    Already linked
                                  </span>
                                )}
                              </div>
                            </div>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  {selectedTargets.size} argument{selectedTargets.size !== 1 ? 's' : ''} selected
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleClose}
                    className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={!hasChanges || isSubmitting}
                    className="px-4 py-2 text-sm font-medium rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isSubmitting ? 'Saving...' : 'Save Links'}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/**
 * Hook to manage the refutation link modal state.
 */
export function useRefutationLinkModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [sourceArgument, setSourceArgument] = useState<Argument | null>(null);
  const [sourceSide, setSourceSide] = useState<Side | null>(null);

  const openModal = useCallback((argument: Argument, side: Side) => {
    setSourceArgument(argument);
    setSourceSide(side);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    // Delay clearing the argument so the exit animation can complete
    setTimeout(() => {
      setSourceArgument(null);
      setSourceSide(null);
    }, 200);
  }, []);

  return {
    isOpen,
    sourceArgument,
    sourceSide,
    openModal,
    closeModal,
  };
}

export default RefutationLinkModal;
