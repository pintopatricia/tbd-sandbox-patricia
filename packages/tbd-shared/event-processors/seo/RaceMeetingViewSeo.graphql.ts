import { gql } from "../../types/__generated__";

export const RaceMeetingViewSeoFragment = gql(/* GraphQL */ `
  fragment RaceMeetingViewSeo on RaceMeetingView {
    __typename
    urn
    meeting {
      __typename
      urn
      venue
      sport {
        sportId
      }
    }
    items {
      selectedRace {
        race {
          __typename
          urn
          name
          startTime
        }
      }
    }
  }
`);
