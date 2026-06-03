import normalizeObbPvpLegFragmentIntoObbPvpLeg from "./obb-leg-normalizer";

const BFF_RESPONSE_PVP = {
  __typename: "ObbLeg",
  quote: {
    __typename: "ObbQuoteSuccess",
    price: {
      decimal: 7.5,
      fractional: {
        numerator: 13,
        denominator: 2,
        __typename: "FractionalOdds",
      },
      __typename: "SportsbookOdds",
    },
  },
  event: {
    __typename: "SportsEvent",
    urn: "ppb:event:33639890",
    name: "Peterborough v Stevenage",
    eventId: "123",
  },
  templateId: "playerVsPlayer",
  templateParams: {
    __typename: "ObbPvpParams",
    outcomeId: "GOALS_TIME_ADJUSTED",
    participantIdA: {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:6975/e/33639890",
    },
    participantIdB: {
      __typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:1234/e/33639890",
    },
    timePeriodId: "MATCH",
  },
};

const BFF_RESPONSE_SQUAD_BET = {
  __typename: "ObbLeg",
  quote: {
    __typename: "ObbQuoteSuccess",
    price: {
      decimal: 5.0,
      fractional: {
        numerator: 4,
        denominator: 1,
        __typename: "FractionalOdds",
      },
      __typename: "SportsbookOdds",
    },
  },
  event: {
    __typename: "SportsEvent",
    urn: "ppb:event:33639890",
    name: "Peterborough v Stevenage",
    eventId: "456",
  },
  templateId: "squadBet",
  templateParams: {
    __typename: "ObbSquadBetParams",
    outcomeIds: ["GOALS", "ASSISTS"],
    value: 2,
    timePeriodId: "MATCH",
    quantifier: "EXACTLY",
    participantIds: [
      {
        __typename: "ObbFootballPlayer",
        urn: "ppb:obb:footballPlayer:6975/e/33639890",
      },
      {
        __typename: "ObbFootballPlayer",
        urn: "ppb:obb:footballPlayer:1234/e/33639890",
      },
    ],
  },
};

const BFF_RESPONSE_UNKNOWN = {
  __typename: "ObbLeg",
  quote: {
    __typename: "ObbQuoteSuccess",
    price: {
      decimal: 2.0,
      fractional: {
        numerator: 1,
        denominator: 1,
        __typename: "FractionalOdds",
      },
      __typename: "SportsbookOdds",
    },
  },
  event: {
    __typename: "SportsEvent",
    urn: "ppb:event:33639890",
    name: "Peterborough v Stevenage",
    eventId: "789",
  },
  templateId: "unknownTemplate",
  templateParams: {
    __typename: "UnknownTemplateParams",
    someProperty: "someValue",
  },
};

describe("OBB leg normalizer", () => {
  describe("normalizeObbLegFragmentIntoObbLeg", () => {
    describe("when receiving ObbPvpParams", () => {
      it("should correctly transform PvP template params and return the data object", () => {
        const { data } = normalizeObbPvpLegFragmentIntoObbPvpLeg(BFF_RESPONSE_PVP);

        expect(data).toEqual({
          event: {
            typename: "SportsEvent",
            urn: "ppb:event:33639890",
            name: "Peterborough v Stevenage",
            eventId: "123",
          },
          quote: {
            typename: "ObbQuoteSuccess",
            price: {
              typename: "SportsbookOdds",
              decimal: 7.5,
              fractional: {
                denominator: 2,
                numerator: 13,
                typename: "FractionalOdds",
              },
            },
          },
          templateParams: {
            participantIdA: {
              urn: "ppb:obb:footballPlayer:6975/e/33639890",
              typename: "ObbFootballPlayer",
            },
            participantIdB: {
              urn: "ppb:obb:footballPlayer:1234/e/33639890",
              typename: "ObbFootballPlayer",
            },
            outcomeId: "GOALS_TIME_ADJUSTED",
            timePeriodId: "MATCH",
          },
          templateId: "playerVsPlayer",
          id: "17eaeee8a8bdabc8",
        });
      });
    });

    describe("when receiving ObbSquadBetParams", () => {
      it("should correctly transform Squad Bet template params and return the data object", () => {
        const { data } = normalizeObbPvpLegFragmentIntoObbPvpLeg(BFF_RESPONSE_SQUAD_BET);

        expect(data.event).toEqual({
          typename: "SportsEvent",
          urn: "ppb:event:33639890",
          name: "Peterborough v Stevenage",
          eventId: "456",
        });

        expect(data.quote).toEqual({
          typename: "ObbQuoteSuccess",
          price: {
            typename: "SportsbookOdds",
            decimal: 5.0,
            fractional: {
              denominator: 1,
              numerator: 4,
              typename: "FractionalOdds",
            },
          },
        });

        expect(data.templateParams).toEqual({
          participantIds: [
            {
              urn: "ppb:obb:footballPlayer:6975/e/33639890",
              typename: "ObbFootballPlayer",
            },
            {
              urn: "ppb:obb:footballPlayer:1234/e/33639890",
              typename: "ObbFootballPlayer",
            },
          ],
          outcomeIds: ["GOALS", "ASSISTS"],
          value: 2,
          timePeriodId: "MATCH",
          quantifier: "EXACTLY",
        });

        expect(data.templateId).toBe("squadBet");
        expect(data.id).toBeDefined();
        expect(typeof data.id).toBe("string");
      });
    });

    describe("when receiving unknown template params type", () => {
      it("should throw an error for unknown template params type", () => {
        expect(() => {
          normalizeObbPvpLegFragmentIntoObbPvpLeg(BFF_RESPONSE_UNKNOWN);
        }).toThrow("Unknown template params type");
      });
    });
  });
});
