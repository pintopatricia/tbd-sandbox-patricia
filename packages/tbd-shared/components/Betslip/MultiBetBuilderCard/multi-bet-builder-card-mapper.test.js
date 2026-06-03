import {
  getBettingResolvers,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getSportsbookConfirmationLegs } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";

import {
  createGetBettingEventGroupedLegs,
  createGetConfirmationEventGroupedLegs,
} from "./multi-bet-builder-card-mapper";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({ localCodeBcp47: "en_US", timezone: "tz" })),
}));

const mockGenericMetadata = {
  "RUNNER:1": {
    eventUrn: "event:urn:1",
    eventName: "Event Name",
    type: "GENERIC",
  },
  "RUNNER:2": {
    eventUrn: "event:urn:1",
    eventName: "Event Name",
    type: "GENERIC",
  },
};

const mockBettingLegs = {
  "LEG:1": { runners: ["RUNNER:1"] },
  "LEG:2": { runners: ["RUNNER:2"] },
};

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  getBettingResolvers: jest.fn(() => ({
    getMetadata: jest.fn(() => mockGenericMetadata),
  })),
  getSportsbookBettingLegs: jest.fn(() => mockBettingLegs),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getSportsbookConfirmationLegs: jest.fn(() => mockBettingLegs),
}));

jest.mock("../../../helpers/dates", () => ({
  formatTime: jest.fn(() => "Formatted Time"),
}));

describe("multi bet builder card mapper", () => {
  describe("createGetEventGroupedLegs", () => {
    afterEach(jest.clearAllMocks);

    describe("when the legs are all from the same event", () => {
      it("should return one event entry", () => {
        const getBettingEventGroupedLegs = createGetBettingEventGroupedLegs();

        expect(Object.keys(getBettingEventGroupedLegs({}, ["LEG:1", "LEG:2"])).length).toEqual(1);
      });

      it("should return all leg ids belonging to that event", () => {
        const getBettingEventGroupedLegs = createGetBettingEventGroupedLegs();
        const { "event:urn:1": group } = getBettingEventGroupedLegs({}, ["LEG:1", "LEG:2"]);

        expect(group.legIds).toEqual(["LEG:1", "LEG:2"]);
      });

      it("should return the title of the event", () => {
        const getBettingEventGroupedLegs = createGetBettingEventGroupedLegs();
        const { "event:urn:1": group } = getBettingEventGroupedLegs({}, ["LEG:1", "LEG:2"]);

        expect(group.title).toEqual("Event Name");
      });

      it("should return the urn of the event", () => {
        const getBettingEventGroupedLegs = createGetBettingEventGroupedLegs();
        const { "event:urn:1": group } = getBettingEventGroupedLegs({}, ["LEG:1", "LEG:2"]);

        expect(group.urn).toEqual("event:urn:1");
      });
    });

    describe("when the legs are all from the same race", () => {
      const racingMetadataMock = {
        "RUNNER:1": {
          type: "RACING",
          racing: { urn: "race:urn:1", venue: "Venue" },
        },
        "RUNNER:2": {
          type: "RACING",
          racing: { urn: "race:urn:1", venue: "Venue" },
        },
      };

      beforeEach(() => {
        getBettingResolvers.mockReturnValueOnce({
          getMetadata: jest.fn().mockReturnValueOnce(racingMetadataMock),
        });
      });

      it("should return one race entry", () => {
        const getBettingEventGroupedLegs = createGetBettingEventGroupedLegs();

        expect(Object.keys(getBettingEventGroupedLegs({}, ["LEG:1", "LEG:2"])).length).toEqual(1);
      });

      it("should return all leg ids belonging to that race", () => {
        const getBettingEventGroupedLegs = createGetBettingEventGroupedLegs();
        const { "race:urn:1": group } = getBettingEventGroupedLegs({}, ["LEG:1", "LEG:2"]);

        expect(group.legIds).toEqual(["LEG:1", "LEG:2"]);
      });

      it("should return the title of the race", () => {
        const getBettingEventGroupedLegs = createGetBettingEventGroupedLegs();
        const { "race:urn:1": group } = getBettingEventGroupedLegs({}, ["LEG:1", "LEG:2"]);

        expect(group.title).toEqual("Formatted Time Venue");
      });

      it("should return the urn of the race", () => {
        const getBettingEventGroupedLegs = createGetBettingEventGroupedLegs();
        const { "race:urn:1": group } = getBettingEventGroupedLegs({}, ["LEG:1", "LEG:2"]);

        expect(group.urn).toEqual("race:urn:1");
      });
    });

    describe("when the legs are from different races", () => {
      const racingMetadataMock = {
        "RUNNER:1": {
          type: "RACING",
          racing: { urn: "race:urn:1", venue: "Venue 1" },
        },
        "RUNNER:2": {
          type: "RACING",
          racing: { urn: "race:urn:2", venue: "Venue 2" },
        },
      };

      beforeEach(() => {
        getBettingResolvers.mockReturnValueOnce({
          getMetadata: jest.fn().mockReturnValueOnce(racingMetadataMock),
        });
      });

      it("should return two race entries", () => {
        const getBettingEventGroupedLegs = createGetBettingEventGroupedLegs();

        expect(Object.keys(getBettingEventGroupedLegs({}, ["LEG:1", "LEG:2"])).length).toEqual(2);
      });

      it("should return leg ids grouped by each race", () => {
        const getBettingEventGroupedLegs = createGetBettingEventGroupedLegs();
        const { "race:urn:1": groupOne, "race:urn:2": groupTwo } = getBettingEventGroupedLegs({}, ["LEG:1", "LEG:2"]);

        expect(groupOne.legIds).toEqual(["LEG:1"]);
        expect(groupTwo.legIds).toEqual(["LEG:2"]);
      });

      it("should return the correct title per race", () => {
        const getBettingEventGroupedLegs = createGetBettingEventGroupedLegs();
        const { "race:urn:1": groupOne, "race:urn:2": groupTwo } = getBettingEventGroupedLegs({}, ["LEG:1", "LEG:2"]);

        expect(groupOne.title).toEqual("Formatted Time Venue 1");
        expect(groupTwo.title).toEqual("Formatted Time Venue 2");
      });

      it("should return the corrent urn per race", () => {
        const getBettingEventGroupedLegs = createGetBettingEventGroupedLegs();
        const { "race:urn:1": groupOne, "race:urn:2": groupTwo } = getBettingEventGroupedLegs({}, ["LEG:1", "LEG:2"]);

        expect(groupOne.urn).toEqual("race:urn:1");
        expect(groupTwo.urn).toEqual("race:urn:2");
      });
    });
  });

  describe("createGetBettingEventGroupedLegs", () => {
    it("should use the legs selector getSportsbookBettingLegs", () => {
      createGetBettingEventGroupedLegs()({}, ["LEG:1"]);

      expect(getSportsbookBettingLegs).toHaveBeenCalledTimes(1);
    });
  });

  describe("createGetConfirmationEventGroupedLegs", () => {
    it("should use the legs selector getSportsbookConfirmationLegs", () => {
      createGetConfirmationEventGroupedLegs()({}, ["LEG:1"]);

      expect(getSportsbookConfirmationLegs).toHaveBeenCalledTimes(1);
    });
  });
});
