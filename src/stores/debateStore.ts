import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  Argument,
  DebateRound,
  NewArgument,
  NewSpeaker,
  RefutationLink,
  Speaker,
} from "../types";
import { DEBATE_STATUS, REFUTATION_LINK_TYPES } from "../types";

/**
 * Generates a unique ID for entities.
 */
const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
};

interface DebateState {
  /** The current debate round, or null if no debate is active */
  currentDebate: DebateRound | null;
  /** All saved debates */
  savedDebates: DebateRound[];
  /** Whether the saved flows sidebar is open */
  isSidebarOpen: boolean;

  // Actions
  /** Creates a new debate round with the given topic */
  createDebate: (topic: string) => void;
  /** Clears the current debate */
  clearDebate: () => void;
  /** Updates the debate status */
  setDebateStatus: (status: DebateRound["status"]) => void;
  /** Saves the current debate to the saved debates list */
  saveCurrentDebate: () => void;
  /** Loads a saved debate by ID */
  loadDebate: (debateId: string) => void;
  /** Deletes a saved debate by ID */
  deleteSavedDebate: (debateId: string) => void;
  /** Toggles the sidebar */
  toggleSidebar: () => void;

  /** Adds a new speaker to the debate */
  addSpeaker: (speaker: NewSpeaker) => string;
  /** Removes a speaker and all their arguments from the debate */
  removeSpeaker: (speakerId: string) => void;
  /** Updates a speaker's information */
  updateSpeaker: (
    speakerId: string,
    updates: Partial<Omit<Speaker, "id" | "arguments">>,
  ) => void;

  /** Adds a new argument for a speaker */
  addArgument: (speakerId: string, argument: NewArgument) => string | null;
  /** Updates an existing argument */
  updateArgument: (
    argumentId: string,
    updates: Partial<Omit<Argument, "id" | "speakerId">>,
  ) => void;
  /** Deletes an argument and removes all refutation links to it */
  deleteArgument: (argumentId: string) => void;

  /** Creates a refutation link between two arguments */
  linkRefutation: (sourceArgumentId: string, targetArgumentId: string) => void;
  /** Removes a refutation link between two arguments */
  unlinkRefutation: (
    sourceArgumentId: string,
    targetArgumentId: string,
  ) => void;

  // Computed/Getters
  /** Gets an argument by its ID */
  getArgumentById: (argumentId: string) => Argument | null;
  /** Gets all arguments for a specific speaker */
  getSpeakerArguments: (speakerId: string) => Argument[];
  /** Gets all refutation links in the debate for visualization */
  getRefutationLinks: () => RefutationLink[];
  /** Gets a speaker by their ID */
  getSpeakerById: (speakerId: string) => Speaker | null;
  /** Gets all arguments for a specific side */
  getArgumentsBySide: (side: Speaker["side"]) => Argument[];
}

export const useDebateStore = create<DebateState>()(
  devtools(
    persist(
      (set, get) => ({
        currentDebate: null,
        savedDebates: [],
        isSidebarOpen: true,

        // Debate management
        createDebate: (topic: string) => {
          const state = get();

          // Auto-save current debate before creating new one
          if (state.currentDebate && state.currentDebate.speakers.length > 0) {
            const existingIndex = state.savedDebates.findIndex(
              (d) => d.id === state.currentDebate!.id,
            );
            if (existingIndex >= 0) {
              // Update existing
              const newSavedDebates = [...state.savedDebates];
              newSavedDebates[existingIndex] = state.currentDebate;
              set(
                { savedDebates: newSavedDebates },
                false,
                "autoSaveBeforeCreate",
              );
            } else {
              // Add new
              set(
                { savedDebates: [...state.savedDebates, state.currentDebate] },
                false,
                "autoSaveBeforeCreate",
              );
            }
          }

          const now = new Date();
          const newDebate: DebateRound = {
            id: generateId(),
            topic,
            createdAt: now,
            updatedAt: now,
            speakers: [],
            status: DEBATE_STATUS.IN_PROGRESS,
          };
          set({ currentDebate: newDebate }, false, "createDebate");
        },

        clearDebate: () => {
          set({ currentDebate: null }, false, "clearDebate");
        },

        saveCurrentDebate: () => {
          const state = get();
          if (!state.currentDebate) return;

          const existingIndex = state.savedDebates.findIndex(
            (d) => d.id === state.currentDebate!.id,
          );
          if (existingIndex >= 0) {
            // Update existing
            const newSavedDebates = [...state.savedDebates];
            newSavedDebates[existingIndex] = state.currentDebate;
            set({ savedDebates: newSavedDebates }, false, "saveCurrentDebate");
          } else {
            // Add new
            set(
              { savedDebates: [...state.savedDebates, state.currentDebate] },
              false,
              "saveCurrentDebate",
            );
          }
        },

        loadDebate: (debateId: string) => {
          const state = get();

          // Auto-save current debate before loading another
          if (state.currentDebate && state.currentDebate.id !== debateId) {
            const existingIndex = state.savedDebates.findIndex(
              (d) => d.id === state.currentDebate!.id,
            );
            if (existingIndex >= 0) {
              const newSavedDebates = [...state.savedDebates];
              newSavedDebates[existingIndex] = state.currentDebate;
              set(
                { savedDebates: newSavedDebates },
                false,
                "autoSaveBeforeLoad",
              );
            } else if (state.currentDebate.speakers.length > 0) {
              set(
                { savedDebates: [...state.savedDebates, state.currentDebate] },
                false,
                "autoSaveBeforeLoad",
              );
            }
          }

          const debateToLoad = state.savedDebates.find(
            (d) => d.id === debateId,
          );
          if (debateToLoad) {
            set({ currentDebate: { ...debateToLoad } }, false, "loadDebate");
          }
        },

        deleteSavedDebate: (debateId: string) => {
          const state = get();
          set(
            {
              savedDebates: state.savedDebates.filter((d) => d.id !== debateId),
              // Clear current if it's the one being deleted
              currentDebate:
                state.currentDebate?.id === debateId
                  ? null
                  : state.currentDebate,
            },
            false,
            "deleteSavedDebate",
          );
        },

        toggleSidebar: () => {
          set(
            (state) => ({ isSidebarOpen: !state.isSidebarOpen }),
            false,
            "toggleSidebar",
          );
        },

        setDebateStatus: (status) => {
          set(
            (state) => {
              if (!state.currentDebate) return state;
              return {
                currentDebate: {
                  ...state.currentDebate,
                  status,
                  updatedAt: new Date(),
                },
              };
            },
            false,
            "setDebateStatus",
          );
        },

        // Speaker management
        addSpeaker: (speaker: NewSpeaker) => {
          const id = generateId();
          set(
            (state) => {
              if (!state.currentDebate) return state;
              const newSpeaker: Speaker = {
                ...speaker,
                id,
                arguments: [],
              };
              return {
                currentDebate: {
                  ...state.currentDebate,
                  speakers: [...state.currentDebate.speakers, newSpeaker],
                  updatedAt: new Date(),
                },
              };
            },
            false,
            "addSpeaker",
          );
          return id;
        },

        removeSpeaker: (speakerId: string) => {
          set(
            (state) => {
              if (!state.currentDebate) return state;

              // Get all argument IDs from the speaker being removed
              const speakerToRemove = state.currentDebate.speakers.find(
                (s) => s.id === speakerId,
              );
              const removedArgumentIds = new Set(
                speakerToRemove?.arguments.map((a) => a.id) ?? [],
              );

              // Remove speaker and clean up refutation links in other arguments
              const updatedSpeakers = state.currentDebate.speakers
                .filter((s) => s.id !== speakerId)
                .map((speaker) => ({
                  ...speaker,
                  arguments: speaker.arguments.map((arg) => ({
                    ...arg,
                    refutes: arg.refutes.filter(
                      (id) => !removedArgumentIds.has(id),
                    ),
                    refutedBy: arg.refutedBy.filter(
                      (id) => !removedArgumentIds.has(id),
                    ),
                  })),
                }));

              return {
                currentDebate: {
                  ...state.currentDebate,
                  speakers: updatedSpeakers,
                  updatedAt: new Date(),
                },
              };
            },
            false,
            "removeSpeaker",
          );
        },

        updateSpeaker: (speakerId, updates) => {
          set(
            (state) => {
              if (!state.currentDebate) return state;
              return {
                currentDebate: {
                  ...state.currentDebate,
                  speakers: state.currentDebate.speakers.map((speaker) =>
                    speaker.id === speakerId
                      ? { ...speaker, ...updates }
                      : speaker,
                  ),
                  updatedAt: new Date(),
                },
              };
            },
            false,
            "updateSpeaker",
          );
        },

        // Argument management
        addArgument: (speakerId: string, argument: NewArgument) => {
          const state = get();
          if (!state.currentDebate) return null;

          const speakerExists = state.currentDebate.speakers.some(
            (s) => s.id === speakerId,
          );
          if (!speakerExists) return null;

          const id = generateId();
          set(
            (state) => {
              if (!state.currentDebate) return state;
              const newArgument: Argument = {
                ...argument,
                id,
                timestamp: new Date(),
                refutes: [],
                refutedBy: [],
                refutesSpeaker: undefined,
              };

              return {
                currentDebate: {
                  ...state.currentDebate,
                  speakers: state.currentDebate.speakers.map((speaker) =>
                    speaker.id === speakerId
                      ? {
                          ...speaker,
                          arguments: [...speaker.arguments, newArgument],
                        }
                      : speaker,
                  ),
                  updatedAt: new Date(),
                },
              };
            },
            false,
            "addArgument",
          );
          return id;
        },

        updateArgument: (argumentId: string, updates) => {
          set(
            (state) => {
              if (!state.currentDebate) return state;
              return {
                currentDebate: {
                  ...state.currentDebate,
                  speakers: state.currentDebate.speakers.map((speaker) => ({
                    ...speaker,
                    arguments: speaker.arguments.map((arg) =>
                      arg.id === argumentId ? { ...arg, ...updates } : arg,
                    ),
                  })),
                  updatedAt: new Date(),
                },
              };
            },
            false,
            "updateArgument",
          );
        },

        deleteArgument: (argumentId: string) => {
          set(
            (state) => {
              if (!state.currentDebate) return state;

              // Remove the argument and clean up all refutation links pointing to it
              return {
                currentDebate: {
                  ...state.currentDebate,
                  speakers: state.currentDebate.speakers.map((speaker) => ({
                    ...speaker,
                    arguments: speaker.arguments
                      .filter((arg) => arg.id !== argumentId)
                      .map((arg) => ({
                        ...arg,
                        refutes: arg.refutes.filter((id) => id !== argumentId),
                        refutedBy: arg.refutedBy.filter(
                          (id) => id !== argumentId,
                        ),
                      })),
                  })),
                  updatedAt: new Date(),
                },
              };
            },
            false,
            "deleteArgument",
          );
        },

        // Refutation management
        linkRefutation: (
          sourceArgumentId: string,
          targetArgumentId: string,
        ) => {
          set(
            (state) => {
              if (!state.currentDebate) return state;

              return {
                currentDebate: {
                  ...state.currentDebate,
                  speakers: state.currentDebate.speakers.map((speaker) => ({
                    ...speaker,
                    arguments: speaker.arguments.map((arg) => {
                      if (arg.id === sourceArgumentId) {
                        // Source argument now refutes target
                        return {
                          ...arg,
                          refutes: arg.refutes.includes(targetArgumentId)
                            ? arg.refutes
                            : [...arg.refutes, targetArgumentId],
                        };
                      }
                      if (arg.id === targetArgumentId) {
                        // Target argument is now refuted by source
                        return {
                          ...arg,
                          refutedBy: arg.refutedBy.includes(sourceArgumentId)
                            ? arg.refutedBy
                            : [...arg.refutedBy, sourceArgumentId],
                        };
                      }
                      return arg;
                    }),
                  })),
                  updatedAt: new Date(),
                },
              };
            },
            false,
            "linkRefutation",
          );
        },

        unlinkRefutation: (
          sourceArgumentId: string,
          targetArgumentId: string,
        ) => {
          set(
            (state) => {
              if (!state.currentDebate) return state;

              return {
                currentDebate: {
                  ...state.currentDebate,
                  speakers: state.currentDebate.speakers.map((speaker) => ({
                    ...speaker,
                    arguments: speaker.arguments.map((arg) => {
                      if (arg.id === sourceArgumentId) {
                        return {
                          ...arg,
                          refutes: arg.refutes.filter(
                            (id) => id !== targetArgumentId,
                          ),
                        };
                      }
                      if (arg.id === targetArgumentId) {
                        return {
                          ...arg,
                          refutedBy: arg.refutedBy.filter(
                            (id) => id !== sourceArgumentId,
                          ),
                        };
                      }
                      return arg;
                    }),
                  })),
                  updatedAt: new Date(),
                },
              };
            },
            false,
            "unlinkRefutation",
          );
        },

        // Computed/Getters
        getArgumentById: (argumentId: string) => {
          const state = get();
          if (!state.currentDebate) return null;

          for (const speaker of state.currentDebate.speakers) {
            const argument = speaker.arguments.find((a) => a.id === argumentId);
            if (argument) return argument;
          }
          return null;
        },

        getSpeakerArguments: (speakerId: string) => {
          const state = get();
          if (!state.currentDebate) return [];

          const speaker = state.currentDebate.speakers.find(
            (s) => s.id === speakerId,
          );
          return speaker?.arguments ?? [];
        },

        getRefutationLinks: () => {
          const state = get();
          if (!state.currentDebate) return [];

          const links: RefutationLink[] = [];

          for (const speaker of state.currentDebate.speakers) {
            for (const argument of speaker.arguments) {
              // Create links for each refutation
              for (const targetId of argument.refutes) {
                links.push({
                  sourceArgumentId: argument.id,
                  targetArgumentId: targetId,
                  type: REFUTATION_LINK_TYPES.REFUTES,
                });
              }
            }
          }

          return links;
        },

        getSpeakerById: (speakerId: string) => {
          const state = get();
          if (!state.currentDebate) return null;
          return (
            state.currentDebate.speakers.find((s) => s.id === speakerId) ?? null
          );
        },

        getArgumentsBySide: (side) => {
          const state = get();
          if (!state.currentDebate) return [];

          return state.currentDebate.speakers
            .filter((speaker) => speaker.side === side)
            .flatMap((speaker) => speaker.arguments);
        },
      }),
      {
        name: "congress-flow-storage",
        partialize: (state) => ({
          savedDebates: state.savedDebates,
          currentDebate: state.currentDebate,
          isSidebarOpen: state.isSidebarOpen,
        }),
      },
    ),
    { name: "debate-store" },
  ),
);

// Selector hooks for performance optimization
export const useCurrentDebate = () =>
  useDebateStore((state) => state.currentDebate);
export const useSpeakers = () =>
  useDebateStore((state) => state.currentDebate?.speakers ?? []);
export const useDebateStatus = () =>
  useDebateStore((state) => state.currentDebate?.status ?? null);
export const useSavedDebates = () =>
  useDebateStore((state) => state.savedDebates);
export const useIsSidebarOpen = () =>
  useDebateStore((state) => state.isSidebarOpen);
