import { motion } from 'framer-motion';
import { ChevronRight, TrendingUp } from 'lucide-react';
import type { MajorArgument } from '../../types';
import { SIDES } from '../../types';

interface MajorArgumentsSectionProps {
  arguments: MajorArgument[];
  onArgumentClick?: (argumentId: string) => void;
}

interface ArgumentCardProps {
  argument: MajorArgument;
  index: number;
  onClick?: () => void;
}

const ArgumentCard = ({ argument, index, onClick }: ArgumentCardProps) => {
  const isAffirmative = argument.side === SIDES.AFFIRMATIVE;
  const sideColor = isAffirmative
    ? 'var(--color-affirmative)'
    : 'var(--color-negative)';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      onClick={onClick}
      className={`
        p-3 rounded-lg border border-[var(--color-border-subtle)]
        bg-[var(--color-bg-tertiary)] hover:bg-[var(--color-bg-elevated)]
        transition-colors cursor-pointer group
      `}
      style={{
        borderLeftWidth: '3px',
        borderLeftColor: sideColor,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm text-[var(--color-text-primary)] leading-relaxed flex-1">
          {argument.argument}
        </p>
        <ChevronRight className="w-4 h-4 text-[var(--color-text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 mt-0.5" />
      </div>

      {/* Strength Indicator */}
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-1.5 bg-[var(--color-bg-primary)] rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${argument.strength}%` }}
            transition={{ duration: 0.5, delay: index * 0.05 + 0.2 }}
            className="h-full rounded-full"
            style={{ backgroundColor: sideColor }}
          />
        </div>
        <span
          className="text-xs font-medium tabular-nums"
          style={{ color: sideColor }}
        >
          {argument.strength}%
        </span>
      </div>
    </motion.div>
  );
};

/**
 * Displays major arguments grouped by side with strength indicators.
 */
export const MajorArgumentsSection = ({
  arguments: args,
  onArgumentClick,
}: MajorArgumentsSectionProps) => {
  const affirmativeArgs = args.filter((a) => a.side === SIDES.AFFIRMATIVE);
  const negativeArgs = args.filter((a) => a.side === SIDES.NEGATIVE);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-[var(--color-text-secondary)]" />
        <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
          Major Arguments
        </h3>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {/* Affirmative Arguments */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-affirmative)' }}
            />
            <span className="text-xs font-medium text-[var(--color-affirmative)] uppercase tracking-wider">
              Affirmative
            </span>
            <span className="text-xs text-[var(--color-text-tertiary)]">
              ({affirmativeArgs.length} arguments)
            </span>
          </div>
          {affirmativeArgs.length > 0 ? (
            <div className="space-y-2">
              {affirmativeArgs.map((arg, i) => (
                <ArgumentCard
                  key={`aff-${i}`}
                  argument={arg}
                  index={i}
                  onClick={onArgumentClick ? () => onArgumentClick(`aff-${i}`) : undefined}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-tertiary)] italic">
              No major arguments identified
            </p>
          )}
        </div>

        {/* Negative Arguments */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: 'var(--color-negative)' }}
            />
            <span className="text-xs font-medium text-[var(--color-negative)] uppercase tracking-wider">
              Negative
            </span>
            <span className="text-xs text-[var(--color-text-tertiary)]">
              ({negativeArgs.length} arguments)
            </span>
          </div>
          {negativeArgs.length > 0 ? (
            <div className="space-y-2">
              {negativeArgs.map((arg, i) => (
                <ArgumentCard
                  key={`neg-${i}`}
                  argument={arg}
                  index={i + affirmativeArgs.length}
                  onClick={onArgumentClick ? () => onArgumentClick(`neg-${i}`) : undefined}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-[var(--color-text-tertiary)] italic">
              No major arguments identified
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
