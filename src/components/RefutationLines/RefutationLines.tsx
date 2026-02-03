import { createPortal } from 'react-dom';
import { AnimatePresence } from 'framer-motion';
import { useMemo, useState, useEffect } from 'react';
import { RefutationLine } from './RefutationLine';
import type { RefutationLink } from '../../types';
import type { ArgumentPositionMap } from '../../hooks/useArgumentPositions';

export interface RefutationLinesProps {
  /** Map of argument IDs to their DOM positions */
  positions: ArgumentPositionMap;
  /** Links to render (filtered for hovered argument) */
  links: RefutationLink[];
  /** The currently hovered argument ID */
  hoveredArgumentId: string | null;
  /** Whether to use a portal for rendering (renders at document level) */
  usePortal?: boolean;
}

/**
 * SVG overlay component that renders curved bezier lines
 * connecting arguments that have refutation relationships.
 * 
 * Renders as an absolutely positioned SVG covering the viewport.
 * Lines only appear when an argument is being hovered.
 */
export function RefutationLines({
  positions,
  links,
  hoveredArgumentId,
  usePortal = true,
}: RefutationLinesProps) {
  const [viewportSize, setViewportSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  // Update viewport size on resize
  useEffect(() => {
    const handleResize = () => {
      setViewportSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Filter links to only show those with valid positions
  const validLinks = useMemo(() => {
    return links.filter((link) => {
      const sourceRect = positions.get(link.sourceArgumentId);
      const targetRect = positions.get(link.targetArgumentId);
      return sourceRect && targetRect;
    });
  }, [links, positions]);

  // Don't render anything if no argument is hovered or no valid links
  if (!hoveredArgumentId || validLinks.length === 0) {
    return null;
  }

  const svgContent = (
    <svg
      className="fixed inset-0 pointer-events-none"
      style={{
        width: viewportSize.width,
        height: viewportSize.height,
        zIndex: 9999,
      }}
      viewBox={`0 0 ${viewportSize.width} ${viewportSize.height}`}
      preserveAspectRatio="none"
    >
      <AnimatePresence mode="sync">
        {validLinks.map((link) => {
          const sourceRect = positions.get(link.sourceArgumentId);
          const targetRect = positions.get(link.targetArgumentId);

          if (!sourceRect || !targetRect) return null;

          const lineKey = `${link.sourceArgumentId}-${link.targetArgumentId}-${link.type}`;

          return (
            <RefutationLine
              key={lineKey}
              lineKey={lineKey}
              sourceRect={sourceRect}
              targetRect={targetRect}
              type={link.type}
            />
          );
        })}
      </AnimatePresence>
    </svg>
  );

  // Optionally render through a portal at document level
  if (usePortal && typeof document !== 'undefined') {
    return createPortal(svgContent, document.body);
  }

  return svgContent;
}

/**
 * Wrapper component that includes highlighted argument styling.
 * Can be used to dim non-connected arguments while hovering.
 */
export interface RefutationLinesWithHighlightProps extends RefutationLinesProps {
  /** Set of argument IDs that are connected to the hovered argument */
  connectedArgumentIds: Set<string>;
  /** CSS class to apply to connected arguments */
  connectedClassName?: string;
  /** CSS class to apply to non-connected arguments */
  dimmedClassName?: string;
}

export function RefutationLinesWithHighlight({
  positions,
  links,
  hoveredArgumentId,
  connectedArgumentIds,
  usePortal = true,
}: RefutationLinesWithHighlightProps) {
  // Apply CSS classes to argument elements based on connection status
  useEffect(() => {
    if (!hoveredArgumentId) {
      // Remove all highlight classes when not hovering
      document.querySelectorAll('[data-argument-id]').forEach((el) => {
        el.classList.remove('refutation-connected', 'refutation-dimmed', 'refutation-hovered');
      });
      return;
    }

    document.querySelectorAll('[data-argument-id]').forEach((el) => {
      const argumentId = el.getAttribute('data-argument-id');
      if (!argumentId) return;

      // Reset classes
      el.classList.remove('refutation-connected', 'refutation-dimmed', 'refutation-hovered');

      if (argumentId === hoveredArgumentId) {
        el.classList.add('refutation-hovered');
      } else if (connectedArgumentIds.has(argumentId)) {
        el.classList.add('refutation-connected');
      } else {
        el.classList.add('refutation-dimmed');
      }
    });

    // Cleanup on unmount or when hover changes
    return () => {
      document.querySelectorAll('[data-argument-id]').forEach((el) => {
        el.classList.remove('refutation-connected', 'refutation-dimmed', 'refutation-hovered');
      });
    };
  }, [hoveredArgumentId, connectedArgumentIds]);

  return (
    <RefutationLines
      positions={positions}
      links={links}
      hoveredArgumentId={hoveredArgumentId}
      usePortal={usePortal}
    />
  );
}

export default RefutationLines;
