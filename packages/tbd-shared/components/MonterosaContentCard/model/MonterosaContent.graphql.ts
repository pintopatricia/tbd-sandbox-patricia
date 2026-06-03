import { useLazyQuery } from "@apollo/client/react";
import { gql } from "../../../types/__generated__";
import { useEffect } from "react";

export const MonterosaContentFragment = gql(/* GraphQL */ `
  fragment MonterosaContentCard on MonterosaContentCard {
    __typename
    urn
    host
    projectId
    monterosaEventId
  }
`);

export const MonterosaContentQuery = gql(/* GraphQL */ `
  query MonterosaContentCard($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...MonterosaContentCard
    }
  }
`);

export const MonterosaAppContextFragment = gql(/* GraphQL */ `
  fragment MonterosaAppContext on AppContextDetails {
    __typename
    urn
    preferences {
      sportsbookOddsDisplay {
        __typename
        urn
        selectedOddsDisplayFormat
      }
    }
  }
`);

export const MonterosaAppContextQuery = gql(/* GraphQL */ `
  query MonterosaAppContext {
    AppContext {
      ...MonterosaAppContext
    }
  }
`);

export const useMonterosaContentCardQuery = (variables: { cardURN: string }, options: { visible: boolean }) => {
  const [fetchCard, { called, loading, data }] = useLazyQuery(MonterosaContentQuery);

  const card = data?.Cards?.[0];

  useEffect(() => {
    if (options.visible) {
      fetchCard({
        variables: { urn: variables.cardURN },
      });
    }
  }, [options.visible, fetchCard, variables.cardURN]);

  return {
    called,
    loading,
    data: {
      card,
    },
  };
};

export const useMonterosaAppContextQuery = (options: { visible: boolean }) => {
  const [fetchAppContext, { called, loading, data }] = useLazyQuery(MonterosaAppContextQuery);

  useEffect(() => {
    if (options.visible) {
      fetchAppContext();
    }
  }, [options.visible, fetchAppContext]);

  return {
    called,
    loading,
    data: {
      appContext: data?.AppContext,
    },
  };
};
