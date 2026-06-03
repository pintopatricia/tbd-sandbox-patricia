import { useApolloClient, useLazyQuery } from "@apollo/client/react";
import { useCallback, useEffect, useRef } from "react";
import { gql } from "../../../../../types/__generated__";
import { cacheWarmup } from "./cache-warmup";

export const RaceMeetingViewAppContextFragment = gql(/* GraphQL */ `
  fragment RaceMeetingViewAppContext on AppContextDetails {
    __typename
    urn
    userdetails {
      localeCodeBcp47
      timezone
    }
    brandSettings {
      name
      isActive
    }
  }
`);

export const RaceMeetingViewAppContextQuery = gql(/* GraphQL */ `
  query RaceMeetingViewAppContext {
    AppContext {
      ...RaceMeetingViewAppContext
    }
  }
`);

export const RaceNavigationItemFragment = gql(/* GraphQL */ `
  fragment RaceNavigationItem on RaceNavigationItem {
    race {
      urn
      raceId
      name
      startTime
      verdict
      broadcasts {
        liveVideoUrl
        dataVizUrl
      }
      primaryMarket {
        ... on SportsbookMarket {
          numberOfActiveRunners
        }
      }
      raceKind {
        ... on HorseRaceKind {
          runners {
            horse {
              name
            }
            rating123
            ratingStars
          }
          details {
            name
            title
            scheduledTime
            distance {
              totalFurlongs
              totalMeters
              miles
              furlongs
              yards
            }
            numberOfRunners
            numberOfNonRunners
            numberOfParticipants
            going
            status
            type
            resultType
            raceClass
          }
        }
        ... on GreyhoundRaceKind {
          details {
            numberOfRunners
          }
        }
      }
      availableToSubscribe
    }
    viewLink {
      viewUrn
      viewUrl
    }
    promotion {
      signposting
    }
  }
`);

export const RaceMeetingViewFragment = gql(/* GraphQL */ `
  fragment RaceMeetingView on RaceMeetingView {
    __typename
    urn
    url
    title
    meeting {
      urn
      name
      venue
      country
      date
      countryFlag {
        vector
        small
      }
      sport {
        sportId
        name
      }
    }
    races {
      ...RaceNavigationItem
    }
    siblingRaceMeetingViews {
      urn
      url
      meeting {
        urn
        name
        venue
        country
        countryFlag {
          vector
          small
        }
      }
    }
    items {
      selectedRace {
        ...RaceNavigationItem
      }
      edges {
        node {
          ... on RaceResultsCard {
            __typename
            urn
          }
          ... on RegulatoryCard {
            __typename
            urn
          }
          ... on NavigationTabsList {
            ...NavigationTabsListCard
          }
          ... on PreferenceSingleChoiceCard {
            __typename
            urn
          }
        }
        cursor
        theme
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`);

export const RaceMeetingViewQuery = gql(/* GraphQL */ `
  query RaceMeetingView($viewURN: URN!) {
    View(viewURN: $viewURN) {
      ...RaceMeetingView
    }
  }
`);

export const useRaceMeetingViewAppContextQuery = () => {
  const [fetchAppContext, { called, loading, data }] = useLazyQuery(RaceMeetingViewAppContextQuery);

  useEffect(() => {
    if (!called) {
      fetchAppContext();
    }
  }, [fetchAppContext, called]);

  return {
    loading: !called || loading,
    data: {
      appContext: data?.AppContext,
    },
  };
};

/**
 * Meeting-scoped view query. Uses cache-and-network so cached data renders
 * immediately on revisit while a background fetch keeps the meeting's race
 * links fresh — otherwise links removed by the BFF (finished races, schedule
 * changes) stick around until a hard reload.
 */
export const useRaceMeetingViewQuery = (variables: { viewURN: string }) => {
  const client = useApolloClient();
  const [fetchView, { called, loading, data, previousData, refetch }] = useLazyQuery(RaceMeetingViewQuery, {
    errorPolicy: "all",
    fetchPolicy: "cache-and-network",
  });
  const fetchedURN = useRef<string | undefined>(undefined);
  const warmedUpViewRef = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (variables.viewURN !== fetchedURN.current) {
      fetchedURN.current = variables.viewURN;
      warmedUpViewRef.current = undefined;
      fetchView({ variables: { viewURN: variables.viewURN } });
    }
  }, [fetchView, variables.viewURN]);

  const effectiveData = data ?? previousData;
  const view = effectiveData?.View;
  const raceMeetingView = view && "__typename" in view && view.__typename === "RaceMeetingView" ? view : undefined;

  useEffect(() => {
    if (raceMeetingView && raceMeetingView.urn !== warmedUpViewRef.current) {
      warmedUpViewRef.current = raceMeetingView.urn;
      cacheWarmup(client.cache, raceMeetingView);
    }
  }, [client.cache, raceMeetingView]);

  const canRenderHeader =
    !!raceMeetingView &&
    (raceMeetingView.urn === variables.viewURN ||
      raceMeetingView.races.some((race) => race?.viewLink.viewUrn === variables.viewURN));

  const refresh = useCallback(() => refetch({ viewURN: variables.viewURN }), [refetch, variables.viewURN]);

  return {
    loading: !called || loading,
    canRenderHeader,
    refresh,
    data: {
      view: raceMeetingView,
    },
  };
};
