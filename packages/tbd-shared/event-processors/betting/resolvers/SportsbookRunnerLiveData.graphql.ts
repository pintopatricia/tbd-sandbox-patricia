import { gql } from "../../../types/__generated__";

export const SportsbookRunnerLiveDataPotentialBetUpdateFragment = gql(/* GraphQL */ `
  fragment SportsbookRunnerLiveDataPotentialBetUpdate on SportsbookRunnerLiveData {
    __typename
    urn
    isPotentialBet @client
  }
`);

export const SportsbookRunnerLiveDataEventProcessorFragment = gql(/* GraphQL */ `
  fragment SportsbookRunnerLiveDataEventProcessor on SportsbookRunnerLiveData {
    odds {
      decimal
      fractional {
        numerator
        denominator
      }
    }
    displayOdds {
      decimal
      fractional {
        numerator
        denominator
      }
    }
    previousOdds(limit: 1) {
      odds {
        decimal
        fractional {
          numerator
          denominator
        }
      }
      displayOdds {
        decimal
        fractional {
          numerator
          denominator
        }
      }
    }
    runnerStatus
  }
`);
