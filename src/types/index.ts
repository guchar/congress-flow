// Side constants
export const SIDES = {
  AFFIRMATIVE: "affirmative",
  NEGATIVE: "negative",
} as const;

export type Side = (typeof SIDES)[keyof typeof SIDES];

// Argument type constants
export const ARGUMENT_TYPES = {
  CONSTRUCTIVE: "constructive",
  REBUTTAL: "rebuttal",
  CROSSFIRE: "crossfire",
  SUMMARY: "summary",
  FINAL_FOCUS: "final-focus",
} as const;

export type ArgumentType = (typeof ARGUMENT_TYPES)[keyof typeof ARGUMENT_TYPES];

// Debate status constants
export const DEBATE_STATUS = {
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
} as const;

export type DebateStatus = (typeof DEBATE_STATUS)[keyof typeof DEBATE_STATUS];

// Refutation link type constants
export const REFUTATION_LINK_TYPES = {
  REFUTES: "refutes",
  REFUTED_BY: "refuted-by",
} as const;

export type RefutationLinkType =
  (typeof REFUTATION_LINK_TYPES)[keyof typeof REFUTATION_LINK_TYPES];

// Clash status constants
export const CLASH_STATUS = {
  RESOLVED: "resolved",
  CONTESTED: "contested",
  UNADDRESSED: "unaddressed",
} as const;

export type ClashStatus = (typeof CLASH_STATUS)[keyof typeof CLASH_STATUS];

/**
 * Represents an argument made by a speaker during the debate.
 */
export interface Argument {
  /** Unique identifier for the argument */
  id: string;
  /** ID of the speaker who made this argument */
  speakerId: string;
  /** The content/text of the argument */
  content: string;
  /** When the argument was recorded */
  timestamp: Date;
  /** The type of speech this argument was made in (optional, simplified UI) */
  type?: ArgumentType;
  /** Array of argument IDs that this argument refutes */
  refutes: string[];
  /** Array of argument IDs that refute this argument */
  refutedBy: string[];
  /** Speaker ID being refuted via REF shortcut (e.g., "REF Lee") */
  refutesSpeaker?: string;
}

/**
 * Represents a speaker in the debate.
 */
export interface Speaker {
  /** Unique identifier for the speaker */
  id: string;
  /** Speaker's name */
  name: string;
  /** Which side the speaker is on */
  side: Side;
  /** Speaking order in the debate */
  order: number;
  /** Arguments made by this speaker */
  arguments: Argument[];
}

/**
 * Represents the entire debate round.
 */
export interface DebateRound {
  /** Unique identifier for the debate round */
  id: string;
  /** The resolution/topic being debated */
  topic: string;
  /** When the debate was created */
  createdAt: Date;
  /** When the debate was last updated */
  updatedAt: Date;
  /** All speakers in the debate */
  speakers: Speaker[];
  /** Current status of the debate */
  status: DebateStatus;
}

/**
 * Represents a link between arguments for visualization purposes.
 */
export interface RefutationLink {
  /** ID of the source argument */
  sourceArgumentId: string;
  /** ID of the target argument being linked */
  targetArgumentId: string;
  /** Type of refutation relationship */
  type: RefutationLinkType;
}

/**
 * Represents an area of clash between the two sides.
 */
export interface ClashArea {
  /** The topic or issue being contested */
  topic: string;
  /** The affirmative side's position on this topic */
  affirmativePosition: string;
  /** The negative side's position on this topic */
  negativePosition: string;
  /** Current status of this clash */
  status: ClashStatus;
}

/**
 * Represents a major argument summary.
 */
export interface MajorArgument {
  /** Which side made the argument */
  side: Side;
  /** Summary of the argument */
  argument: string;
  /** Strength score (0-100) */
  strength: number;
}

/**
 * AI-generated summary of the debate.
 */
export interface DebateSummary {
  /** The most significant arguments from both sides */
  majorArguments: MajorArgument[];
  /** Areas where the two sides clash */
  areasOfClash: ClashArea[];
  /** Recommendations for improvement or strategy */
  recommendations: string[];
  /** Overall assessment of the debate */
  overallAssessment: string;
}

// Utility types for creating new entities
export type NewSpeaker = Omit<Speaker, "id" | "arguments">;
export type NewArgument = Omit<
  Argument,
  "id" | "timestamp" | "refutes" | "refutedBy" | "refutesSpeaker"
>;
export type NewDebateRound = Omit<
  DebateRound,
  "id" | "createdAt" | "updatedAt" | "speakers"
>;
