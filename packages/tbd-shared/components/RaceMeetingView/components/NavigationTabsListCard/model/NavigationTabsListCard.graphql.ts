import { useFragment, useQuery } from "@apollo/client/react";
import { gql } from "../../../../../types/__generated__";

export const NavigationTabsListCardFragment = gql(/* GraphQL */ `
  fragment NavigationTabsListCard on NavigationTabsList {
    __typename
    urn
    title
    items {
      edges {
        node {
          ... on NavigationTab {
            urn
            title {
              translated
            }
            viewLink {
              viewUrn
              viewUrl
            }
            items {
              edges {
                node {
                  __typename
                  urn
                }
              }
            }
          }
        }
      }
    }
  }
`);

export const NavigationTabsListCardQuery = gql(/* GraphQL */ `
  query NavigationTabsListCard($urns: [URN!]!) {
    Cards(cardsURN: $urns) {
      ...NavigationTabsListCard
    }
  }
`);

export const useNavigationTabsListCardQuery = (urn: string) => {
  const { complete, data: fragmentData } = useFragment({
    fragment: NavigationTabsListCardFragment,
    from: { __typename: "NavigationTabsList" as const, urn },
  });

  const { loading, data } = useQuery(NavigationTabsListCardQuery, {
    variables: { urns: [urn] },
    skip: complete,
  });

  if (complete) {
    const narrowed = "urn" in fragmentData ? fragmentData : undefined;
    return {
      loading: false,
      data: {
        navigationTabsList: narrowed,
      },
    };
  }

  const cards = data?.Cards;
  const navigationTabsList = cards?.find(
    (card): card is Extract<NonNullable<typeof card>, { __typename: "NavigationTabsList" }> =>
      !!card && "__typename" in card && card.__typename === "NavigationTabsList",
  );

  return {
    loading,
    data: {
      navigationTabsList,
    },
  };
};
