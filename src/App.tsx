import { useRef, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Gavel, ArrowRight, Sparkles, Users, Link2 } from "lucide-react";

// Components
import { Header } from "./components/Header";
import { FlowTable } from "./components/FlowTable";
import { SummaryPanel } from "./components/Summary";
import { RefutationLinesWithHighlight } from "./components/RefutationLines";
import { SavedFlowsSidebar } from "./components/SavedFlowsSidebar";
import { Button } from "./components/ui/Button";
import { NewDebateModal } from "./components/NewDebateModal";

// Contexts
import { RefutationProvider } from "./contexts";

// Hooks
import { useArgumentPositions } from "./hooks/useArgumentPositions";
import {
  useRefutationHighlight,
  useArgumentHoverHandlers,
} from "./hooks/useRefutationHighlight";

// Store
import { useCurrentDebate, useDebateStore } from "./stores/debateStore";

/**
 * Welcome screen shown when no debate is active.
 * Clean, Apple-inspired design.
 */
const WelcomeScreen = ({ onStartDebate }: { onStartDebate: () => void }) => {
  const features = [
    {
      icon: Users,
      title: "Track Speakers",
      description: "Record arguments in real-time with post-it note cards",
    },
    {
      icon: Link2,
      title: "Link Refutations",
      description: "Type REF [Name] to connect arguments visually",
    },
    {
      icon: Sparkles,
      title: "AI Summaries",
      description: "Auto-generated insights, clashes, and recommendations",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex-1 flex items-center justify-center p-8"
    >
      <div className="max-w-lg w-full text-center">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10"
        >
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex p-4 rounded-2xl bg-[var(--color-accent)]/10 mb-6"
          >
            <Gavel className="w-10 h-10 text-[var(--color-accent)]" />
          </motion.div>

          <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3 tracking-tight">
            Congress Flow
          </h1>
          <p className="text-base text-[var(--color-text-secondary)] max-w-sm mx-auto">
            The modern way to flow Congressional Debate with AI-powered
            insights.
          </p>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <Button
            variant="primary"
            size="lg"
            rightIcon={<ArrowRight className="w-5 h-5" />}
            onClick={onStartDebate}
          >
            Start New Debate
          </Button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 gap-3"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-4 p-4 rounded-xl bg-white shadow-[var(--shadow-card)] text-left"
            >
              <div className="p-2 rounded-lg bg-[var(--color-bg-tertiary)]">
                <feature.icon className="w-5 h-5 text-[var(--color-text-secondary)]" />
              </div>
              <div>
                <h3 className="font-medium text-[var(--color-text-primary)]">
                  {feature.title}
                </h3>
                <p className="text-sm text-[var(--color-text-tertiary)]">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
};

/**
 * Main application component.
 * Three-column layout: Saved Flows | Flow Table | AI Summary
 */
function App() {
  // References
  const flowTableRef = useRef<HTMLDivElement>(null);

  // Modal state
  const [isNewDebateModalOpen, setIsNewDebateModalOpen] = useState(false);

  // Store
  const currentDebate = useCurrentDebate();
  const hasDebate = !!currentDebate;

  // Hooks for refutation visualization
  const positions = useArgumentPositions(flowTableRef);
  const {
    hoveredArgumentId,
    setHoveredArgumentId,
    allRelevantLinks,
    connectedArgumentIds,
  } = useRefutationHighlight();

  // Get hover handlers for ArgumentItem components
  const { handleMouseEnter, handleMouseLeave } =
    useArgumentHoverHandlers(setHoveredArgumentId);

  // Scroll to argument handler for summary panel
  const handleScrollToArgument = useCallback(
    (argumentId: string) => {
      const element = document.querySelector(
        `[data-argument-id="${argumentId}"]`,
      );
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        setHoveredArgumentId(argumentId);
        setTimeout(() => setHoveredArgumentId(null), 2000);
      }
    },
    [setHoveredArgumentId],
  );

  // Handle new debate creation - open modal
  const handleStartDebate = useCallback(() => {
    setIsNewDebateModalOpen(true);
  }, []);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement
    ) {
      return;
    }

    // N - New debate
    if (e.key === "n" || e.key === "N") {
      setIsNewDebateModalOpen(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="h-screen flex flex-col bg-[var(--color-bg-secondary)]">
      {/* Header */}
      <Header onNewDebate={handleStartDebate} />

      {/* Main 3-column layout */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Saved Flows Sidebar */}
        <SavedFlowsSidebar onNewDebate={handleStartDebate} />

        {/* Center: Flow Table */}
        <div className="flex-1 overflow-auto">
          {!hasDebate ? (
            <WelcomeScreen onStartDebate={handleStartDebate} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6"
            >
              <RefutationProvider
                onArgumentMouseEnter={handleMouseEnter}
                onArgumentMouseLeave={handleMouseLeave}
              >
                <div ref={flowTableRef}>
                  <FlowTable />
                </div>
              </RefutationProvider>
            </motion.div>
          )}
        </div>

        {/* Right: AI Summary Panel (always visible) */}
        {hasDebate && (
          <div className="w-[320px] border-l border-[var(--color-border-subtle)] flex-shrink-0">
            <SummaryPanel onScrollToArgument={handleScrollToArgument} />
          </div>
        )}
      </main>

      {/* Refutation Lines Overlay */}
      <RefutationLinesWithHighlight
        positions={positions}
        links={allRelevantLinks}
        hoveredArgumentId={hoveredArgumentId}
        connectedArgumentIds={connectedArgumentIds}
      />

      {/* New Debate Modal */}
      <NewDebateModal
        isOpen={isNewDebateModalOpen}
        onClose={() => setIsNewDebateModalOpen(false)}
      />
    </div>
  );
}

export default App;
