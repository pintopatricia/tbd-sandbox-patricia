/* eslint-disable no-underscore-dangle */
import normalizeBetSharingCardGroupFragmentIntoBetSharingCardGroup from "./bet-sharing-card-group-normalizer";

jest.mock("../../entities/sportsbook-bet/sportsbook-bet-normalizer", () =>
  jest.fn(() => ({ data: "normalizedBetMock" })),
);

const ODDS_MOCK = {
  decimal: 2.3,
  fractional: {
    numerator: 9,
    denominator: 1,
  },
};

const BET_MOCK = {
  urn: "ppb:tbd:sbkBet:1",
  betReceiptId: "1/O 123",
  betId: "1",
  isSettled: true,
  betType: "SGL",
  isSGM: true,
  isSGMMulti: false,
  has90MinBet: true,
  currentSize: 12.1,
  profitAndLoss: 312,
  originalPotentialWin: 311,
  isOddsBoosted: true,
  numLines: 1,
  betPrice: ODDS_MOCK,
  result: "CASHED_OUT",
  bonus: 1,
  product: "SPORTSBOOK",
  edges: [{ reason: "ACCA_INSURANCE", status: "ACTIVE" }],
};

const BFF_RESPONSE = {
  __typename: "BetSharingCardGroup",
  urn: "ppb:tbd:cardgroup:betSharing:1",
  bet: BET_MOCK,
  full: {
    edges: [
      {
        node: {
          __typename: "SportsbookBetLegCardGroup",
          urn: "ppb:tbd:card:sbkBetLeg:1180181556/0",
          full: {
            edges: [
              {
                node: {
                  __typename: "FixtureCard",
                  urn: "ppb:tbd:card:fixture:30824665|viewLink|0",
                },
              },
              {
                node: {
                  __typename: "BetLegCard",
                  urn: "ppb:tbd:card:sbkBetLeg:1180181556/0",
                },
              },
            ],
          },
        },
      },
      {
        node: {
          __typename: "SportsbookBetLegCardGroup",
          urn: "ppb:tbd:card:sbkBetLeg:1180181556/1",
          full: {
            edges: [
              {
                node: {
                  __typename: "RaceDetailsCard",
                  urn: "ppb:tbd:card:raceDetails:30886155.1230|true",
                },
              },
              {
                node: {
                  __typename: "BetLegCard",
                  urn: "ppb:tbd:card:sbkBetLeg:1180181556/1",
                },
              },
            ],
          },
        },
      },
      {
        node: {
          __typename: "SportsbookBetLegCardGroup",
          urn: "ppb:tbd:card:sbkBetLeg:1180181556/2",
          full: {
            edges: [
              {
                node: {
                  __typename: "BetLegCard",
                  urn: "ppb:tbd:card:sbkBetLeg:1180181556/2",
                },
              },
            ],
          },
        },
      },
    ],
  },
};

describe("Bet Sharing card group normalizer", () => {
  describe("normalizeBetSharingCardGroupFragmentIntoBetSharingCardGroup", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeBetSharingCardGroupFragmentIntoBetSharingCardGroup(BFF_RESPONSE);

      expect(data).toEqual({
        typename: BFF_RESPONSE.__typename,
        urn: BFF_RESPONSE.urn,
        bet: "normalizedBetMock",
        items: [
          {
            typename: BFF_RESPONSE.full.edges[0].node.__typename,
            urn: BFF_RESPONSE.full.edges[0].node.urn,
          },
          {
            typename: BFF_RESPONSE.full.edges[1].node.__typename,
            urn: BFF_RESPONSE.full.edges[1].node.urn,
          },
          {
            typename: BFF_RESPONSE.full.edges[2].node.__typename,
            urn: BFF_RESPONSE.full.edges[2].node.urn,
          },
        ],
      });
    });

    it("should correctly transform and return the data object when items are false", () => {
      BFF_RESPONSE.full.edges[2] = null;

      const { data } = normalizeBetSharingCardGroupFragmentIntoBetSharingCardGroup(BFF_RESPONSE);

      expect(data).toEqual(
        expect.objectContaining({
          items: [
            {
              typename: BFF_RESPONSE.full.edges[0].node.__typename,
              urn: BFF_RESPONSE.full.edges[0].node.urn,
            },
            {
              typename: BFF_RESPONSE.full.edges[1].node.__typename,
              urn: BFF_RESPONSE.full.edges[1].node.urn,
            },
          ],
        }),
      );
    });
  });
});
