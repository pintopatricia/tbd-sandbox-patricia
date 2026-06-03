import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";

import { Card, TabsGroup, MarketBlurbs } from "@ppb/the-wall-web";
import { PlaceFooter } from "../PlaceFooter/PlaceFooter.web";
import { BetslipSection, SportsbookPlacePanelContentLayout } from "./SportsbookPlacePanel.types";

import styles from "./SportsbookPlacePanel.web.css";
import { SportsbookPlacePanel } from "./SportsbookPlacePanel.web";

jest.mock("@ppb/the-wall-web/components/bricks/SubHeader/SubHeader", () => ({
  SubHeader: jest.fn(() => <subheader-mock />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/MarketBlurbs/MarketBlurbs", () => ({
  MarketBlurbs: jest.fn(() => <market-blurbs />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/Card/Card", () => ({
  Card: jest.fn(({ props, children }) => <card-mock {...props}>{children}</card-mock>),
}));

jest.mock("@ppb/the-wall-web/components/walls/TabsGroup/TabsGroup", () => ({
  TabsGroup: jest.fn(({ props }) => <tabsgroup-mock {...props} />),
}));

jest.mock("../PlaceFooter/PlaceFooter.web", () => ({
  PlaceFooter: jest.fn(({ props }) => <sbk-footer {...props} />),
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
  termsLabel: "termsLabel",
  termsLinkLabel: "termsLinkLabel",
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
  footerPrefix = "footerPrefix",
  hasCTALoading,
  hasFreeBets,
  hasPlaceError,
  i18n = i18nMock,
  isDesktop,
  isFreeBetsSelected,
  isFreeBetsDisabled,
  isOddsBoosted,
  isPanelDisabled,
  isPlaceDisabled,
  isSummaryDisabled,
  notifications = "notifications",
  placeBtnLabel,
  totalOriginalReturns,
  totalReturns,
  secondaryButton,
  termsUrl,
  freeBetsAlertMessage,
  onFreeBetsRemovePress,
  onCollapseToggle,
  onFreeBetsChange,
  onPlaceClick,
  onRemoveAllClick,
  onTabSwitch = onTabSwitchSpy,
  setRef,
  isLoggedIn,
  placeBtnSecondaryLabel,
  placeBtnLoadingLabel,
  reversePlaceBtnLabels = false,
  balanceAfterBet,
  hasMarketBlurbs = false,
} = {}) =>
  render(
    <SportsbookPlacePanel
      ref={setRef}
      betslipCards={betslipCards}
      contentLayout={contentLayout}
      footerPrefix={footerPrefix}
      hasCTALoading={hasCTALoading}
      hasFreeBets={hasFreeBets}
      hasPlaceError={hasPlaceError}
      i18n={i18n}
      isDesktop={isDesktop}
      isFreeBetsSelected={isFreeBetsSelected}
      isFreeBetsDisabled={isFreeBetsDisabled}
      isOddsBoosted={isOddsBoosted}
      isPanelDisabled={isPanelDisabled}
      isPlaceDisabled={isPlaceDisabled}
      isSummaryDisabled={isSummaryDisabled}
      notifications={notifications}
      placeBtnLabel={placeBtnLabel}
      totalOriginalReturns={totalOriginalReturns}
      totalReturns={totalReturns}
      termsUrl={termsUrl}
      freeBetsAlertMessage={freeBetsAlertMessage}
      onFreeBetsRemovePress={onFreeBetsRemovePress}
      onCollapseToggle={onCollapseToggle}
      onFreeBetsChange={onFreeBetsChange}
      secondaryButton={secondaryButton}
      onPlaceClick={onPlaceClick}
      onRemoveAllClick={onRemoveAllClick}
      onTabSwitch={onTabSwitch}
      isLoggedIn={isLoggedIn}
      placeBtnSecondaryLabel={placeBtnSecondaryLabel}
      placeBtnLoadingLabel={placeBtnLoadingLabel}
      reversePlaceBtnLabels={reversePlaceBtnLabels}
      balanceAfterBet={balanceAfterBet}
      hasMarketBlurbs={hasMarketBlurbs}
    />,
  );

describe("SportsbookPlacePanel", () => {
  beforeEach(jest.clearAllMocks);

  it("should have sbkPlacePanel class", () => {
    const { container } = renderSportsbookPlacePanel();
    const comp = container.querySelector(`.${styles.sbkPlacePanel}`);

    expect(comp).toBeDefined();
  });

  describe("contentLayout", () => {
    describe("when contentLayout is ACCORDION", () => {
      it("should not render tabs", () => {
        renderSportsbookPlacePanel({ contentLayout: SportsbookPlacePanelContentLayout.ACCORDION });

        expect(TabsGroup).not.toHaveBeenCalled();
      });
    });
  });

  describe("market blurbs", () => {
    describe("when we do not have MarketBlurbs", () => {
      it("should not render", () => {
        renderSportsbookPlacePanel();

        expect(MarketBlurbs).not.toHaveBeenCalled();
      });
    });

    describe("when we have MarketBlurbs", () => {
      it("should render", () => {
        renderSportsbookPlacePanel({ hasMarketBlurbs: true });

        expect(MarketBlurbs).toHaveBeenCalled();
      });
    });
  });
  describe("scrollable element", () => {
    it("should have scrollable class", () => {
      const { container } = renderSportsbookPlacePanel();
      const el = container.querySelector(`.${styles.scrollable}`);

      expect(el).not.toBeNull();
    });

    it("should have ref set", () => {
      const setRef = jest.fn();
      renderSportsbookPlacePanel({ setRef });

      expect(setRef).toHaveBeenCalledTimes(1);
    });
  });

  describe("scrollable desktop", () => {
    describe("when component is not on a desktop layout", () => {
      it("should not have the scrollable desktop class", () => {
        const { container } = renderSportsbookPlacePanel();
        const el = container.querySelector(`.${styles.scrollableDesktop}`);

        expect(el).toBeNull();
      });
    });
    describe("when component is on a desktop layout", () => {
      it("should have the scrollable desktop class", () => {
        const { container } = renderSportsbookPlacePanel({ isDesktop: true });
        const el = container.querySelector(`.${styles.scrollableDesktop}`);

        expect(el).not.toBeNull();
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
              card: <span>Multi bet builder card goes here</span>,
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
              card: <span>Bet builders card goes here</span>,
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
              card: <span>One line multiple card goes here</span>,
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
              card: <span>Multi lines multiples goes here</span>,
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
              card: <span>Cast bets card goes here</span>,
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
              card: <span>Singles card goes here</span>,
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
            card: <span>Singles card goes here</span>,
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
        termsUrl: "termsUrl",
        totalOriginalReturns: "totalOriginalReturns",
        totalReturns: "totalReturns",
        freeBetsAlertMessage: "freeBetsAlertMessage",
        onFreeBetsRemovePress: "onFreeBetsRemovePress",
        onFreeBetsChange: "onFreeBetsChange",
        onPlaceClick: "onPlaceClick",
        onRemoveAllClick: "onRemoveAllClick",
        isLoggedIn: "isLoggedIn",
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
          termsUrl: "termsUrl",
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
