import { useState, useEffect, useRef, useCallback } from "react";

export type UseFavouriteGamesErrorToastProps = {
  errorTimestamp: number | null;
  errorGameId: string | null;
  gameId: string;
  autoHideDuration?: number;
  onDismiss?: () => void;
};

export type UseFavouriteGamesErrorToastReturn = {
  isVisible: boolean;
  hideToast: () => void;
};

/**
 * Hook to manage the display of favourite games error toasts for a specific game
 *
 * @param errorTimestamp - Timestamp when the error occurred (used to detect new errors)
 * @param errorGameId - The ID of the game that caused the error
 * @param gameId - The ID of the game this component is responsible for
 * @param autoHideDuration - Duration in milliseconds before auto-hiding (default: 3000)
 * @param onDismiss - Callback to clear error state in Redux
 * @returns Object with isVisible flag and hideToast function
 */
export const useFavouriteGamesErrorToast = ({
  errorTimestamp,
  errorGameId,
  gameId,
  autoHideDuration = 3000,
  onDismiss,
}: UseFavouriteGamesErrorToastProps): UseFavouriteGamesErrorToastReturn => {
  const [dismissedTimestamp, setDismissedTimestamp] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hasDismissedRef = useRef(false);

  const isVisible = errorTimestamp != null && errorGameId === gameId && errorTimestamp !== dismissedTimestamp;

  useEffect(() => {
    if (!isVisible) return undefined;

    hasDismissedRef.current = false;
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      setDismissedTimestamp(errorTimestamp);
      if (!hasDismissedRef.current) {
        hasDismissedRef.current = true;
        onDismiss?.();
      }
    }, autoHideDuration);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isVisible, errorTimestamp, autoHideDuration, onDismiss]);

  const hideToast = useCallback(() => {
    if (errorTimestamp != null) setDismissedTimestamp(errorTimestamp);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (!hasDismissedRef.current) {
      hasDismissedRef.current = true;
      onDismiss?.();
    }
  }, [errorTimestamp, onDismiss]);

  return { isVisible, hideToast };
};
