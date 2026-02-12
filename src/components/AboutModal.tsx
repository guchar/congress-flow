import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * About modal explaining the purpose and mission of Congress Flow.
 * Displays information about Sandel Academy's vision for flowing.
 */
export function AboutModal({ isOpen, onClose }: AboutModalProps) {
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

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)]">
                <div className="flex items-center gap-3">
                  <img 
                    src="/images/sandel-logo.png" 
                    alt="Sandel Academy" 
                    className="h-10 w-auto"
                  />
                  <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
                    About Congress Flow
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
                >
                  <X className="w-5 h-5 text-[var(--color-text-secondary)]" />
                </button>
              </div>

              {/* Content */}
              <div className="px-6 py-6 overflow-y-auto max-h-[calc(80vh-80px)]">
                <div className="space-y-4">
                  <div className="p-6 rounded-xl bg-gradient-to-br from-[var(--color-accent)]/5 to-[var(--color-accent)]/10 border border-[var(--color-accent)]/20">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-3">
                      Our Mission
                    </h3>
                    <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                      Here at Sandel Academy, we're strong believers in the importance of flowing as 
                      a fundamental skill for becoming the best Congressional debater you can be. 
                      Flowing isn't just about taking notes—it's about understanding the intricate 
                      web of arguments, recognizing clash points, and strategically positioning your 
                      contributions in the round.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      Why We Built This
                    </h3>
                    <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                      Traditional flowing methods can be overwhelming, especially when rounds become 
                      fast-paced and complex. We created Congress Flow to modernize the flowing 
                      experience, making it more intuitive, visual, and insightful. Our platform helps 
                      you:
                    </p>
                    <ul className="space-y-2 ml-4">
                      <li className="flex items-start gap-2 text-base text-[var(--color-text-secondary)]">
                        <span className="text-[var(--color-accent)] mt-1">•</span>
                        <span>Track every speaker and argument with clear, organized cards</span>
                      </li>
                      <li className="flex items-start gap-2 text-base text-[var(--color-text-secondary)]">
                        <span className="text-[var(--color-accent)] mt-1">•</span>
                        <span>Visualize refutation links and see how arguments connect</span>
                      </li>
                      <li className="flex items-start gap-2 text-base text-[var(--color-text-secondary)]">
                        <span className="text-[var(--color-accent)] mt-1">•</span>
                        <span>Get AI-powered insights to identify clash areas and strategic opportunities</span>
                      </li>
                      <li className="flex items-start gap-2 text-base text-[var(--color-text-secondary)]">
                        <span className="text-[var(--color-accent)] mt-1">•</span>
                        <span>Save and review past rounds to continuously improve your skills</span>
                      </li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      The Sandel Academy Difference
                    </h3>
                    <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                      At Sandel Academy, we combine traditional debate excellence with modern technology. 
                      Our approach emphasizes deep understanding of argumentation, critical thinking, and 
                      strategic communication. Congress Flow embodies these values by providing tools that 
                      enhance your analytical capabilities while preserving the intellectual rigor that 
                      makes Congressional Debate such a valuable activity.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-[var(--color-text-primary)]">
                      For Debaters, By Debaters
                    </h3>
                    <p className="text-base text-[var(--color-text-secondary)] leading-relaxed">
                      This tool was designed with real Congressional debaters in mind. We understand 
                      the challenges of keeping up with rapid-fire arguments, tracking multiple speakers, 
                      and finding your moment to contribute effectively. Whether you're preparing for your 
                      first tournament or competing at nationals, Congress Flow is here to support your 
                      journey to becoming a more effective, strategic, and confident debater.
                    </p>
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-[var(--color-bg-tertiary)]">
                    <p className="text-sm text-[var(--color-text-tertiary)] text-center">
                      Ready to elevate your flowing game? Start a new debate and experience 
                      the future of Congressional Debate flowing.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
