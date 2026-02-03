import { useState, useEffect, useCallback, useRef } from "react";

export interface ArgumentPosition {
  id: string;
  rect: DOMRect;
}

export type ArgumentPositionMap = Map<string, DOMRect>;
export type SpeakerPositionMap = Map<string, DOMRect>;

export interface PositionMaps {
  arguments: ArgumentPositionMap;
  speakers: SpeakerPositionMap;
}

/**
 * Hook to track DOM positions of argument and speaker elements.
 * Uses ResizeObserver and MutationObserver to detect changes.
 *
 * @param containerRef - Reference to the container element (FlowTable)
 * @param argumentSelector - CSS selector to find argument elements (default: '[data-argument-id]')
 * @param speakerSelector - CSS selector to find speaker elements (default: '[data-speaker-id]')
 */
export function useArgumentPositions(
  containerRef: React.RefObject<HTMLElement | null>,
  argumentSelector: string = "[data-argument-id]",
  speakerSelector: string = "[data-speaker-id]",
): ArgumentPositionMap {
  const [positions, setPositions] = useState<ArgumentPositionMap>(new Map());
  const frameRef = useRef<number | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const mutationObserverRef = useRef<MutationObserver | null>(null);

  const updatePositions = useCallback(() => {
    // Cancel any pending frame
    if (frameRef.current !== null) {
      cancelAnimationFrame(frameRef.current);
    }

    // Schedule update on next animation frame for smooth performance
    frameRef.current = requestAnimationFrame(() => {
      const container = containerRef.current;
      if (!container) return;

      const newPositions = new Map<string, DOMRect>();

      // Track argument positions
      const argumentElements = container.querySelectorAll(argumentSelector);
      argumentElements.forEach((element) => {
        const argumentId = element.getAttribute("data-argument-id");
        if (argumentId) {
          const rect = element.getBoundingClientRect();
          newPositions.set(argumentId, rect);
        }
      });

      // Track speaker card positions (use speaker-{id} prefix to distinguish)
      const speakerElements = container.querySelectorAll(speakerSelector);
      speakerElements.forEach((element) => {
        const speakerId = element.getAttribute("data-speaker-id");
        if (speakerId) {
          const rect = element.getBoundingClientRect();
          newPositions.set(`speaker-${speakerId}`, rect);
        }
      });

      setPositions(newPositions);
      frameRef.current = null;
    });
  }, [containerRef, argumentSelector, speakerSelector]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Initial position calculation
    updatePositions();

    // Set up ResizeObserver to track size changes
    resizeObserverRef.current = new ResizeObserver(() => {
      updatePositions();
    });

    // Observe the container for size changes
    resizeObserverRef.current.observe(container);

    // Also observe all argument elements
    const argumentElements = container.querySelectorAll(argumentSelector);
    argumentElements.forEach((element) => {
      resizeObserverRef.current?.observe(element);
    });

    // Set up MutationObserver to track DOM changes (new arguments added/removed)
    mutationObserverRef.current = new MutationObserver((mutations) => {
      let needsUpdate = false;

      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          // Check if any argument elements were added or removed
          mutation.addedNodes.forEach((node) => {
            if (node instanceof Element) {
              if (
                node.matches(argumentSelector) ||
                node.querySelector(argumentSelector)
              ) {
                needsUpdate = true;
                // Observe new argument elements
                if (node.matches(argumentSelector)) {
                  resizeObserverRef.current?.observe(node);
                }
                node.querySelectorAll(argumentSelector).forEach((el) => {
                  resizeObserverRef.current?.observe(el);
                });
              }
            }
          });

          mutation.removedNodes.forEach((node) => {
            if (node instanceof Element) {
              if (
                node.matches(argumentSelector) ||
                node.querySelector(argumentSelector)
              ) {
                needsUpdate = true;
              }
            }
          });
        }
      }

      if (needsUpdate) {
        updatePositions();
      }
    });

    mutationObserverRef.current.observe(container, {
      childList: true,
      subtree: true,
    });

    // Handle scroll events
    const handleScroll = () => {
      updatePositions();
    };

    // Handle window resize
    const handleResize = () => {
      updatePositions();
    };

    // Listen for scroll on window and any scrollable ancestors
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize, { passive: true });

    // Also listen for scroll on the container if it's scrollable
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      // Cleanup
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      resizeObserverRef.current?.disconnect();
      mutationObserverRef.current?.disconnect();

      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerRef, argumentSelector, updatePositions]);

  return positions;
}

/**
 * Utility hook to get a single argument's position
 */
export function useArgumentPosition(
  positions: ArgumentPositionMap,
  argumentId: string | null,
): DOMRect | null {
  if (!argumentId) return null;
  return positions.get(argumentId) ?? null;
}
