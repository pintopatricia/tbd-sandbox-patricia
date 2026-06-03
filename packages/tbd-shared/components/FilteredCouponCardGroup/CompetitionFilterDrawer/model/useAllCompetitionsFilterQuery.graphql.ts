import { useQuery } from "@apollo/client/react";
import { gql } from "../../../../types/__generated__";

export default gql(/* GraphQL */ `
  fragment FilteredCouponCardGroupAllCompetitionsFilterOptions on FilteredCouponCardGroup {
    filterOptions {
      __typename
      competitionsFilter {
        urn
        allCompetitions {
          competitions {
            __typename
            urn
            name
            competitionId
            sport {
              __typename
              urn
              name
              sportId
            }
          }
          country {
            urn
            code
            flag {
              vector
              small
              medium
              large
            }
          }
        }
      }
    }
  }
`);

export const getCardQuery = gql(/* GraphQL */ `
  query AllCompetitionsFilter($urn: [URN!]!) {
    Cards(cardsURN: $urn) {
      ...FilteredCouponCardGroupAllCompetitionsFilterOptions
    }
  }
`);

export const useAllCompetitionsFilterQuery = (urn: string) =>
  useQuery(getCardQuery, {
    variables: {
      urn,
    },
  });

export type QueryResponseData = {
  filterOptions: {
    __typename: "FilteredCouponOptions";
    competitionsFilter: {
      urn: string;
      allCompetitions: {
        competitions: {
          __typename: "Competition";
          urn: string;
          name: string;
          competitionId: number;
        }[];
        country: {
          code: string;
          flag: {
            vector: string;
          };
        };
      }[];
    };
  };
};
