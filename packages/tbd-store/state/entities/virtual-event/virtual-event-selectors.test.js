import {
  getVirtualEventByURN,
  createVirtualEventByURNSelector,
  createVirtualSportEventsByURNSelector,
} from "./virtual-event-selectors";

const stateMock = {
  "ppb:virtualEvent:22334455": {
    urn: "ppb:virtualEvent:22334455",
    sport: "ppb:virtualSport:0",
  },
  "ppb:virtualEvent:22334456": {
    urn: "ppb:virtualEvent:22334456",
    sport: "ppb:virtualSport:1",
  },
};

describe("virtual events selectors", () => {
  describe("getVirtualEventByURN selector", () => {
    it("must return undefined when receiving an URN for a non-existing virtual event", () => {
      const result = getVirtualEventByURN("RANDOM_URN");
      expect(result).toBe(undefined);
    });

    it("must return a virtual event when receiving an URN for an existing virtual event", () => {
      const result = getVirtualEventByURN(stateMock, "ppb:virtualEvent:22334455");
      expect(result).toEqual(stateMock["ppb:virtualEvent:22334455"]);
    });
  });

  describe("createVirtualEventByURNSelector selector", () => {
    it("must return undefined when receiving an URN for a non-existing virtual event", () => {
      const getVirtualEventByURNByCreateSelector = createVirtualEventByURNSelector();
      const result = getVirtualEventByURNByCreateSelector(stateMock, "RANDOM_URN");

      expect(result).toBe(undefined);
    });

    it("must return a virtual event when receiving an URN for an existing virtual event", () => {
      const getVirtualEventByURNByCreateSelector = createVirtualEventByURNSelector();
      const result = getVirtualEventByURNByCreateSelector(stateMock, "ppb:virtualEvent:22334455");

      expect(result).toEqual(stateMock["ppb:virtualEvent:22334455"]);
    });
  });

  describe("createVirtualSportEventsByURNSelector selector", () => {
    it("must return empty when receiving an URN for a non-existing virtual sport", () => {
      const getVirtualSportEventsByURN = createVirtualSportEventsByURNSelector();
      const result = getVirtualSportEventsByURN(stateMock, "RANDOM_URN");

      expect(result).toEqual([]);
    });

    it("must return virtual events when receiving an URN for an existing virtual sport", () => {
      const getVirtualSportEventsByURN = createVirtualSportEventsByURNSelector();
      const result = getVirtualSportEventsByURN(stateMock, "ppb:virtualSport:0");

      expect(result).toEqual([stateMock["ppb:virtualEvent:22334455"]]);
    });
  });
});
