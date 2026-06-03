import {
  createSportsbookBetLegSelector,
  createSportsbookBetLegsSelector,
  createAccaFreezeEligibleLegsSelector,
  createIsBetFrozenSelector,
} from "./sportsbook-bet-legs-selectors";

const stateMock = {
  "ppb:sbkBetLeg:923285015/0": {
    urn: "ppb:sbkBetLeg:923285015/0",
  },
};

const stateMock2 = {
  "ppb:sbkBetLeg:923285015/1": {
    urn: "ppb:sbkBetLeg:923285015/1",
  },
};

const stateMock3 = {
  ...stateMock,
  ...stateMock2,
  "ppb:sbkBetLeg:923285015/2": {
    urn: "ppb:sbkBetLeg:923285015/2",
  },
};

const AVAILABLE_ACCA_FREEZE_MOCK = {
  "ppb:sbkBetLeg:923285015/0": {
    urn: "ppb:sbkBetLeg:923285015/0",
    mutations: {
      eligibility: [
        {
          mutation: "AccaFreeze",
          mutationAvailability: "Available",
        },
      ],
    },
  },
};

const ALREADY_FROZEN_BET_LEG_MOCK = {
  "ppb:sbkBetLeg:923285015/0": {
    urn: "ppb:sbkBetLeg:923285015/0",
    mutations: {
      details: [{ freezeDetails: "I am frozen" }],
      eligibility: [
        {
          mutation: "AccaFreeze",
          mutationAvailability: "Available",
        },
      ],
    },
  },
};

const NOT_ALREADY_FROZEN_BET_LEG_MOCK = {
  "ppb:sbkBetLeg:923285015/0": {
    urn: "ppb:sbkBetLeg:923285015/0",
    mutations: {
      details: [],
      eligibility: [
        {
          mutation: "AccaFreeze",
          mutationAvailability: "Available",
        },
      ],
    },
  },
};

const UNAVAILABLE_ACCA_FREEZE_MOCK = {
  "ppb:sbkBetLeg:923285015/0": {
    urn: "ppb:sbkBetLeg:923285015/0",
    mutations: {
      eligibility: [
        {
          mutation: "AccaFreeze",
          mutationAvailability: "Unavailable",
        },
      ],
    },
  },
};

describe('"bet legs" selectors', () => {
  describe("createSportsbookBetLegSelector", () => {
    it("should be a function factory", () => {
      const getSportsbookBetLeg = createSportsbookBetLegSelector();
      expect(getSportsbookBetLeg).toEqual(expect.any(Function));
      expect(getSportsbookBetLeg).not.toBe(createSportsbookBetLegSelector());
    });

    describe("when state does not change", () => {
      it("should not recompute the selector", () => {
        const getSportsbookBetLeg = createSportsbookBetLegSelector();
        getSportsbookBetLeg(stateMock);
        getSportsbookBetLeg(stateMock);

        expect(getSportsbookBetLeg.recomputations()).toEqual(1);
      });
    });

    describe("when state changes", () => {
      it("should recompute the selector", () => {
        const getSportsbookBetLeg = createSportsbookBetLegSelector();
        getSportsbookBetLeg(stateMock);
        getSportsbookBetLeg(stateMock2);
        getSportsbookBetLeg(stateMock2);

        expect(getSportsbookBetLeg.recomputations()).toEqual(2);
      });
    });

    describe("when bet leg for requested urn exists", () => {
      it("should return the corresponding bet leg", () => {
        const getSportsbookBetLeg = createSportsbookBetLegSelector();
        expect(getSportsbookBetLeg(stateMock, "ppb:sbkBetLeg:923285015/0")).toStrictEqual({
          urn: "ppb:sbkBetLeg:923285015/0",
        });
      });
    });

    describe("when bet leg for requested urn does not exists", () => {
      it("should return undefined", () => {
        const getSportsbookBetLeg = createSportsbookBetLegSelector();
        expect(getSportsbookBetLeg(stateMock, "ppb:sbkBetLeg:24312/100")).toBe(undefined);
      });
    });
  });

  describe("createSportsbookBetLegsSelector", () => {
    it("should be a function factory", () => {
      const getSportsbookBetLegs = createSportsbookBetLegsSelector();
      expect(getSportsbookBetLegs).toEqual(expect.any(Function));
      expect(getSportsbookBetLegs).not.toBe(createSportsbookBetLegsSelector());
    });

    describe("when state does not change", () => {
      it("should not recompute the selector", () => {
        const getSportsbookBetLegs = createSportsbookBetLegsSelector();
        const urns = ["ppb:sbkBetLeg:923285015/0", "ppb:sbkBetLeg:923285015/2"];
        getSportsbookBetLegs(stateMock3, urns);
        getSportsbookBetLegs(stateMock3, urns);

        expect(getSportsbookBetLegs.recomputations()).toEqual(1);
      });
    });

    describe("when state changes", () => {
      it("should recompute the selector", () => {
        const getSportsbookBetLegs = createSportsbookBetLegsSelector();
        const urns = ["ppb:sbkBetLeg:923285015/0", "ppb:sbkBetLeg:923285015/2"];
        getSportsbookBetLegs(stateMock2, urns);
        getSportsbookBetLegs(stateMock3, urns);

        expect(getSportsbookBetLegs.recomputations()).toEqual(2);
      });
    });

    describe("when bet leg for requested urn exists", () => {
      it("should return the corresponding bet leg", () => {
        const getSportsbookBetLegs = createSportsbookBetLegsSelector();
        expect(
          getSportsbookBetLegs(stateMock3, ["ppb:sbkBetLeg:923285015/0", "ppb:sbkBetLeg:923285015/2"]),
        ).toStrictEqual([
          {
            urn: "ppb:sbkBetLeg:923285015/0",
          },
          {
            urn: "ppb:sbkBetLeg:923285015/2",
          },
        ]);
      });
    });

    describe("when bet leg for requested urn does not exists", () => {
      it("should return an empty array", () => {
        const getSportsbookBetLegs = createSportsbookBetLegsSelector();
        expect(getSportsbookBetLegs({ stateMock3 }, ["ppb:sbkBetLeg:24312/100"])).toStrictEqual([]);
      });
    });
  });

  describe("createAccaFreezeEligibleLegsSelector", () => {
    it("should be a function factory", () => {
      const getAccaFreezeEligibleLegs = createAccaFreezeEligibleLegsSelector();
      expect(getAccaFreezeEligibleLegs).toEqual(expect.any(Function));
      expect(getAccaFreezeEligibleLegs).not.toBe(createAccaFreezeEligibleLegsSelector());
    });

    describe("when no legs are available for acca freeze", () => {
      it("should return 0", () => {
        const getAccaFreezeEligibleLegs = createAccaFreezeEligibleLegsSelector();
        const numberOfAccaFreezeEligibleLegs = getAccaFreezeEligibleLegs(UNAVAILABLE_ACCA_FREEZE_MOCK, [
          "ppb:sbkBetLeg:923285015/0",
        ]).length;

        expect(numberOfAccaFreezeEligibleLegs).toEqual(0);
      });
    });

    describe("when legs are available for acca freeze", () => {
      it("should return 1", () => {
        const getAccaFreezeEligibleLegs = createAccaFreezeEligibleLegsSelector();
        const numberOfAccaFreezeEligibleLegs = getAccaFreezeEligibleLegs(AVAILABLE_ACCA_FREEZE_MOCK, [
          "ppb:sbkBetLeg:923285015/0",
        ]).length;

        expect(numberOfAccaFreezeEligibleLegs).toEqual(1);
      });
    });
  });

  describe("createIsBetFrozenSelector", () => {
    it("should be a function factory", () => {
      const isBetFrozen = createIsBetFrozenSelector();
      expect(isBetFrozen).toEqual(expect.any(Function));
      expect(isBetFrozen).not.toBe(createIsBetFrozenSelector());
    });

    describe("when the bet is frozen", () => {
      it("should return as true", () => {
        const isBetFrozen = createIsBetFrozenSelector();

        expect(isBetFrozen(ALREADY_FROZEN_BET_LEG_MOCK, ["ppb:sbkBetLeg:923285015/0"])).toEqual(true);
      });
    });

    describe("when the bet is not frozen", () => {
      it("should return as false", () => {
        const isBetFrozen = createIsBetFrozenSelector();

        expect(isBetFrozen(NOT_ALREADY_FROZEN_BET_LEG_MOCK, ["ppb:sbkBetLeg:923285015/0"])).toEqual(false);
      });
    });
  });
});
