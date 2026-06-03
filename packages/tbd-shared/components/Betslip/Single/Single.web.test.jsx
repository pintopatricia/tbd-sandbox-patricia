import { render } from "@testing-library/react";

import {
  FallbackIconType,
  BetDetailsAction,
  BetDetailsColor,
  StatusLabelSizeType,
  StatusLabelType,
} from "@ppb/the-wall-common/types";
import { BetDetails, StatusLabel } from "@ppb/the-wall-web";

import { ValueIconName } from "@ppb/the-wall-icons";
import ConnectedBetControls from "../BetControls";
import { BetControls } from "../BetControls/BetControls.web";
import { Single } from "./Single.web";

import { RootBetslipContext } from "../RootBetslip/RootBetslipContext";

jest.mock("../BetControls", () => jest.fn().mockReturnValue(<connected-bet-controls-mock />));
jest.mock("../BetControls/BetControls.web", () => ({
  BetControls: jest.fn().mockReturnValue(<bet-controls-component-mock />),
}));
jest.mock("@ppb/the-wall-web", () => ({
  BetDetails: jest.fn(() => <bet-details-mock />),
  StatusLabel: jest.fn((props) => <status-label-mock {...props} />),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  ValueIconName: {
    PRICE_BOOST: "PRICE_BOOST",
  },
}));

const RootBetslipProviderMock = ({
  children,
  registerCollapseListener = jest.fn().mockReturnValue(jest.fn()),
  isBetConfirmationStep,
}) => (
  <RootBetslipContext.Provider value={{ registerCollapseListener, isBetConfirmationStep }}>
    {children}
  </RootBetslipContext.Provider>
);

function renderSingle(
  {
    shouldFocusStakeField,
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
  } = {},
  rootContext = {},
) {
  return render(
    <RootBetslipProviderMock
      registerCollapseListener={rootContext.registerCollapseListener}
      isBetConfirmationStep={rootContext.isBetConfirmationStep || false}
    >
      <Single
        shouldFocusStakeField={shouldFocusStakeField}
        runnerUrn={runnerUrn}
        id={id}
        legId={legId}
        title={title}
        subtitle={subtitle}
        handicap={handicap}
        hasAvailabilityHints={hasAvailabilityHints}
        silk={silk}
        silkFallbackIconType={silkFallbackIconType}
        racingSport={racingSport}
        isPriceBoosted={isPriceBoosted}
        boostedInfo={boostedInfo}
        hasBoostSignposting={hasBoostSignposting}
        is90Min={is90Min}
        selectionTypeIcon={selectionTypeIcon}
        guaranteedPriceLabel={guaranteedPriceLabel}
        isGuaranteedPriceSelected={isGuaranteedPriceSelected}
        dispatchRemoveSelectionAction={dispatchRemoveSelectionAction}
      />
    </RootBetslipProviderMock>,
  );
}

afterEach(() => {
  jest.clearAllMocks();
});

describe("Single", () => {
  it("should call ConnectedBetControls", () => {
    renderSingle({ id: "some id", shouldFocusStakeField: true, hasAvailabilityHints: true });

    expect(ConnectedBetControls).toHaveBeenCalledWith(
      {
        component: BetControls,
        combinationId: "some id",
        shouldFocusStakeField: true,
        hasAvailabilityHints: true,
      },
      undefined,
    );

    expect(ConnectedBetControls).toHaveBeenCalledTimes(1);
  });

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
              iconName: "PRICE_BOOST",
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
        silk: "SILK_ICON",
        racingSport: 7,
        guaranteedPriceLabel: "guaranteedPriceLabel mock",
        isGuaranteedPriceSelected: true,
        is90Min: true,
        selectionTypeIcon: "selectionTypeIcon",
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
          displayAllSubtitleText: false,
        },
        undefined,
      );
      expect(BetDetails).toHaveBeenCalledTimes(1);
    });

    describe("when selectionTypeIcon prop is not informed", () => {
      it("should call BetDetails with selectionTypeIcon as undefined", () => {
        renderSingle({
          id: "1",
          title: "Some runner",
          subtitle: "Some market - some event",
          handicap: "Some handicap",
          silkIcon: "SILK_ICON",
          racingSport: 7,
          guaranteedPriceLabel: "guaranteedPriceLabel mock",
          isGuaranteedPriceSelected: true,
          is90Min: true,
          selectionTypeIcon: undefined,
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
            selectionTypeIcon: undefined,
            guaranteedPriceLabel: "guaranteedPriceLabel mock",
            isGuaranteedPriceSelected: true,
            displayAllSubtitleText: false,
          },
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
        renderSingle({}, { isBetConfirmationStep: true });

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
