import { createIsAccaFreezeEligibleSelector, createSportsbookBetSelector } from "./sportsbook-bets-selectors";

const stateMock = {
  "ppb:sbkBet:923285015": {
    urn: "ppb:sbkBet:923285015",
    betReceiptId: "O/10221904/0000162",
    betType: "SGL",
  },
};

const stateMock2 = {
  "ppb:sbkBet:923285104": {
    urn: "ppb:sbkBet:923285104",
    betReceiptId: "O/10221901/0000162",
    betType: "SGL",
  },
};

const stateMock3 = {
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betReceiptId: "O/10221904/0000164",
        betType: "DOUBLE",
        currentSize: 0.32,
        betId: 12345678,
        profitAndLoss: 1.91,
        numLines: 1,
        edges: [],
        legs: [
          {
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
                  mutationAvailability: "Available",
                },
              ],
            },
          },
          {
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
                  mutationAvailability: "Unavailable",
                },
              ],
            },
          },
        ],
        result: "CASHED_OUT",
        mutations: {
          eligibility: [{ mutation: "AccaFreeze" }],
        },
      },
    },
  },
  entities: { preferences: {}, throttles: {} },
};

const stateMock4 = {
  betting: {
    sportsbookbets: {
      "ppb:sbkBet:923378353": {
        urn: "ppb:sbkBet:923378353",
        betReceiptId: "O/10221904/0000164",
        betType: "DOUBLE",
        currentSize: 0.32,
        betId: 12345678,
        profitAndLoss: 1.91,
        numLines: 1,
        edges: [],
        legs: [
          {
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
                  mutationAvailability: "Unavailable",
                },
              ],
            },
          },
          {
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
                  mutationAvailability: "Unavailable",
                },
              ],
            },
          },
        ],
        result: "CASHED_OUT",
        mutations: {
          eligibility: [{ mutation: "None" }],
        },
      },
    },
  },
  entities: { preferences: {}, throttles: {} },
};

describe('"bets" selectors', () => {
  describe("createSportsbookBetSelector", () => {
    it("should be a function factory", () => {
      const getSportsbookBet = createSportsbookBetSelector();
      expect(getSportsbookBet).toEqual(expect.any(Function));
      expect(getSportsbookBet).not.toBe(createSportsbookBetSelector());
    });

    describe("when state does not change", () => {
      it("should not recompute the selector", () => {
        const getSportsbookBet = createSportsbookBetSelector();
        getSportsbookBet(stateMock);
        getSportsbookBet(stateMock);

        expect(getSportsbookBet.recomputations()).toEqual(1);
      });
    });

    describe("when state changes", () => {
      it("should recompute the selector", () => {
        const getSportsbookBet = createSportsbookBetSelector();
        getSportsbookBet(stateMock);
        getSportsbookBet(stateMock2);
        getSportsbookBet(stateMock2);

        expect(getSportsbookBet.recomputations()).toEqual(2);
      });
    });

    describe("when bet for requested urn exists", () => {
      it("should return the corresponding bet", () => {
        const getSportsbookBet = createSportsbookBetSelector();
        expect(getSportsbookBet(stateMock, "ppb:sbkBet:923285015")).toStrictEqual({
          urn: "ppb:sbkBet:923285015",
          betReceiptId: "O/10221904/0000162",
          betType: "SGL",
        });
      });
    });

    describe("when bet for requested urn does not exists", () => {
      it("should return undefined", () => {
        const getSportsbookBet = createSportsbookBetSelector();
        expect(getSportsbookBet(stateMock, "ppb:sbkBet:24312")).toBe(undefined);
      });
    });
  });

  describe("createIsAccaFreezeEligibleSelector", () => {
    it("should be a function factory", () => {
      const isAccaFreezeEligible = createIsAccaFreezeEligibleSelector();
      expect(isAccaFreezeEligible).toEqual(expect.any(Function));
      expect(isAccaFreezeEligible).not.toBe(createIsAccaFreezeEligibleSelector());
    });

    describe("when acca freeze is available", () => {
      it("should return as true", () => {
        const isAccaFreezeEligible = createIsAccaFreezeEligibleSelector();

        expect(isAccaFreezeEligible(stateMock3.betting.sportsbookbets, "ppb:sbkBet:923378353")).toEqual(true);
      });
    });

    describe("when acca freeze is unavailable", () => {
      it("should return as false", () => {
        const isAccaFreezeEligible = createIsAccaFreezeEligibleSelector();

        expect(isAccaFreezeEligible(stateMock4.betting.sportsbookbets, "ppb:sbkBet:923378353")).toEqual(false);
      });
    });
  });
});
