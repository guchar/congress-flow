// Position tracking hooks
export {
  useArgumentPositions,
  useArgumentPosition,
} from './useArgumentPositions';
export type { ArgumentPosition, ArgumentPositionMap } from './useArgumentPositions';

// Refutation highlight hooks
export {
  useRefutationHighlight,
  useRefutationPositions,
  useArgumentHoverHandlers,
} from './useRefutationHighlight';
export type { RefutationHighlightState, ElementPositionPair } from './useRefutationHighlight';

// Debate summary hook
export { useDebateSummary, DEBATE_SUMMARY_QUERY_KEY } from './useDebateSummary';
