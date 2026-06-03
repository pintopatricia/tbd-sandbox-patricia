import { BETTING__OBB_REMOVE_LEG_ACTION } from "@ppb/tbd-store/actions/betting";
import { createGetObbLegsMetadataByPotentialBetIdSelector } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");

jest.mock("@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors", () => ({
  createGetObbLegMetadataByUrnSelector: jest.fn(() => jest.fn()),
  createGetObbLegsMetadataByPotentialBetIdSelector: jest.fn(() => jest.fn()),
}));

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn().mockReturnValue(jest.fn().mockReturnValue({ isActive: true })),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const obbBettingStateMock = {
  potentialBets: {
    "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000": {
      urn: "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000",
      betType: "SINGLE",
      legs: ["p6t3n1su50s7bz8y"],
      stake: 1,
      potentialReturns: 3,
      quote: {
        price: {
          fractional: {
            numerator: 3,
            denominator: 1,
          },
          decimal: 2,
        },
      },
    },
  },
  legs: {
    p6t3n1su50s7bz8y: {
      id: "p6t3n1su50s7bz8y",
      metadata: {
        eventName: "Team A v Team B",
        participantsDescription: "Player 12345",
        outcomeDescription: "GOALS AT_LEAST 2 HALF1",
        aggregatorDescription: "Player to achieve Outcome",
        legTypeDescription: "Basic",
      },
    },
  },
  totalStake: 2,
  totalPotentialReturns: 8,
};

describe("ObbSingle mapToPropsFactory", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    function setup({ obbBettingState = {}, ownProps = {} } = {}) {
      createGetObbLegsMetadataByPotentialBetIdSelector.mockReturnValue(() =>
        Object.values(obbBettingStateMock.potentialBets).reduce((acc, bet) => {
          const [legId] = bet.legs;

          return {
            ...acc,
            [legId]: obbBettingStateMock.legs[legId].metadata,
          };
        }, {}),
      );

      const state = {
        betting: {
          obbBetting: { ...obbBettingState },
        },
      };

      return makeMapStateToProps()(state, ownProps);
    }

    describe("when the obb potentialBet metadata on appState is null", () => {
      it("should return empty object", () => {
        createGetObbLegsMetadataByPotentialBetIdSelector.mockReturnValueOnce(() => null);
        expect(setup()).toEqual({});
      });
    });

    describe("when the obb potentialBet metadata on appState is fulfilled", () => {
      it("should return metadata", () => {
        expect(setup({ obbBettingStateMock })).toEqual({
          legId: "p6t3n1su50s7bz8y",
          outcomeDescription: "GOALS AT_LEAST 2 HALF1 - Team A v Team B",
          participant: "Player 12345",
          isPlacing: false,
        });
      });

      it("should return metadata with default data", () => {
        createGetObbLegsMetadataByPotentialBetIdSelector.mockReturnValueOnce(() => ({
          "DUMMY:LEG": { someProperty: "abc" },
        }));
        expect(setup({ obbBettingStateMock })).toEqual({
          legId: "DUMMY:LEG",
          outcomeDescription: "",
          participant: "",
          isPlacing: false,
        });
      });

      it("should return an empty object and log error when an exception occurs", () => {
        createGetObbLegsMetadataByPotentialBetIdSelector.mockReturnValueOnce(() =>
          jest.fn.mockImplementation(() => {
            throw new Error("Test Error");
          }),
        );
        expect(setup({ obbBettingStateMock })).toEqual({});

        expect(global.console.error).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });

  describe("mapDispatchToProps", () => {
    const dispatchSpy = jest.fn();

    describe("dispatchRemoveSelectionAction", () => {
      it("should dispatch a BettingObbRemoveLegAction", () => {
        const { dispatchRemoveSelectionAction } = mapDispatchToProps(dispatchSpy);
        dispatchRemoveSelectionAction("id");

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__OBB_REMOVE_LEG_ACTION,
          payload: { legId: "id" },
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
