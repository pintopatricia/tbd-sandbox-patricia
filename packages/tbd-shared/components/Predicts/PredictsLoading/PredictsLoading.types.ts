export interface PredictsLoadingProps {
  isLoading: boolean;
  onDismiss: () => void;
  minDisplayMs?: number;
}

export type PredictsLoadingState = "YES" | "NO";

export interface FlipStep {
  /** Time from mount, in ms, when this state becomes active. */
  at: number;
  /** Label shown at this step. */
  label: PredictsLoadingState;
  /** Flip animation duration leading into this state. 0 for the initial step. */
  flipMs: number;
}
