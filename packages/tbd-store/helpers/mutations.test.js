import { LegType } from "../state/constants";
import { getLegUrnForBMELeg } from "./mutations";

const mockState = {
  "ppb:sbkBetLeg:31241921/0": {
    urn: "ppb:sbkBetLeg:31241921/0",
    typename: "BetLeg",
    type: LegType.SS,
    parts: [],
    legNumber: 1,
    mutations: null,
  },
  "ppb:sbkBetLeg:31241922/0": {
    urn: "ppb:sbkBetLeg:31241922/0",
    typename: "BetLeg",
    type: LegType.SS,
    parts: [],
    legNumber: 1,
    mutations: null,
  },
};

describe("mutations helper", () => {
  describe("getLegUrnForBMELeg", () => {
    it("returns the legUrn for the correct leg", () => {
      expect(getLegUrnForBMELeg(mockState, "31241922", 1)).toEqual("ppb:sbkBetLeg:31241922/0");
    });

    it("returns undefined when the legRef is not in state", () => {
      expect(getLegUrnForBMELeg(mockState, "31241922", 2)).toEqual(undefined);
    });

    it("returns undefined when the betId is not in state", () => {
      expect(getLegUrnForBMELeg(mockState, "31241925", 2)).toEqual(undefined);
    });
  });
});
