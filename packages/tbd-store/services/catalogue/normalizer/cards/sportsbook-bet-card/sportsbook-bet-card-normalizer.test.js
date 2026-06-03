import sportsbookBetCardNormalizer from "./sportsbook-bet-card-normalizer";

const BFF_RESPONSE = {
  __typename: "SportsbookBetCard",
  urn: "sbk_market_bet_card_urn1",
  bet: {
    urn: "sbk_market_bet_urn1",
    legs: [
      {
        parts: [{ marketBetUrn: "ppb:marketBet:1" }],
      },
      {
        parts: [{ marketBetUrn: "ppb:marketBet:2" }],
      },
    ],
  },
  navigationLinks: [
    {
      marketBetUrn: "ppb:marketBet:1",
      viewUrn: "navigationUrn1",
      viewUrl: "navigationUrl1",
    },
    {
      marketBetUrn: "ppb:marketBet:2",
      viewUrn: "navigationUrn2",
      viewUrl: "navigationUrl2",
    },
  ],
  betSharingViewLink: {
    viewUrn: "betSharingViewLinkViewUrn",
  },
};

describe("sportsbook market bets normalizer", () => {
  describe("normalizeSportsbookBetCardFragmentIntoBetCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = sportsbookBetCardNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        urn: "sbk_market_bet_card_urn1",
        typename: "SportsbookBetCard",
        betURN: "sbk_market_bet_urn1",
        navigationLinks: {
          "ppb:marketBet:1": {
            viewUrn: "navigationUrn1",
            viewUrl: "navigationUrl1",
          },
          "ppb:marketBet:2": {
            viewUrn: "navigationUrn2",
            viewUrl: "navigationUrl2",
          },
        },
        betSharingViewLink: BFF_RESPONSE.betSharingViewLink,
      });
    });

    describe("when there are no links", () => {
      it("should correctly transform and return the navigationLinks as an empty object", () => {
        const { data } = sportsbookBetCardNormalizer({
          ...BFF_RESPONSE,
          navigationLinks: [],
        });

        expect(data).toEqual({
          urn: "sbk_market_bet_card_urn1",
          typename: "SportsbookBetCard",
          betURN: "sbk_market_bet_urn1",
          navigationLinks: {},
          betSharingViewLink: BFF_RESPONSE.betSharingViewLink,
        });
      });
    });

    describe("when betSharingViewLink is null", () => {
      it("should return the betSharingViewLink as undefined", () => {
        const { data } = sportsbookBetCardNormalizer({
          ...BFF_RESPONSE,
          betSharingViewLink: null,
        });

        expect(data).toEqual(
          expect.objectContaining({
            betSharingViewLink: undefined,
          }),
        );
      });
    });
  });
});
