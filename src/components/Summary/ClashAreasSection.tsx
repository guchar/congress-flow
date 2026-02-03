import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle2, CircleDot, Swords } from 'lucide-react';
import type { ClashArea, ClashStatus } from '../../types';
import { CLASH_STATUS } from '../../types';

interface ClashAreasSectionProps {
  clashAreas: ClashArea[];
}

interface StatusBadgeProps {
  status: ClashStatus;
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const config: Record<
    ClashStatus,
    { label: string; color: string; bg: string; icon: typeof CheckCircle2 }
  > = {
    [CLASH_STATUS.RESOLVED]: {
      label: 'Resolved',
      color: 'var(--color-success)',
      bg: 'rgba(16, 185, 129, 0.1)',
      icon: CheckCircle2,
    },
    [CLASH_STATUS.CONTESTED]: {
      label: 'Contested',
      color: 'var(--color-warning)',
      bg: 'rgba(245, 158, 11, 0.1)',
      icon: AlertTriangle,
    },
    [CLASH_STATUS.UNADDRESSED]: {
      label: 'Unaddressed',
      color: 'var(--color-error)',
      bg: 'rgba(239, 68, 68, 0.1)',
      icon: CircleDot,
    },
  };

  const { label, color, bg, icon: Icon } = config[status];

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ color, backgroundColor: bg }}
    >
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
};

interface ClashCardProps {
  clash: ClashArea;
  index: number;
}

const ClashCard = ({ clash, index }: ClashCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="p-4 rounded-lg bg-[var(--color-bg-tertiary)] border border-[var(--color-border-subtle)]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h4 className="text-sm font-medium text-[var(--color-text-primary)]">
          {clash.topic}
        </h4>
        <StatusBadge status={clash.status} />
      </div>

      {/* Positions */}
      <div className="space-y-3">
        {/* Affirmative Position */}
        <div
          className="p-3 rounded-md"
          style={{ backgroundColor: 'var(--color-affirmative-subtle)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-affirmative)' }}
            />
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--color-affirmative)' }}
            >
              Affirmative
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
            {clash.affirmativePosition}
          </p>
        </div>

        {/* VS Divider */}
        <div className="flex items-center justify-center">
          <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
          <span className="px-2 text-xs text-[var(--color-text-tertiary)]">
            vs
          </span>
          <div className="flex-1 h-px bg-[var(--color-border-subtle)]" />
        </div>

        {/* Negative Position */}
        <div
          className="p-3 rounded-md"
          style={{ backgroundColor: 'var(--color-negative-subtle)' }}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: 'var(--color-negative)' }}
            />
            <span
              className="text-xs font-medium uppercase tracking-wider"
              style={{ color: 'var(--color-negative)' }}
            >
              Negative
            </span>
          </div>
          <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">
            {clash.negativePosition}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Displays areas of clash between the two sides.
 */
export const ClashAreasSection = ({ clashAreas }: ClashAreasSectionProps) => {
  // Sort by status: unaddressed first, then contested, then resolved
  const sortedClashes = [...clashAreas].sort((a, b) => {
    const order: Record<ClashStatus, number> = {
      [CLASH_STATUS.UNADDRESSED]: 0,
      [CLASH_STATUS.CONTESTED]: 1,
      [CLASH_STATUS.RESOLVED]: 2,
    };
    return order[a.status] - order[b.status];
  });

  // Count by status
  const statusCounts = clashAreas.reduce(
    (acc, clash) => {
      acc[clash.status] = (acc[clash.status] || 0) + 1;
      return acc;
    },
    {} as Record<ClashStatus, number>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Swords className="w-4 h-4 text-[var(--color-text-secondary)]" />
          <h3 className="text-sm font-medium text-[var(--color-text-primary)]">
            Areas of Clash
          </h3>
        </div>

        {/* Status Summary */}
        <div className="flex items-center gap-2">
          {statusCounts[CLASH_STATUS.RESOLVED] && (
            <span className="text-xs text-[var(--color-success)]">
              {statusCounts[CLASH_STATUS.RESOLVED]} resolved
            </span>
          )}
          {statusCounts[CLASH_STATUS.CONTESTED] && (
            <span className="text-xs text-[var(--color-warning)]">
              {statusCounts[CLASH_STATUS.CONTESTED]} contested
            </span>
          )}
          {statusCounts[CLASH_STATUS.UNADDRESSED] && (
            <span className="text-xs text-[var(--color-error)]">
              {statusCounts[CLASH_STATUS.UNADDRESSED]} unaddressed
            </span>
          )}
        </div>
      </div>

      {clashAreas.length > 0 ? (
        <div className="space-y-3">
          {sortedClashes.map((clash, i) => (
            <ClashCard key={`clash-${i}`} clash={clash} index={i} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-text-tertiary)] italic">
          No areas of clash identified yet
        </p>
      )}
    </div>
  );
};
