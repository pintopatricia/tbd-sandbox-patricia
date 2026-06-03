import {
  getBettingResolvers,
  getSportsbookBettingReviewLines,
  getSportsbookBettingRunners,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { buildSelection } from "../connected-sportsbook-betslip-mapper";
import { createPreviewSelectionsSelector } from "./preview-line-mapper";

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors");
jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");
jest.mock("../connected-sportsbook-betslip-mapper");

describe("Preview Line Mapper", () => {
  describe("createPreviewSelectionsSelector", () => {
    function setupSelections({
      lines = {
        "LINE:1": {
          runners: [
            { marketId: "924.1", selectionId: 1 },
            { marketId: "924.2", selectionId: 1 },
          ],
        },
      },
      metadata = {
        "924.1-1": { metadata: "metadata" },
        "924.2-1": { metadata2: "metadata2" },
      },
      runners = {
        "924.1-1": {},
        "924.2-1": {},
      },
      state = { betslip: { group: "REAL" } },
    } = {}) {
      getSportsbookBettingReviewLines.mockReturnValue(lines);
      createGetCountryLocalCurrencyCodeSelector.mockReturnValue(jest.fn(() => ({ details: "details" })));
      getBettingResolvers.mockReturnValue({
        getMetadata: jest.fn(() => metadata),
      });
      getSportsbookBettingRunners.mockReturnValue(runners);
      buildSelection.mockReturnValue({ title: "title", subtitle: "subtitle" });

      return createPreviewSelectionsSelector()(state, "LINE:1");
    }

    describe("when there is no respective runner", () => {
      it("should not map that runner", () => {
        const selections = setupSelections({ runners: { "924.1-1": {} } });

        expect(selections).toEqual([{ id: "924.1-1", subtitle: "subtitle", title: "title" }]);
      });
    });

    describe("when there is no respective runner metadata for a runner", () => {
      it("should not map that runner", () => {
        const selections = setupSelections({ metadata: { "924.1-1": {} } });

        expect(selections).toEqual([{ id: "924.1-1", subtitle: "subtitle", title: "title" }]);
      });
    });

    describe("when there is all data", () => {
      it("should map out all selections from the line", () => {
        const selections = setupSelections();

        expect(selections).toEqual([
          { id: "924.1-1", subtitle: "subtitle", title: "title" },
          { id: "924.2-1", subtitle: "subtitle", title: "title" },
        ]);
      });
    });
  });
});
