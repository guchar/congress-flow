import { motion } from "framer-motion";
import { useCurrentDebate } from "../../stores/debateStore";
import { SIDES } from "../../types";
import SpeakerColumn from "./SpeakerColumn";

/**
 * FlowTable Component
 *
 * Main container for the Congressional Debate flowing interface.
 * Displays two columns: Affirmative (left) and Negative (right).
 * Clean, minimal design with no borders - uses whitespace for separation.
 */
const FlowTable: React.FC = () => {
  const currentDebate = useCurrentDebate();

  if (!currentDebate) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
            No Active Debate
          </h2>
          <p className="text-[var(--color-text-tertiary)]">
            Create a new debate to start flowing arguments.
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      {/* Topic header - minimal, clean */}
      <div className="mb-6 text-center">
        <motion.h1
          className="text-2xl font-semibold text-[var(--color-text-primary)] tracking-tight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {currentDebate.topic}
        </motion.h1>
      </div>

      {/* Two-column layout - no borders, just whitespace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px]">
        {/* Affirmative Column */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.3 }}
        >
          <SpeakerColumn side={SIDES.AFFIRMATIVE} />
        </motion.div>

        {/* Negative Column */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <SpeakerColumn side={SIDES.NEGATIVE} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FlowTable;
