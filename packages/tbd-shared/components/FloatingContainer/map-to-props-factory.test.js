import { makeMapStateToProps } from "./map-to-props-factory";

const mockGetObbBettingLegs = jest.fn();
jest.mock("@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors", () => ({
  getObbBettingLegs: (...args) => mockGetObbBettingLegs(...args),
}));

const mockGetSportsbookSimpleSelectionsCounter = jest.fn();
jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createSimpleSelectionsCounterSelector: () => mockGetSportsbookSimpleSelectionsCounter,
}));

const MOCK_STATE = {};

function mapStateToProps(state = MOCK_STATE) {
  return makeMapStateToProps()(state);
}

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    mockGetObbBettingLegs.mockReturnValue({});
    mockGetSportsbookSimpleSelectionsCounter.mockReturnValue(0);
  });

  describe("betslipHasSelections", () => {
    it("should be false when there are no OBB legs and no sportsbook selections", () => {
      mockGetObbBettingLegs.mockReturnValue({});
      mockGetSportsbookSimpleSelectionsCounter.mockReturnValue(0);

      expect(mapStateToProps().betslipHasSelections).toBe(false);
    });

    it("should be true when there are OBB legs", () => {
      mockGetObbBettingLegs.mockReturnValue({ leg1: {} });

      expect(mapStateToProps().betslipHasSelections).toBe(true);
    });

    it("should be true when there are sportsbook selections", () => {
      mockGetSportsbookSimpleSelectionsCounter.mockReturnValue(1);

      expect(mapStateToProps().betslipHasSelections).toBe(true);
    });

    it("should be true when both OBB legs and sportsbook selections are present", () => {
      mockGetObbBettingLegs.mockReturnValue({ leg1: {} });
      mockGetSportsbookSimpleSelectionsCounter.mockReturnValue(2);

      expect(mapStateToProps().betslipHasSelections).toBe(true);
    });
  });
});
