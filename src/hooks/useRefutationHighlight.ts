import { useState, useCallback, useMemo } from "react";
import { useDebateStore } from "../stores/debateStore";
import type { RefutationLink } from "../types";
import { REFUTATION_LINK_TYPES } from "../types";
import type { ArgumentPositionMap } from "./useArgumentPositions";

export interface RefutationHighlightState {
  /** The ID of the currently hovered argument, or null */
  hoveredArgumentId: string | null;
  /** Set the hovered argument ID */
  setHoveredArgumentId: (id: string | null) => void;
  /** Refutation links where the hovered argument is the source (it refutes others) */
  outgoingLinks: RefutationLink[];
  /** Refutation links where the hovered argument is the target (it is refuted by others) */
  incomingLinks: RefutationLink[];
  /** All links relevant to the hovered argument */
  allRelevantLinks: RefutationLink[];
  /** IDs of all arguments connected to the hovered argument */
  connectedArgumentIds: Set<string>;
}

/**
 * Hook for managing hover state and filtering refutation links
 * for the currently hovered argument.
 * Now also supports REF [SpeakerName] links to speaker cards.
 */
export function useRefutationHighlight(): RefutationHighlightState {
  const [hoveredArgumentId, setHoveredArgumentId] = useState<string | null>(
    null,
  );

  const getRefutationLinks = useDebateStore(
    (state) => state.getRefutationLinks,
  );
  const getArgumentById = useDebateStore((state) => state.getArgumentById);
  const currentDebate = useDebateStore((state) => state.currentDebate);

  // Get all links and filter for the hovered argument
  const {
    outgoingLinks,
    incomingLinks,
    allRelevantLinks,
    connectedArgumentIds,
  } = useMemo(() => {
    if (!hoveredArgumentId) {
      return {
        outgoingLinks: [] as RefutationLink[],
        incomingLinks: [] as RefutationLink[],
        allRelevantLinks: [] as RefutationLink[],
        connectedArgumentIds: new Set<string>(),
      };
    }

    const allLinks = getRefutationLinks();
    const argument = getArgumentById(hoveredArgumentId);

    if (!argument) {
      return {
        outgoingLinks: [] as RefutationLink[],
        incomingLinks: [] as RefutationLink[],
        allRelevantLinks: [] as RefutationLink[],
        connectedArgumentIds: new Set<string>(),
      };
    }

    // Outgoing: this argument refutes others
    const outgoing: RefutationLink[] = allLinks.filter(
      (link) => link.sourceArgumentId === hoveredArgumentId,
    );

    // Add speaker refutation link if the argument has refutesSpeaker set
    if (argument.refutesSpeaker) {
      outgoing.push({
        sourceArgumentId: hoveredArgumentId,
        targetArgumentId: `speaker-${argument.refutesSpeaker}`,
        type: REFUTATION_LINK_TYPES.REFUTES,
      });
    }

    // Incoming: this argument is refuted by others
    const incoming: RefutationLink[] = allLinks
      .filter((link) => link.targetArgumentId === hoveredArgumentId)
      .map((link) => ({
        sourceArgumentId: link.targetArgumentId,
        targetArgumentId: link.sourceArgumentId,
        type: REFUTATION_LINK_TYPES.REFUTED_BY,
      }));

    // Also check if any arguments refute this speaker (if hovering on speaker card)
    if (currentDebate && hoveredArgumentId.startsWith("speaker-")) {
      const speakerId = hoveredArgumentId.replace("speaker-", "");
      currentDebate.speakers.forEach((speaker) => {
        speaker.arguments.forEach((arg) => {
          if (arg.refutesSpeaker === speakerId) {
            incoming.push({
              sourceArgumentId: arg.id,
              targetArgumentId: hoveredArgumentId,
              type: REFUTATION_LINK_TYPES.REFUTED_BY,
            });
          }
        });
      });
    }

    const all = [...outgoing, ...incoming];

    // Collect all connected argument IDs (including speaker-prefixed IDs)
    const connected = new Set<string>();
    all.forEach((link) => {
      if (link.sourceArgumentId !== hoveredArgumentId) {
        connected.add(link.sourceArgumentId);
      }
      if (link.targetArgumentId !== hoveredArgumentId) {
        connected.add(link.targetArgumentId);
      }
    });

    return {
      outgoingLinks: outgoing,
      incomingLinks: incoming,
      allRelevantLinks: all,
      connectedArgumentIds: connected,
    };
  }, [hoveredArgumentId, getRefutationLinks, getArgumentById, currentDebate]);

  return {
    hoveredArgumentId,
    setHoveredArgumentId,
    outgoingLinks,
    incomingLinks,
    allRelevantLinks,
    connectedArgumentIds,
  };
}

export interface ElementPositionPair {
  sourceId: string;
  targetId: string;
  sourceRect: DOMRect;
  targetRect: DOMRect;
  type: RefutationLink["type"];
}

/**
 * Hook to calculate position pairs for drawing lines between arguments.
 * Returns pairs only when both source and target elements have valid positions.
 */
export function useRefutationPositions(
  links: RefutationLink[],
  positions: ArgumentPositionMap,
): ElementPositionPair[] {
  return useMemo(() => {
    const pairs: ElementPositionPair[] = [];

    for (const link of links) {
      const sourceRect = positions.get(link.sourceArgumentId);
      const targetRect = positions.get(link.targetArgumentId);

      if (sourceRect && targetRect) {
        pairs.push({
          sourceId: link.sourceArgumentId,
          targetId: link.targetArgumentId,
          sourceRect,
          targetRect,
          type: link.type,
        });
      }
    }

    return pairs;
  }, [links, positions]);
}

/**
 * Hook for handling hover events on argument elements.
 * Returns event handlers to attach to argument elements.
 */
export function useArgumentHoverHandlers(
  setHoveredArgumentId: (id: string | null) => void,
) {
  const handleMouseEnter = useCallback(
    (argumentId: string) => {
      setHoveredArgumentId(argumentId);
    },
    [setHoveredArgumentId],
  );

  const handleMouseLeave = useCallback(() => {
    setHoveredArgumentId(null);
  }, [setHoveredArgumentId]);

  return {
    handleMouseEnter,
    handleMouseLeave,
  };
}
