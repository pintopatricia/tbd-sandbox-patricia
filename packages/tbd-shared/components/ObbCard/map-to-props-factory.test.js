import { createFindCardbyURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createFindCardbyURNSelector: jest.fn(),
}));

const getFindObbCardbyURNSelector = jest.fn();

const DEFAULT_STATE = {
  layouts: {
    cards: {},
  },
};

function setup({ cardMock, urn, typename, layoutUrn, itemIndex }) {
  createFindCardbyURNSelector.mockImplementation(() => getFindObbCardbyURNSelector.mockImplementation(() => cardMock));
  return makeMapStateToProps()(DEFAULT_STATE, { urn, typename, layoutUrn, itemIndex });
}

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when the card is loaded", () => {
    it("should pass the card and the expected props", () => {
      const props = setup({
        cardMock: { typename: "ObbPvpCard" },
        urn: "urn",
        typename: "ObbPvpCard",
        layoutUrn: "layoutUrn",
        itemIndex: 1,
      });
      expect(props.typename).toEqual("ObbPvpCard");
      expect(props.isCardLoaded).toBe(true);
      expect(props.layoutUrn).toEqual("layoutUrn");
      expect(props.itemIndex).toEqual(1);
    });
  });

  describe("when the card is not loaded", () => {
    it("should pass the card and the expected props", () => {
      const props = setup({
        cardMock: null,
        urn: "urn",
        typename: "ObbPvpCard",
        layoutUrn: "layoutUrn",
        itemIndex: 1,
      });
      expect(props.typename).toEqual("ObbPvpCard");
      expect(props.isCardLoaded).toBe(false);
      expect(props.layoutUrn).toEqual("layoutUrn");
      expect(props.itemIndex).toEqual(1);
    });
  });
});
