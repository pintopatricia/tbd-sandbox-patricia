import { UI__OPEN_COMBINATIONS_LIST } from "@ppb/tbd-store/actions/betslip";
import { createGetReviewCombinationLineIdsSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createGetReviewCombinationLineIdsSelector: jest.fn(() => () => []),
}));
jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const setupMapStateToProps = ({
  appState = { betting: { sportsbookBetting: { runners: {} } }, betslip: { sportsbookOddsMovement: {} }, entities: {} },
  lineIds = [],
  ownProps = { id: "COMB:1" },
} = {}) => {
  createGetReviewCombinationLineIdsSelector.mockReturnValue(() => lineIds);

  return makeMapStateToProps()(appState, ownProps);
};

describe("makeMapStateToProps", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should return lineIds", () => {
    const props = setupMapStateToProps({ lineIds: [1, 2] });

    expect(props.lineIds).toEqual([1, 2]);
  });

  it("should forward id", () => {
    const props = setupMapStateToProps();

    expect(props.id).toEqual("COMB:1");
  });
});

describe("mapDispatchToProps", () => {
  it("should map dispatchOnOpen", () => {
    const { dispatchOnOpen } = mapDispatchToProps(jest.fn());

    expect(dispatchOnOpen).toBeDefined();
  });

  describe("dispatchOnOpen", () => {
    it("should dispatch UI__OPEN_COMBINATIONS_LIST with id and maxCombinations", () => {
      const dispatch = jest.fn();
      const { dispatchOnOpen } = mapDispatchToProps(dispatch);

      dispatchOnOpen("COMB:1");

      expect(dispatch).toHaveBeenCalledWith({
        type: UI__OPEN_COMBINATIONS_LIST,
        payload: { combinationId: "COMB:1", maxCombinations: 16 },
      });
    });
  });
});
