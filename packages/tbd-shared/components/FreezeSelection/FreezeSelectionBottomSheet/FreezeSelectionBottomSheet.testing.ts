import { FreezeCardStates, FreezeCardStatuses } from "../../Card/snowflakes/FreezeCard/shared";
import { BetLegFreezeInfo } from "./map-to-props-factory";

type Params = {
  eligibilityAvailability: string;
  hasFixture: BetLegFreezeInfo["hasFixture"];
  freezeEligibility: BetLegFreezeInfo["freezeEligibility"];
  freezeStatus: BetLegFreezeInfo["freezeStatus"];
  freezeFailure?: boolean;
};

export type Eligibility = {
  mutation: "AccaFreeze";
};

export function aBetLegFreezeInfo(overrides: Partial<Params> = {}) {
  const values: Params = {
    eligibilityAvailability: "Eligible",
    hasFixture: true,
    freezeEligibility: FreezeCardStates.ACTIVE,
    freezeStatus: FreezeCardStatuses.INPLAY,
    freezeFailure: undefined,
    ...overrides,
  };

  return {
    betLeg: {
      legNumber: Math.random(), // Don't care, but should be distinct.
      urn: Math.random(),
      parts: [
        {
          eventDescription: "Man Utd v Everton",
          eventMarketDescription: "First Goal Scorer",
          selectionName: "André Gomes",
          marketBetUrn: "ppb:marketBet:55677043",
        },
      ],
      mutations: {
        eligibility: [
          {
            mutation: "AccaFreeze",
            mutationAvailability: values.eligibilityAvailability,
          },
        ],
        failure: values.freezeFailure,
      },
    },
    eventHeaderUrn: "ppb:eventheader:1",
    hasFixture: values.hasFixture,
    fixtureUrn: "ppb:footballfixture:42",
    freezeEligibility: values.freezeEligibility,
    eventUrn: "ppb:event:7",
    formattedOdds: "3/2",
    freezeStatus: values.freezeStatus,
    freezeCardText: "freezecardtext",
  };
}
