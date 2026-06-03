import { Text } from "react-native";
import { render } from "@testing-library/react-native";
import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";
import { Card, TabsGroup } from "@ppb/the-wall-native";
import { SportsbookPlacePanelContentLayout, BetslipSection } from "./SportsbookPlacePanel.types";

import { PlaceFooter } from "../PlaceFooter/PlaceFooter.native";

import { SBK_PLACE_PANEL } from "./SportsbookPlacePanel.native.selectors";
import { SportsbookPlacePanel } from "./SportsbookPlacePanel.native";

jest.mock("react-native-svg", () => ({ SvgCssUri: jest.fn(() => <svg-css-uri-mock />) }));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Card: jest.fn(({ props, children }) => <card-mock {...props}>{children}</card-mock>),
  TabsGroup: jest.fn(({ props }) => <tabsgroup-mock {...props} />),
  SubHeader: jest.fn(() => <sub-header-mock />),
  KeyboardAwareScrollView: jest.fn(({ children }) => (
    <keyboard-aware-scroll-view-mock>{children}</keyboard-aware-scroll-view-mock>
  )),
  Alert: jest.fn(() => <alert-mock />),
  MarketBlurbs: jest.fn(() => <market-blurbs-mock />),
}));

jest.mock("../PlaceFooter/PlaceFooter.native", () => ({
  PlaceFooter: jest.fn(({ props }) => <place-footer-mock {...props} />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    SportsbookPlacePanelActionIconDisabledColour: "SportsbookPlacePanelActionIconDisabledColour",
    SportsbookPlacePanelVerticalGapPrimary: {},
  },
  spacings: "spacing-20",
}));

const i18nMock = {
  singlesGroup: "singles tab mock",
  multiplesGroup: "multiples tab mock",
  systemGroup: "system tab mock",
  totalReturns: "totalReturns",
  place: "place",
  placeWithChanges: "accept changes & place",
  multiBetBuilder: "mbb title",
  betBuilder: "bb title",
  multiples: "multiples title",
  additionalMultiples: "additional multiples title",
  singles: "singles title",
  casts: "cast title",
  removeLabel: "removeLabel",
  freeBetsLabel: "freeBets",
  eachWay: "eachWay",
  freeBetsAlertRemoveLabel: "Remove",
};

const betslipCardsMock = [
  {
    id: i18nMock.multiplesGroup,
    content: [
      {
        card: <multi-bet-builder-card-mock />,
        title: i18nMock.multiBetBuilder,
        startsOpen: true,
        collapsable: true,
      },
      {
        card: <bet-builders-card-mock />,
        title: i18nMock.betBuilder,
        startsOpen: true,
        collapsable: true,
      },
      {
        card: <one-line-multiple-card-mock />,
        title: i18nMock.multiples,
        startsOpen: true,
        collapsable: true,
      },
    ],
  },
  {
    id: i18nMock.systemGroup,
    content: [
      {
        card: <multi-lines-multiples-card-mock />,
        title: i18nMock.additionalMultiples,
        startsOpen: true,
        collapsable: true,
      },
      {
        card: <cast-bets-card-mock />,
        title: i18nMock.casts,
        startsOpen: true,
        collapsable: true,
      },
    ],
  },
  {
    id: i18nMock.singlesGroup,
    content: [
      {
        card: <singles-card-mock />,
        title: i18nMock.singles,
        startsOpen: true,
        collapsable: true,
      },
    ],
  },
];

const onTabSwitchSpy = jest.fn();

const renderSportsbookPlacePanel = ({
  betslipCards = betslipCardsMock,
  contentLayout,
  isPanelDisabled,
  isSummaryDisabled,
  isPlaceDisabled,
  hasFreeBets,
  isFreeBetsSelected,
  isFreeBetsDisabled,
  totalReturns,
  totalOriginalReturns,
  hasPlaceError,
  notifications = <notifications-mock testId="notification-mock" />,
  placeBtnLabel,
  hasCTALoading = true,
  i18n = i18nMock,
  collapsablesStartsOpen = {
    bbMulti: true,
    betBuilders: true,
    oneLineMultiple: true,
    multiLinesMultiples: true,
    castBets: true,
    singles: true,
  },
  secondaryButton,
  freeBetsAlertMessage,
  onFreeBetsRemovePress,
  onFreeBetsChange,
  onPlaceClick,
  onRemoveAllClick,
  onNotificationClick,
  onCollapseToggle,
  onTabSwitch = onTabSwitchSpy,
  isLoggedIn,
  placeBtnSecondaryLabel,
  placeBtnLoadingLabel,
  reversePlaceBtnLabels,
  balanceAfterBet,
  isOddsBoosted,
  footerPrefix,
  hasMarketBlurbs = true,
} = {}) =>
  render(
    <SportsbookPlacePanel
      betslipCards={betslipCards}
      contentLayout={contentLayout}
      isPanelDisabled={isPanelDisabled}
      isSummaryDisabled={isSummaryDisabled}
      isPlaceDisabled={isPlaceDisabled}
      hasFreeBets={hasFreeBets}
      isFreeBetsSelected={isFreeBetsSelected}
      isFreeBetsDisabled={isFreeBetsDisabled}
      totalReturns={totalReturns}
      totalOriginalReturns={totalOriginalReturns}
      hasPlaceError={hasPlaceError}
      notifications={notifications}
      footerPrefix={footerPrefix}
      placeBtnLabel={placeBtnLabel}
      hasCTALoading={hasCTALoading}
      i18n={i18n}
      collapsablesStartsOpen={collapsablesStartsOpen}
      freeBetsAlertMessage={freeBetsAlertMessage}
      onFreeBetsRemovePress={onFreeBetsRemovePress}
      onFreeBetsChange={onFreeBetsChange}
      secondaryButton={secondaryButton}
      onPlaceClick={onPlaceClick}
      onRemoveAllClick={onRemoveAllClick}
      onNotificationClick={onNotificationClick}
      onCollapseToggle={onCollapseToggle}
      onTabSwitch={onTabSwitch}
      isLoggedIn={isLoggedIn}
      placeBtnSecondaryLabel={placeBtnSecondaryLabel}
      placeBtnLoadingLabel={placeBtnLoadingLabel}
      reversePlaceBtnLabels={reversePlaceBtnLabels}
      balanceAfterBet={balanceAfterBet}
      isOddsBoosted={isOddsBoosted}
      hasMarketBlurbs={hasMarketBlurbs}
    />,
  );

describe("SportsbookPlacePanel", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render the component", () => {
    const selectors = renderSportsbookPlacePanel({});
    const component = selectors.queryByTestId(SBK_PLACE_PANEL);

    expect(component).not.toBeNull();
  });

  describe("contentLayout", () => {
    describe("when contentLayout is ACCORDION", () => {
      it("should not render tabs", () => {
        renderSportsbookPlacePanel({ contentLayout: SportsbookPlacePanelContentLayout.ACCORDION });

        expect(TabsGroup).not.toHaveBeenCalled();
      });
    });
  });

  describe("collapsable betting cards", () => {
    describe.each`
      key                      | title
      ${"bbMulti"}             | ${"mbb title"}
      ${"betBuilders"}         | ${"bb title"}
      ${"oneLineMultiple"}     | ${"multiples title"}
      ${"multiLinesMultiples"} | ${"additional multiples title"}
      ${"castBets"}            | ${"cast title"}
      ${"singles"}             | ${"singles title"}
    `("when there's a $key card", ({ key, title }) => {
      const betslipCardsResolver = {
        [BetslipSection.bbMulti]: {
          id: i18nMock.multiplesGroup,
          content: [
            {
              card: <Text>Multi bet builder card goes here</Text>,
              title: i18nMock.multiBetBuilder,
              startsOpen: true,
              collapsable: true,
            },
          ],
        },
        [BetslipSection.betBuilders]: {
          id: i18nMock.multiplesGroup,
          content: [
            {
              card: <Text>Bet builders card goes here</Text>,
              title: i18nMock.betBuilder,
              startsOpen: true,
              collapsable: true,
            },
          ],
        },
        [BetslipSection.oneLineMultiple]: {
          id: i18nMock.multiplesGroup,
          content: [
            {
              card: <Text>One line multiple card goes here</Text>,
              title: i18nMock.multiples,
              startsOpen: true,
              collapsable: true,
            },
          ],
        },
        [BetslipSection.multiLinesMultiples]: {
          id: i18nMock.systemGroup,
          content: [
            {
              card: <Text>Multi lines multiples goes here</Text>,
              title: i18nMock.additionalMultiples,
              startsOpen: true,
              collapsable: true,
            },
          ],
        },
        [BetslipSection.castBets]: {
          id: i18nMock.systemGroup,
          content: [
            {
              card: <Text>Cast bets card goes here</Text>,
              title: i18nMock.casts,
              startsOpen: true,
              collapsable: true,
            },
          ],
        },
        [BetslipSection.singles]: {
          id: i18nMock.singlesGroup,
          content: [
            {
              card: <Text>Singles card goes here</Text>,
              title: i18nMock.singles,
              startsOpen: true,
              collapsable: true,
            },
          ],
        },
      };

      beforeEach(() => {
        renderSportsbookPlacePanel({
          betslipCards: [betslipCardsResolver[key]],
          onCollapseToggle: () => {},
        });
      });

      it("should call Card", () => {
        expect(Card).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            title,
            startOpen: true,
            onTitleClick: expect.any(Function),
            theme: CardTheme.PRIMARY,
            size: CardHeaderSize.SMALL,
            isCollapsible: true,
            fullWidthContent: true,
          }),
          undefined,
        );
        expect(Card).toHaveBeenCalledTimes(1);
      });

      it("should render card", () => {
        const { children: cardContent } = Card.mock.calls[0][0];
        const betslipCard = cardContent.props.children;

        expect(betslipCard).toEqual(betslipCardsResolver[key].content[0].card);
      });
    });

    describe("when a card is tagged as not collapsable", () => {
      const singlesCard = {
        id: i18nMock.singlesGroup,
        content: [
          {
            card: <Text>Singles card goes here</Text>,
            title: i18nMock.singles,
            startsOpen: true,
            collapsable: false,
          },
        ],
      };

      it("should not call Card", () => {
        renderSportsbookPlacePanel({
          betslipCards: [singlesCard],
          onCollapseToggle: () => {},
        });

        expect(Card).not.toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("PlaceFooter", () => {
    it("should render footer with the correct props", () => {
      const sbkFooterProps = {
        balanceAfterBet: "balanceAfterBet",
        hasCTALoading: "hasCTALoading",
        hasFreeBets: "hasFreeBets",
        hasPlaceError: "hasPlaceError",
        i18n: i18nMock,
        isFreeBetsSelected: "isFreeBetsSelected",
        isFreeBetsDisabled: "isFreeBetsDisabled",
        isOddsBoosted: "isOddsBoosted",
        isPanelDisabled: "isPanelDisabled",
        isPlaceDisabled: "isPlaceDisabled",
        isSummaryDisabled: "isSummaryDisabled",
        notifications: "notifications",
        placeBtnLabel: "placeBtnLabel",
        placeBtnSecondaryLabel: "placeBtnSecondaryLabel",
        placeBtnLoadingLabel: "placeBtnLoadingLabel",
        reversePlaceBtnLabels: "reversePlaceBtnLabels",
        secondaryButton: "secondaryButton",
        totalOriginalReturns: "totalOriginalReturns",
        totalReturns: "totalReturns",
        freeBetsAlertMessage: "freeBetsAlertMessage",
        onFreeBetsRemovePress: "onFreeBetsRemovePress",
        onFreeBetsChange: "onFreeBetsChange",
        onPlaceClick: "onPlaceClick",
        onRemoveAllClick: "onRemoveAllClick",
        isLoggedIn: "isLoggedIn",
        footerPrefix: "footerPrefix",
      };
      renderSportsbookPlacePanel(sbkFooterProps);

      expect(PlaceFooter).toHaveBeenCalledTimes(1);
      expect(PlaceFooter).toHaveBeenCalledWith(
        {
          balanceAfterBet: "balanceAfterBet",
          hasCTALoading: "hasCTALoading",
          hasFreeBets: "hasFreeBets",
          hasPlaceError: "hasPlaceError",
          i18n: i18nMock,
          isFreeBetsSelected: "isFreeBetsSelected",
          isFreeBetsDisabled: "isFreeBetsDisabled",
          isOddsBoosted: "isOddsBoosted",
          isPanelDisabled: "isPanelDisabled",
          isPlaceDisabled: "isPlaceDisabled",
          isSummaryDisabled: "isSummaryDisabled",
          notifications: "notifications",
          placeBtnLabel: "placeBtnLabel",
          placeBtnSecondaryLabel: "placeBtnSecondaryLabel",
          placeBtnLoadingLabel: "placeBtnLoadingLabel",
          reversePlaceBtnLabels: "reversePlaceBtnLabels",
          secondaryButton: "secondaryButton",
          totalOriginalReturns: "totalOriginalReturns",
          totalReturns: "totalReturns",
          freeBetsAlertMessage: "freeBetsAlertMessage",
          onFreeBetsRemovePress: "onFreeBetsRemovePress",
          onFreeBetsChange: "onFreeBetsChange",
          onPlacePress: "onPlaceClick",
          onRemoveAllPress: "onRemoveAllClick",
          isLoggedIn: "isLoggedIn",
          footerPrefix: "footerPrefix",
        },
        undefined,
      );
    });
  });
});
