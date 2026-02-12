import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, ChevronRight, Loader2, Sparkles, ChevronLeft, Maximize2, Minimize2 } from "lucide-react";
import { useState } from "react";
import { useDebateSummary } from "../../hooks/useDebateSummary";
import { useCurrentDebate } from "../../stores/debateStore";
import { Button } from "../ui/Button";
import { ClashAreasSection } from "./ClashAreasSection";
import { MajorArgumentsSection } from "./MajorArgumentsSection";
import { RecommendationsSection } from "./RecommendationsSection";

interface SummaryPanelProps {
  onScrollToArgument?: (speakerNames: string[]) => void;
}

/**
 * Fixed sidebar panel for displaying AI-generated debate summaries.
 * Always visible on the right side, auto-generates content.
 */
export const SummaryPanel = ({ onScrollToArgument }: SummaryPanelProps) => {
  const currentDebate = useCurrentDebate();
  const {
    summary,
    isLoading,
    error,
    generateSummary,
    clearSummary,
    isConfigured,
    cooldownMessage,
  } = useDebateSummary();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const hasArguments =
    currentDebate?.speakers.some((s) => s.arguments.length > 0) ?? false;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 20 }}
      animate={{ 
        opacity: 1, 
        x: 0,
        width: isCollapsed ? "48px" : isExpanded ? "480px" : "320px"
      }}
      transition={{ duration: 0.3 }}
      className="h-full bg-white flex flex-col overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--color-border-subtle)]">
        <AnimatePresence mode="wait">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-3"
            >
              <div className="p-2 rounded-xl bg-[var(--color-accent)]/10">
                <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-[var(--color-text-primary)]">
                  The Round So Far
                </h2>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Control Buttons */}
        <div className="flex items-center gap-1">
          {!isCollapsed && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
              title={isExpanded ? "Normal size" : "Expand"}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4 text-[var(--color-text-secondary)]" />
              ) : (
                <Maximize2 className="w-4 h-4 text-[var(--color-text-secondary)]" />
              )}
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? (
              <ChevronLeft className="w-4 h-4 text-[var(--color-text-secondary)]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[var(--color-text-secondary)]" />
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto px-5"
          >
            {/* API Key Warning */}
            {!isConfigured && (
              <div className="mb-4 mt-4 p-4 rounded-xl bg-amber-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">
                      Gemini API Key Required
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Add your API key to{" "}
                      <code className="px-1 py-0.5 rounded bg-amber-100 font-mono text-[10px]">
                        VITE_GEMINI_API_KEY
                      </code>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* No Debate State */}
            {!currentDebate && (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <p className="text-sm text-[var(--color-text-tertiary)]">
                  Start a debate to see AI analysis
                </p>
              </div>
            )}

            {/* No Arguments State */}
            {currentDebate && !hasArguments && (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <p className="text-sm text-[var(--color-text-tertiary)]">
                  Add arguments to generate insights
                </p>
              </div>
            )}

            {/* Generate Button */}
            {currentDebate && hasArguments && !summary && !isLoading && (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="p-3 rounded-full bg-[var(--color-accent)]/10 mb-4">
                  <Sparkles className="w-6 h-6 text-[var(--color-accent)]" />
                </div>
                <h3 className="text-sm font-medium text-[var(--color-text-primary)] mb-2">
                  Ready to Analyze
                </h3>
                <p className="text-xs text-[var(--color-text-tertiary)] mb-4 max-w-[200px]">
                  Generate AI insights on arguments, clashes, and recommendations
                </p>
                <Button
                  onClick={generateSummary}
                  disabled={!isConfigured}
                  size="sm"
                  className="gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Generate
                </Button>
                
                {/* AI Disclaimer */}
                <div className="mt-4 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-800 leading-relaxed">
                    This is a new tool. It will not work perfectly, errors may arise.
                  </p>
                </div>
              </div>
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="flex flex-col items-center justify-center h-48 text-center">
                <Loader2 className="w-6 h-6 text-[var(--color-accent)] animate-spin mb-3" />
                <p className="text-sm text-[var(--color-text-tertiary)]">
                  Analyzing...
                </p>
              </div>
            )}

            {/* Error State */}
            {cooldownMessage && !isLoading && (
              <div className="mb-4 mt-4 p-4 rounded-xl bg-amber-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-800">Please wait</p>
                    <p className="text-xs text-amber-700 mt-1">{cooldownMessage}</p>
                  </div>
                </div>
              </div>
            )}
            {error && !isLoading && (
              <div className="mb-4 mt-4 p-4 rounded-xl bg-red-50">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">
                      Generation failed
                    </p>
                    <p className="text-xs text-red-600 mt-1">{error.message}</p>
                    <button
                      onClick={generateSummary}
                      className="mt-2 text-xs text-[var(--color-accent)] hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Summary Content */}
            {summary && !isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 py-4 pb-6"
              >
                {/* Overall Assessment */}
                <div className="p-4 rounded-xl bg-[var(--color-bg-tertiary)]">
                  <h3 className="text-xs font-medium text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2">
                    Assessment
                  </h3>
                  <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
                    {summary.overallAssessment}
                  </p>
                </div>

                {/* Recommendations - Moved up after assessment */}
                <RecommendationsSection recommendations={summary.recommendations} />

                {/* Major Arguments */}
                <MajorArgumentsSection
                  arguments={summary.majorArguments}
                  onArgumentClick={onScrollToArgument}
                />

                {/* Areas of Clash */}
                <ClashAreasSection clashAreas={summary.areasOfClash} />

                {/* Regenerate Button */}
                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => {
                      clearSummary();
                      generateSummary();
                    }}
                    className="flex items-center gap-2 text-xs text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Regenerate
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* AI Disclaimer at Bottom */}
                <div className="mt-4 px-3 py-2 rounded-lg bg-amber-50 border border-amber-200">
                  <p className="text-xs text-amber-800 leading-relaxed text-center">
                    This is a new tool. It will not work perfectly, errors may arise.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.aside>
  );
};
