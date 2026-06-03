import { render } from "@testing-library/react-native";

import {
  BetSegmentsColor,
  BetSegmentsIcons,
  FallbackIconType,
  BetDetailsColor,
  BetDetailsAction,
  AlertType,
  BetSegmentsSize,
} from "@ppb/the-wall-common/types";
import { ValueIconName } from "@ppb/the-wall-icons";

import { Alert, BetDetails, BetSegments, FreeBets, Option } from "@ppb/the-wall-native";
import { BetSportsbookReceipt } from "./BetSportsbookReceipt.native";

jest.mock("react-native-svg", () => ({ SvgCssUri: jest.fn(() => <svg-css-uri-mock />) }));

jest.mock("@ppb/the-wall-native", () => ({
  Alert: jest.fn(() => <alert-mock />),
  BetDetails: jest.fn(() => <betslip-selection />),
  BetSegments: jest.fn(() => <bet-receipt-segments />),
  FreeBets: jest.fn(() => <freebets-mock />),
  Option: jest.fn(() => <option-mock />),
}));
jest.mock("../../../../../../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

function renderBetSportsbookReceipt({
  title,
  subtitle,
  odds,
  previousOdds,
  segmentsIcon,
  stake,
  colorIndicator,
  profitOrLiability,
  previousProfitOrLiability,
  oddsLabel,
  stakeLabel,
  profitOrLiabilityLabel,
  theme,
  hasBonusUsed = false,
  freeBetsLabel,
  generosityAlertMessage,
  generosityIconName,
  silkIcon,
  silkFallbackIconType,
  racingSport,
  hasEachWay,
  eachWayLabel,
  eachWaySubtitle,
  is90Min,
  selectionTypeIcon,
  isPriceBoosted,
  hasMyOddsBoost,
  isGuaranteedPriceSelected,
  guaranteedPriceLabel,
  hasShownReceiptIds,
  isPushNotificationsUnavailable,
  isFreeBetsSelected = false,
} = {}) {
  return render(
    <BetSportsbookReceipt
      title={title}
      subtitle={subtitle}
      theme={theme}
      odds={odds}
      previousOdds={previousOdds}
      segmentsIcon={segmentsIcon}
      stake={stake}
      colorIndicator={colorIndicator}
      profitOrLiability={profitOrLiability}
      previousProfitOrLiability={previousProfitOrLiability}
      oddsLabel={oddsLabel}
      stakeLabel={stakeLabel}
      profitOrLiabilityLabel={profitOrLiabilityLabel}
      hasBonusUsed={hasBonusUsed}
      freeBetsLabel={freeBetsLabel}
      generosityAlertMessage={generosityAlertMessage}
      generosityIconName={generosityIconName}
      silkIcon={silkIcon}
      silkFallbackIconType={silkFallbackIconType}
      racingSport={racingSport}
      hasEachWay={hasEachWay}
      eachWayLabel={eachWayLabel}
      eachWaySubtitle={eachWaySubtitle}
      is90Min={is90Min}
      selectionTypeIcon={selectionTypeIcon}
      isPriceBoosted={isPriceBoosted}
      hasMyOddsBoost={hasMyOddsBoost}
      isGuaranteedPriceSelected={isGuaranteedPriceSelected}
      guaranteedPriceLabel={guaranteedPriceLabel}
      hasShownReceiptIds={hasShownReceiptIds}
      isPushNotificationsUnavailable={isPushNotificationsUnavailable}
      isFreeBetsSelected={isFreeBetsSelected}
    />,
  );
}

const dummyReceipt = {
  title: "Selection",
  subtitle: "Market - Event Name",
  odds: 2.1,
  previousOdds: 1.5,
  segmentsIcon: BetSegmentsIcons.ODDSBOOST,
  stake: "£5",
  profitOrLiability: "£10.5",
  previousProfitOrLiability: "£8.5",
  oddsLabel: "Odds",
  stakeLabel: "Stake",
  profitOrLiabilityLabel: "Profit",
  silkIcon: "silkIconMock",
  racingSport: 7,
  silkFallbackIconType: FallbackIconType.HorseRacing,
  hasEachWay: false,
  is90Min: true,
  eachWayLabel: "Each Way",
  eachWaySubtitle: "Each Way Subtitle",
  isGuaranteedPriceSelected: true,
  hasMyOddsBoost: false,
  guaranteedPriceLabel: "guaranteedPriceLabelMock",
  isPushNotificationsUnavailable: false,
  isOddsBoosted: true,
};

describe("BetSportsbookReceipt", () => {
  beforeEach(jest.clearAllMocks);

  describe("BetDetails", () => {
    it("should be called with the right props", () => {
      renderBetSportsbookReceipt({ ...dummyReceipt });

      expect(BetDetails).toHaveBeenCalledWith(
        {
          title: dummyReceipt.title,
          subtitle: dummyReceipt.subtitle,
          color: BetDetailsColor.Teal,
          action: BetDetailsAction.None,
          is90Min: true,
          icon: expect.any(Object),
          isGuaranteedPriceSelected: dummyReceipt.isGuaranteedPriceSelected,
          guaranteedPriceLabel: dummyReceipt.guaranteedPriceLabel,
          notificationsUnavailable: dummyReceipt.isPushNotificationsUnavailable,
          displayAllSubtitleText: false,
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

    describe("selectionTypeIcon", () => {
      describe("when selectionTypeIcon is provided", () => {
        it("should render bet details with the correct icon", () => {
          renderBetSportsbookReceipt({
            ...dummyReceipt,
            selectionTypeIcon: ValueIconName.SPORTS_PROMOTION,
          });

          expect(BetDetails).toHaveBeenCalledWith(
            expect.objectContaining({
              selectionTypeIcon: ValueIconName.SPORTS_PROMOTION,
            }),
            undefined,
          );
        });
      });

      describe("when selectionTypeIcon is not provided", () => {
        it("should not render bet details with the icon", () => {
          renderBetSportsbookReceipt({ ...dummyReceipt });

          expect(BetDetails).toHaveBeenCalledWith(
            expect.objectContaining({
              selectionTypeIcon: undefined,
            }),
            undefined,
          );
        });
      });
    });
  });

  describe("EachWay", () => {
    describe("when hasEachWay is true", () => {
      it("should call Option", () => {
        renderBetSportsbookReceipt({ ...dummyReceipt, hasEachWay: true });

        expect(Option).toHaveBeenCalledWith(
          {
            isReadOnly: true,
            isSelected: true,
            title: "Each Way",
            subtitle: "Each Way Subtitle",
          },
          undefined,
        );
        expect(Option).toHaveBeenCalledTimes(1);
      });
    });

    describe("when hasEachWay is false", () => {
      it("should NOT call EachWay", () => {
        renderBetSportsbookReceipt({ ...dummyReceipt, hasEachWay: false });

        expect(Option).not.toHaveBeenCalled();
      });
    });
  });

  describe("BetSegments", () => {
    it("should be called with the right props", () => {
      renderBetSportsbookReceipt({
        ...dummyReceipt,
        colorIndicator: BetSegmentsColor.Blue,
      });

      expect(BetSegments).toHaveBeenCalledWith(
        {
          colorIndicator: BetSegmentsColor.Blue,
          icon: dummyReceipt.segmentsIcon,
          isOddsBoosted: false,
          leftLabel: dummyReceipt.oddsLabel,
          leftValue: dummyReceipt.odds,
          leftPreviousValue: dummyReceipt.previousOdds,
          midLabel: dummyReceipt.stakeLabel,
          midValue: dummyReceipt.stake,
          rightLabel: dummyReceipt.profitOrLiabilityLabel,
          rightValue: dummyReceipt.profitOrLiability,
          rightPreviousValue: dummyReceipt.previousProfitOrLiability,
          size: BetSegmentsSize.SMALL,
        },
        undefined,
      );
      expect(BetSegments).toHaveBeenCalledTimes(1);
    });
  });

  describe("isPriceBoosted (MYOB or odds boost market type)", () => {
    describe("when isPriceBoosted is true", () => {
      it("should call BetDetails with BetDetailsColor.Black", () => {
        renderBetSportsbookReceipt({
          ...dummyReceipt,
          isPriceBoosted: true,
        });

        expect(BetDetails).toHaveBeenCalledWith(expect.objectContaining({ color: BetDetailsColor.Black }), undefined);
        expect(BetDetails).toHaveBeenCalledTimes(1);
      });

      it("should call BetSegments with the correct props", () => {
        renderBetSportsbookReceipt({
          ...dummyReceipt,
          isPriceBoosted: true,
        });

        expect(BetSegments).toHaveBeenCalledWith(
          {
            colorIndicator: undefined,
            icon: dummyReceipt.segmentsIcon,
            leftLabel: dummyReceipt.oddsLabel,
            leftValue: dummyReceipt.odds,
            leftPreviousValue: dummyReceipt.previousOdds,
            midLabel: dummyReceipt.stakeLabel,
            midValue: dummyReceipt.stake,
            rightLabel: dummyReceipt.profitOrLiabilityLabel,
            rightValue: dummyReceipt.profitOrLiability,
            rightPreviousValue: dummyReceipt.previousProfitOrLiability,
            isOddsBoosted: true,
            size: BetSegmentsSize.SMALL,
          },
          undefined,
        );
        expect(BetSegments).toHaveBeenCalledTimes(1);
      });
    });

    describe("when isPriceBoosted is false", () => {
      it("should call BetDetails with BetDetailsColor.Teal", () => {
        renderBetSportsbookReceipt({
          ...dummyReceipt,
          isPriceBoosted: false,
        });

        expect(BetDetails).toHaveBeenCalledWith(expect.objectContaining({ color: BetDetailsColor.Teal }), undefined);
        expect(BetDetails).toHaveBeenCalledTimes(1);
      });

      describe("and hasMyOddsBoost is true", () => {
        it("should call BetSegments with the correct props", () => {
          renderBetSportsbookReceipt({
            ...dummyReceipt,
            hasMyOddsBoost: true,
          });

          expect(BetSegments).toHaveBeenCalledWith(
            {
              colorIndicator: undefined,
              icon: dummyReceipt.segmentsIcon,
              leftLabel: dummyReceipt.oddsLabel,
              leftValue: dummyReceipt.odds,
              leftPreviousValue: dummyReceipt.previousOdds,
              midLabel: dummyReceipt.stakeLabel,
              midValue: dummyReceipt.stake,
              rightLabel: dummyReceipt.profitOrLiabilityLabel,
              rightValue: dummyReceipt.profitOrLiability,
              rightPreviousValue: dummyReceipt.previousProfitOrLiability,
              isOddsBoosted: true,
              size: BetSegmentsSize.SMALL,
            },
            undefined,
          );
          expect(BetSegments).toHaveBeenCalledTimes(1);
        });
      });
    });
  });

  describe("FreeBets", () => {
    describe("when user does not use bonus", () => {
      it("should not render the free bets info", () => {
        renderBetSportsbookReceipt({ ...dummyReceipt, hasBonusUsed: false });

        expect(FreeBets).toHaveBeenCalledTimes(0);
      });
    });

    describe("when user uses bonus", () => {
      it("should render the free bets info", () => {
        renderBetSportsbookReceipt({ ...dummyReceipt, hasBonusUsed: true, freeBetsLabel: "freeBetsLabel" });

        expect(FreeBets).toHaveBeenCalledWith(
          {
            label: "freeBetsLabel",
            isSelected: true,
            isReadOnly: true,
          },
          undefined,
        );
        expect(FreeBets).toHaveBeenCalledTimes(1);
      });
    });

    describe("when user uses bonus wallets", () => {
      it("should render the generosity alert", () => {
        renderBetSportsbookReceipt({
          ...dummyReceipt,
          generosityAlertMessage: "generosityAlertMessage",
          generosityIconName: "Value--Free-Bets",
        });

        expect(Alert).toHaveBeenCalledWith(
          {
            message: "generosityAlertMessage",
            type: AlertType.Generosity,
            showCloseIcon: false,
            iconOverload: "Value--Free-Bets",
          },
          undefined,
        );
        expect(Alert).toHaveBeenCalledTimes(1);
      });
    });
  });
});
