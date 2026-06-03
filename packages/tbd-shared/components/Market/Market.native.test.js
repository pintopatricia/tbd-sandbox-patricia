import { render, act } from "@testing-library/react-native";

import { Card, SecondaryButton } from "@ppb/the-wall-native";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import useShowMore from "../../hooks/useShowMore";
import ConnectedExchangeMarket from "../ExchangeMarket";
import ExchangeMarket from "../ExchangeMarket/ExchangeMarket.native";
import ConnectedMarketBlurb from "../MarketBlurb";
import MarketBlurb from "../MarketBlurb/MarketBlurb.native";
import ShowMore from "../ShowMore/ShowMore.native";
import ConnectedSportsbookMarket from "../SportsbookMarket";
import SportsbookMarket from "../SportsbookMarket/SportsbookMarket.native";

import { Market } from "./Market.native";

const mockNavigate = jest.fn();
const dispatchToggleShowMoreRunnersMock = jest.fn();
const dispatchTogglePromoDescriptionMock = jest.fn();
const dispatchNavigateToViewMock = jest.fn();
const dispatchMarketBlurbLinkClickMock = jest.fn();
const dispatchClickCardActionMock = jest.fn();

jest.mock("@ppb/tbd-router/native", () => ({ navigate: (viewLink) => mockNavigate(viewLink) }));
jest.mock("@ppb/the-wall-native", () => ({
  Card: jest.fn(({ props, children }) => <card-mock {...props}>{children}</card-mock>),
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
}));

jest.mock("@ppb/the-wall-icons/icons", () => ({
  iconsMap: { Navigation: { "arrow-right": "Navigation--arrow-right" } },
}));
jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("../../hooks/useShowMore", () =>
  jest.fn(() => ({
    itemsToDisplay: [],
    isShowMoreAvailable: false,
    isItemsListCollapsed: false,
    onShowMoreChange: jest.fn(),
  })),
);
jest.mock("../ExchangeMarket", () => jest.fn(() => <exchange-market-mock />));
jest.mock("../ExchangeMarket/ExchangeMarket.native", () => jest.fn(() => <exchange-market-mock />));
jest.mock("../MarketBlurb", () => jest.fn(() => <connected-market-blurb-mock />));
jest.mock("../MarketBlurb/MarketBlurb.native", () => jest.fn(() => <market-blurb-mock />));
jest.mock("../ShowMore/ShowMore.native", () => jest.fn(() => <show-more-mock />));
jest.mock("../SportsbookMarket", () => jest.fn(() => <sportsbook-market-mock />));
jest.mock("../SportsbookMarket/SportsbookMarket.native", () => jest.fn(() => <sportsbook-market-mock />));
jest.mock("@ppb/tbd-router/native/router", () => ({
  navigate: jest.fn(),
}));

jest.mock("../../config/endpoints", () => ({
  getEndpoint: jest.fn(() => "betfairexchange.site"),
}));

const DEFAULT_PROPS = {
  cardUrn: "cardUrn",
  runnerUrns: [],
  marketViewLinks: [{ viewUrl: "url" }],
  isCashoutQuoteAvailable: false,
  getCardType: jest.fn(),
  navigateToMarketView: jest.fn(),
  numberOfItemsToDisplay: 4,
  dispatchToggleShowMoreRunners: dispatchToggleShowMoreRunnersMock,
  dispatchTogglePromoDescription: dispatchTogglePromoDescriptionMock,
  dispatchNavigateToView: dispatchNavigateToViewMock,
  dispatchMarketBlurbLinkClick: dispatchMarketBlurbLinkClickMock,
  dispatchClickCardAction: dispatchClickCardActionMock,
  visible: true,
  sporteventURN: "sportEventURN",
};

const setup = (props) => render(<Market {...DEFAULT_PROPS} {...props} />);

describe("Market card", () => {
  afterEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    describe("when no marketUrn is present", () => {
      it("should render an empty card if URN list is empty", () => {
        const empty = setup({
          title: "Match Odds",
          runnerUrns: [],
        });
        expect(empty.firstChild).toEqual();
      });
    });

    it("should render MarketBlurb when defined", () => {
      setup({
        urn: "cardUrn",
        marketUrn: "ppb:sbkMarket:924.201495349",
        marketBlurb: {
          titleKey: "TITLE",
          descriptionKey: "DESCRIPTION",
          signposting: IconsList.NINETY_MINUTE_PAYOUT,
          externalLinkType: "SOME_URL",
        },
      });

      expect(ConnectedMarketBlurb).toHaveBeenCalledTimes(1);
      expect(ConnectedMarketBlurb).toHaveBeenCalledWith(
        {
          component: MarketBlurb,
          titleKey: "TITLE",
          descriptionKey: "DESCRIPTION",
          signposting: IconsList.NINETY_MINUTE_PAYOUT,
          externalLinkType: "SOME_URL",
          variant: "super sub",
        },
        undefined,
      );
    });

    describe("when the market urn is Sportsbook", () => {
      it("should render a ConnectedSportsbookMarket with all required props", () => {
        useShowMore.mockReturnValue({
          itemsToDisplay: ["runner1Urn"],
          isShowMoreAvailable: true,
          isItemsListCollapsed: false,
          onShowMoreChange: expect.any(Function),
        });

        setup({
          title: "Match Odds",
          marketUrn: "ppb:sbkMarket:924.201495349",
          numberOfItemsToDisplay: 1,
          runnerUrns: ["runner1Urn", "runner2Urn"],
          runnersAmount: 2,
          show90MinBlurb: true,
          visible: true,
        });

        expect(ConnectedSportsbookMarket).toHaveBeenCalledWith(
          {
            cardUrn: "cardUrn",
            urn: "ppb:sbkMarket:924.201495349",
            component: SportsbookMarket,
            displayRunnersUrns: ["runner1Urn"],
            numberOfItemsToDisplay: 1,
            isItemsListCollapsed: false,
            isShowMoreAvailable: true,
            onMarketPromoClick: expect.any(Function),
            onLinkClick: expect.any(Function),
            show90MinBlurb: true,
            visible: true,
          },
          undefined,
        );
      });

      it("should render a ShowMore", () => {
        setup({
          title: "Match Odds",
          marketUrn: "ppb:sbkMarket:924.201495349",
          runnerUrns: ["runner1Urn", "runner2Urn"],
          runnersAmount: 20,
        });

        expect(ShowMore).toHaveBeenCalledWith(
          {
            cardRef: expect.anything(),
            numberOfItemsToDisplay: 4,
            numberOfLines: 20,
            setShowMore: expect.any(Function),
            onToggleShowMoreRunners: expect.any(Function),
            showMore: false,
          },
          undefined,
        );
      });

      describe("when ShowMore is toggled", () => {
        it("should call dispatchToggleShowMoreRunners", () => {
          setup({
            title: "Match Odds",
            marketUrn: "ppb:sbkMarket:924.201495349",
            runnerUrns: ["runner1Urn", "runner2Urn"],
            runnersAmount: 20,
          });

          ShowMore.mock.calls[0][0].onToggleShowMoreRunners(false);

          expect(dispatchToggleShowMoreRunnersMock).toHaveBeenCalledTimes(1);
          expect(dispatchToggleShowMoreRunnersMock).toHaveBeenCalledWith("cardUrn", false, undefined);
        });
      });

      describe("when marketBlurb is defined", () => {
        it("should render MarketBlurb", () => {
          setup({
            cardUrn: "cardUrn",
            marketUrn: "ppb:sbkMarket:924.201495349",
            marketBlurb: {
              titleKey: "TITLE",
              descriptionKey: "DESCRIPTION",
              signposting: IconsList.NINETY_MINUTE_PAYOUT,
              externalLinkType: "SOME_URL",
            },
          });

          expect(ConnectedMarketBlurb).toHaveBeenCalledTimes(1);
          expect(ConnectedMarketBlurb).toHaveBeenCalledWith(
            {
              component: MarketBlurb,
              titleKey: "TITLE",
              descriptionKey: "DESCRIPTION",
              signposting: IconsList.NINETY_MINUTE_PAYOUT,
              externalLinkType: "SOME_URL",
              variant: "super sub",
            },
            undefined,
          );
        });

        describe("and ShowMore is toggled", () => {
          it("should call dispatchToggleShowMoreRunners", () => {
            setup({
              cardUrn: "cardUrn",
              title: "Match Odds",
              marketUrn: "ppb:sbkMarket:924.201495349",
              runnerUrns: ["runner1Urn", "runner2Urn"],
              runnersAmount: 20,
              marketBlurb: {
                titleKey: "TITLE",
                descriptionKey: "DESCRIPTION",
                signposting: IconsList.NINETY_MINUTE_PAYOUT,
                externalLinkType: "SOME_URL",
                gaModuleSuffix: "SUFFIX MOCK",
              },
            });

            ShowMore.mock.calls[0][0].onToggleShowMoreRunners(false);

            expect(dispatchToggleShowMoreRunnersMock).toHaveBeenCalledTimes(1);
            expect(dispatchToggleShowMoreRunnersMock).toHaveBeenCalledWith("cardUrn", false, "SUFFIX MOCK");
          });
        });
      });
    });

    describe("when the market urn is Exchange", () => {
      it("should render a ConnectedExchangeMarket with all required props", () => {
        useShowMore.mockReturnValue({
          itemsToDisplay: ["runner1Urn"],
          isShowMoreAvailable: true,
          isItemsListCollapsed: false,
          onShowMoreChange: expect.any(Function),
        });

        setup({
          title: "Match Odds",
          marketUrn: "ppb:exc:924.201495349",
          numberOfItemsToDisplay: 1,
          runnerUrns: ["runner1Urn", "runner2Urn"],
          runnersAmount: 2,
          visible: true,
        });

        expect(ConnectedExchangeMarket).toHaveBeenCalledWith(
          {
            cardUrn: "cardUrn",
            urn: "ppb:exc:924.201495349",
            component: ExchangeMarket,
            displayRunnersUrns: ["runner1Urn"],
            isCashoutQuoteAvailable: false,
            onMarketPromoClick: expect.any(Function),
            onLinkClick: expect.any(Function),
            visible: true,
          },
          undefined,
        );
      });

      it("should render a ShowMore", () => {
        setup({
          title: "Match Odds",
          marketUrn: "ppb:exc:924.201495349",
          runnerUrns: ["runner1Urn", "runner2Urn"],
          runnersAmount: 20,
        });

        expect(ShowMore).toHaveBeenCalledWith(
          {
            cardRef: expect.anything(),
            numberOfItemsToDisplay: 4,
            numberOfLines: 20,
            setShowMore: expect.any(Function),
            onToggleShowMoreRunners: expect.any(Function),
            showMore: false,
          },
          undefined,
        );
      });

      describe("when ShowMore is toggled", () => {
        it("should call dispatchToggleShowMoreRunners", () => {
          setup({
            title: "Match Odds",
            marketUrn: "ppb:exc:924.201495349",
            runnerUrns: ["runner1Urn", "runner2Urn"],
            runnersAmount: 20,
          });

          ShowMore.mock.calls[0][0].onToggleShowMoreRunners(false);

          expect(dispatchToggleShowMoreRunnersMock).toHaveBeenCalledTimes(1);
          expect(dispatchToggleShowMoreRunnersMock).toHaveBeenCalledWith("cardUrn", false, undefined);
        });
      });
    });
  });

  describe("when clicking on market title", () => {
    describe("and eventViewLink is available", () => {
      const getCardType = jest.fn(() => "MARKET_EXTENDED_CARD");
      const navigateToMarketView = jest.fn();

      beforeEach(() => {
        setup({
          eventViewLink: {
            viewUrl: "eventViewUrl",
          },
          title: "title",
          navigateToMarketView,
          getCardType,
          isCashoutQuoteAvailable: true,
          marketUrn: "ppb:exc:924.201495349",
          runnerUrns: ["runner1Urn", "runner2Urn"],
          runnersAmount: 2,
        });

        act(() => {
          Card.mock.calls[0][0].onTitleClick();
        });
      });

      it("should dispatch navigate to eventView", () => {
        expect(mockNavigate).toHaveBeenCalledWith({ viewUrl: "eventViewUrl" });
      });

      it("should not dispatch navigateToMarketView action", () => {
        expect(getCardType).not.toHaveBeenCalledWith(true);
        expect(navigateToMarketView).not.toHaveBeenCalled();
      });

      it("should dispatch NavigateToView action", () => {
        expect(dispatchNavigateToViewMock).toHaveBeenCalledWith("eventViewUrl", "cardUrn", "title");
      });
    });

    describe("and eventViewLink is not available", () => {
      const getCardType = jest.fn(() => "MARKET_EXTENDED_CARD");
      const navigateToMarketView = jest.fn();

      describe("and selected market is available", () => {
        beforeEach(() => {
          setup({
            title: "title",
            navigateToMarketView,
            getCardType,
            marketViewLinks: [{ viewUrl: "sbkViewMarketUrl", viewUrn: "ppb:sbkMarket:924.204112221" }],
            isCashoutQuoteAvailable: true,
            marketUrn: "ppb:sbkMarket:924.204112221",
            runnerUrns: ["runner1Urn", "runner2Urn"],
            runnersAmount: 2,
          });

          act(() => {
            Card.mock.calls[0][0].onTitleClick();
          });
        });

        it("should dispatch mockNavigate to market view", () => {
          expect(mockNavigate).toHaveBeenCalledWith({
            viewUrl: "sbkViewMarketUrl",
            viewUrn: "ppb:sbkMarket:924.204112221",
          });
        });

        it("should dispatch navigateToMarketView action", () => {
          expect(getCardType).toHaveBeenCalledWith(true);
          expect(navigateToMarketView).toHaveBeenCalledWith(
            "MARKET_EXTENDED_CARD",
            "sbkViewMarketUrl",
            "cardUrn",
            "title",
          );
        });
      });

      describe("and marketViewLinks is empty", () => {
        describe("and selected market is available", () => {
          beforeEach(() => {
            setup({
              title: "title",
              navigateToMarketView,
              getCardType,
              isCashoutQuoteAvailable: true,
              marketUrn: "ppb:exc:924.201495349",
              runnerUrns: ["runner1Urn", "runner2Urn"],
              runnersAmount: 2,
              marketViewLinks: [],
            });

            act(() => {
              Card.mock.calls[0][0].onTitleClick();
            });
          });

          it("should not call getCardType", () => {
            expect(getCardType).not.toHaveBeenCalled();
          });

          it("should not dispatch navigate", () => {
            expect(mockNavigate).not.toHaveBeenCalled();
          });

          it("should not dispatch navigateToMarketView action", () => {
            expect(navigateToMarketView).not.toHaveBeenCalled();
          });
        });
      });
    });
  });

  describe("when clicking on market promo", () => {
    beforeEach(() => {
      setup({
        marketPromo: {
          title: "extra places",
        },
        title: "Match Odds",
        marketUrn: "ppb:sbkMarket:924.201495349",
        numberOfItemsToDisplay: 1,
        runnerUrns: ["runner1Urn", "runner2Urn"],
        runnersAmount: 2,
      });

      act(() => {
        ConnectedSportsbookMarket.mock.calls[0][0].onMarketPromoClick({
          title: "extra places",
          isOpen: true,
          variant: "promo",
        });
      });
    });

    it("should dispatch toggle promo description action", () => {
      expect(dispatchTogglePromoDescriptionMock).toHaveBeenCalledWith("extra places", true, "promo");
    });
  });

  describe("when tabLink is provided", () => {
    const tabLink = {
      label: "See all markets",
      icon: { category: "Navigation", id: "arrow-right" },
      tabViewLink: { viewUrl: "https://example.com/markets", viewUrn: "ppb:view:markets" },
    };

    it("should render SecondaryButton with correct props", () => {
      setup({
        marketUrn: "ppb:sbkMarket:924.201495349",
        runnerUrns: ["runner1Urn"],
        runnersAmount: 1,
        tabLink,
      });

      expect(SecondaryButton).toHaveBeenCalledWith(
        expect.objectContaining({
          label: "See all markets",
          icon: "Navigation--arrow-right",
        }),
        undefined,
      );
    });

    it("should not render SecondaryButton when tabLink is not provided", () => {
      setup({
        marketUrn: "ppb:sbkMarket:924.201495349",
        runnerUrns: ["runner1Urn"],
        runnersAmount: 1,
      });

      expect(SecondaryButton).not.toHaveBeenCalled();
    });

    describe("when SecondaryButton is tapped", () => {
      beforeEach(() => {
        setup({
          marketUrn: "ppb:sbkMarket:924.201495349",
          runnerUrns: ["runner1Urn"],
          runnersAmount: 1,
          tabLink,
        });

        act(() => {
          SecondaryButton.mock.calls[0][0].onTap();
        });
      });

      it("should call navigate with tabViewLink", () => {
        expect(mockNavigate).toHaveBeenCalledWith({
          viewUrl: "https://example.com/markets",
          viewUrn: "ppb:view:markets",
        });
      });

      it("should call dispatchClickCardAction with correct arguments", () => {
        expect(dispatchClickCardActionMock).toHaveBeenCalledWith(
          "cardUrn",
          "sportEventURN",
          tabLink.tabViewLink.viewUrl,
          tabLink.label,
        );
      });
    });
  });

  describe("when clicking on market blurb link", () => {
    beforeEach(() => {
      setup({
        marketUrn: "ppb:sbkMarket:924.201495349",
        runnerUrns: ["runner1Urn"],
        runnersAmount: 1,
      });
    });

    describe("when link is defined", () => {
      beforeEach(() => {
        act(() => {
          ConnectedSportsbookMarket.mock.calls[0][0].onLinkClick({ text: "text", url: "https://example.com" });
        });
      });

      it("should dispatch market blurb link click", () => {
        expect(dispatchMarketBlurbLinkClickMock).toHaveBeenCalledWith({ text: "text", url: "https://example.com" });
      });

      it("should dispatch navigate to external view", () => {
        expect(mockNavigate).toHaveBeenCalledWith({
          fallbackViewUrl: "betfairexchange.site",
          viewUrl: "https://example.com",
          viewUrn: "ppb:tbd:view:external",
        });
      });
    });

    describe("when link is not defined", () => {
      beforeEach(() => {
        act(() => {
          ConnectedSportsbookMarket.mock.calls[0][0].onLinkClick();
        });
      });

      it("should not dispatch market blurb link click", () => {
        expect(dispatchMarketBlurbLinkClickMock).not.toHaveBeenCalled();
      });

      it("should not dispatch navigate to external view", () => {
        expect(mockNavigate).not.toHaveBeenCalled();
      });
    });
  });
});
