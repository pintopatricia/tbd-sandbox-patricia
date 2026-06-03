import { useCallback, useEffect, useRef, useState } from "react";
import { MonterosaOddsDisplayFormat } from "../types/types";

/**
 * Platform-agnostic odds-format sync for a Monterosa experience.
 *
 * Handles ready-gating, dedup, and reset on `experienceKey` change/unmount.
 * `onSendPreference` is provided by the caller because the SDK differs per
 * platform (web: launcher-kit `sendMessage(experience, ...)`, native: RN SDK
 * `sendMessage(viewRef, ...)`).
 */
type UseMonterosaPreferenceSyncArgs = {
  experienceKey?: string | null;
  oddsDisplayFormat?: MonterosaOddsDisplayFormat;
  onSendPreference: (oddsFormat: MonterosaOddsDisplayFormat) => void;
};

type UseMonterosaPreferenceSyncResult = {
  handleExperienceReady: () => void;
};

export default function useMonterosaPreferenceSync({
  experienceKey,
  oddsDisplayFormat,
  onSendPreference,
}: UseMonterosaPreferenceSyncArgs): UseMonterosaPreferenceSyncResult {
  const [isExperienceReady, setIsExperienceReady] = useState(false);
  const lastSentOddsDisplayFormatRef = useRef<MonterosaOddsDisplayFormat | null>(null);
  const currentOddsDisplayFormatRef = useRef<MonterosaOddsDisplayFormat | null>(null);

  useEffect(() => {
    currentOddsDisplayFormatRef.current = oddsDisplayFormat || null;
  }, [oddsDisplayFormat]);

  const sendIfChanged = useCallback(
    (nextOddsDisplayFormat?: MonterosaOddsDisplayFormat | null) => {
      if (!nextOddsDisplayFormat) {
        return;
      }

      if (lastSentOddsDisplayFormatRef.current === nextOddsDisplayFormat) {
        return;
      }

      onSendPreference(nextOddsDisplayFormat);
      lastSentOddsDisplayFormatRef.current = nextOddsDisplayFormat;
    },
    [onSendPreference],
  );

  const handleExperienceReady = useCallback(() => {
    setIsExperienceReady(true);
    sendIfChanged(currentOddsDisplayFormatRef.current);
  }, [sendIfChanged]);

  useEffect(() => {
    if (!isExperienceReady) {
      return;
    }

    sendIfChanged(oddsDisplayFormat);
  }, [isExperienceReady, oddsDisplayFormat, sendIfChanged]);

  useEffect(
    () => () => {
      setIsExperienceReady(false);
      lastSentOddsDisplayFormatRef.current = null;
    },
    [experienceKey],
  );

  return {
    handleExperienceReady,
  };
}
