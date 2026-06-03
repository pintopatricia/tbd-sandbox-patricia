import "jest-dom/extend-expect";
import { render, act } from "@testing-library/react";

import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Card, SecondaryButton } from "@ppb/the-wall-web";

import ConnectedSportsbookMarket from "../SportsbookMarket";
import ConnectedExchangeMarket from "../ExchangeMarket";
import ConnectedMarketBlurb from "../MarketBlurb";
import ShowMore from "../ShowMore/ShowMore.web";
import useShowMore from "../../hooks/useShowMore";

import { Market } from "./Market.web";

const dispatchToggleShowMoreRunnersMock = jest.fn();
const dispatchTogglePromoDescriptionMock = jest.fn();
const dispatchPushExternalBlankActionMock = jest.fn();
const dispatchMarketBlurbLinkClickMock = jest.fn();
const dispatchClickCardActionMock = jest.fn();

jest.mock("@ppb/the-wall-web", () => ({
  Link: jest.fn(({ props, children }) => <div {...props}>{children}</div>),
  Container: jest.fn(({ props, children }) => <div {...props}>{children}</div>),
  Card: jest.fn(({ props, children }) => <card-mock {...props}>{children}</card-mock>),
  SecondaryButton: jest.fn(() => <secondary-button-mock />),
}));

jest.mock("@ppb/the-wall-icons/icons", () => ({
  iconsMap: { Navigation: { "arrow-right": "Navigation--arrow-right" } },
}));

jest.mock("../ExchangeMarket", () => jest.fn(() => <exchange-market />));
jest.mock("../ExchangeMarket/ExchangeMarket.web", () => jest.fn(() => <exchange-market />));
jest.mock("../SportsbookMarket", () => jest.fn(() => <connected-sportsbook-market />));
jest.mock("../SportsbookMarket/SportsbookMarket.web", () => jest.fn(() => <sportsbook-market />));
jest.mock("../MarketBlurb", () => jest.fn(() => <connected-market-blurb-mock />));
jest.mock("../MarketBlurb/MarketBlurb.web", () => jest.fn(() => <market-blurb-mock />));
jest.mock("../ShowMore/ShowMore.web", () => jest.fn(() => <show-more-mock />));

jest.mock("../../hooks/useShowMore", () =>
  jest.fn(() => ({
    itemsToDisplay: [],
    isShowMoreAvailable: false,
    isItemsListCollapsed: false,
    onShowMoreChange: jest.fn(),
  })),
);

function setup({
  title,
  navigateToMarketView = jest.fn(),
  pushAction = jest.fn(),
  eventViewLink,
  marketViewLinks = [{ viewUrl: "url" }],
  cardUrn = "cardUrn",
  getCardType = jest.fn(),
  isCashoutQuoteAvailable = false,
  dispatchFetchRunnersOrderUpdates = jest.fn(),
  inline,
  numberOfItemsToDisplay = 4,
  dispatchToggleShowMoreRunners = dispatchToggleShowMoreRunnersMock,
  dispatchTogglePromoDescription = dispatchTogglePromoDescriptionMock,
  dispatchPushExternalBlankAction = dispatchPushExternalBlankActionMock,
  dispatchMarketBlurbLinkClick = dispatchMarketBlurbLinkClickMock,
  dispatchClickCardAction = dispatchClickCardActionMock,
  marketPromo,
  sporteventURN= "sportEventURN",
  marketBlurb,
  infoBlurbs,
  runnersAmount,
  runnerUrns = [],
  marketUrn,
  tabLink,
  dispatchNavigateToView = jest.fn(),
}) {
  return render(
    <Market
      cardUrn={cardUrn}
      runnersAmount={runnersAmount}
      runnerUrns={runnerUrns}
      marketUrn={marketUrn}
      title={title}
      navigateToMarketView={navigateToMarketView}
      eventViewLink={eventViewLink}
      marketViewLinks={marketViewLinks}
      pushAction={pushAction}
      getCardType={getCardType}
      isCashoutQuoteAvailable={isCashoutQuoteAvailable}
      dispatchFetchRunnersOrderUpdates={dispatchFetchRunnersOrderUpdates}
      inline={inline}
      numberOfItemsToDisplay={numberOfItemsToDisplay}
      dispatchToggleShowMoreRunners={dispatchToggleShowMoreRunners}
      dispatchClickCardAction={dispatchClickCardAction}
      marketPromo={marketPromo}
      marketBlurb={marketBlurb}
      infoBlurbs={infoBlurbs}
      sporteventURN={sporteventURN}
      dispatchTogglePromoDescription={dispatchTogglePromoDescription}
      dispatchNavigateToView={dispatchNavigateToView}
      dispatchPushExternalBlankAction={dispatchPushExternalBlankAction}
      dispatchMarketBlurbLinkClick={dispatchMarketBlurbLinkClick}
      tabLink={tabLink}
    />,
  );
}

describe("Market", () => {
  beforeEach(jest.clearAllMocks);

  describe("initialization", () => {
    it("should render nothing when no marketUrn is present", () => {
      const empty = setup({
        title: "Match Odds",
        runnerUrns: [],
      });
      expect(empty.container.firstChild).toBeNull();
    });

    describe("when market is Sportsbook", () => {
      beforeEach(() => {
        useShowMore.mockReturnValue({
          itemsToDisplay: ["runner1Urn"],
          isShowMoreAvailable: true,
          isItemsListCollapsed: false,
          onShowMoreChange: expect.any(Function),
        });
      });

      it("should render ConnectedSportsbookMarket with correct props", async () => {
        await act(() =>
          setup({
            title: "Match Odds",
            marketUrn: "ppb:sbkMarket:924.201495349",
            numberOfItemsToDisplay: 1,
            runnerUrns: ["runner1Urn", "runner2Urn"],
            runnersAmount: 2,
            marketPromo: { title: "promo" },
            infoBlurbs: [{ title: "blurb" }],
          }),
        );

        expect(ConnectedSportsbookMarket).toHaveBeenCalledWith(
          expect.objectContaining({
            cardUrn: "cardUrn",
            urn: "ppb:sbkMarket:924.201495349",
            component: expect.any(Object),
            displayRunnersUrns: ["runner1Urn"],
            numberOfItemsToDisplay: 1,
            isItemsListCollapsed: false,
            isShowMoreAvailable: true,
            marketPromo: { title: "promo" },
            infoBlurbs: [{ title: "blurb" }],
            onMarketPromoClick: expect.any(Function),
            onLinkClick: expect.any(Function),
          }),
          undefined,
        );
      });

      it("should render ShowMore when numberOfItemsToDisplay is less than runners amount", () => {
        setup({
          title: "Match Odds",
          marketUrn: "ppb:sbkMarket:924.201495349",
          runnerUrns: ["runner1Urn", "runner2Urn"],
          runnersAmount: 20,
          numberOfItemsToDisplay: 4,
        });

        expect(ShowMore).toHaveBeenCalledWith(
          {
            numberOfItemsToDisplay: 4,
            numberOfLines: 20,
            setShowMore: expect.any(Function),
            onToggleShowMoreRunners: expect.any(Function),
            showMore: false,
            cardRef: null,
          },
          undefined,
        );
      });

      it("should not render ShowMore when numberOfItemsToDisplay equals runners amount", () => {
        setup({
          title: "Match Odds",
          marketUrn: "ppb:sbkMarket:924.201495349",
          runnerUrns: ["runner1Urn", "runner2Urn"],
          runnersAmount: 4,
          numberOfItemsToDisplay: 4,
        });

        expect(ShowMore).not.toHaveBeenCalled();
      });
    });

    describe("when marketBlurb is defined", () => {
      it("should render MarketBlurb", async () => {
        await act(() =>
          setup({
            cardUrn: "cardUrn",
            marketUrn: "ppb:sbkMarket:924.201495349",
            marketBlurb: {
              titleKey: "TITLE_KEY",
              descriptionKey: "DESCRIPTION_KEY",
              signposting: IconsList.NINETY_MINUTE_PAYOUT,
              externalLinkType: "NINETY_MINUTE_RULE",
            },
          }),
        );

        expect(ConnectedMarketBlurb).toHaveBeenCalledTimes(2);
        expect(ConnectedMarketBlurb).toHaveBeenCalledWith(
          {
            component: expect.any(Object),
            titleKey: "TITLE_KEY",
            descriptionKey: "DESCRIPTION_KEY",
            signposting: IconsList.NINETY_MINUTE_PAYOUT,
            externalLinkType: "NINETY_MINUTE_RULE",
            variant: "super sub",
          },
          undefined,
        );
      });
    });

    describe("when the market urn is Exchange", () => {
      beforeEach(() => {
        useShowMore.mockReturnValue({
          itemsToDisplay: ["runner1Urn"],
          isShowMoreAvailable: true,
          isItemsListCollapsed: false,
          onShowMoreChange: expect.any(Function),
        });
      });

      it("should render a ConnectedExchangeMarket", async () => {
        await act(() =>
          setup({
            title: "Match Odds",
            marketUrn: "ppb:exc:924.201495349",
            runnerUrns: ["runner1Urn", "runner2Urn"],
            runnersAmount: 2,
          }),
        );

        expect(ConnectedExchangeMarket).toHaveBeenCalledWith(
          expect.objectContaining({
            cardUrn: "cardUrn",
            urn: "ppb:exc:924.201495349",
            displayRunnersUrns: ["runner1Urn"],
            isCashoutQuoteAvailable: false,
            onMarketPromoClick: expect.any(Function),
            onLinkClick: expect.any(Function),
          }),
          undefined,
        );

        const call = ConnectedExchangeMarket.mock.calls[0][0];
        expect(call.component).toBeDefined();
        expect(call.component.$$typeof).toBe(Symbol.for("react.lazy"));
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
            numberOfItemsToDisplay: 4,
            numberOfLines: 20,
            setShowMore: expect.any(Function),
            onToggleShowMoreRunners: expect.any(Function),
            showMore: false,
            cardRef: null,
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

  describe("interactions", () => {
    describe("market title click", () => {
      describe("and eventViewLink is available", () => {
        const getCardType = jest.fn(() => "MARKET_EXTENDED_CARD");
        const navigateToMarketView = jest.fn();
        const pushAction = jest.fn();
        const navigateToView = jest.fn();

        beforeEach(() => {
          setup({
            eventViewLink: {
              viewUrl: "eventViewUrl",
            },
            title: "title",
            navigateToMarketView,
            pushAction,
            getCardType,
            isCashoutQuoteAvailable: true,
            marketUrn: "ppb:exc:924.201495349",
            runnerUrns: ["runner1Urn", "runner2Urn"],
            runnersAmount: 2,
            dispatchNavigateToView: navigateToView,
          });

          act(() => {
            Card.mock.calls[0][0].onTitleClick();
          });
        });

        it("should dispatch pushAction to eventView", () => {
          expect(pushAction).toHaveBeenCalledWith({ viewUrl: "eventViewUrl" });
        });

        it("should dispatch NavigateToView action", () => {
          expect(navigateToView).toHaveBeenCalledWith("eventViewUrl", "cardUrn", "title");
        });

        it("should not dispatch navigateToMarketView action", () => {
          expect(getCardType).not.toHaveBeenCalledWith(true);
          expect(navigateToMarketView).not.toHaveBeenCalled();
        });
      });

      describe("and eventViewLink is not available", () => {
        const getCardType = jest.fn(() => "MARKET_EXTENDED_CARD");
        const navigateToMarketView = jest.fn();
        const pushAction = jest.fn();

        describe("and selected market is available", () => {
          beforeEach(() => {
            setup({
              title: "title",
              navigateToMarketView,
              pushAction,
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

          it("should dispatch pushAction to market view", () => {
            expect(pushAction).toHaveBeenCalledWith({
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
                pushAction,
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

            it("should not dispatch pushAction", () => {
              expect(pushAction).not.toHaveBeenCalled();
            });

            it("should not dispatch navigateToMarketView action", () => {
              expect(navigateToMarketView).not.toHaveBeenCalled();
            });
          });
        });
      });
    });

    describe("market promo click", () => {
      it("should dispatch toggle promo description when market promo exists", () => {
        setup({
          marketPromo: { title: "extra places" },
          marketUrn: "ppb:sbkMarket:924.201495349",
          runnerUrns: ["runner1Urn"],
          runnersAmount: 1,
        });

        act(() => {
          ConnectedSportsbookMarket.mock.calls[0][0].onMarketPromoClick({
            title: "extra places",
            isOpen: true,
            variant: "promo",
          });
        });

        expect(dispatchTogglePromoDescriptionMock).toHaveBeenCalledWith("extra places", true, "promo");
      });
    });

    describe("tabLink", () => {
      const tabLink = {
        label: "See all markets",
        icon: { category: "Navigation", id: "arrow-right" },
        tabViewLink: { viewUrl: "https://example.com/markets", viewUrn: "ppb:view:markets" },
      };

      it("should render SecondaryButton with correct props when tabLink is provided", () => {
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

      describe("when SecondaryButton is clicked", () => {
        const pushAction = jest.fn();
        const navigateToView = jest.fn();

        beforeEach(() => {
          setup({
            marketUrn: "ppb:sbkMarket:924.201495349",
            runnerUrns: ["runner1Urn"],
            runnersAmount: 1,
            tabLink,
            pushAction,
            dispatchClickCardAction: navigateToView,
          });

          act(() => {
            SecondaryButton.mock.calls[0][0].onTap();
          });
        });

        it("should call dispatchPushAction with tabViewLink", () => {
          expect(pushAction).toHaveBeenCalledWith({
            viewUrl: "https://example.com/markets",
            viewUrn: "ppb:view:markets",
          });
        });

        it("should call dispatchNavigateToView with correct arguments", () => {
          expect(navigateToView).toHaveBeenCalledWith("cardUrn", "sportEventURN", tabLink.tabViewLink.viewUrl, tabLink.label);
        });
      });
    });

    describe("link click", () => {
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

        it("should dispatch push external blank action", () => {
          expect(dispatchPushExternalBlankActionMock).toHaveBeenCalledWith("https://example.com");
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

        it("should not dispatch push external blank action", () => {
          expect(dispatchPushExternalBlankActionMock).not.toHaveBeenCalled();
        });
      });
    });
  });
});
