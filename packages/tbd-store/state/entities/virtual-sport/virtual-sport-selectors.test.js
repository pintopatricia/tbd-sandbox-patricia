import {
  getVirtualSportByURN,
  getVirtualSportById,
  createVirtualSportByURNSelector,
  createVirtualSportByIdSelector,
} from "./virtual-sport-selectors";

const stateMock = {
  "ppb:virtualSport:1": {
    urn: "ppb:virtualSport:1",
    sportId: "1",
  },
  "ppb:virtualSport:2": {
    urn: "ppb:virtualSport:2",
    sportId: "2",
  },
  "ppb:virtualSport:3": {
    urn: "ppb:virtualSport:3",
    sportId: "3",
  },
};

describe("virtual sport selectors", () => {
  describe("getVirtualSportByURN selector", () => {
    it("should return undefined when no virtual sport exists", () => {
      const result = getVirtualSportByURN(stateMock, "RANDOM_URN");
      expect(result).toBe(undefined);
    });

    it("should return the correct entity when provided with a valid URN", () => {
      const result = getVirtualSportByURN(stateMock, "ppb:virtualSport:1");
      expect(result).toEqual({
        urn: "ppb:virtualSport:1",
        sportId: "1",
      });
    });
  });

  describe("getVirtualSportById selector", () => {
    it("should return undefined when no virtual sport exists", () => {
      const result = getVirtualSportById(stateMock, "RANDOM_URN");
      expect(result).toBe(undefined);
    });

    it("should return the correct entity when provided with a valid URN", () => {
      const result = getVirtualSportById(stateMock, "1");
      expect(result).toEqual({
        urn: "ppb:virtualSport:1",
        sportId: "1",
      });
    });
  });

  describe("createVirtualSportByURNSelector selector", () => {
    it("must return undefined when receiving an URN for a non-existing virtual sport", () => {
      const getVirtualSportByURNByCreateSelector = createVirtualSportByURNSelector();
      const result = getVirtualSportByURNByCreateSelector(stateMock, "RANDOM_URN");

      expect(result).toBe(undefined);
    });

    it("must return a virtual sport when receiving an URN for an existing virtual sport", () => {
      const getVirtualSportByURNByCreateSelector = createVirtualSportByURNSelector();
      const result = getVirtualSportByURNByCreateSelector(stateMock, "ppb:virtualSport:1");

      expect(result).toEqual(stateMock["ppb:virtualSport:1"]);
    });
  });

  describe("createVirtualSportByIdSelector selector", () => {
    it("must return undefined when receiving an URN for a non-existing virtual sport", () => {
      const getVirtualSportByURNByCreateSelector = createVirtualSportByIdSelector();
      const result = getVirtualSportByURNByCreateSelector(stateMock, "RANDOM_URN");

      expect(result).toBe(undefined);
    });

    it("must return a virtual sport when receiving an URN for an existing virtual sport", () => {
      const getVirtualSportByURNByCreateSelector = createVirtualSportByIdSelector();
      const result = getVirtualSportByURNByCreateSelector(stateMock, "1");

      expect(result).toEqual(stateMock["ppb:virtualSport:1"]);
    });
  });
});
