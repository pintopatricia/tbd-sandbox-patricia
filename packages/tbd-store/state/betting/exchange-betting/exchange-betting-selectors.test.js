import {
  isOfRunner,
  getMarketPotentialBets,
  getUnmatchedBets,
  getBettingMarket,
  createBettingMarketRunnersPositionSelector,
  createMarketPotentialBetsSelector,
} from "./exchange-betting-selectors";

beforeEach(jest.clearAllMocks);

describe("getUnmatchedBets", () => {
  describe("when there is not market state", () => {
    it("should return an empty array", () => {
      const appState = {
        betting: {
          exchangeBetting: {
            1.1: {
              unmatchedBets: [],
            },
          },
        },
      };

      expect(getUnmatchedBets(appState, "1.2", ["some betId"])).toEqual([]);
    });
  });
  describe("when there is market state", () => {
    describe("but can't find bet with given id", () => {
      it("should return an empty array", () => {
        const appState = {
          betting: {
            exchangeBetting: {
              1.1: {
                unmatchedBets: [
                  {
                    id: "some betId",
                  },
                ],
              },
            },
          },
        };

        expect(getUnmatchedBets(appState, "1.1", ["another betId"])).toEqual([]);
      });
    });

    describe("and can find bet with given id", () => {
      it("should return unmatched bet array", () => {
        const appState = {
          betting: {
            exchangeBetting: {
              1.1: {
                unmatchedBets: [
                  {
                    id: "u:111",
                  },
                ],
              },
            },
          },
        };

        expect(getUnmatchedBets(appState, "1.1", ["111"])).toEqual([
          {
            id: "u:111",
          },
        ]);
      });
    });
  });
});

describe("isOfRunner", () => {
  describe("when selectionId is different", () => {
    it("should return false", () => {
      const bet = { selectionId: 1, handicap: 0 };
      const runner = { selectionId: 2, handicap: 0 };
      expect(isOfRunner(bet, runner)).toBe(false);
    });
  });
  describe("when handicap is different", () => {
    it("should return false", () => {
      const bet = { selectionId: 1, handicap: 0 };
      const runner = { selectionId: 1, handicap: 1 };
      expect(isOfRunner(bet, runner)).toBe(false);
    });
  });
  describe("when both selectionId and handicap are the same", () => {
    it("should return true", () => {
      const bet = { selectionId: 1, handicap: 0 };
      const runner = { selectionId: 1, handicap: 0 };
      expect(isOfRunner(bet, runner)).toBe(true);
    });
  });
});

describe("getMarketPotentialBets", () => {
  const stateMock = {
    betting: {
      exchangeBetting: {
        "some:market:urn": {
          potentialBets: ["list_of_potential_bets"],
        },
      },
    },
  };

  describe("when there is no exchange market", () => {
    it("should return an empty array", () => {
      expect(getMarketPotentialBets(stateMock, "random:urn")).toEqual([]);
    });
  });

  describe("when there is an exchange market", () => {
    it("should return the potential bets from state", () => {
      expect(getMarketPotentialBets(stateMock, "some:market:urn")).toEqual(["list_of_potential_bets"]);
    });
  });
});

describe("getBettingMarket", () => {
  const stateMock = {
    betting: {
      exchangeBetting: {
        "some:market:urn": {
          some: "market",
        },
      },
    },
  };

  describe("when there is no exchange market", () => {
    it("should return an empty array", () => {
      expect(getBettingMarket(stateMock, "random:urn")).toEqual(undefined);
    });
  });

  describe("when there is an exchange market", () => {
    it("should return the market state", () => {
      expect(getBettingMarket(stateMock, "some:market:urn")).toEqual({ some: "market" });
    });
  });
});

describe("createMarketPotentialBetsSelector", () => {
  const stateMock = {
    betting: {
      exchangeBetting: {
        "some:market:urn": {
          potentialBets: [{ betId: "betId" }],
        },
      },
    },
  };

  describe("when there are potential bets for that market", () => {
    it("should return potential bets", () => {
      const potentialBets = createMarketPotentialBetsSelector()(stateMock.betting.exchangeBetting, "some:market:urn");
      expect(potentialBets).toEqual([{ betId: "betId" }]);
    });
  });

  describe("when there are no potential bets for that market", () => {
    const potentialBets = createMarketPotentialBetsSelector()(
      stateMock.betting.exchangeBetting,
      "some:othermarket:urn",
    );

    it("should return potential bets as undefined", () => {
      expect(potentialBets).toEqual(undefined);
    });
  });
});

describe("createBettingMarketRunnersPositionSelector", () => {
  function getState() {
    return {
      betting: {
        exchangeBetting: {
          "some:market:urn": {
            runnersPosition: [
              {
                handicap: 0,
                pnl: {
                  lose: undefined,
                  win: undefined,
                },
                potentialPnl: {
                  lose: undefined,
                  win: undefined,
                },
                whatIf: {
                  lose: undefined,
                  win: undefined,
                },
              },
            ],
          },
        },
      },
    };
  }

  describe("when there is a market", () => {
    it("should return the runner positions", () => {
      const stateMock = getState();
      const runnerPositions = createBettingMarketRunnersPositionSelector()(
        stateMock.betting.exchangeBetting,
        "some:market:urn",
      );

      expect(runnerPositions.length).toBe(1);
      expect(runnerPositions).toEqual([
        {
          handicap: 0,
          pnl: {
            lose: undefined,
            win: undefined,
          },
          potentialPnl: {
            lose: undefined,
            win: undefined,
          },
          whatIf: {
            lose: undefined,
            win: undefined,
          },
        },
      ]);
    });

    describe("when runners position change (handicap)", () => {
      it("should return the updated runners positions", () => {
        const stateMock = getState();
        const stateMockUpdate = getState();
        stateMockUpdate.betting.exchangeBetting["some:market:urn"].runnersPosition[0].handicap = 1;

        const getBettinMarketRunnersPosition = createBettingMarketRunnersPositionSelector();

        const runnerPositions = getBettinMarketRunnersPosition(stateMock.betting.exchangeBetting, "some:market:urn");
        const runnerPositions2 = getBettinMarketRunnersPosition(
          stateMockUpdate.betting.exchangeBetting,
          "some:market:urn",
        );

        expect(runnerPositions === runnerPositions2).toEqual(false);
      });
    });

    describe("when runners position change (pnl.win)", () => {
      it("should return the updated runners positions", () => {
        const stateMock = getState();
        const stateMockUpdate = getState();
        stateMockUpdate.betting.exchangeBetting["some:market:urn"].runnersPosition[0].pnl.win = 1;

        const getBettinMarketRunnersPosition = createBettingMarketRunnersPositionSelector();

        const runnerPositions = getBettinMarketRunnersPosition(stateMock.betting.exchangeBetting, "some:market:urn");
        const runnerPositions2 = getBettinMarketRunnersPosition(
          stateMockUpdate.betting.exchangeBetting,
          "some:market:urn",
        );

        expect(runnerPositions === runnerPositions2).toEqual(false);
      });
    });

    describe("when runners position change (pnl.lose)", () => {
      it("should return the updated runners positions", () => {
        const stateMock = getState();
        const stateMockUpdate = getState();
        stateMockUpdate.betting.exchangeBetting["some:market:urn"].runnersPosition[0].pnl.lose = 1;

        const getBettinMarketRunnersPosition = createBettingMarketRunnersPositionSelector();

        const runnerPositions = getBettinMarketRunnersPosition(stateMock.betting.exchangeBetting, "some:market:urn");
        const runnerPositions2 = getBettinMarketRunnersPosition(
          stateMockUpdate.betting.exchangeBetting,
          "some:market:urn",
        );

        expect(runnerPositions === runnerPositions2).toEqual(false);
      });
    });

    describe("when runners position change (potentialPnl.win)", () => {
      it("should return the updated runners positions", () => {
        const stateMock = getState();
        const stateMockUpdate = getState();
        stateMockUpdate.betting.exchangeBetting["some:market:urn"].runnersPosition[0].potentialPnl.win = 1;

        const getBettinMarketRunnersPosition = createBettingMarketRunnersPositionSelector();

        const runnerPositions = getBettinMarketRunnersPosition(stateMock.betting.exchangeBetting, "some:market:urn");
        const runnerPositions2 = getBettinMarketRunnersPosition(
          stateMockUpdate.betting.exchangeBetting,
          "some:market:urn",
        );

        expect(runnerPositions === runnerPositions2).toEqual(false);
      });
    });

    describe("when runners position change (potentialPnl.lose)", () => {
      it("should return the updated runners positions", () => {
        const stateMock = getState();
        const stateMockUpdate = getState();
        stateMockUpdate.betting.exchangeBetting["some:market:urn"].runnersPosition[0].potentialPnl.lose = 1;

        const getBettinMarketRunnersPosition = createBettingMarketRunnersPositionSelector();

        const runnerPositions = getBettinMarketRunnersPosition(stateMock.betting.exchangeBetting, "some:market:urn");
        const runnerPositions2 = getBettinMarketRunnersPosition(
          stateMockUpdate.betting.exchangeBetting,
          "some:market:urn",
        );

        expect(runnerPositions === runnerPositions2).toEqual(false);
      });
    });

    describe("when runners position change (whatIf.win)", () => {
      it("should return the updated runners positions", () => {
        const stateMock = getState();
        const stateMockUpdate = getState();
        stateMockUpdate.betting.exchangeBetting["some:market:urn"].runnersPosition[0].whatIf.win = 1;

        const getBettinMarketRunnersPosition = createBettingMarketRunnersPositionSelector();

        const runnerPositions = getBettinMarketRunnersPosition(stateMock.betting.exchangeBetting, "some:market:urn");
        const runnerPositions2 = getBettinMarketRunnersPosition(
          stateMockUpdate.betting.exchangeBetting,
          "some:market:urn",
        );

        expect(runnerPositions === runnerPositions2).toEqual(false);
      });
    });

    describe("when runners position change (whatIf.lose)", () => {
      it("should return the updated runners positions", () => {
        const stateMock = getState();
        const stateMockUpdate = getState();
        stateMockUpdate.betting.exchangeBetting["some:market:urn"].runnersPosition[0].whatIf.lose = 1;

        const getBettinMarketRunnersPosition = createBettingMarketRunnersPositionSelector();

        const runnerPositions = getBettinMarketRunnersPosition(stateMock.betting.exchangeBetting, "some:market:urn");
        const runnerPositions2 = getBettinMarketRunnersPosition(
          stateMockUpdate.betting.exchangeBetting,
          "some:market:urn",
        );

        expect(runnerPositions === runnerPositions2).toEqual(false);
      });
    });

    describe("when state is the same", () => {
      it("should return the same runners positions", () => {
        const stateMock = getState();
        const stateMockUpdate = getState();
        const getBettinMarketRunnersPosition = createBettingMarketRunnersPositionSelector();

        const runnerPositions = getBettinMarketRunnersPosition(stateMock.betting.exchangeBetting, "some:market:urn");
        const runnerPositions2 = getBettinMarketRunnersPosition(
          stateMockUpdate.betting.exchangeBetting,
          "some:market:urn",
        );

        expect(runnerPositions === runnerPositions2).toEqual(true);
      });
    });
  });

  describe("when there are no markets", () => {
    it("should return an empty validations array", () => {
      const stateMock = getState();
      const runnerPositions = createBettingMarketRunnersPositionSelector()(
        stateMock.betting.exchangeBetting,
        "random:market:urn",
      );

      expect(runnerPositions.length).toBe(0);
    });
  });
});
