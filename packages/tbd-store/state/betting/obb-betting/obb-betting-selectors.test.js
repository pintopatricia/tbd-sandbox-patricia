import {
  getObbBettingState,
  getObbBettingLegs,
  getObbBettingPrimeLegs,
  createGetObbPotentialBetsByIdSelector,
  createGetObbLegsMetadataByPotentialBetIdSelector,
  getObbBettingPotentialBets,
  createGetObbLegsUrnsByPotentialBetIdSelector,
  getObbBettingValidations,
  getObbBetslipFailure,
  getObbPotentialBetFailures,
  getObbLegFailures,
  createGetObbCombinedLegsMetadataByPotentialBetIdSelector,
  getObbCombinedLegFailures,
  getObbCombinedPotentialBetFailures,
  createGetObbLegInBetslipByIdSelector,
  createGetXofNDataByPotentialBetIdSelector,
} from "./obb-betting-selectors";

describe("OBB Betting Selectors", () => {
  beforeEach(jest.resetAllMocks);

  describe("getObbBettingState", () => {
    it("should return obbBetting", () => {
      const state = { betting: { obbBetting: {} } };

      expect(getObbBettingState(state)).toBe(state.betting.obbBetting);
    });
  });

  describe("getObbBettingPotentialBets", () => {
    it("should return potential bets from obbBetting", () => {
      const state = { betting: { obbBetting: { potentialBets: { foo: "bar" } } } };

      expect(getObbBettingPotentialBets(state)).toEqual({ foo: "bar" });
    });
  });

  describe("getObbBettingPrimeLegs", () => {
    it("should return the potential prime legs from obbBetting", () => {
      const state = {
        betting: {
          obbBetting: {
            legs: {
              leg1: { id: "leg1", templateId: "xOfN" },
              leg2: { id: "leg2", templateId: "participantsCombined" },
              leg3: { id: "leg3", templateId: "playerVsPlayer" },
            },
          },
        },
      };
      expect(getObbBettingPrimeLegs(state)).toEqual({
        leg2: {
          id: "leg2",
          templateId: "participantsCombined",
        },
        leg3: {
          id: "leg3",
          templateId: "playerVsPlayer",
        },
      });
    });
  });

  describe("getObbBettingValidations", () => {
    it("should return validations from obbBetting", () => {
      const state = { betting: { obbBetting: { validations: { foo: "bar" } } } };

      expect(getObbBettingValidations(state)).toEqual({ foo: "bar" });
    });
  });

  describe("getObbBetslipFailure", () => {
    it("should return the betslip failures from obbBetting", () => {
      const state = { betting: { obbBetting: { failures: { betslip: { foo: "bar" } } } } };

      expect(getObbBetslipFailure(state)).toEqual({ foo: "bar" });
    });
  });

  describe("getObbPotentialBetFailures", () => {
    it("should return the potential bet failures from obbBetting", () => {
      const state = { betting: { obbBetting: { failures: { potentialBets: { foo: "bar" } } } } };

      expect(getObbPotentialBetFailures(state)).toEqual({ foo: "bar" });
    });
  });

  describe("getObbLegFailures", () => {
    it("should return the leg failures from obbBetting", () => {
      const state = { betting: { obbBetting: { failures: { legs: { foo: "bar" } } } } };

      expect(getObbLegFailures(state)).toEqual({ foo: "bar" });
    });
  });

  describe("getObbCombinedLegFailures", () => {
    it("should return the combined leg failures from obbBetting", () => {
      const state = {
        betting: {
          obbBetting: {
            legs: {
              leg1: { id: "leg1", params: { baseBets: [{ templateId: "pvp" }, { templateId: "pvp" }] } },
              leg2: { id: "leg2", params: { outcomeId: "GOALS" } },
              leg3: { id: "leg3", params: { outcomeId: "GOALS" } },
            },
            failures: {
              legs: {
                leg1: "LEG_FAILURE",
                leg2: "LEG_FAILURE",
                leg3: "LEG_FAILURE",
              },
            },
          },
        },
      };
      expect(getObbCombinedLegFailures(state)).toEqual({
        leg1: "LEG_FAILURE",
      });
    });
  });

  describe("getObbCombinedPotentialBetFailures", () => {
    it("should return the combined potential bet failures from obbBetting", () => {
      const state = {
        betting: {
          obbBetting: {
            potentialBets: {
              bet1: { legs: ["leg1"] },
              bet2: { legs: ["leg2"] },
              bet3: { legs: ["leg3"] },
            },
            legs: {
              leg1: { id: "leg1", params: { baseBets: [{ templateId: "pvp" }, { templateId: "pvp" }] } },
              leg2: { id: "leg2", params: { outcomeId: "GOALS" } },
              leg3: { id: "leg3", params: { outcomeId: "GOALS" } },
            },
            failures: {
              potentialBets: {
                bet1: "POTENTIAL_BET_FAILURE",
                bet2: "POTENTIAL_BET_FAILURE",
                bet3: "POTENTIAL_BET_FAILURE",
              },
            },
          },
        },
      };
      expect(getObbCombinedPotentialBetFailures(state)).toEqual({
        bet1: "POTENTIAL_BET_FAILURE",
      });
    });
  });

  describe("getObbBettingLegs", () => {
    it("should return obbBetting legs", () => {
      const state = { betting: { obbBetting: { legs: {} } } };

      expect(getObbBettingLegs(state)).toBe(state.betting.obbBetting.legs);
    });
  });

  describe("createGetObbLegsMetadataByPotentialBetIdSelector", () => {
    it("should return obbBetting legs metadata when the bet exists", () => {
      const legUrn = "leg:urn:1";
      const potentialBetId = "bet:urn:1";
      const state = {
        betting: {
          obbBetting: {
            potentialBets: { [potentialBetId]: { legs: [legUrn] } },
            legs: {
              [legUrn]: { event: { name: "EventName" }, metadata: { participantsDescription: "participants" } },
            },
          },
        },
      };

      expect(createGetObbLegsMetadataByPotentialBetIdSelector()(state, potentialBetId)).toEqual({
        [legUrn]: {
          eventName: "EventName",
          participantsDescription: "participants",
        },
      });
    });

    it("should return an empty object when the bet does not exist", () => {
      const potentialBetId = "bet:urn:2";
      const state = {
        betting: {
          obbBetting: {
            potentialBets: { "bet:urn:1": { legs: ["leg:urn:1"] } },
            legs: {
              "leg:urn:1": { event: { name: "EventName" }, metadata: { participantsDescription: "participants" } },
            },
          },
        },
      };

      expect(createGetObbLegsMetadataByPotentialBetIdSelector()(state, potentialBetId)).toEqual({});
    });
  });

  describe("createGetObbPotentialBetsByIdSelector", () => {
    it("should return obbBetting potential legs", () => {
      const legId = "leg:urn:1";
      const state = {
        betting: { obbBetting: { potentialBets: { [legId]: { dummyDataProp: "dummyDataPro" } } } },
      };

      expect(createGetObbPotentialBetsByIdSelector()(state, legId)).toBe(state.betting.obbBetting.potentialBets[legId]);
    });
  });

  describe("createGetObbLegsUrnsByPotentialBetIdSelector", () => {
    it("should return obbBetting legs urns", () => {
      const legUrn = "leg:urn:1";
      const potentialBetId = "bet:urn:1";
      const state = {
        betting: { obbBetting: { potentialBets: { [potentialBetId]: { legs: [legUrn] } } } },
      };

      expect(createGetObbLegsUrnsByPotentialBetIdSelector()(state, potentialBetId)).toEqual([legUrn]);
    });
  });

  describe("createGetObbCombinedLegsMetadataByPotentialBetIdSelector", () => {
    it("should return the combined legs metadata", () => {
      const state = {
        betting: {
          obbBetting: {
            potentialBets: {
              bet1: { legs: ["leg3"] },
              bet2: { legs: ["leg1"] },
              bet3: { legs: ["leg2"] },
            },
            legs: {
              leg1: {
                templateId: "pvp",
                event: { name: "EventName 1" },
                params: { outcomeId: "SHOTS" },
                metadata: { participantsDescription: "participants 1" },
              },
              leg2: {
                templateId: "pvp",
                event: { name: "EventName 2" },
                params: { outcomeId: "GOALS" },
                metadata: { participantsDescription: "participants 2" },
              },
              leg3: {
                params: {
                  baseBets: [
                    { templateId: "pvp", params: { outcomeId: "SHOTS" } },
                    { templateId: "pvp", params: { outcomeId: "GOALS" } },
                  ],
                },
              },
            },
          },
        },
      };

      expect(createGetObbCombinedLegsMetadataByPotentialBetIdSelector()(state, "bet1")).toEqual({
        leg1: { eventName: "EventName 1", participantsDescription: "participants 1" },
        leg2: { eventName: "EventName 2", participantsDescription: "participants 2" },
      });
    });
  });

  describe("createGetObbLegInBetslipByIdSelector", () => {
    it("should return true if the exists in betslip", () => {
      const betslipId = "betslip:123";
      const state = {
        betting: { obbBetting: { legs: { [betslipId]: { id: betslipId } } } },
      };

      expect(createGetObbLegInBetslipByIdSelector()(state, betslipId)).toBe(true);
    });

    it("should return false if the betslip does not exist", () => {
      const betslipId = "betslip:456";
      const state = {
        betting: { obbBetting: { legs: { "betslip:123": { id: "betslip:123" } } } },
      };

      expect(createGetObbLegInBetslipByIdSelector()(state, betslipId)).toBe(false);
    });
  });

  describe("createGetXofNDataByPotentialBetIdSelector", () => {
    it("should return array with id and x for potential bets with X_OF_N legs and quotes", () => {
      const state = {
        betting: {
          obbBetting: {
            potentialBets: {
              "bet:1": {
                legs: ["leg:1"],
                quote: { price: { decimal: 2.5 } },
              },
              "bet:2": {
                legs: ["leg:2"],
                quote: { price: { decimal: 3.0 } },
              },
            },
            legs: {
              "leg:1": {
                id: "leg:1",
                templateId: "xOfN",
                params: { x: 2, baseBets: [] },
              },
              "leg:2": {
                id: "leg:2",
                templateId: "xOfN",
                params: { x: 3, baseBets: [] },
              },
            },
          },
        },
      };

      expect(createGetXofNDataByPotentialBetIdSelector()(state, ["bet:1", "bet:2"])).toEqual([
        { id: "bet:1", x: 2 },
        { id: "bet:2", x: 3 },
      ]);
    });

    it("should filter out potential bets without quotes", () => {
      const state = {
        betting: {
          obbBetting: {
            potentialBets: {
              "bet:1": {
                legs: ["leg:1"],
                quote: { price: { decimal: 2.5 } },
              },
              "bet:2": {
                legs: ["leg:2"],
                quote: null,
              },
            },
            legs: {
              "leg:1": {
                id: "leg:1",
                templateId: "xOfN",
                params: { x: 2, baseBets: [] },
              },
              "leg:2": {
                id: "leg:2",
                templateId: "xOfN",
                params: { x: 3, baseBets: [] },
              },
            },
          },
        },
      };

      expect(createGetXofNDataByPotentialBetIdSelector()(state, ["bet:1", "bet:2"])).toEqual([{ id: "bet:1", x: 2 }]);
    });

    it("should filter out legs without x parameter", () => {
      const state = {
        betting: {
          obbBetting: {
            potentialBets: {
              "bet:1": {
                legs: ["leg:1"],
                quote: { price: { decimal: 2.5 } },
              },
              "bet:2": {
                legs: ["leg:2"],
                quote: { price: { decimal: 3.0 } },
              },
            },
            legs: {
              "leg:1": {
                id: "leg:1",
                templateId: "xOfN",
                params: { x: 2, baseBets: [] },
              },
              "leg:2": {
                id: "leg:2",
                templateId: "playerVsPlayer",
                params: { outcomeId: "GOALS_TIME_ADJUSTED" },
              },
            },
          },
        },
      };

      expect(createGetXofNDataByPotentialBetIdSelector()(state, ["bet:1", "bet:2"])).toEqual([{ id: "bet:1", x: 2 }]);
    });

    it("should return empty array when potential bet does not exist", () => {
      const state = {
        betting: {
          obbBetting: {
            potentialBets: {},
            legs: {},
          },
        },
      };

      expect(createGetXofNDataByPotentialBetIdSelector()(state, ["bet:1"])).toEqual([]);
    });

    it("should return empty array when given empty array", () => {
      const state = {
        betting: {
          obbBetting: {
            potentialBets: {
              "bet:1": {
                legs: ["leg:1"],
                quote: { price: { decimal: 2.5 } },
              },
            },
            legs: {
              "leg:1": {
                id: "leg:1",
                templateId: "xOfN",
                params: { x: 2, baseBets: [] },
              },
            },
          },
        },
      };

      expect(createGetXofNDataByPotentialBetIdSelector()(state, [])).toEqual([]);
    });

    it("should handle multiple legs per potential bet correctly", () => {
      const state = {
        betting: {
          obbBetting: {
            potentialBets: {
              "bet:1": {
                legs: ["leg:1", "leg:2"],
                quote: { price: { decimal: 2.5 } },
              },
            },
            legs: {
              "leg:1": {
                id: "leg:1",
                templateId: "xOfN",
                params: { x: 2, baseBets: [] },
              },
              "leg:2": {
                id: "leg:2",
                templateId: "xOfN",
                params: { x: 3, baseBets: [] },
              },
            },
          },
        },
      };

      expect(createGetXofNDataByPotentialBetIdSelector()(state, ["bet:1"])).toEqual([
        { id: "bet:1", x: 2 },
        { id: "bet:1", x: 3 },
      ]);
    });
  });
});
