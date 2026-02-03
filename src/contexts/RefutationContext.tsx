import { createContext, useContext, type ReactNode } from 'react';

interface RefutationContextValue {
  /** Called when mouse enters an argument element */
  onArgumentMouseEnter: (argumentId: string) => void;
  /** Called when mouse leaves an argument element */
  onArgumentMouseLeave: () => void;
}

const RefutationContext = createContext<RefutationContextValue | null>(null);

interface RefutationProviderProps {
  children: ReactNode;
  onArgumentMouseEnter: (argumentId: string) => void;
  onArgumentMouseLeave: () => void;
}

/**
 * Provider component for refutation hover state management.
 * Allows ArgumentItem components to trigger refutation line visualization.
 */
export function RefutationProvider({
  children,
  onArgumentMouseEnter,
  onArgumentMouseLeave,
}: RefutationProviderProps) {
  return (
    <RefutationContext.Provider
      value={{ onArgumentMouseEnter, onArgumentMouseLeave }}
    >
      {children}
    </RefutationContext.Provider>
  );
}

/**
 * Hook to access refutation hover handlers.
 * Returns null if used outside of RefutationProvider.
 */
export function useRefutationContext(): RefutationContextValue | null {
  return useContext(RefutationContext);
}

/**
 * Hook to get refutation hover handlers with fallback for when not in provider.
 * Safe to use in components that may be rendered outside the provider.
 */
export function useRefutationHoverHandlers() {
  const context = useContext(RefutationContext);
  
  return {
    onMouseEnter: context?.onArgumentMouseEnter ?? (() => {}),
    onMouseLeave: context?.onArgumentMouseLeave ?? (() => {}),
  };
}
