import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getCastGroupIds = jest.fn();

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createGetCastGroupIdsSelector: jest.fn(() => getCastGroupIds),
}));

const getIsConfirmStep = jest.fn();
const getConfirmationCastGroupsIds = jest.fn();

jest.mock("../sportsbook-betslip-confirm-mapper", () => ({
  createIsConfirmStep: jest.fn(() => getIsConfirmStep),
  createGetConfirmationCastGroupIdsSelector: jest.fn(() => getConfirmationCastGroupsIds),
}));

const stateMock = {
  betslip: {
    group: "GROUP:1",
  },
};
const castGroupIdsMock = ["CAST:1", "CAST:2"];

describe("ConnectedCastBetsCard map-to-props-factory", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    describe("castGroupIds", () => {
      describe("when the step is place potential", () => {
        beforeEach(() => {
          getIsConfirmStep.mockReturnValueOnce(false);
        });

        it("should call the selector from createGetCastGroupIdsSelector", () => {
          makeMapStateToProps()(stateMock);

          expect(getCastGroupIds).toHaveBeenCalledTimes(1);
          expect(getCastGroupIds).toHaveBeenCalledWith(stateMock);
        });

        it("should return an array of cast group IDs", () => {
          getCastGroupIds.mockReturnValueOnce(castGroupIdsMock);

          const { castGroupIds } = makeMapStateToProps()(stateMock);

          expect(castGroupIds).toEqual(castGroupIdsMock);
        });
      });

      describe("when the step is confirm bet", () => {
        beforeEach(() => {
          getIsConfirmStep.mockReturnValueOnce(true);
        });

        it("should call the selector from createGetConfirmationCastGroupIdsSelector", () => {
          makeMapStateToProps()(stateMock);

          expect(getConfirmationCastGroupsIds).toHaveBeenCalledTimes(1);
          expect(getConfirmationCastGroupsIds).toHaveBeenCalledWith(stateMock);
        });

        it("should return an array of cast group IDs", () => {
          getConfirmationCastGroupsIds.mockReturnValueOnce(castGroupIdsMock);

          const { castGroupIds } = makeMapStateToProps()(stateMock);

          expect(castGroupIds).toEqual(castGroupIdsMock);
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    it("should return an empty DispatchProps", () => {
      const dispatchProps = mapDispatchToProps();

      expect(dispatchProps).toEqual({});
    });
  });
});
