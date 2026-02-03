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
 * Calculates bezier curve control points for a smooth arc between two elements.
 * The curve arcs upward (over the content) for better visibility.
 */
function calculateBezierPoints(
  sourceRect: DOMRect,
  targetRect: DOMRect,
  containerOffset: { x: number; y: number } = { x: 0, y: 0 },
): BezierPoints {
  // Start from the right edge center of source
  const startX = sourceRect.right - containerOffset.x;
  const startY = sourceRect.top + sourceRect.height / 2 - containerOffset.y;

  // End at the left edge center of target
  const endX = targetRect.left - containerOffset.x;
  const endY = targetRect.top + targetRect.height / 2 - containerOffset.y;

  // Calculate the horizontal distance
  const horizontalDistance = Math.abs(endX - startX);
  const verticalDistance = Math.abs(endY - startY);

  // Determine if we should arc up or down based on relative positions
  const arcDirection = startY > endY ? -1 : 1;

  // Calculate curve intensity based on distance
  const curveIntensity = Math.min(horizontalDistance * 0.3, 150);
  const verticalOffset =
    Math.max(curveIntensity, verticalDistance * 0.5) * arcDirection;

  // Control points create a smooth S-curve or arc
  const midY = (startY + endY) / 2 - verticalOffset;

  // For a cubic bezier, we need two control points
  const controlX1 = startX + horizontalDistance * 0.25;
  const controlY1 = midY;

  const controlX2 = endX - horizontalDistance * 0.25;
  const controlY2 = midY;

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

  // Arrow marker ID
  const arrowId = `arrow-${lineKey}`;

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
        strokeWidth={8}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        exit={{ pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { duration: 0.5, ease: "easeOut" },
          opacity: { duration: 0.2 },
        }}
        style={{
          filter: "blur(4px)",
        }}
      />

      {/* Main line with dash animation */}
      <motion.path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={2}
        strokeLinecap="round"
        strokeDasharray="8 4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: 1,
          opacity: 1,
          strokeDashoffset: [0, -24],
        }}
        exit={{ pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { duration: 0.5, ease: "easeOut" },
          opacity: { duration: 0.2 },
          strokeDashoffset: {
            duration: 1,
            ease: "linear",
            repeat: Infinity,
          },
        }}
      />

      {/* Solid core line */}
      <motion.path
        d={path}
        fill="none"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.6 }}
        exit={{ pathLength: 0, opacity: 0 }}
        transition={{
          pathLength: { duration: 0.5, ease: "easeOut" },
          opacity: { duration: 0.2 },
        }}
      />

      {/* Arrow head at target */}
      <defs>
        <marker
          id={arrowId}
          markerWidth="10"
          markerHeight="10"
          refX="9"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <motion.path
            d="M 0 0 L 10 5 L 0 10 L 3 5 Z"
            fill={strokeColor}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
            transition={{ delay: 0.3, duration: 0.2 }}
          />
        </marker>
      </defs>

      {/* Arrow at end point */}
      <motion.polygon
        points="0,-6 12,0 0,6"
        fill={strokeColor}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{ delay: 0.4, duration: 0.2 }}
        style={{
          transformOrigin: "center",
          transform: `translate(${points.endX}px, ${points.endY}px) rotate(${arrowAngle}deg)`,
        }}
      />
    </g>
  );
}

export default RefutationLine;
