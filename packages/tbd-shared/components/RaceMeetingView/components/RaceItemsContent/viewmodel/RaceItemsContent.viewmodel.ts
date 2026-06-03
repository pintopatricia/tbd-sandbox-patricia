import { useEffect, useMemo, useRef, useState } from "react";
import type { InitialItemsData } from "../../RaceMeetingView/viewmodel/RaceMeetingView.viewmodel";
import { useRaceItemsContentQuery } from "../model/RaceItemsContent.graphql";

export type CardEdge = {
  key: string;
  typename: string;
  urn: string | null;
};

function mapCardEdges(items: InitialItemsData | undefined) {
  return (items?.edges ?? []).reduce<CardEdge[]>((acc, edge) => {
    const node = edge?.node;
    if (!node || !("__typename" in node)) return acc;
    const urn = "urn" in node && node.urn ? (node.urn as string) : null;
    acc.push({ key: `${node.__typename}-${urn}`, typename: node.__typename, urn });
    return acc;
  }, []);
}

export function useRaceItemsContentVM(
  viewUrn: string,
  raceUrn: string | undefined,
  initialItems?: InitialItemsData,
  resultType?: string | null,
  deferQuery = false,
) {
  const hasInitialData = !!initialItems;
  const [queryActivated, setQueryActivated] = useState(false);
  const [prevHasInitialData, setPrevHasInitialData] = useState(hasInitialData);

  // Reset activation when new initialItems arrive (e.g., meeting switch
  // provides fresh data for the new default race). Uses React's render-time
  // state adjustment pattern to avoid setState-in-effect warnings.
  if (hasInitialData !== prevHasInitialData) {
    setPrevHasInitialData(hasInitialData);
    if (hasInitialData) {
      setQueryActivated(false);
    }
  }

  // Skip the items query while the parent meeting query is still resolving the
  // selected race, or when initialItems already has fresh data from the parent
  // query. The query activates when the parent cannot satisfy the selected
  // race, or when a result-type transition needs fresh items.
  const skipQuery = deferQuery || (hasInitialData && !queryActivated);
  const skipQueryRef = useRef(skipQuery);
  useEffect(() => {
    skipQueryRef.current = skipQuery;
  });

  const {
    loading,
    refetch,
    data: { items: fetchedItems, previousItems: previousFetchedItems },
  } = useRaceItemsContentQuery({ viewURN: viewUrn, race: raceUrn }, { skip: skipQuery });

  // initialItems (from the parent meeting query) is a synchronous fallback for
  // the default race's first paint. Once the query activates and resolves,
  // fetchedItems takes over as the authoritative source.
  const items = fetchedItems ?? initialItems;
  const previousItems = previousFetchedItems ?? initialItems;

  const cardEdges = useMemo(() => mapCardEdges(items), [items]);
  const previousCardEdges = useMemo(() => mapCardEdges(previousItems), [previousItems]);

  const prevResultTypeRef = useRef<string | null | undefined>(undefined);
  const hasFetchedOnFullResultRef = useRef(false);
  const [prevRaceUrn, setPrevRaceUrn] = useState(raceUrn);
  const [prevResultType, setPrevResultType] = useState(resultType);
  const [hasFetchedOnFullResult, setHasFetchedOnFullResult] = useState(false);

  // Reset result-type tracking when the race changes so that transitions
  // from one race don't suppress refetches for a different race.
  if (raceUrn !== prevRaceUrn) {
    setPrevRaceUrn(raceUrn);
    setPrevResultType(undefined);
    setHasFetchedOnFullResult(false);
  }

  // Activate the query at render time when a result-type transition occurs
  // while the query is still skipped. Uses React's render-time state
  // adjustment pattern to avoid setState-in-effect warnings.
  const resultTypeChanged = resultType !== prevResultType;
  if (resultTypeChanged) {
    setPrevResultType(resultType);

    if (resultType === "QUICK_RESULT" && skipQuery) {
      setQueryActivated(true);
    }

    if (resultType === "FULL_RESULT" && prevResultType !== "FULL_RESULT" && !hasFetchedOnFullResult && skipQuery) {
      setQueryActivated(true);
    }
  }

  // Keep refs in sync with state so the effect reads consistent values
  // without needing state in its dependency array.
  useEffect(() => {
    prevResultTypeRef.current = prevResultType;
    hasFetchedOnFullResultRef.current = hasFetchedOnFullResult;
  }, [prevResultType, hasFetchedOnFullResult]);
  // Targeted refetch on key result-type transitions (live-patched via
  // race-status-live-data). Only handles the refetch side effect — query
  // activation is handled above at render time.
  useEffect(() => {
    if (resultType === "QUICK_RESULT") {
      if (!skipQueryRef.current && refetch) {
        refetch();
      }
    }

    if (
      resultType === "FULL_RESULT" &&
      prevResultTypeRef.current !== "FULL_RESULT" &&
      !hasFetchedOnFullResultRef.current
    ) {
      if (!skipQueryRef.current && refetch) {
        refetch();
        hasFetchedOnFullResultRef.current = true;
      }
    }

    prevResultTypeRef.current = resultType;
  }, [resultType, refetch]);

  const hasData = cardEdges.length > 0;
  const isQueryLoading = loading && !hasData;
  const hasPreviousData = previousCardEdges.length > 0;
  const transitioning = isQueryLoading && hasPreviousData;
  const effectiveCardEdges = transitioning ? previousCardEdges : cardEdges;

  return {
    loading: isQueryLoading && !hasPreviousData,
    transitioning,
    vm: {
      data: {
        cardEdges: effectiveCardEdges,
      },
    },
  };
}
