import { act, render } from "@testing-library/react-native";
import { AppState } from "react-native";

import { InfoLabel, StatusLabel } from "@ppb/the-wall-native";
import { InfoLabelType, StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { ValueIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { navigate } from "@ppb/tbd-router";

import ConnectedGenericView from "../GenericView";
import { GenericView } from "../GenericView/GenericView.native";
import ConnectedCashout from "../Cashout";
import Cashout from "../Cashout/Cashout.native";
import { SportsbookBetPanel } from "../SportsbookBetPanel/SportsbookBetPanel.native";
import ConnectedNotificationsSubscription from "../NotificationsSubscription";
import { NotificationsViewMode } from "../NotificationsSubscription/map-to-props-factory";
import NotificationsSubscription from "../NotificationsSubscription/NotificationsSubscription.native";

import { i18n } from "../../helpers/i18n";
import SportsbookBetCard from "./SportsbookBetCard.native";

jest.mock("@ppb/the-wall-native", () => ({
  SportsbookBetPanel: jest.fn(({ children }) => <sportsbook-bet-panel-mock>{children}</sportsbook-bet-panel-mock>),
  InfoLabel: jest.fn(() => <info-label-component></info-label-component>),
  StatusLabel: jest.fn(({ props }) => <status-label-component {...props}></status-label-component>),
}));

jest.mock("../SportsbookBetPanel/SportsbookBetPanel.native", () => ({
  SportsbookBetPanel: jest.fn(({ children, notification, ...props }) => (
    <>
      {notification}
      <sportsbook-bet-panel-mock {...props}>{children}</sportsbook-bet-panel-mock>
    </>
  )),
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

jest.mock("../GenericView", () => jest.fn(() => <connected-generic-view-mock />));

jest.mock("../GenericView/GenericView.native", () => ({
  GenericView: jest.fn(() => <generic-view-mock />),
}));

jest.mock("../Cashout/Cashout.native", () => jest.fn(() => <cashout-component-mock />));

jest.mock("../Cashout", () => jest.fn(() => <connected-cashout-mock data-testid="connected-cashout" />));

jest.mock("../NotificationsSubscription/NotificationsSubscription.native", () =>
  jest.fn((props) => <notifications-subscription-mock {...props} />),
);

jest.mock("../NotificationsSubscription", () =>
  jest.fn((props) => <connected-notifications-subscription-mock {...props} />),
);

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(() => {}),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: { "spacing-card-top-default": 12 },
}));

jest.mock("@react-navigation/native", () => {
  const React = require("react");
  return {
    useFocusEffect: jest.fn((callback) => {
      // to attach to the react unmount lifecycle, for cleanup function
      React.useEffect(() => {
        const cleanup = callback();
        return cleanup;
      }, [callback]);
    }),
  };
});

jest.mock("../FreezeSelection/FreezeSelection.native", () =>
  jest.fn(() => <freeze-selection-mock data-testid="freeze-selection" />),
);

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
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

jest.mock("react-native-device-info", () => ({}));

function renderSportsbookBetCard(props) {
  return render(<SportsbookBetCard {...props} />);
}

const defaultProps = {
  urn: "urn-mock",
  title: "Match Odds",
  supportingText: undefined,
  statusLabelText: "statusLabelText",
  statusLabelIcon: "statusLabelIcon",
  statusLabelType: "statusLabelType",
  isMultiple: true,
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
  originalReturns: "10.00",
  stakeDetail: "(2 x £5)",
  returns: "£205.00",
  placedReturns: "£150.00",
  betSegmentInfos: [{ label: "I18N.MY_BETS.RESULT.PLACED", icon: "placed icon" }],
  showOddsBoostSignposting: true,
  cashoutQuoteURN: "QUOTE_URN",
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
  navigationIsFocused: true,
  isMutationEligible: true,
  alert: {
    type: "success",
    message: "message",
    iconName: "System--notification-success",
  },
};

const EXPECTED_SPORTSBOOK_BET_PANEL = {
  title: "Match Odds",
  supportingText: undefined,
  statusLabelText: "statusLabelText",
  statusLabelIcon: "statusLabelIcon",
  statusLabelType: "statusLabelType",
  isMultiple: true,
  isGuaranteedPriceSelected: false,
  guaranteedPriceLabel: "guaranteedPriceLabel",
  segmentData: {
    rightValue: "£205.00",
    rightPreviousValue: "10.00",
    midValue: "£5.03",
    midLabel: "Stake",
    midValueDetail: "(2 x £5)",
    rightLabel: "Returns",
    isOddsBoosted: true,
  },
  secondarySegmentData: {
    rightLabel: "2nd - 4th returns",
    rightPreviousValue: "",
    rightValue: "£150.00",
  },
  betSegmentInfos: [{ label: "I18N.MY_BETS.RESULT.PLACED", icon: "placed icon" }],
  onOpenExternalUrl: expect.any(Function),
  notification: expect.any(Object),
  alert: expect.any(Object),
  children: [false, null, undefined, false, expect.any(Object)],
};

describe("Sportsbook Bet Card native component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    defaultProps.dispatchFetchCatalogue = jest.fn();
    defaultProps.dispatchShareIconTap = jest.fn();
    defaultProps.dispatchHeritageInfoLabelClick = jest.fn();
    defaultProps.dispatchSubscribeCardUpdatesAction = mockDispatchSubscribeCardUpdatesAction;
    defaultProps.dispatchUnsubscribeCardUpdatesAction = mockDispatchUnsubscribeCardUpdatesAction;
    defaultProps.dispatchSubscribeBlhResult = mockDispatchSubscribeBlhResult;
    defaultProps.dispatchUnsubscribeBlhResult = mockDispatchUnsubscribeBlhResult;
    defaultProps.dispatchSubscribeBmeResult = mockDispatchSubscribeBmeResult;
    defaultProps.dispatchUnsubscribeBmeResult = mockDispatchUnsubscribeBmeResult;
  });

  describe("when props does not have title", () => {
    it("should not render any component", () => {
      renderSportsbookBetCard({
        ...defaultProps,
        title: undefined,
      });

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
    let props;

    beforeEach(() => {
      props = {
        ...defaultProps,
        betSharingViewUrn: "betSharingViewUrn",
      };
    });

    describe("when isBetSharingSupported is true", () => {
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
          },
          undefined,
        );
      });

      describe("when pressing the ShareIcon button", () => {
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

  describe("notificationsSubscription", () => {
    it("should call ConnectedNotificationsSubscription with the right props", () => {
      renderSportsbookBetCard(defaultProps);

      expect(ConnectedNotificationsSubscription).toHaveBeenCalledWith(
        {
          viewMode: NotificationsViewMode.MY_BETS,
          betURN: defaultProps.urn,
          component: NotificationsSubscription,
        },
        undefined,
      );
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

  describe("when props has hasQuote = true", () => {
    it("should render cashout button", () => {
      renderSportsbookBetCard({ ...defaultProps, hasQuote: true });

      expect(ConnectedCashout).toHaveBeenCalledWith({ cashoutURN: "QUOTE_URN", component: Cashout }, undefined);
    });
  });

  describe("when props has hasQuote = false", () => {
    it("should not render cashout button", () => {
      renderSportsbookBetCard({ ...defaultProps, hasQuote: false });

      expect(ConnectedCashout).not.toHaveBeenCalledWith();
    });
  });

  describe.each([
    ["dispatchSubscribeCardUpdatesAction", mockDispatchSubscribeCardUpdatesAction, true],
    ["dispatchUnsubscribeCardUpdatesAction", mockDispatchUnsubscribeCardUpdatesAction, false],
    ["dispatchSubscribeBlhResult", mockDispatchSubscribeBlhResult, true],
    ["dispatchUnsubscribeBlhResult", mockDispatchUnsubscribeBlhResult, false],
    ["dispatchSubscribeBmeResult", mockDispatchSubscribeBmeResult, true],
    ["dispatchUnsubscribeBmeResult", mockDispatchUnsubscribeBmeResult, false],
  ])("%s", (action, actionFn, shouldCall) => {
    describe("when shouldSubscribe is true and app is active", () => {
      it(`should ${shouldCall ? "call" : "call on unmount"} ${action} with URN`, () => {
        Object.defineProperty(AppState, "currentState", {
          value: "active",
          writable: true,
          configurable: true,
        });

        const { unmount } = renderSportsbookBetCard({ ...defaultProps, shouldSubscribe: true });

        if (shouldCall) {
          expect(actionFn).toHaveBeenCalledWith(defaultProps.urn);
        } else {
          expect(actionFn).not.toHaveBeenCalled();

          act(() => {
            unmount();
          });

          expect(actionFn).toHaveBeenCalledWith(defaultProps.urn);
        }
      });
    });

    describe("when shouldSubscribe is true and app is inactive", () => {
      it(`should not call ${action}`, () => {
        Object.defineProperty(AppState, "currentState", {
          value: "background",
          writable: true,
          configurable: true,
        });

        const { unmount } = renderSportsbookBetCard({ ...defaultProps, shouldSubscribe: true });

        expect(actionFn).not.toHaveBeenCalled();

        act(() => {
          unmount();
        });

        if (!shouldCall) {
          expect(actionFn).toHaveBeenCalledWith(defaultProps.urn);
        } else {
          expect(actionFn).not.toHaveBeenCalled();
        }
      });
    });

    describe("when shouldSubscribe is false", () => {
      it(`should not call ${action}`, () => {
        const { unmount } = renderSportsbookBetCard({ ...defaultProps, shouldSubscribe: false });

        expect(actionFn).not.toHaveBeenCalled();

        act(() => {
          unmount();
        });

        expect(actionFn).not.toHaveBeenCalled();
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

      it("should call dispatchHeritageInfoLabelClick", () => {
        renderSportsbookBetCard({ ...defaultProps, shouldShowHeritageInfoLabel: true });

        act(() => {
          InfoLabel.mock.calls[0][0].onClick();
        });

        expect(defaultProps.dispatchHeritageInfoLabelClick).toHaveBeenCalled();
      });
    });

    describe("when onOpenExternalUrl is clicked", () => {
      it("should call navigate", () => {
        const EXTERNAL_LINK_MOCK = "https://support.skybet.com/rule-4-deductions";

        renderSportsbookBetCard({
          ...defaultProps,
          betSegmentInfos: [{ label: "I18N.MYBETS.RULE4", icon: "external link", externalUrl: EXTERNAL_LINK_MOCK }],
        });

        act(() => {
          act(() => {
            SportsbookBetPanel.mock.calls[0][0].onOpenExternalUrl(EXTERNAL_LINK_MOCK);
          });
        });

        expect(navigate).toHaveBeenCalledWith({
          viewUrl: EXTERNAL_LINK_MOCK,
          viewDisplayMode: "BLANK_WEBVIEW",
          viewUrn: "ppb:tbd:view:external",
        });
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
});
