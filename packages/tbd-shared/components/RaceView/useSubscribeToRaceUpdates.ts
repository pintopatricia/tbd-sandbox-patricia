import { useEffect, useRef } from "react";
import { RaceDetails } from "@ppb/tbd-store";
import { ComponentProps } from "./props";

/**
 * Hook to manage subscription and unsubscription to race updates
 * Fetches the View data when results are available.
 */
export const useSubscribeToRaceUpdates = ({
  urn,
  raceStatus,
  resultType,
  raceURN,
  dispatchSubscribeRaceUpdates,
  dispatchUnsubscribeRaceUpdates,
  dispatchFetchCatalogue,
}: ComponentProps) => {
  const subscribedRef = useRef(false);
  const prevResultTypeRef = useRef<RaceDetails["resultType"] | undefined>(undefined);
  const hasFetchedOnFullResultRef = useRef(false);

  useEffect(() => {
    if (!!raceURN && raceStatus !== undefined) {
      dispatchSubscribeRaceUpdates(raceURN);
      subscribedRef.current = true;
    }

    return () => {
      if (!!raceURN && subscribedRef.current) {
        dispatchUnsubscribeRaceUpdates(raceURN);
      }
    };
  }, [raceStatus, dispatchSubscribeRaceUpdates, dispatchUnsubscribeRaceUpdates, raceURN]);

  useEffect(() => {
    if (raceStatus === "RESULT") {
      if (resultType === "QUICK_RESULT") {
        dispatchFetchCatalogue(urn);
      }

      if (
        resultType === "FULL_RESULT" &&
        prevResultTypeRef.current === "QUICK_RESULT" &&
        !hasFetchedOnFullResultRef.current
      ) {
        dispatchFetchCatalogue(urn);
        hasFetchedOnFullResultRef.current = true;
      }
    }
    prevResultTypeRef.current = resultType;
  }, [raceStatus, resultType, dispatchFetchCatalogue, urn]);
};
