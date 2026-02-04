import { useState, useEffect } from "react";
import { motion, AnimatePresence, Reorder } from "framer-motion";
import { Plus, Trash2 } from "lucide-react";
import { useDebateStore } from "../../stores/debateStore";
import type { Speaker, Argument } from "../../types";
import { SIDES } from "../../types";
import ArgumentItem from "./ArgumentItem";
import ConfirmDialog from "../ui/ConfirmDialog";

interface SpeakerCardProps {
  /** The speaker to display */
  speaker: Speaker;
}

/**
 * SpeakerCard Component
 *
 * Displays an individual speaker with their arguments.
 * Post-it note style design with soft colors and shadows.
 */
const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker }) => {
  // Auto-edit mode for new speakers (name starts with "Speaker")
  const isNewSpeaker = speaker.name.startsWith("Speaker ");
  const [isEditingName, setIsEditingName] = useState(isNewSpeaker);
  const [editedName, setEditedName] = useState(
    isNewSpeaker ? "" : speaker.name,
  );
  const [localArguments, setLocalArguments] = useState<Argument[]>(
    speaker.arguments,
  );
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { updateSpeaker, removeSpeaker, addArgument } = useDebateStore();

  const isAffirmative = speaker.side === SIDES.AFFIRMATIVE;

  // Post-it note styles
  const postitStyles = isAffirmative
    ? "bg-[var(--color-postit-affirmative)]"
    : "bg-[var(--color-postit-negative)]";

  // Slight rotation for organic post-it feel
  const rotation = isAffirmative ? "rotate-[-0.5deg]" : "rotate-[0.5deg]";

  // Handle name save
  const handleNameSave = () => {
    const trimmedName = editedName.trim();
    if (trimmedName && trimmedName !== speaker.name) {
      updateSpeaker(speaker.id, { name: trimmedName });
      setEditedName(trimmedName);
    } else if (!trimmedName) {
      // If empty, keep the default name
      setEditedName(speaker.name);
    } else {
      setEditedName(speaker.name);
    }
    setIsEditingName(false);
  };

  // Handle name key press
  const handleNameKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleNameSave();
    } else if (e.key === "Escape") {
      setEditedName(speaker.name);
      setIsEditingName(false);
    }
  };

  // Handle add argument
  const handleAddArgument = () => {
    addArgument(speaker.id, {
      speakerId: speaker.id,
      content: "",
    });
  };

  // Handle delete speaker
  const handleDeleteSpeaker = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDeleteSpeaker = () => {
    removeSpeaker(speaker.id);
  };

  // Handle reorder
  const handleReorder = (newOrder: Argument[]) => {
    setLocalArguments(newOrder);
  };

  // Sync local arguments with speaker arguments
  useEffect(() => {
    setLocalArguments(speaker.arguments);
  }, [speaker.arguments]);

  return (
    <div
      className={`
        postit-note relative group
        ${postitStyles} ${rotation}
        rounded-lg p-4
        shadow-[var(--shadow-postit)]
        transition-all duration-300
      `}
      data-speaker-id={speaker.id}
      data-speaker-name={speaker.name}
    >
      {/* Header with speaker name */}
      <div className="flex items-center justify-between mb-3">
        {/* Order number */}
        <span className="text-xs font-medium text-[var(--color-text-tertiary)] mr-2">
          #{speaker.order}
        </span>

        {/* Name (editable) */}
        {isEditingName ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            onBlur={handleNameSave}
            onKeyDown={handleNameKeyPress}
            placeholder="Enter name..."
            autoFocus
            className="flex-1 bg-white/50 px-2 py-1 rounded text-sm font-semibold text-[var(--color-text-primary)] outline-none focus:bg-white/80 placeholder:text-[var(--color-text-tertiary)] placeholder:font-normal"
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className="flex-1 text-left text-sm font-semibold text-[var(--color-text-primary)] hover:opacity-70 transition-opacity truncate"
          >
            {speaker.name}
          </button>
        )}

        {/* Delete button - only show on hover */}
        <button
          onClick={handleDeleteSpeaker}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded"
          aria-label="Delete speaker"
        >
          <Trash2 className="w-3.5 h-3.5 text-[var(--color-text-tertiary)]" />
        </button>
      </div>

      {/* Arguments list */}
      <div className="space-y-2 min-h-[40px]">
        <AnimatePresence mode="popLayout">
          {speaker.arguments.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-[var(--color-text-tertiary)] text-center py-3 italic"
            >
              Click + to add notes
            </motion.p>
          ) : (
            <Reorder.Group
              axis="y"
              values={localArguments}
              onReorder={handleReorder}
              className="space-y-2"
            >
              {localArguments.map((argument) => (
                <Reorder.Item
                  key={argument.id}
                  value={argument}
                  className="cursor-grab active:cursor-grabbing"
                >
                  <ArgumentItem argument={argument} speakerId={speaker.id} />
                </Reorder.Item>
              ))}
            </Reorder.Group>
          )}
        </AnimatePresence>
      </div>

      {/* Add argument button - clean, minimal */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-3"
      >
        <button
          onClick={handleAddArgument}
          className="w-full py-2 flex items-center justify-center gap-1.5 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)] hover:bg-black/5 rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Argument
        </button>
      </motion.div>

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteSpeaker}
        title="Remove Speaker?"
        message={`Are you sure you want to remove ${speaker.name}? This will delete all their arguments.`}
        confirmText="Remove"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
};

export default SpeakerCard;
