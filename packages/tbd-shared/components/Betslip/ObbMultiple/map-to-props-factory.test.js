import { BETTING__OBB_REMOVE_LEG_ACTION, BETTING__OBB_CHANGE_STAKE_ACTION } from "@ppb/tbd-store/actions/betting";
import {
  createGetObbCombinedLegsMetadataByPotentialBetIdSelector,
  createGetObbPotentialBetsByIdSelector,
  getObbCombinedLegFailures,
  createGetXofNDataByPotentialBetIdSelector,
} from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { UI__BETSLIP_SLIDER_INTERACTION, UI__BETSLIP_SLIDER_DISPLAYED } from "@ppb/tbd-store/actions/interface";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors");

jest.mock("@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors", () => ({
  createGetObbCombinedLegsMetadataByPotentialBetIdSelector: jest.fn(() => jest.fn()),
  createGetObbPotentialBetsByIdSelector: jest.fn(() => jest.fn()),
  getObbCombinedLegFailures: jest.fn(),
  createGetXofNDataByPotentialBetIdSelector: jest.fn(() => jest.fn()),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) =>
    key === "I18N.BETSLIP.SELECTIONS_COUNT" ? `${interpolationValues.numberOfSelections} Selections` : key,
  ),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const obbBettingStateMock = {
  potentialBets: {
    "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000": {
      id: "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000",
      betType: "MULTIPLE",
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
        legDescription: "Player 12345 GOALS AT_LEAST 2 HALF1 | Player 2345 GOALS AT_LEAST 2 HALF1",
        legTypeDescription: "Basic",
      },
      params: {
        baseBets: [
          { params: { outcomeId: "SHOTS" }, templateId: "pvp" },
          { params: { outcomeId: "GOALS" }, templateId: "pvp" },
        ],
      },
    },
    r5i8t3ty71h6av5r: {
      id: "r5i8t3ty71h6av5r",
      metadata: {
        eventName: "Team A v Team B",
        participantsDescription: "Player 2345",
        outcomeDescription: "GOALS AT_LEAST 2 HALF1",
        legDescription: "Player 2345 GOALS AT_LEAST 2 HALF1",
        legTypeDescription: "Basic",
      },
      params: { outcomeId: "GOALS" },
      templateId: "pvp",
    },
    y47g3n1su50s7bz8y: {
      id: "y47g3n1su50s7bz8y",
      metadata: {
        eventName: "Team A v Team B",
        participantsDescription: "Player 12345",
        outcomeDescription: "GOALS AT_LEAST 2 HALF1",
        legDescription: "Player 12345 GOALS AT_LEAST 2 HALF1",
        legTypeDescription: "Basic",
      },
      templateId: "pvp",
      params: { outcomeId: "SHOTS" },
    },
  },
  totalStake: 2,
  totalPotentialReturns: 8,
  failures: {
    betslip: null,
    legs: {},
    potentialBets: {},
  },
};

describe("ObbMultiple mapToPropsFactory", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    function setup({ obbBettingState = {}, ownProps = {}, entities = {} } = {}) {
      const state = {
        betting: {
          obbBetting: { ...obbBettingState },
        },
        entities: { experiments: { ...entities.experiments } },
      };

      const defaultOwnProps = {
        potentialBets: [{ id: "ppb:obb:potentialBet", x: 2 }],
      };

      return makeMapStateToProps()(state, { ...defaultOwnProps, ...ownProps });
    }
    describe("when the obb potentialBet metadata on appState is null", () => {
      it("should return empty object", () => {
        createGetObbCombinedLegsMetadataByPotentialBetIdSelector.mockReturnValueOnce(() => null);
        expect(setup()).toEqual({});
      });
    });

    describe("when the obb potentialBet metadata on appState is fulfilled", () => {
      it("should return metadata", () => {
        createGetObbCombinedLegsMetadataByPotentialBetIdSelector.mockReturnValueOnce(() => ({
          y47g3n1su50s7bz8y: {
            eventName: "Team A v Team B",
            participantsDescription: "Player 12345",
            outcomeDescription: "GOALS AT_LEAST 2 HALF1",
          },
          r5i8t3ty71h6av5r: {
            eventName: "Team A v Team B",
            participantsDescription: "Player 2345",
            outcomeDescription: "GOALS AT_LEAST 2 HALF1",
          },
        }));
        createGetObbPotentialBetsByIdSelector.mockReturnValueOnce(() => ({
          id: "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000",
          legs: ["p6t3n1su50s7bz8y"],
        }));
        getObbCombinedLegFailures.mockReturnValueOnce(obbBettingStateMock.failures.legs);
        createGetXofNDataByPotentialBetIdSelector.mockReturnValueOnce(() => []);

        expect(
          setup({
            obbBettingState: obbBettingStateMock,
            ownProps: { potentialBets: [{ id: "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000", x: 2 }] },
          }),
        ).toEqual({
          i18n: {
            notCombinableAlert: "I18N.BETSLIP.NOT_COMBINABLE",
            notCombinableMessage: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS",
            selectionsToWin: "I18N.BETSLIP.OBB.SELECTIONS_TO_WIN",
          },
          legs: [
            {
              legId: "y47g3n1su50s7bz8y",
              outcomeDescription: "GOALS AT_LEAST 2 HALF1",
              participantsDescription: "Player 12345",
            },
            {
              legId: "r5i8t3ty71h6av5r",
              outcomeDescription: "GOALS AT_LEAST 2 HALF1",
              participantsDescription: "Player 2345",
            },
          ],
          eventName: "Team A v Team B",
          selectionsTitle: "2 Selections",
          hasNotCombinableFailure: false,
          potentialBetWithStake: { id: "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000", x: 2 },
        });
      });

      it("should return metadata with default data", () => {
        createGetObbCombinedLegsMetadataByPotentialBetIdSelector.mockReturnValueOnce(() => ({
          "DUMMY:LEG": { someProperty: "abc" },
        }));

        createGetObbPotentialBetsByIdSelector.mockReturnValueOnce(() => ({
          id: "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000",
          legs: ["DUMMY:LEG"],
        }));

        getObbCombinedLegFailures.mockReturnValueOnce(obbBettingStateMock.failures.legs);
        createGetXofNDataByPotentialBetIdSelector.mockReturnValueOnce(() => []);

        expect(
          setup({
            obbBettingState: obbBettingStateMock,
            ownProps: { potentialBets: [{ id: "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000", x: 2 }] },
          }),
        ).toEqual({
          i18n: {
            notCombinableAlert: "I18N.BETSLIP.NOT_COMBINABLE",
            notCombinableMessage: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS",
            selectionsToWin: "I18N.BETSLIP.OBB.SELECTIONS_TO_WIN",
          },
          legs: [
            {
              legId: "DUMMY:LEG",
              outcomeDescription: "",
              participantsDescription: "",
            },
          ],
          eventName: "",
          selectionsTitle: "1 Selections",
          hasNotCombinableFailure: false,
          potentialBetWithStake: { id: "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000", x: 2 },
        });
      });

      it("should return hasNotCombinableFailure as true when there is a not combinable failure", () => {
        const combinedLegFailures = {
          "DUMMY:LEG": "IMPOSSIBLE_OBB_CHOICE",
        };

        createGetObbCombinedLegsMetadataByPotentialBetIdSelector.mockReturnValueOnce(() => ({
          "DUMMY:LEG": { someProperty: "abc" },
        }));

        const mockPotentialBet = { legs: ["DUMMY:LEG"] };
        createGetObbPotentialBetsByIdSelector.mockReturnValueOnce(() => mockPotentialBet);

        createGetXofNDataByPotentialBetIdSelector.mockReturnValueOnce(() => []);

        getObbCombinedLegFailures.mockReturnValueOnce(combinedLegFailures);

        const result = setup({
          obbBettingState: obbBettingStateMock,
          ownProps: { potentialBets: [{ id: "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000", x: 2 }] },
        });

        expect(result).toEqual({
          i18n: {
            notCombinableAlert: "I18N.BETSLIP.NOT_COMBINABLE",
            notCombinableMessage: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS",
            selectionsToWin: "I18N.BETSLIP.OBB.SELECTIONS_TO_WIN",
          },
          legs: [
            {
              legId: "DUMMY:LEG",
              outcomeDescription: "",
              participantsDescription: "",
            },
          ],
          eventName: "",
          selectionsTitle: "1 Selections",
          hasNotCombinableFailure: true,
          potentialBetWithStake: { id: "ppb:obb:potentialBet:00000000-0000-0000-0000-000000000000", x: 2 },
        });
      });

      it("should return an empty object and log error when an exception occurs", () => {
        createGetObbCombinedLegsMetadataByPotentialBetIdSelector.mockReturnValueOnce(() => {
          throw new Error("Test Error");
        });

        expect(setup({ obbBettingStateMock })).toEqual({});

        expect(global.console.error).toHaveBeenCalledWith(expect.any(Error));
      });
    });
  });
  describe("mapDispatchToProps", () => {
    const dispatchSpy = jest.fn();

    describe("dispatchRemoveSelectionAction", () => {
      it("should dispatch a BetslipAddToBetslipButtonPressAction", () => {
        const { dispatchRemoveSelectionAction } = mapDispatchToProps(dispatchSpy);
        dispatchRemoveSelectionAction("legId");

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__OBB_REMOVE_LEG_ACTION,
          payload: { legId: "legId" },
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("dispatchSliderInteraction", () => {
      it("should dispatch a BetslipAddToBetslipButtonPressAction", () => {
        const { dispatchSliderInteraction } = mapDispatchToProps(dispatchSpy);
        dispatchSliderInteraction("eventName", "increase", "button");

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: UI__BETSLIP_SLIDER_INTERACTION,
          payload: { direction: "increase", eventName: "eventName", source: "button" },
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("dispatchStakeChange", () => {
      it("should dispatch a BettingObbChangeStakeAction with newValue", () => {
        const { dispatchStakeChange } = mapDispatchToProps(dispatchSpy);
        dispatchStakeChange({ potentialBetId: "bet:1", newValue: 10 });

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__OBB_CHANGE_STAKE_ACTION,
          payload: { potentialBetId: "bet:1", newValue: 10 },
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });

      it("should dispatch a BettingObbChangeStakeAction with null when newValue is undefined", () => {
        const { dispatchStakeChange } = mapDispatchToProps(dispatchSpy);
        dispatchStakeChange({ potentialBetId: "bet:1", newValue: undefined });

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: BETTING__OBB_CHANGE_STAKE_ACTION,
          payload: { potentialBetId: "bet:1", newValue: null },
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });

    describe("dispatchSliderDisplayed", () => {
      it("should dispatch a BetslipSliderDisplayedAction with eventName", () => {
        const { dispatchSliderDisplayed } = mapDispatchToProps(dispatchSpy);
        dispatchSliderDisplayed("Man City vs Man Utd");

        expect(dispatchSpy).toHaveBeenCalledWith({
          type: UI__BETSLIP_SLIDER_DISPLAYED,
          payload: { eventName: "Man City vs Man Utd" },
        });
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
      });
    });
  });
});
