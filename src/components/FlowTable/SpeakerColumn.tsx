import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useSpeakers, useDebateStore } from "../../stores/debateStore";
import type { Side } from "../../types";
import { SIDES } from "../../types";
import SpeakerCard from "./SpeakerCard";

interface SpeakerColumnProps {
  /** Which side this column represents */
  side: Side;
}

/**
 * SpeakerColumn Component
 *
 * Displays all speakers for one side of the debate (Affirmative or Negative).
 * Clean, minimal design with no borders.
 */
const SpeakerColumn: React.FC<SpeakerColumnProps> = ({ side }) => {
  const speakers = useSpeakers();
  const { addSpeaker } = useDebateStore();

  // Filter speakers by side and sort by order
  const sideSpeakers = speakers
    .filter((speaker) => speaker.side === side)
    .sort((a, b) => a.order - b.order);

  const isAffirmative = side === SIDES.AFFIRMATIVE;
  const sideName = isAffirmative ? "Affirmative" : "Negative";

  // Dynamic styles based on side
  const headerTextColor = isAffirmative
    ? "text-[var(--color-affirmative)]"
    : "text-[var(--color-negative)]";

  // Add a new speaker directly (no modal)
  const handleAddSpeaker = () => {
    const nextOrder = sideSpeakers.length + 1;
    addSpeaker({
      name: `Speaker ${nextOrder}`,
      side,
      order: nextOrder,
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Column Header - Minimal, typography-based */}
      <div className="mb-4">
        <h2 className={`text-lg font-semibold ${headerTextColor}`}>
          {sideName}
        </h2>
        <p className="text-sm text-[var(--color-text-tertiary)]">
          {sideSpeakers.length} speaker{sideSpeakers.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Speakers List */}
      <div className="flex-1 space-y-4 overflow-y-auto">
        <AnimatePresence mode="popLayout">
          {sideSpeakers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-[var(--color-text-tertiary)] text-sm"
            >
              No speakers yet. Add one to start flowing.
            </motion.div>
          ) : (
            sideSpeakers.map((speaker, index) => (
              <motion.div
                key={speaker.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.2,
                  delay: index * 0.05,
                  layout: { duration: 0.2 },
                }}
              >
                <SpeakerCard speaker={speaker} />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Speaker Button - Creates speaker inline */}
      <div className="mt-4">
        <button
          onClick={handleAddSpeaker}
          className={`
            w-full py-3 px-4 
            flex items-center justify-center gap-2
            text-sm font-medium
            rounded-xl
            transition-all duration-200
            ${
              isAffirmative
                ? "text-[var(--color-affirmative)] hover:bg-[var(--color-affirmative)]/5"
                : "text-[var(--color-negative)] hover:bg-[var(--color-negative)]/5"
            }
          `}
        >
          <Plus className="w-4 h-4" />
          Add Speaker
        </button>
      </div>
    </div>
  );
};

export default SpeakerColumn;
