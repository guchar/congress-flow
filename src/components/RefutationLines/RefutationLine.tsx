import { motion } from "framer-motion";
import { useMemo } from "react";
import type { RefutationLinkType } from "../../types";

export interface RefutationLineProps {
  /** Source element position */
  sourceRect: DOMRect;
  /** Target element position */
  targetRect: DOMRect;
  /** Type of refutation link */
  type: RefutationLinkType;
  /** Unique key for the line */
  lineKey: string;
  /** Container offset (for relative positioning) */
  containerOffset?: { x: number; y: number };
}

interface BezierPoints {
  startX: number;
  startY: number;
  controlX1: number;
  controlY1: number;
  controlX2: number;
  controlY2: number;
  endX: number;
  endY: number;
}

/**
 * Calculates bezier curve control points for a clean, direct connection between two elements.
 * The curve is subtle and follows the natural flow from source to target.
 */
function calculateBezierPoints(
  sourceRect: DOMRect,
  targetRect: DOMRect,
  containerOffset: { x: number; y: number } = { x: 0, y: 0 },
): BezierPoints {
  // Determine if source is to the left or right of target
  const sourceIsLeft = sourceRect.right < targetRect.left;
  
  // Start point: right edge if source is left, left edge if source is right
  const startX = sourceIsLeft 
    ? sourceRect.right - containerOffset.x 
    : sourceRect.left - containerOffset.x;
  const startY = sourceRect.top + sourceRect.height / 2 - containerOffset.y;

  // End point: left edge if source is left, right edge if source is right
  const endX = sourceIsLeft 
    ? targetRect.left - containerOffset.x 
    : targetRect.right - containerOffset.x;
  const endY = targetRect.top + targetRect.height / 2 - containerOffset.y;

  // Calculate the horizontal distance
  const horizontalDistance = Math.abs(endX - startX);
  
  // Keep a gentle curve - just enough to look smooth, not dramatic
  const curveOffset = Math.min(horizontalDistance * 0.4, 80);
  
  // Control points for a smooth horizontal connection
  const controlX1 = sourceIsLeft ? startX + curveOffset : startX - curveOffset;
  const controlY1 = startY;

  const controlX2 = sourceIsLeft ? endX - curveOffset : endX + curveOffset;
  const controlY2 = endY;

  return {
    startX,
    startY,
    controlX1,
    controlY1,
    controlX2,
    controlY2,
    endX,
    endY,
  };
}

/**
 * Generates an SVG path string for a cubic bezier curve.
 */
function generateBezierPath(points: BezierPoints): string {
  const {
    startX,
    startY,
    controlX1,
    controlY1,
    controlX2,
    controlY2,
    endX,
    endY,
  } = points;
  return `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`;
}

/**
 * Single refutation line component with animation.
 * Renders as a curved bezier path with an arrow head.
 */
export function RefutationLine({
  sourceRect,
  targetRect,
  type: _type,
  lineKey,
  containerOffset = { x: 0, y: 0 },
}: RefutationLineProps) {
  const points = useMemo(
    () => calculateBezierPoints(sourceRect, targetRect, containerOffset),
    [sourceRect, targetRect, containerOffset],
  );

  const path = useMemo(() => generateBezierPath(points), [points]);

  // Color based on refutation type - using red for REF links
  const strokeColor = "#ef4444"; // red-500 for refutation
  const glowColor = "rgba(239, 68, 68, 0.3)";

  // Calculate arrow rotation angle at the end point
  const arrowAngle = useMemo(() => {
    const { controlX2, controlY2, endX, endY } = points;
    return Math.atan2(endY - controlY2, endX - controlX2) * (180 / Math.PI);
  }, [points]);

  return (
    <g>
      {/* Glow effect layer */}
      <motion.path
        d={path}
        fill="none"
        stroke={glowColor}
        strokeWidth={6}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        exit={{ pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { duration: 0.4, ease: "easeOut" },
          opacity: { duration: 0.2 },
        }}
        style={{
          filter: "blur(3px)",
        }}
      />

      {/* Main solid line */}
      <motion.path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2.5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        exit={{ pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { duration: 0.4, ease: "easeOut" },
          opacity: { duration: 0.2 },
        }}
      />

      {/* Arrow at end point */}
      <motion.polygon
        points="0,-5 10,0 0,5"
        fill={strokeColor}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.3, duration: 0.2 }}
        style={{
          transformOrigin: "center",
          transform: `translate(${points.endX}px, ${points.endY}px) rotate(${arrowAngle}deg)`,
        }}
      />
    </g>
  );
}

export default RefutationLine;
