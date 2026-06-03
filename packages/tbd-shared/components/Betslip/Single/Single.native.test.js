import { useContext } from "react";
import { render } from "@testing-library/react-native";

import {
  FallbackIconType,
  BetDetailsAction,
  BetDetailsColor,
  StatusLabelSizeType,
  StatusLabelType,
} from "@ppb/the-wall-common/types";
import { BetDetails, StatusLabel } from "@ppb/the-wall-native";

import { ValueIconName } from "@ppb/the-wall-icons";
import { Single } from "./Single.native";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({ isBetConfirmationStep: false })),
}));

jest.mock("../BetControls", () => jest.fn(() => <connected-bet-controls-mock />));
jest.mock("../BetControls/BetControls.native", () => ({
  BetControls: jest.fn(() => <bet-controls-component-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  BetDetails: jest.fn(() => <bet-details-mock />),
  StatusLabel: jest.fn((props) => <status-label-mock {...props} />),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

function renderSingle({
  shouldFocusStakeField = false,
  runnerUrn = "runnerUrn",
  id = "id",
  legId = "legId",
  title = "title",
  subtitle = "subtitle",
  handicap = "handicap",
  silk = "silkIcon",
  silkFallbackIconType = FallbackIconType.HorseRacing,
  racingSport,
  isPriceBoosted,
  boostedInfo,
  hasBoostSignposting,
  is90Min,
  selectionTypeIcon,
  guaranteedPriceLabel,
  isGuaranteedPriceSelected,
  hasAvailabilityHints,
  dispatchRemoveSelectionAction = jest.fn(),
} = {}) {
  return render(
    <Single
      shouldFocusStakeField={shouldFocusStakeField}
      runnerUrn={runnerUrn}
      id={id}
      legId={legId}
      title={title}
      subtitle={subtitle}
      handicap={handicap}
      boostedInfo={boostedInfo}
      hasAvailabilityHints={hasAvailabilityHints}
      silk={silk}
      silkFallbackIconType={silkFallbackIconType}
      racingSport={racingSport}
      is90Min={is90Min}
      selectionTypeIcon={selectionTypeIcon}
      isPriceBoosted={isPriceBoosted}
      hasBoostSignposting={hasBoostSignposting}
      guaranteedPriceLabel={guaranteedPriceLabel}
      isGuaranteedPriceSelected={isGuaranteedPriceSelected}
      dispatchRemoveSelectionAction={dispatchRemoveSelectionAction}
    />,
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Single", () => {
  describe("Odds Boost Icon", () => {
    describe("when isPriceBoosted is true", () => {
      describe("when hasBoostSignposting is true", () => {
        it("should render StatusLabel with correct props", () => {
          renderSingle({
            id: "some id",
            isPriceBoosted: true,
            hasBoostSignposting: true,
            boostedInfo: {
              label: "Price Boost",
              iconName: ValueIconName.PRICE_BOOST,
            },
          });

          expect(StatusLabel).toHaveBeenCalledTimes(1);
          expect(StatusLabel).toHaveBeenCalledWith(
            {
              iconName: ValueIconName.PRICE_BOOST,
              statusLabelType: StatusLabelType.ALTERNATIVE_BRANDED,
              statusLabelSize: StatusLabelSizeType.MEDIUM,
              text: "Price Boost",
            },
            undefined,
          );
        });
      });

      describe("when hasBoostSignposting is false", () => {
        it("should not render StatusLabel", () => {
          renderSingle({ id: "some id", isPriceBoosted: true, hasBoostSignposting: false });

          expect(StatusLabel).not.toHaveBeenCalled();
        });
      });
    });

    describe("when isPriceBoosted is false", () => {
      describe("when hasBoostSignposting is true", () => {
        it("should not render StatusLabel", () => {
          renderSingle({ id: "some id", isPriceBoosted: false, hasBoostSignposting: true });

          expect(StatusLabel).not.toHaveBeenCalled();
        });
      });

      describe("when hasBoostSignposting is false", () => {
        it("should not render StatusLabel", () => {
          renderSingle({ id: "some id", isPriceBoosted: false, hasBoostSignposting: false });

          expect(StatusLabel).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("BetDetails", () => {
    it("should call BetDetails with proper values", () => {
      renderSingle({
        id: "1",
        title: "Some runner",
        subtitle: "Some market - some event",
        handicap: "Some handicap",
        silkIcon: "SILK_ICON",
        racingSport: 7,
        is90Min: true,
        selectionTypeIcon: "selectionTypeIcon",
        silkFallbackIconType: FallbackIconType.HorseRacing,
        guaranteedPriceLabel: "guaranteedPriceLabel mock",
        isGuaranteedPriceSelected: true,
      });

      expect(BetDetails).toHaveBeenCalledWith(
        {
          title: "Some runner",
          subtitle: "Some market - some event",
          highlightedValueLabel: "Some handicap",
          action: BetDetailsAction.Remove,
          color: BetDetailsColor.Teal,
          onAction: expect.any(Function),
          icon: expect.any(Object),
          is90Min: true,
          selectionTypeIcon: "selectionTypeIcon",
          guaranteedPriceLabel: "guaranteedPriceLabel mock",
          isGuaranteedPriceSelected: true,
          i18n: {
            Remove: "I18N.ACCESSIBILITY.REMOVE_BET_SELECTION",
            Edit: "I18N.ACCESSIBILITY.EDIT_BET",
            None: "I18N.ACCESSIBILITY.NO_ACTION_AVAILABLE",
          },
        },
        undefined,
      );
      expect(BetDetails).toHaveBeenCalledTimes(1);
    });

    describe("when selectionTypeIcon prop is not provided", () => {
      it("should call BetDetails with selectionTypeIcon as undefined", () => {
        renderSingle({
          id: "1",
          title: "Some runner",
          subtitle: "Some market - some event",
          handicap: "Some handicap",
          silkIcon: "SILK_ICON",
          silkFallbackIconType: FallbackIconType.HorseRacing,
          guaranteedPriceLabel: "guaranteedPriceLabel mock",
          isGuaranteedPriceSelected: true,
          is90Min: true,
        });

        expect(BetDetails).toHaveBeenCalledWith(
          expect.objectContaining({
            selectionTypeIcon: undefined,
          }),
          undefined,
        );
        expect(BetDetails).toHaveBeenCalledTimes(1);
      });
    });

    describe("when selection action is called", () => {
      it("should call dispatchRemoveSelectionAction callback with selection", () => {
        const dispatchRemoveSelectionAction = jest.fn();
        renderSingle({ dispatchRemoveSelectionAction });

        // call action
        BetDetails.mock.calls[0][0].onAction();

        expect(dispatchRemoveSelectionAction).toHaveBeenCalledWith({ legId: "legId", runnerUrn: "runnerUrn" });
        expect(dispatchRemoveSelectionAction).toHaveBeenCalledTimes(1);
      });
    });

    describe("when not MYOB or odds boost market type", () => {
      it("should pass Teal color", () => {
        renderSingle({
          isPriceBoosted: false,
        });

        expect(BetDetails).toHaveBeenCalledWith(
          expect.objectContaining({
            color: BetDetailsColor.Teal,
          }),
          undefined,
        );
        expect(BetDetails).toHaveBeenCalledTimes(1);
      });
    });

    describe("when is MYOB or odds boost market type", () => {
      it("should pass Black color", () => {
        renderSingle({
          isPriceBoosted: true,
        });

        expect(BetDetails).toHaveBeenCalledWith(
          expect.objectContaining({
            color: BetDetailsColor.Black,
          }),
          undefined,
        );
        expect(BetDetails).toHaveBeenCalledTimes(1);
      });
    });

    describe("when in CONFIRM_POTENTIAL step", () => {
      it("should not pass a callback action", () => {
        useContext.mockReturnValueOnce({ isBetConfirmationStep: true });
        renderSingle();

        expect(BetDetails).toHaveBeenCalledWith(
          expect.objectContaining({
            action: BetDetailsAction.None,
            onAction: undefined,
          }),
          undefined,
        );
        expect(BetDetails).toHaveBeenCalledTimes(1);
      });
    });
  });
});
