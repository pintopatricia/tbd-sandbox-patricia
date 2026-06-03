import { act, render, waitFor } from "@testing-library/react";

import { InfoLabelType, StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { InfoLabel, useOnIntersect, StatusLabel } from "@ppb/the-wall-web";
import { SportsbookBetPanel } from "../SportsbookBetPanel/SportsbookBetPanel.web";
import { ValueIconName } from "@ppb/the-wall-icons";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { canShare } from "../../helpers/share.web";
import ConnectedCashout from "../Cashout";
import { ConfigContext } from "../Config/ConfigContext";
import ConnectedGenericView from "../GenericView";
import { GenericView } from "../GenericView/GenericView.web";

import SportsbookBetCard from "./SportsbookBetCard.web";
import { i18n } from "../../helpers/i18n";

jest.mock("@ppb/the-wall-web", () => ({
  SportsbookBetPanel: jest.fn(({ children, ...props }) => (
    <sportsbook-bet-panel-mock {...props}>{children}</sportsbook-bet-panel-mock>
  )),
  InfoLabel: jest.fn(() => <info-label-component></info-label-component>),
  useOnIntersect: jest.fn(),
  StatusLabel: jest.fn(({ props }) => <status-label-component {...props}></status-label-component>),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  ValueIconName: {
    PRICE_BOOST: "PRICE_BOOST",
    ACCA_FREEZE: "Value--Acca-Freeze",
  },
  SystemIconName: {
    NOTIFICATION_SUCCESS: "System--notification-success",
  },
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../../helpers/share.web", () => ({
  canShare: jest.fn(),
}));

jest.mock("../GenericView", () => jest.fn(() => <connected-generic-view-mock />));

jest.mock("../GenericView/GenericView.web", () => ({
  GenericView: jest.fn(() => <generic-view-mock />),
}));

jest.mock("../Config/ConfigContext", () => ({
  ConfigContext: {
    _currentValue: {
      isDesktopLayout: false,
    },
  },
}));

jest.mock("../Cashout", () => jest.fn(() => <connected-cashout-mock data-testid="connected-cashout" />));

jest.mock("../Cashout/Cashout.web", () => jest.fn(() => <cashout-mock />));

jest.mock("../FreezeSelection/FreezeSelection.web", () =>
  jest.fn(() => <freeze-selection-mock data-testid="freeze-selection" />),
);

jest.mock("../SportsbookBetPanel/SportsbookBetPanel.web", () => ({
  SportsbookBetPanel: jest.fn(({ children, props }) => (
    <sportsbook-bet-panel-mock {...props}>{children}</sportsbook-bet-panel-mock>
  )),
}));

const mockDispatchSubscribeCardUpdatesAction = jest.fn();
const mockDispatchUnsubscribeCardUpdatesAction = jest.fn();
const mockDispatchSubscribeBlhResult = jest.fn();
const mockDispatchUnsubscribeBlhResult = jest.fn();
const mockDispatchSubscribeBmeResult = jest.fn();
const mockDispatchUnsubscribeBmeResult = jest.fn();

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const defaultProps = {
  urn: "mockSbkBetUrn",
  title: "Match Odds",
  supportingText: undefined,
  statusLabelText: "text",
  statusLabelIcon: "statusLabelIcon",
  statusLabelType: "statusLabelType",
  isMultiple: true,
  statusLabelBoostedInfo: undefined,
  isGuaranteedPriceSelected: false,
  labels: {
    guaranteedPriceLabel: "guaranteedPriceLabel",
    stake: "Stake",
    returns: "Returns",
    placedReturns: "2nd - 4th returns",
    freeBetsBonus: "FreeBet",
    oddsBoost: "Odds Boost",
    heritageInfoLabel: {
      label: "Why can't i cash out my older bets?",
      icon: "System-external-link",
    },
    priceBoost: "Price Boost",
  },
  stake: "£5.03",
  returns: "£205.00",
  placedReturns: "£150.00",
  stakeDetail: "(2 x £5)",
  originalReturns: "10.00",
  betSegmentInfos: [{ label: "I18N.MY_BETS.RESULT.PLACED", icon: "placed icon" }],
  showOddsBoostSignposting: true,
  cashoutQuoteURN: undefined,
  isAccaFreezeEligible: false,
  shouldShowFreezeSelectionButton: false,
  hasQuote: false,
  shouldSubscribe: true,
  shouldShowHeritageInfoLabel: false,
  heritageInfoLabelViewLink: {
    viewUrn: "ppb:tbd:view:external",
    viewUrl: "https://support.skybet.com/app/answers/detail/why-cant-i-cash-out-my-older-bets",
    viewDisplayMode: "BLANK_WEBVIEW",
  },
  freezeDetails: "",
  isMutationEligible: true,
  alert: {
    type: "success",
    message: "message",
    iconName: "System--notification-success",
  },
  dispatchFetchCatalogue: jest.fn(),
  dispatchShareIconTap: jest.fn(),
  dispatchExternalPushBlankAction: jest.fn(),
  dispatchHeritageInfoLabelClick: jest.fn(),
  dispatchSubscribeCardUpdatesAction: mockDispatchSubscribeCardUpdatesAction,
  dispatchUnsubscribeCardUpdatesAction: mockDispatchUnsubscribeCardUpdatesAction,
  dispatchSubscribeBlhResult: mockDispatchSubscribeBlhResult,
  dispatchUnsubscribeBlhResult: mockDispatchUnsubscribeBlhResult,
  dispatchSubscribeBmeResult: mockDispatchSubscribeBmeResult,
  dispatchUnsubscribeBmeResult: mockDispatchUnsubscribeBmeResult,
};

const EXPECTED_SPORTSBOOK_BET_PANEL = {
  title: "Match Odds",
  supportingText: undefined,
  statusLabelText: "text",
  statusLabelIcon: "statusLabelIcon",
  statusLabelType: "statusLabelType",
  isMultiple: true,
  isGuaranteedPriceSelected: false,
  guaranteedPriceLabel: "guaranteedPriceLabel",
  segmentData: {
    midLabel: "Stake",
    midValue: "£5.03",
    midValueDetail: "(2 x £5)",
    rightLabel: "Returns",
    rightPreviousValue: "10.00",
    rightValue: "£205.00",
    isOddsBoosted: true,
  },
  secondarySegmentData: {
    rightLabel: "2nd - 4th returns",
    rightPreviousValue: "",
    rightValue: "£150.00",
  },
  betSegmentInfos: [{ label: "I18N.MY_BETS.RESULT.PLACED", icon: "placed icon" }],
  alert: expect.any(Object),
  children: [false, null, undefined, false, expect.any(Object)],
};

function renderSportsbookBetCard(props, isIntersecting = false) {
  useOnIntersect.mockReturnValue({ isIntersecting });

  return render(<SportsbookBetCard {...props} />);
}

describe("Sportsbook Bet Card web component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when props does not have title", () => {
    it("should not render any component", () => {
      renderSportsbookBetCard({ ...defaultProps, title: undefined });

      expect(SportsbookBetPanel).not.toHaveBeenCalled();
    });
  });

  describe("when props does not have returns", () => {
    it("should not render any component", () => {
      renderSportsbookBetCard({ ...defaultProps, returns: undefined });

      expect(SportsbookBetPanel).not.toHaveBeenCalled();
    });
  });

  describe("when props does not have stake", () => {
    it("should not render any component", () => {
      renderSportsbookBetCard({
        ...defaultProps,
        stake: undefined,
      });

      expect(SportsbookBetPanel).not.toHaveBeenCalled();
    });
  });

  describe("when props has title, returns and stake", () => {
    describe("when odds prop is defined", () => {
      it("should call SportsbookBetPanel with correct props", () => {
        renderSportsbookBetCard(defaultProps);

        expect(SportsbookBetPanel).toHaveBeenCalledWith(EXPECTED_SPORTSBOOK_BET_PANEL, undefined);
      });
    });
  });

  describe("when props does not have placed returns", () => {
    it("should call SportsbookBetPanel with secondarySegmentData as undefined", () => {
      renderSportsbookBetCard({ ...defaultProps, placedReturns: undefined });

      expect(SportsbookBetPanel).toHaveBeenCalledWith(
        expect.objectContaining({ secondarySegmentData: undefined }),
        undefined,
      );
    });
  });

  describe("when isSettled is true", () => {
    it("should call SportsbookBetPanel with secondarySegmentData as undefined", () => {
      renderSportsbookBetCard({ ...defaultProps, isSettled: true });

      expect(SportsbookBetPanel).toHaveBeenCalledWith(
        expect.objectContaining({ secondarySegmentData: undefined }),
        undefined,
      );
    });
  });

  describe("when props has betSharingViewUrn", () => {
    const props = {
      ...defaultProps,
      betSharingViewUrn: "betSharingViewUrn",
    };

    describe("when isDesktopLayout is true", () => {
      beforeEach(() => {
        ConfigContext._currentValue.isDesktopLayout = true;
      });

      it("should call SportsbookBetPanel with onShareIconTap undefined", () => {
        renderSportsbookBetCard(props);

        expect(SportsbookBetPanel).toHaveBeenCalledWith(
          expect.objectContaining({
            onShareIconTap: undefined,
          }),
          undefined,
        );
      });
    });

    describe("when isDesktopLayout is false", () => {
      beforeEach(() => {
        ConfigContext._currentValue.isDesktopLayout = false;
      });

      describe("when canShare returns false", () => {
        beforeEach(() => {
          canShare.mockReturnValue(false);
        });

        it("should call SportsbookBetPanel with onShareIconTap undefined", () => {
          renderSportsbookBetCard(props);

          expect(SportsbookBetPanel).toHaveBeenCalledTimes(1);
          expect(SportsbookBetPanel).toHaveBeenCalledWith(
            expect.objectContaining({
              onShareIconTap: undefined,
            }),
            undefined,
          );
        });
      });

      describe("when canShare returns true", () => {
        beforeEach(() => {
          canShare.mockReturnValue(true);
        });

        it("should call SportsbookBetPanel with onShareIconTap defined", () => {
          renderSportsbookBetCard(props);

          expect(SportsbookBetPanel).toHaveBeenCalledTimes(1);
          expect(SportsbookBetPanel).toHaveBeenCalledWith(
            expect.objectContaining({
              onShareIconTap: expect.any(Function),
            }),
            undefined,
          );
        });

        it("should call ConnectedGenericView", () => {
          renderSportsbookBetCard(props);

          expect(ConnectedGenericView).toHaveBeenCalledTimes(1);
          expect(ConnectedGenericView).toHaveBeenCalledWith(
            {
              urn: props.betSharingViewUrn,
              component: GenericView,
              placeholder: expect.any(Function),
            },
            undefined,
          );
        });

        describe("when pressing the Share button", () => {
          beforeEach(() => {
            renderSportsbookBetCard(props);

            act(() => {
              SportsbookBetPanel.mock.calls[0][0].onShareIconTap();
            });
          });

          it("should call dispatchFetchCatalogue with betSharingViewUrn", () => {
            expect(props.dispatchFetchCatalogue).toHaveBeenCalledTimes(1);
            expect(props.dispatchFetchCatalogue).toHaveBeenCalledWith(props.betSharingViewUrn);
          });

          it("should call MyBetsBetSharingPreviewTapAction", () => {
            expect(props.dispatchShareIconTap).toHaveBeenCalledTimes(1);
            expect(props.dispatchShareIconTap).toHaveBeenCalledWith();
          });
        });
      });
    });
  });

  describe("when isAccaFreezeEligible is true", () => {
    it("should render acca freeze StatusLabel", async () => {
      renderSportsbookBetCard({
        ...defaultProps,
        isAccaFreezeEligible: true,
      });

      expect(StatusLabel).toHaveBeenCalledTimes(1);
      expect(StatusLabel).toHaveBeenCalledWith(
        {
          iconName: "Value--Acca-Freeze",
          statusLabelSize: "small",
          statusLabelType: "alternativeBranded",
          text: `${i18n({ key: "I18N.ACCA_FREEZE.TITLE" })}`,
        },
        undefined,
      );
    });
  });

  describe("when the superSubIcon prop is provided", () => {
    it("should render the Super Sub icon", async () => {
      renderSportsbookBetCard({
        ...defaultProps,
        superSubIcon: "Value--Super-Sub-With-Label",
      });

      expect(GenericIcon).toHaveBeenCalledTimes(1);
      expect(GenericIcon).toHaveBeenCalledWith(
        {
          name: "Value--Super-Sub-With-Label",
        },
        undefined,
      );
    });
  });
  describe("when cashoutQuoteURN is defined", () => {
    describe("and hasQuote is true", () => {
      it("should render Cashout", async () => {
        const { getByTestId } = renderSportsbookBetCard({
          ...defaultProps,
          cashoutQuoteURN: "QUOTE_URN",
          hasQuote: true,
        });

        await waitFor(() => getByTestId("connected-cashout"));

        expect(ConnectedCashout).toHaveBeenCalledWith(
          { cashoutURN: "QUOTE_URN", component: expect.any(Object) },
          undefined,
        );
        expect(ConnectedCashout).toHaveBeenCalledTimes(1);
      });
    });

    describe("and hasQuote is false", () => {
      it("should not render Cashout", () => {
        renderSportsbookBetCard({
          ...defaultProps,
          cashoutQuoteURN: "QUOTE_URN",
          hasQuote: false,
        });

        expect(ConnectedCashout).not.toHaveBeenCalled();
      });
    });
  });

  describe("when cashoutQuoteURN is not defined", () => {
    it("should not render Cashout", () => {
      renderSportsbookBetCard(defaultProps);

      expect(ConnectedCashout).not.toHaveBeenCalled();
    });
  });

  describe.each([
    ["dispatchSubscribeCardUpdatesAction", mockDispatchSubscribeCardUpdatesAction, true],
    ["dispatchUnsubscribeCardUpdatesAction", mockDispatchUnsubscribeCardUpdatesAction, false],
    ["dispatchSubscribeBlhResult", mockDispatchSubscribeBlhResult, true],
    ["dispatchUnsubscribeBlhResult", mockDispatchUnsubscribeBlhResult, false],
    ["dispatchSubscribeBmeResult", mockDispatchSubscribeBmeResult, true],
    ["dispatchUnsubscribeBmeResult", mockDispatchUnsubscribeBmeResult, false],
  ])("%s", (action, actionFn, isIntersecting) => {
    describe("when shouldSubscribe is true", () => {
      describe(`and isIntersecting is ${isIntersecting}`, () => {
        it(`should call ${action} with URN`, () => {
          renderSportsbookBetCard({ ...defaultProps, shouldSubscribe: true }, isIntersecting);

          expect(actionFn).toHaveBeenCalledWith(defaultProps.urn);
        });
      });
    });

    describe("when shouldSubscribe is false", () => {
      describe(`and isIntersecting is ${isIntersecting}`, () => {
        it(`should not call ${action}`, () => {
          renderSportsbookBetCard({ ...defaultProps, shouldSubscribe: false }, isIntersecting);

          expect(actionFn).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when shouldShowHeritageInfoLabel is true", () => {
    it("should render the InfoLabel", () => {
      renderSportsbookBetCard({ ...defaultProps, shouldShowHeritageInfoLabel: true });

      expect(InfoLabel).toHaveBeenCalledTimes(1);
      expect(InfoLabel).toHaveBeenCalledWith(
        {
          infoLabelType: InfoLabelType.BRANDED,
          iconName: "System-external-link",
          iconPosition: "right",
          label: "Why can't i cash out my older bets?",
          onClick: expect.any(Function),
        },
        undefined,
      );
    });

    it("should call dispatchHeritageInfoLabelClick and dispatchExternalPushBlankAction", () => {
      renderSportsbookBetCard({ ...defaultProps, shouldShowHeritageInfoLabel: true });

      act(() => {
        InfoLabel.mock.calls[0][0].onClick();
      });

      expect(defaultProps.dispatchHeritageInfoLabelClick).toHaveBeenCalled();
      expect(defaultProps.dispatchExternalPushBlankAction).toHaveBeenCalled();
    });
  });

  describe("when statusLabelBoostedInfo is defined", () => {
    it("should render StatusLabel Signposting", () => {
      renderSportsbookBetCard({
        ...defaultProps,
        statusLabelBoostedInfo: { iconName: ValueIconName.PRICE_BOOST, label: "Price Boost" },
      });

      expect(StatusLabel).toHaveBeenCalledTimes(1);
      expect(StatusLabel).toHaveBeenCalledWith(
        {
          iconName: ValueIconName.PRICE_BOOST,
          statusLabelType: StatusLabelType.ALTERNATIVE_BRANDED,
          statusLabelSize: StatusLabelSizeType.SMALL,
          text: "Price Boost",
        },
        undefined,
      );
    });
  });

  describe("when statusLabelBoostedInfo is not defined", () => {
    it("should not render StatusLabel Signposting", () => {
      renderSportsbookBetCard({ ...defaultProps });
      expect(StatusLabel).toHaveBeenCalledTimes(0);
    });
  });
});
