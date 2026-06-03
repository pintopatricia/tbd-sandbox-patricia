import {
  UI__BETSLIP_SBK_CAST_BET_CHANGE,
  UI__BETSLIP_SBK_CAST_BET_ORDER_CHANGE,
  UI__BETSLIP_SBK_CONFIRM_CAST_BET_CHANGE,
} from "@ppb/tbd-store/actions/betslip";
import { BETTING__SBK_ORDER_CHANGE } from "@ppb/tbd-store/actions/betting";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const castBetsMock = {
  id: "castGroupId",
  title: "title",
  selectedCastType: "selectedCastType",
  isOrderable: false,
};
const runnerOrdersMock = ["runner"];
const castTypesMock = ["castType"];

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipCard: jest.fn(() => ({ placeStatus: "NONE" })),
  getCastContext: jest.fn(() => ({})),
}));

const getRunnerOrders = jest.fn(() => runnerOrdersMock);

jest.mock("@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors", () => ({
  createGetCastRunnerIdsSelector: jest.fn(() => getRunnerOrders),
}));

const getCastBet = jest.fn(() => castBetsMock);

jest.mock("../betslip-mapper", () => ({
  createGetCastBetSelector: jest.fn(() => getCastBet),
}));

const getCastTypes = jest.fn(() => castTypesMock);

jest.mock("../SportsbookPlace/sportsbook-place-mapper", () => ({
  createCastTypesBuilder: jest.fn(() => getCastTypes),
}));

const getConfirmationCastContext = jest.fn(() => ({}));
const getConfirmRunnerOrders = jest.fn(() => runnerOrdersMock);
const getConfirmCastTypes = jest.fn(() => castTypesMock);
const getConfirmationCastBet = jest.fn(() => castBetsMock);
const getIsConfirmStep = jest.fn(() => false);

jest.mock("../sportsbook-betslip-confirm-mapper", () => ({
  createGetConfirmationCastContextSelector: jest.fn(() => getConfirmationCastContext),
  createGetConfirmationCastRunnerIdsSelector: jest.fn(() => getConfirmRunnerOrders),
  createGetConfirmationCastTypesSelector: jest.fn(() => getConfirmCastTypes),
  createGetConfirmationCastBetSelector: jest.fn(() => getConfirmationCastBet),
  createIsConfirmStep: jest.fn(() => getIsConfirmStep),
}));

describe("ConnectedCastBet map-to-props-factory", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    function setupMapStateToProps({
      appState = "appState",
      ownProps = {
        castGroupId: "castGroupId",
      },
    } = {}) {
      return makeMapStateToProps()(appState, ownProps);
    }

    describe("when the step is place potential", () => {
      it("should call the function created from createGetCastRunnerIdsSelector", () => {
        setupMapStateToProps();

        expect(getRunnerOrders).toHaveBeenCalledTimes(1);
      });

      it("should call the function created from createCastTypesBuilder", () => {
        setupMapStateToProps();

        expect(getCastTypes).toHaveBeenCalledTimes(1);
      });

      it("should call the function created from createGetCastBetSelector", () => {
        setupMapStateToProps();

        expect(getCastBet).toHaveBeenCalledTimes(1);
      });

      describe("when getCastBet returns a valid castGroup", () => {
        it("should return id", () => {
          const { id } = setupMapStateToProps();

          expect(id).toEqual("castGroupId");
        });

        it("should return title", () => {
          const { title } = setupMapStateToProps();

          expect(title).toEqual("title");
        });

        it("should return selectedCastType", () => {
          const { selectedCastType } = setupMapStateToProps();

          expect(selectedCastType).toEqual("selectedCastType");
        });

        it("should return runnersOrder", () => {
          const { runnersOrder } = setupMapStateToProps();

          expect(runnersOrder).toEqual(["runner"]);
        });

        it("should return castTypes", () => {
          const { castTypes } = setupMapStateToProps();

          expect(castTypes).toEqual(["castType"]);
        });

        it("should return isOrderable", () => {
          const { isOrderable } = setupMapStateToProps();

          expect(isOrderable).toEqual(false);
        });
      });
    });

    describe("when the step is confirm bet", () => {
      beforeAll(() => {
        getIsConfirmStep.mockReturnValue(true);
      });

      it("should call the function created from createGetConfirmationCastContextSelector", () => {
        setupMapStateToProps();

        expect(getConfirmationCastContext).toHaveBeenCalledTimes(1);
      });

      it("should call the function created from createGetConfirmationCastRunnerIdsSelector", () => {
        setupMapStateToProps();

        expect(getConfirmRunnerOrders).toHaveBeenCalledTimes(1);
      });

      it("should call the function created from createGetConfirmationCastTypesSelector", () => {
        setupMapStateToProps();

        expect(getConfirmCastTypes).toHaveBeenCalledTimes(1);
      });

      it("should call the function created from createGetConfirmationCastBetSelector", () => {
        setupMapStateToProps();

        expect(getConfirmationCastBet).toHaveBeenCalledTimes(1);
      });

      describe("when getCastBet returns a valid castGroup", () => {
        it("should return id", () => {
          const { id } = setupMapStateToProps();

          expect(id).toEqual("castGroupId");
        });

        it("should return title", () => {
          const { title } = setupMapStateToProps();

          expect(title).toEqual("title");
        });

        it("should return selectedCastType", () => {
          const { selectedCastType } = setupMapStateToProps();

          expect(selectedCastType).toEqual("selectedCastType");
        });

        it("should return runnersOrder", () => {
          const { runnersOrder } = setupMapStateToProps();

          expect(runnersOrder).toEqual(["runner"]);
        });

        it("should return castTypes", () => {
          const { castTypes } = setupMapStateToProps();

          expect(castTypes).toEqual(["castType"]);
        });

        it("should return isOrderable", () => {
          const { isOrderable } = setupMapStateToProps();

          expect(isOrderable).toEqual(false);
        });
      });
    });

    describe("when there is no betslip card", () => {
      it("should return empty", () => {
        getBetslipCard.mockReturnValue(undefined);

        const state = setupMapStateToProps();

        expect(state).toEqual({});
      });
    });

    describe("when there is no cast bet", () => {
      it("should return empty", () => {
        getCastBet.mockReturnValue(undefined);

        const state = setupMapStateToProps();

        expect(state).toEqual({});
      });
    });
  });

  describe("mapDispatchToProps", () => {
    function setupMapDispatchToProps({ dispatch = jest.fn() } = {}) {
      return mapDispatchToProps(dispatch);
    }

    it("should have defined dispatchers", () => {
      const dispatchers = setupMapDispatchToProps();

      expect(dispatchers.dispatchOrderChange).toBeDefined();
      expect(dispatchers.dispatchCastBetChange).toBeDefined();
    });

    describe("dispatchOrderChange", () => {
      function setupDispatchOrderChange({
        order = "order",
        combinationId = "combinationId",
        updatedRunnerId = "updatedRunnerId",
      } = {}) {
        const dispatch = jest.fn();
        const { dispatchOrderChange } = setupMapDispatchToProps({ dispatch });

        dispatchOrderChange(combinationId, updatedRunnerId, order);

        return dispatch;
      }

      it("should call dispatch with BettingSportsbookOrderChangeAction", () => {
        const dispatch = setupDispatchOrderChange();

        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: BETTING__SBK_ORDER_CHANGE,
          payload: {
            order: "order",
          },
        });
      });

      it("should call dispatch with BetslipSportsbookCastBetOrderChange", () => {
        const dispatch = setupDispatchOrderChange();

        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: UI__BETSLIP_SBK_CAST_BET_ORDER_CHANGE,
          payload: {
            combinationId: "combinationId",
            updatedRunnerId: "updatedRunnerId",
          },
        });
      });
    });

    describe("dispatchCastBetChange", () => {
      it("should call dispatch with BetslipSportsbookCastBetChange", () => {
        const dispatch = jest.fn();
        const { dispatchCastBetChange } = setupMapDispatchToProps({ dispatch });
        dispatchCastBetChange("castId", "combinationId");

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__BETSLIP_SBK_CAST_BET_CHANGE,
          payload: {
            castId: "castId",
            combinationId: "combinationId",
          },
        });
      });
    });

    describe("dispatchConfirmCastBetChange", () => {
      it("should call dispatch with BetslipSportsbookConfirmCastBetChange", () => {
        const dispatch = jest.fn();
        const { dispatchConfirmCastBetChange } = setupMapDispatchToProps({ dispatch });
        dispatchConfirmCastBetChange("castId", "combinationId");

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__BETSLIP_SBK_CONFIRM_CAST_BET_CHANGE,
          payload: {
            castId: "castId",
            combinationId: "combinationId",
          },
        });
      });
    });
  });
});
