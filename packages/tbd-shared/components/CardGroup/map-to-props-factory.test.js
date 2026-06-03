import { createFindCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createFindCardGroupByURNSelector: jest.fn(),
}));

const getFindCardGroupByURNSelector = jest.fn();

const DEFAULT_STATE = {
  layouts: {
    cardgroups: {
      swimlanecardgroups: {},
      pebblecardgroups: {},
      segmentedcardgroups: {},
    },
  },
};

function setup({ cardGroupMock, urn, typename }) {
  createFindCardGroupByURNSelector.mockImplementation(() =>
    getFindCardGroupByURNSelector.mockImplementation(() => cardGroupMock),
  );

  return makeMapStateToProps()(DEFAULT_STATE, { urn, typename });
}

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when card group exists", () => {
    describe("and card group type is empty", () => {
      it("should not pass any card group", () => {
        const { typename } = setup({ cardGroupMock: { typename: null }, urn: "urn" });
        expect(typename).toBe(null);
      });
    });

    describe("and card group type is invalid", () => {
      it("should not pass any card group", () => {
        const { typename } = setup({ cardGroupMock: { typename: "InvalidCardType" }, urn: "urn" });
        expect(typename).toBe(null);
      });
    });

    describe("and it is a valid card group", () => {
      it("should not pass any card group", () => {
        const { typename, isCardGroupLoaded } = setup({
          cardGroupMock: { typename: "SwimlaneCardGroup" },
          urn: "urn",
          typename: "SwimlaneCardGroup",
        });
        expect(typename).toEqual("SwimlaneCardGroup");
        expect(isCardGroupLoaded).toBe(true);
      });
    });
  });
});
