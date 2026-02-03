import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useDebateStore, useSpeakers } from '../../stores/debateStore';
import type { Side } from '../../types';
import { SIDES } from '../../types';

interface AddSpeakerModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal should close */
  onClose: () => void;
  /** The side to add the speaker to */
  side: Side;
}

/**
 * AddSpeakerModal Component
 * 
 * Modal dialog for adding a new speaker to the debate.
 * Pre-selects the side based on which column triggered it.
 */
const AddSpeakerModal: React.FC<AddSpeakerModalProps> = ({ isOpen, onClose, side }) => {
  const [speakerName, setSpeakerName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const { addSpeaker } = useDebateStore();
  const speakers = useSpeakers();

  const isAffirmative = side === SIDES.AFFIRMATIVE;
  const sideName = isAffirmative ? 'Affirmative' : 'Negative';
  const buttonVariant = isAffirmative ? 'affirmative' : 'negative';
  const accentColor = isAffirmative ? 'text-affirmative-400' : 'text-negative-400';

  // Calculate next order number for this side
  const sideSpeakers = speakers.filter((s) => s.side === side);
  const nextOrder = sideSpeakers.length + 1;

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setSpeakerName('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = speakerName.trim();

    if (!trimmedName) {
      setError('Please enter a speaker name');
      return;
    }

    // Check for duplicate names
    const isDuplicate = speakers.some(
      (s) => s.name.toLowerCase() === trimmedName.toLowerCase()
    );

    if (isDuplicate) {
      setError('A speaker with this name already exists');
      return;
    }

    // Add the speaker
    addSpeaker({
      name: trimmedName,
      side,
      order: nextOrder,
    });

    // Close modal
    onClose();
  };

  // Handle key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  // Backdrop animation
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  // Modal animation
  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        damping: 25,
        stiffness: 300,
      },
    },
    exit: { 
      opacity: 0, 
      scale: 0.95,
      y: 20,
      transition: {
        duration: 0.15,
      },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onKeyDown={handleKeyDown}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-md"
          >
            <Card variant="elevated" padding="none" className="overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-background-tertiary`}>
                    <User className={`w-5 h-5 ${accentColor}`} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground-primary">
                      Add Speaker
                    </h2>
                    <p className="text-xs text-foreground-tertiary">
                      <span className={accentColor}>{sideName}</span> • Speaker #{nextOrder}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-5">
                <Input
                  ref={inputRef}
                  label="Speaker Name"
                  placeholder="Enter speaker name..."
                  value={speakerName}
                  onChange={(e) => {
                    setSpeakerName(e.target.value);
                    setError('');
                  }}
                  error={error}
                  autoComplete="off"
                />

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 mt-5">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant={buttonVariant}
                    disabled={!speakerName.trim()}
                  >
                    Add Speaker
                  </Button>
                </div>
              </form>
            </Card>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AddSpeakerModal;
