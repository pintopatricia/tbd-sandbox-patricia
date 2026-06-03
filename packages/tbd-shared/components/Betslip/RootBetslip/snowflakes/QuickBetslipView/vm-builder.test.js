import {
  createCombinationCounterSelector,
  getBettingResolvers,
  getSportsbookBettingCombinations,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createQuickBetslipTitleSelector } from "../../vm-builder";

import { createGetBetslipHeaderViewModel } from "./vm-builder";
import { i18n } from "../../../../../helpers/i18n";

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipGroup: jest.fn().mockReturnValue("sportsbook"),
}));

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createCombinationCounterSelector: jest.fn(() => jest.fn(() => 1)),
  getBettingResolvers: jest.fn(() => ({
    getMetadata: jest.fn(() => ({})),
  })),
  getSportsbookBettingCombinations: jest.fn(() => ({})),
  getSportsbookBettingLegs: jest.fn(() => ({})),
}));

jest.mock("../../vm-builder", () => ({
  createQuickBetslipTitleSelector: jest.fn(() => jest.fn(() => "some title")),
}));

jest.mock("../../../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("createGetBetslipHeaderViewModel", () => {
  beforeEach(jest.clearAllMocks);

  function setup({
    combinations = {
      "COMB:1": {
        id: "COMB:1",
        legs: ["LEG:1"],
        isBoosted: false,
      },
    },
    legs = {
      "LEG:1": {
        runners: ["RUNNER:1"],
      },
    },
    metadata = {
      "RUNNER:1": {
        type: "GENERIC",
        runnerName: "Runner Name",
        marketName: "Market Name",
        eventName: "Event Name",
      },
    },
    totalSelections = 1,
    title = "Some title",
    combinationId = "COMB:1",
  } = {}) {
    createCombinationCounterSelector.mockReturnValue(jest.fn(() => totalSelections));
    createQuickBetslipTitleSelector.mockReturnValue(jest.fn(() => title));
    getSportsbookBettingCombinations.mockReturnValue(combinations);
    getSportsbookBettingLegs.mockReturnValue(legs);
    getBettingResolvers.mockReturnValue({
      getMetadata: jest.fn(() => metadata),
    });

    return createGetBetslipHeaderViewModel()({}, combinationId);
  }

  describe("counter", () => {
    it("should return the total selections count", () => {
      const { counter } = setup({ totalSelections: 3 });

      expect(counter).toBe(3);
    });
  });

  describe("title", () => {
    it("should return the title from createQuickBetslipTitleSelector", () => {
      const { title } = setup({ title: "Some title" });

      expect(createQuickBetslipTitleSelector).toHaveBeenCalled();
      expect(title).toBe("Some title");
    });

    it("should return empty string when title selector returns null", () => {
      const { title } = setup({ title: null });

      expect(createQuickBetslipTitleSelector).toHaveBeenCalled();
      expect(title).toBe("");
    });
  });

  describe("subtitle", () => {
    describe("when combination does not exist", () => {
      it("should return empty string", () => {
        const { subtitle } = setup({ combinations: {} });

        expect(subtitle).toBe("");
      });
    });

    describe("when combination is not boosted", () => {
      it("should return generic subtitle with runner name, market name and event name", () => {
        const { subtitle } = setup();

        expect(subtitle).toBe("[name]Runner Name[/name] - Market Name - Event Name");
      });

      it("should return generic subtitle without event name when event name is empty", () => {
        const { subtitle } = setup({
          metadata: {
            "RUNNER:1": {
              type: "GENERIC",
              runnerName: "Runner Name",
              marketName: "Market Name",
              eventName: "",
            },
          },
        });

        expect(subtitle).toBe("[name]Runner Name[/name] - Market Name");
      });

      it("should return generic subtitle without event name when metadata type is not GENERIC", () => {
        const { subtitle } = setup({
          metadata: {
            "RUNNER:1": {
              type: "OTHER",
              runnerName: "Runner Name",
              marketName: "Market Name",
            },
          },
        });

        expect(subtitle).toBe("[name]Runner Name[/name] - Market Name");
      });

      it("should return empty string when metadata is not found", () => {
        const { subtitle } = setup({ metadata: {} });

        expect(subtitle).toBe("");
      });
    });

    describe("when combination is boosted", () => {
      it("should return price boost subtitle with market name and aggregated event names", () => {
        const { subtitle } = setup({
          combinations: {
            "COMB:1": {
              id: "COMB:1",
              legs: ["LEG:1", "LEG:2"],
              isBoosted: true,
            },
          },
          legs: {
            "LEG:1": { runners: ["RUNNER:1"] },
            "LEG:2": { runners: ["RUNNER:2"] },
          },
          metadata: {
            "RUNNER:1": {
              type: "GENERIC",
              runnerName: "Runner 1",
              marketName: "Market Name",
              eventName: "Event 1",
            },
            "RUNNER:2": {
              type: "GENERIC",
              runnerName: "Runner 2",
              marketName: "Market Name",
              eventName: "Event 2",
            },
          },
        });

        expect(subtitle).toBe("[name]Market Name[/name] - Event 1, Event 2");
      });

      it("should return empty string when metadata is not found for boosted combination", () => {
        const { subtitle } = setup({
          combinations: {
            "COMB:1": {
              id: "COMB:1",
              legs: ["LEG:1"],
              isBoosted: true,
            },
          },
          metadata: {},
        });

        expect(subtitle).toBe("");
      });

      it("should filter out non-GENERIC legs from event names aggregation", () => {
        const { subtitle } = setup({
          combinations: {
            "COMB:1": {
              id: "COMB:1",
              legs: ["LEG:1", "LEG:2"],
              isBoosted: true,
            },
          },
          legs: {
            "LEG:1": { runners: ["RUNNER:1"] },
            "LEG:2": { runners: ["RUNNER:2"] },
          },
          metadata: {
            "RUNNER:1": {
              type: "GENERIC",
              runnerName: "Runner 1",
              marketName: "Market Name",
              eventName: "Event 1",
            },
            "RUNNER:2": {
              type: "OTHER",
              runnerName: "Runner 2",
              marketName: "Market Name",
            },
          },
        });

        expect(subtitle).toBe("[name]Market Name[/name] - Event 1");
      });

      it("should return just the market name when there are no legs info", () => {
        const { subtitle } = setup({
          combinations: {
            "COMB:1": {
              id: "COMB:1",
              legs: ["LEG:1"],
              isBoosted: true,
            },
          },
          legs: {
            "LEG:1": { runners: ["RUNNER:1"] },
          },
          metadata: {
            "RUNNER:1": {
              type: "RACING",
              runnerName: "Runner 1",
              marketName: "Market Name",
            },
          },
        });

        expect(subtitle).toBe("[name]Market Name[/name]");
      });
    });
  });

  describe("moreLabel", () => {
    describe("when combination does not exist", () => {
      it("should return null", () => {
        const { moreLabel } = setup({ combinations: {} });

        expect(moreLabel).toBeNull();
      });
    });

    describe("when combination is boosted", () => {
      it("should return null", () => {
        const { moreLabel } = setup({
          combinations: {
            "COMB:1": {
              id: "COMB:1",
              legs: ["LEG:1"],
              isBoosted: true,
            },
          },
          totalSelections: 3,
        });

        expect(moreLabel).toBeNull();
      });
    });

    describe("when total selections is less than 2", () => {
      it("should return null", () => {
        const { moreLabel } = setup({ totalSelections: 1 });

        expect(moreLabel).toBeNull();
      });
    });

    describe("when total selections is 2 or more", () => {
      it("should return the more label with counter", () => {
        const { moreLabel } = setup({ totalSelections: 3 });

        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.BETSLIP.QUICK_BETSLIP.MORE",
          interpolationValues: {
            counter: 2,
          },
        });
        expect(moreLabel).toBe("I18N.BETSLIP.QUICK_BETSLIP.MORE");
      });
    });
  });
});
