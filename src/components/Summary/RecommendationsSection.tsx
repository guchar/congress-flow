import { motion } from 'framer-motion';
import { ArrowRight, Lightbulb, Target } from 'lucide-react';

interface RecommendationsSectionProps {
  recommendations: string[];
}

interface RecommendationItemProps {
  recommendation: string;
  index: number;
}

const RecommendationItem = ({ recommendation, index }: RecommendationItemProps) => {
  // Determine icon based on content
  const getIcon = () => {
    const lower = recommendation.toLowerCase();
    if (lower.includes('address') || lower.includes('respond') || lower.includes('attack')) {
      return Target;
    }
    return ArrowRight;
  };

  const Icon = getIcon();

  return (
    <motion.li
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors group"
    >
      <div className="p-1.5 rounded-md bg-[var(--color-accent)]/10 group-hover:bg-[var(--color-accent)]/20 transition-colors flex-shrink-0 mt-0.5">
        <Icon className="w-3.5 h-3.5 text-[var(--color-accent)]" />
      </div>
      <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
        {recommendation}
      </p>
    </motion.li>
  );
};

/**
 * Displays actionable recommendations for the debate.
 */
export const RecommendationsSection = ({
  recommendations,
}: RecommendationsSectionProps) => {
  // Categorize recommendations if possible (basic heuristic)
  const categorizedRecs = recommendations.reduce(
    (acc, rec) => {
      const lower = rec.toLowerCase();
      if (lower.includes('affirmative') || lower.includes('aff ')) {
        acc.affirmative.push(rec);
      } else if (lower.includes('negative') || lower.includes('neg ')) {
        acc.negative.push(rec);
      } else {
        acc.general.push(rec);
      }
      return acc;
    },
    { affirmative: [] as string[], negative: [] as string[], general: [] as string[] }
  );

  const hasCategories =
    categorizedRecs.affirmative.length > 0 || categorizedRecs.negative.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="w-4 h-4 text-[var(--color-text-secondary)]" />
        <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
          Recommendations
        </h3>
        <span className="text-xs text-[var(--color-text-tertiary)]">
          ({recommendations.length} items)
        </span>
      </div>

      {recommendations.length > 0 ? (
        hasCategories ? (
          <div className="space-y-4">
            {/* Affirmative Recommendations */}
            {categorizedRecs.affirmative.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--color-affirmative)' }}
                  />
                  <span className="text-xs font-medium text-[var(--color-affirmative)] uppercase tracking-wider">
                    For Affirmative
                  </span>
                </div>
                <ul className="space-y-1">
                  {categorizedRecs.affirmative.map((rec, i) => (
                    <RecommendationItem key={`aff-rec-${i}`} recommendation={rec} index={i} />
                  ))}
                </ul>
              </div>
            )}

            {/* Negative Recommendations */}
            {categorizedRecs.negative.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--color-negative)' }}
                  />
                  <span className="text-xs font-medium text-[var(--color-negative)] uppercase tracking-wider">
                    For Negative
                  </span>
                </div>
                <ul className="space-y-1">
                  {categorizedRecs.negative.map((rec, i) => (
                    <RecommendationItem
                      key={`neg-rec-${i}`}
                      recommendation={rec}
                      index={i + categorizedRecs.affirmative.length}
                    />
                  ))}
                </ul>
              </div>
            )}

            {/* General Recommendations */}
            {categorizedRecs.general.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: 'var(--color-text-tertiary)' }}
                  />
                  <span className="text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                    General
                  </span>
                </div>
                <ul className="space-y-1">
                  {categorizedRecs.general.map((rec, i) => (
                    <RecommendationItem
                      key={`gen-rec-${i}`}
                      recommendation={rec}
                      index={
                        i +
                        categorizedRecs.affirmative.length +
                        categorizedRecs.negative.length
                      }
                    />
                  ))}
                </ul>
              </div>
            )}
          </div>
        ) : (
          <ul className="space-y-1">
            {recommendations.map((rec, i) => (
              <RecommendationItem key={`rec-${i}`} recommendation={rec} index={i} />
            ))}
          </ul>
        )
      ) : (
        <p className="text-sm text-[var(--color-text-tertiary)] italic">
          No recommendations available
        </p>
      )}
    </div>
  );
};
