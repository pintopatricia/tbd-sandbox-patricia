import sportsbookBetLegCardNormalizer from "./sportsbook-bet-leg-card-normalizer";

const BFF_RESPONSE = {
  __typename: "BetLegCard",
  urn: "ppb:tbd:card:sbkBetLeg:1",
  betUrn: "ppb:sbkBet:1",
  leg: {
    __typename: "BetLeg",
    urn: "ppb:sbkBetLeg:1",
    type: "SS",
    result: "WON",
    parts: [
      {
        marketBetUrn: "ppb:marketBet:1",
      },
      {
        marketBetUrn: "ppb:marketBet:2",
      },
    ],
  },
};
describe("sportsbook market bet legs card normalizer", () => {
  describe("sportsbookBetLegCardNormalizer", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = sportsbookBetLegCardNormalizer(BFF_RESPONSE);

      expect(data).toEqual({
        urn: "ppb:tbd:card:sbkBetLeg:1",
        typename: "BetLegCard",
        betURN: "ppb:sbkBet:1",
        legURN: "ppb:sbkBetLeg:1",
      });
    });
  });
});
