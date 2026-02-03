import { useState, useRef, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { useDebateStore } from "../../stores/debateStore";
import { useRefutationHoverHandlers } from "../../contexts";
import type { Argument } from "../../types";

interface ArgumentItemProps {
  /** The argument to display */
  argument: Argument;
  /** The speaker ID this argument belongs to */
  speakerId: string;
}

/**
 * Parse REF [SpeakerName] patterns from content
 * Returns the speaker name if found, null otherwise
 */
const parseRefPattern = (content: string): string | null => {
  const refMatch = content.match(/REF\s+(\w+)/i);
  return refMatch ? refMatch[1] : null;
};

/**
 * ArgumentItem Component
 *
 * Simplified argument entry - just a clean text area.
 * Supports REF [Name] shortcut for refutation linking.
 */
const ArgumentItem: React.FC<ArgumentItemProps> = ({ argument, speakerId }) => {
  const [content, setContent] = useState(argument.content);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { updateArgument, deleteArgument, currentDebate } = useDebateStore();
  const { onMouseEnter, onMouseLeave } = useRefutationHoverHandlers();

  // Check for REF pattern and find matching speaker
  const refSpeakerName = useMemo(() => parseRefPattern(content), [content]);

  const refSpeakerId = useMemo(() => {
    if (!refSpeakerName || !currentDebate) return null;
    const speaker = currentDebate.speakers.find(
      (s) => s.name.toLowerCase() === refSpeakerName.toLowerCase(),
    );
    return speaker?.id ?? null;
  }, [refSpeakerName, currentDebate]);

  const hasRefutation = !!refSpeakerId || !!argument.refutesSpeaker;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // Handle content change
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  // Handle content blur (save)
  const handleContentBlur = () => {
    if (content !== argument.content) {
      // Update content and refutesSpeaker if REF pattern found
      updateArgument(argument.id, {
        content,
        refutesSpeaker: refSpeakerId ?? undefined,
      });
    }
  };

  // Handle delete
  const handleDelete = () => {
    deleteArgument(argument.id);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`
        relative group
        bg-white/60
        rounded-md
        transition-all duration-200
        hover:bg-white/80
        ${hasRefutation ? "border-l-2 border-l-[var(--color-refutation)]" : "border-l-2 border-l-transparent"}
      `}
      data-argument-id={argument.id}
      data-speaker-id={speakerId}
      data-refutes-speaker={
        argument.refutesSpeaker || refSpeakerId || undefined
      }
      onMouseEnter={() => onMouseEnter(argument.id)}
      onMouseLeave={onMouseLeave}
    >
      {/* Delete button - top right, only on hover */}
      <button
        onClick={handleDelete}
        className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-black/5 rounded z-10"
        aria-label="Delete argument"
      >
        <Trash2 className="w-3 h-3 text-[var(--color-text-tertiary)]" />
      </button>

      {/* Content area */}
      <textarea
        ref={textareaRef}
        value={content}
        onChange={handleContentChange}
        onBlur={handleContentBlur}
        placeholder="Enter argument..."
        className={`
          w-full bg-transparent
          text-sm text-[var(--color-text-primary)]
          placeholder:text-[var(--color-text-tertiary)]
          placeholder:italic
          resize-none outline-none border-none
          min-h-[32px] p-2
          focus:outline-none focus:ring-0 focus:border-none
        `}
        rows={1}
      />
    </motion.div>
  );
};

export default ArgumentItem;
