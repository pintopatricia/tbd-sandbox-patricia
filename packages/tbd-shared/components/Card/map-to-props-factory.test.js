import { createFindCardbyURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createFindCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { createViewZoneByURNSelector } from "@ppb/tbd-store/state/layout/viewzones/viewzone-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createFindCardbyURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createFindCardGroupByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/viewzones/viewzone-selectors", () => ({
  createViewZoneByURNSelector: jest.fn(),
}));

const getFindCardbyURNSelector = jest.fn();
const getFindCardGroupByURNSelector = jest.fn();
const getViewZoneByURN = jest.fn();

const DEFAULT_STATE = {
  layouts: {
    cards: {},
  },
};

function setup({ cardMock, urn, typename }) {
  createFindCardbyURNSelector.mockImplementation(() => getFindCardbyURNSelector.mockImplementation(() => cardMock));
  createFindCardGroupByURNSelector.mockImplementation(() => getFindCardGroupByURNSelector.mockImplementation(() => {}));
  createViewZoneByURNSelector.mockImplementation(() => getViewZoneByURN.mockImplementation(() => {}));

  return makeMapStateToProps()(DEFAULT_STATE, { urn, typename });
}

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when the card is loaded", () => {
    it("should pass the card and the expected props", () => {
      const { typename, isCardLoaded } = setup({
        cardMock: { typename: "MarketCard" },
        urn: "urn",
        typename: "MarketCard",
      });
      expect(typename).toEqual("MarketCard");
      expect(isCardLoaded).toBe(true);
    });
  });

  describe("when the card is not loaded", () => {
    it("should pass the card and the expected props", () => {
      const { typename, isCardLoaded } = setup({
        cardMock: null,
        urn: "urn",
        typename: "MarketCard",
      });
      expect(typename).toEqual("MarketCard");
      expect(isCardLoaded).toBe(false);
    });
  });
});
