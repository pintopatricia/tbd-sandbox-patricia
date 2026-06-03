import { render, act } from "@testing-library/react-native";

import { navigate } from "@ppb/tbd-router";
import { BetSegments, Divider } from "@ppb/the-wall-native";

import { InlineExchangeMarket } from "./snowflakes/InlineExchangeMarket/InlineExchangeMarket.native";
import ExchangeMarket from "./ExchangeMarket.native";
import ConnectedCashout from "../Cashout";
import Cashout from "../Cashout/Cashout.native";
import ConnectedExchangeMarketRunner from "../ExchangeMarketRunner";
import { ExchangeMarket as ExchangeMarketComponent } from "./snowflakes/ExchangeMarket/ExchangeMarket.native";
import ConnectedMarketGraph from "../MarketGraph";
import MarketGraph from "../MarketGraph/MarketGraph.native";

jest.mock("@ppb/tbd-router", () => ({
  navigate: jest.fn(() => {}),
}));

jest.mock("@ppb/the-wall-native", () => ({
  BetSegments: jest.fn(() => <bet-segments-mock />),
  Divider: jest.fn(() => <divider-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
  gutters: {},
}));

const dispatchMarketUpdatesSubscribe = jest.fn();
const dispatchMarketUpdatesUnsubscribe = jest.fn();
const dispatchSubscribeExchangeCashout = jest.fn();
const dispatchUnsubscribeExchangeCashout = jest.fn();
const dispatchToggleMarketGraph = jest.fn();
const dispatchUpdateMarketDepth = jest.fn();
const dispatchFetchCatalogue = jest.fn();
const dispatchDeleteView = jest.fn();
const dispatchModalToggleAction = jest.fn();
const onMarketPromoClick = jest.fn();

const BOOK_PERCENTAGE = {
  back: 99.9,
  lay: 103.2,
};

const I18N_LABELS = {
  marketDepth: "marketDepth",
  marketRules: "Market Rules",
  liability: "Liability",
};

jest.mock("../GenericView", () => jest.fn(() => <connected-generic-view-mock data-testid="connected-generic-view" />));

jest.mock("../GenericView/GenericView.native", () => ({
  GenericView: jest.fn(() => <generic-view-mock data-testid="generic-view" />),
}));

jest.mock("../MarketGraph", () => jest.fn(() => <connected-market-graph-mock data-testid="connected-market-graph" />));

jest.mock("../MarketGraph/MarketGraph.native", () => ({
  MarketGraph: jest.fn(() => <market-graph-mock data-testid="market-graph" />),
}));

jest.mock("./snowflakes/ExchangeMarket/ExchangeMarket.native", () => ({
  ExchangeMarket: jest.fn(({ children }) => <exchange-market-mock>{children}</exchange-market-mock>),
}));

jest.mock("./snowflakes/InlineExchangeMarket/InlineExchangeMarket.native", () => ({
  InlineExchangeMarket: jest.fn(() => <inline-exchange-market-mock testID="inline-exchange-market" />),
}));

jest.mock("../Cashout", () => jest.fn(() => <connected-cashout-mock data-testid="connected-cashout" />));
jest.mock("../Cashout/Cashout.native", () => jest.fn(() => <cashout-mock />));
jest.mock("../ExchangeBetButtons", () => jest.fn(() => <connected-exchange-bet-btns-mock />));
jest.mock("../ExchangeBetButtons/ExchangeBetButtons.native", () => jest.fn(() => <exchange-bet-btns-mock />));
jest.mock("../ExchangeMarketRunner/ExchangeMarketRunner.native", () =>
  jest.fn(() => <exchange-market-runner-component-mock />),
);
jest.mock("../ExchangeMarketRunner", () => jest.fn(() => <connected-exchange-market-runner />));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

const PARENTS = ["ppb:tab:1", "ppb:cardgroup:1"];
jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => PARENTS),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("../../helpers/dates", () => ({
  dates: jest.fn(),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn().mockImplementation((object) => object.value),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/UserDetailsState", () => ({
  isOnlineUserDetails: jest.fn(),
}));

jest.mock("@ppb/tbd-store/helpers/markets", () => ({}));
jest.mock("@ppb/tbd-store/helpers/selectors", () => ({}));
jest.mock("@ppb/tbd-store/helpers/market-runners", () => ({}));
jest.mock("@ppb/tbd-store/helpers/sportsbook-betting", () => ({}));

jest.mock("@ppb/tbd-store/state/entities/sports/sport-selectors", () => ({
  getSportByURN: jest.fn(),
}));

function setup(marketId, exchangeMarketProps) {
  return render(
    <ExchangeMarket marketId={marketId} turnInPlayEnabled={true} inplay={false} {...exchangeMarketProps} />,
  );
}

const inlineRunners = [
  {
    urn: "ppb:excRunner:1.175327106/15285/0",
    name: "Albania",
    isRaceRunner: false,
  },
  {
    urn: "ppb:excRunner:1.175327106/8541909/0",
    name: "Kosovo",
    isRaceRunner: false,
  },
  {
    urn: "ppb:excRunner:1.175327106/58805/0",
    name: "The Draw",
    isRaceRunner: false,
  },
];

describe("Connected exchange market", () => {
  describe("exchange market", () => {
    beforeEach(() => {
      const dateSpy = jest.spyOn(Date, "now");
      dateSpy.mockReturnValue("timestamp");
      jest.clearAllMocks();
    });

    describe("when initializing the component", () => {
      it("should create an empty component if no marketId is provided", () => {
        setup(undefined, { random: "exchangeMarketProps" });
        expect(ExchangeMarketComponent).not.toHaveBeenCalled();
      });

      it("should create an Exchange Market component with the correct props", () => {
        setup("1.123456789", {
          marketURN: "marketURN",
          marketId: "marketId",
          liquidity: "fakeLiquidity",
          runners: [],
          status: "OPEN",
          i18nLabels: I18N_LABELS,
          intersectOffset: "210px 100%",
          bookPercentage: BOOK_PERCENTAGE,
          isMarketDepthActive: true,
          dispatchUpdateMarketDepth,
          dispatchMarketUpdatesSubscribe,
          dispatchMarketUpdatesUnsubscribe,
          runnerViewLinks: {
            urn1: { viewUrn: "runnerViewUrn" },
          },
          onMarketPromoClick,
        });
        expect(ExchangeMarketComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            bookPercentage: { back: 99.9, lay: 103.2 },
            i18nLabels: I18N_LABELS,
            isMarketDepthActive: true,
            isRaceMarket: undefined,
            liquidity: "fakeLiquidity",
            marketURN: "marketURN",
            runners: [],
            status: "OPEN",
            onMarketPromoClick: expect.any(Function),
          }),
          undefined,
        );
      });

      it("should instantiate an exchange market runner component for each runner with eventViewLink", () => {
        setup("1.123456789", {
          marketURN: "marketURN",
          marketId: "marketId",
          dispatchMarketUpdatesSubscribe,
          dispatchMarketUpdatesUnsubscribe,
          eventViewLink: { viewUrl: "viewUrl", viewUrn: "viewUrn" },
          runners: [
            {
              urn: "ppb:excRunner:1.175327106/15285/0",
              selectionId: 15285,
            },
            {
              urn: "ppb:excRunner:1.175327106/8541909/0",
              selectionId: 8541909,
            },
          ],
        });
        expect(ConnectedExchangeMarketRunner).toHaveBeenCalledTimes(2);
        expect(ConnectedExchangeMarketRunner).toHaveBeenNthCalledWith(
          1,
          expect.objectContaining({
            eventViewLink: { viewUrl: "viewUrl", viewUrn: "viewUrn" },
          }),
          undefined,
        );
        expect(ConnectedExchangeMarketRunner).toHaveBeenNthCalledWith(
          2,
          expect.objectContaining({
            eventViewLink: { viewUrl: "viewUrl", viewUrn: "viewUrn" },
          }),
          undefined,
        );
      });

      it("should dispatch dispatchUpdateMarketDepth when onMarketDepthButtonTap is called", () => {
        setup("1.123456789", {
          marketURN: "marketURN",
          marketId: "marketId",
          liquidity: "fakeLiquidity",
          runners: [],
          status: "OPEN",
          i18nLabels: I18N_LABELS,
          intersectOffset: "210px 100%",
          bookPercentage: BOOK_PERCENTAGE,
          isMarketDepthActive: true,
          dispatchUpdateMarketDepth,
          dispatchMarketUpdatesSubscribe,
          dispatchMarketUpdatesUnsubscribe,
          runnerViewLinks: {
            urn1: { viewUrn: "runnerViewUrn" },
          },
        });

        act(() => {
          ExchangeMarketComponent.mock.calls[0][0].onMarketDepthButtonTap();
        });

        expect(dispatchUpdateMarketDepth).toHaveBeenCalledWith("marketURN", true);
      });

      describe("when card is visible", () => {
        it("should dispatch dispatchMarketUpdatesSubscribe when rendering the component", () => {
          setup("1.123456789", {
            liquidity: "fakeLiquidity",
            runners: [],
            marketURN: "marketURN",
            status: "OPEN",
            i18nLabels: I18N_LABELS,
            intersectOffset: "210px 100%",
            bookPercentage: BOOK_PERCENTAGE,
            isMarketDepthActive: true,
            visible: true,
            dispatchUpdateMarketDepth,
            dispatchMarketUpdatesSubscribe,
            dispatchMarketUpdatesUnsubscribe,
          });

          expect(dispatchMarketUpdatesSubscribe).toHaveBeenCalledWith("1.123456789", false);
        });

        it(
          "should dispatch dispatchMarketUpdatesSubscribe when rendering the component" +
            " and dispatch it again when marketId updates",
          () => {
            const initialMarketId = "marketId";
            const newMarketId = "newMarketId";

            const props = {
              liquidity: "fakeLiquidity",
              runners: [],
              marketURN: "marketURN",
              status: "OPEN",
              i18nLabels: I18N_LABELS,
              intersectOffset: "210px 100%",
              bookPercentage: BOOK_PERCENTAGE,
              isMarketDepthActive: true,
              visible: true,
              dispatchUpdateMarketDepth,
              dispatchMarketUpdatesSubscribe,
              dispatchMarketUpdatesUnsubscribe,
            };

            const { rerender } = setup(initialMarketId, props);
            expect(dispatchMarketUpdatesSubscribe).toHaveBeenCalledWith("marketId", false);

            rerender(<ExchangeMarket marketId={newMarketId} {...props} />);

            expect(dispatchMarketUpdatesSubscribe).toHaveBeenCalledWith("newMarketId", false);
          },
        );
      });

      describe("when card is not visible", () => {
        it("should dispatch dispatchMarketUpdatesSubscribe when rendering the component", () => {
          setup("1.123456789", {
            liquidity: "fakeLiquidity",
            runners: [],
            marketURN: "marketURN",
            status: "OPEN",
            i18nLabels: I18N_LABELS,
            intersectOffset: "210px 100%",
            bookPercentage: BOOK_PERCENTAGE,
            isMarketDepthActive: true,
            visible: false,
            dispatchUpdateMarketDepth,
            dispatchMarketUpdatesSubscribe,
            dispatchMarketUpdatesUnsubscribe,
          });

          expect(dispatchMarketUpdatesUnsubscribe).toHaveBeenCalledWith("1.123456789", false);
        });
      });

      describe("when the inline prop is set to true", () => {
        it("should create an Exchange Market component with the liquidity props undefined", () => {
          setup("1.123456789", {
            marketURN: "marketURN",
            marketId: "marketId",
            liquidity: undefined,
            runners: [],
            status: "OPEN",
            i18nLabels: I18N_LABELS,
            intersectOffset: "210px 100%",
            bookPercentage: BOOK_PERCENTAGE,
            isMarketDepthActive: true,
            dispatchUpdateMarketDepth,
            dispatchMarketUpdatesSubscribe,
            dispatchMarketUpdatesUnsubscribe,
            runnerViewLinks: {
              urn1: { viewUrn: "runnerViewUrn" },
            },
            onMarketPromoClick,
          });
          expect(ExchangeMarketComponent).toHaveBeenCalledWith(
            expect.objectContaining({
              liquidity: undefined,
            }),
            undefined,
          );
        });
        describe("and renderBetslip is defined", () => {
          it("should not call InlineExchangeMarket with renderBetslip", () => {
            const renderBetslipSpy = jest.fn();
            setup("1.123456789", {
              renderBetslip: renderBetslipSpy,
              inline: true,
              runners: [],
              dispatchMarketUpdatesSubscribe: () => {},
              dispatchMarketUpdatesUnsubscribe: () => {},
            });

            expect(InlineExchangeMarket).not.toHaveBeenCalledWith(
              expect.objectContaining({ renderBetslip: renderBetslipSpy }),
              undefined,
            );
          });
        });

        describe("and the market status is open", () => {
          it("should create an Inline Exchange Market component with selections", () => {
            setup("1.123456789", {
              liquidity: "fakeLiquidity",
              runners: inlineRunners,
              marketURN: "marketURN",
              status: "OPEN",
              i18nLabels: I18N_LABELS,
              intersectOffset: "210px 100%",
              bookPercentage: BOOK_PERCENTAGE,
              isMarketDepthActive: true,
              inline: true,
              dispatchUpdateMarketDepth,
              dispatchMarketUpdatesSubscribe,
              dispatchMarketUpdatesUnsubscribe,
            });

            expect(InlineExchangeMarket).toHaveBeenCalledWith(
              {
                runners: [
                  {
                    urn: "ppb:excRunner:1.175327106/15285/0",
                    name: "Albania",
                    isRaceRunner: false,
                  },
                  {
                    urn: "ppb:excRunner:1.175327106/8541909/0",
                    name: "Kosovo",
                    isRaceRunner: false,
                  },
                  {
                    urn: "ppb:excRunner:1.175327106/58805/0",
                    name: "The Draw",
                    isRaceRunner: false,
                  },
                ],
                renderExcBetButtons: expect.any(Function),
              },
              undefined,
            );
          });
        });
      });

      describe("when marketDepth is not active", () => {
        beforeEach(() => {
          setup("1.123456789", {
            liquidity: "fakeLiquidity",
            runners: [],
            marketURN: "marketURN",
            status: "OPEN",
            i18nLabels: I18N_LABELS,
            intersectOffset: "210px 100%",
            bookPercentage: BOOK_PERCENTAGE,
            isMarketDepthActive: false,
            dispatchUpdateMarketDepth,
            dispatchMarketUpdatesSubscribe,
            dispatchMarketUpdatesUnsubscribe,
          });
        });

        it("should create an Exchange Market component with the correct props", () => {
          expect(ExchangeMarketComponent).toHaveBeenCalledWith(
            expect.objectContaining({
              liquidity: "fakeLiquidity",
              runners: [],
              status: "OPEN",
              i18nLabels: I18N_LABELS,
              bookPercentage: BOOK_PERCENTAGE,
              isMarketDepthActive: false,
              marketURN: "marketURN",
            }),
            undefined,
          );
        });
      });

      describe("when exchangeCashoutQuote is defined", () => {
        describe("and hasQuote is true", () => {
          it("should dispatch an action to subscribe to cashout updates", () => {
            setup("1.123456789", {
              i18nLabels: I18N_LABELS,
              exchangeCashoutURN: "mockCashoutURn/0",
              hasQuote: true,
              liabilityValue: "100",
              dispatchSubscribeExchangeCashout,
              dispatchUnsubscribeExchangeCashout,
              dispatchMarketUpdatesSubscribe,
              dispatchMarketUpdatesUnsubscribe,
            });

            expect(dispatchSubscribeExchangeCashout).toHaveBeenCalledWith("1.123456789");
          });

          it("should render BetSegments", async () => {
            setup("1.123456789", {
              i18nLabels: I18N_LABELS,
              exchangeCashoutURN: "mockCashoutURn/0",
              hasQuote: true,
              liabilityValue: "100",
              dispatchSubscribeExchangeCashout,
              dispatchUnsubscribeExchangeCashout,
              dispatchMarketUpdatesSubscribe,
              dispatchMarketUpdatesUnsubscribe,
            });

            expect(BetSegments).toHaveBeenCalledTimes(1);
            expect(BetSegments).toHaveBeenCalledWith(
              {
                leftLabel: "Liability",
                leftValue: "100",
              },
              undefined,
            );
          });

          it("should render Cashout", async () => {
            setup("1.123456789", {
              i18nLabels: I18N_LABELS,
              exchangeCashoutURN: "mockCashoutURn/0",
              hasQuote: true,
              liabilityValue: "100",
              dispatchSubscribeExchangeCashout,
              dispatchUnsubscribeExchangeCashout,
              dispatchMarketUpdatesSubscribe,
              dispatchMarketUpdatesUnsubscribe,
            });

            expect(ConnectedCashout).toHaveBeenCalledTimes(1);
            expect(ConnectedCashout).toHaveBeenCalledWith(
              { cashoutURN: "mockCashoutURn/0", component: Cashout },
              undefined,
            );
          });

          it("should render Divider", async () => {
            setup("1.123456789", {
              i18nLabels: I18N_LABELS,
              exchangeCashoutURN: "mockCashoutURn/0",
              hasQuote: true,
              liabilityValue: "100",
              dispatchSubscribeExchangeCashout,
              dispatchUnsubscribeExchangeCashout,
              dispatchMarketUpdatesSubscribe,
              dispatchMarketUpdatesUnsubscribe,
            });

            expect(Divider).toHaveBeenCalledTimes(1);
          });
        });
      });

      describe("when exchangeCashoutQuote is not defined", () => {
        it("should not dispatch an action to subscribe to cashout updates", () => {
          setup("1.123456789", {
            exchangeCashoutURN: undefined,
            dispatchSubscribeExchangeCashout,
            dispatchUnsubscribeExchangeCashout,
            dispatchMarketUpdatesSubscribe,
            dispatchMarketUpdatesUnsubscribe,
          });

          expect(dispatchSubscribeExchangeCashout).not.toHaveBeenCalled();
        });

        it("should not render Cashout", () => {
          setup("1.123456789", {
            exchangeCashoutURN: undefined,
            dispatchSubscribeExchangeCashout,
            dispatchUnsubscribeExchangeCashout,
            dispatchMarketUpdatesSubscribe,
            dispatchMarketUpdatesUnsubscribe,
          });

          expect(ConnectedCashout).not.toHaveBeenCalled();
        });
      });
    });

    describe("when marketRulesViewURN is defined", () => {
      const init = () => {
        setup("1.123456789", {
          marketURN: "marketURN",
          marketId: "marketId",
          liquidity: "fakeLiquidity",
          runners: [],
          status: "OPEN",
          i18nLabels: I18N_LABELS,
          intersectOffset: "210px 100%",
          bookPercentage: BOOK_PERCENTAGE,
          isMarketDepthActive: true,
          dispatchUpdateMarketDepth,
          dispatchMarketUpdatesSubscribe,
          dispatchMarketUpdatesUnsubscribe,
          runnerViewLinks: {
            urn1: { viewUrn: "runnerViewUrn" },
          },
          marketRulesViewURN: "marketRulesViewURN",
          dispatchFetchCatalogue,
          dispatchDeleteView,
          dispatchModalToggleAction,
        });
      };

      it("should render ExchangeMarketComponent with a truthy hasMarketRules", () => {
        init();
        expect(ExchangeMarketComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            hasMarketRules: true,
          }),
          undefined,
        );
      });

      describe("and on onMarketRulesButtonTap trigger", () => {
        const triggerMarketRules = () => {
          const { onMarketRulesButtonTap } = ExchangeMarketComponent.mock.calls[0][0];
          act(() => {
            onMarketRulesButtonTap();
          });
        };

        it("should trigger dispatchFetchCatalogue", () => {
          init();
          triggerMarketRules();
          expect(dispatchFetchCatalogue).toHaveBeenCalledWith("marketRulesViewURN");
        });

        it("should trigger dispatchModalToggleAction with isOpen as true", () => {
          init();
          triggerMarketRules();
          expect(dispatchModalToggleAction).toHaveBeenCalledWith(true);
        });

        it("should call navigate with the correct viewUrn", () => {
          init();
          triggerMarketRules();
          expect(navigate).toHaveBeenCalledWith({ viewUrn: "marketRulesViewURN" });
        });
      });
    });

    describe("when marketRulesViewURN is not defined", () => {
      const init = () => {
        setup("1.123456789", {
          liquidity: "fakeLiquidity",
          runners: [],
          status: "fakeStatus",
          i18nLabels: I18N_LABELS,
          intersectOffset: "210px 100%",
          dispatchFetchCatalogue,
          dispatchDeleteView,
          dispatchMarketUpdatesSubscribe,
          dispatchMarketUpdatesUnsubscribe,
        });
      };

      it("should render ExchangeMarketComponent with a falsy hasMarketRules", () => {
        init();
        expect(ExchangeMarketComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            hasMarketRules: false,
          }),
          undefined,
        );
      });
    });

    describe("when the market has a graph", () => {
      const init = () => {
        setup("1.123456789", {
          marketURN: "marketURN",
          marketId: "marketId",
          marketName: "marketName",
          liquidity: "fakeLiquidity",
          isRaceMarket: true,
          runners: [{ name: "runnerName", urn: "runnerUrn" }],
          status: "OPEN",
          i18nLabels: I18N_LABELS,
          intersectOffset: "210px 100%",
          bookPercentage: BOOK_PERCENTAGE,
          isMarketDepthActive: true,
          dispatchUpdateMarketDepth,
          dispatchMarketUpdatesSubscribe,
          dispatchMarketUpdatesUnsubscribe,
          runnerViewLinks: {
            urn1: { viewUrn: "runnerViewUrn" },
          },
          marketRulesViewURN: "marketRulesViewURN",
          dispatchFetchCatalogue,
          dispatchDeleteView,
          dispatchModalToggleAction,
          dispatchToggleMarketGraph,
        });
      };

      it("should render ExchangeMarketComponent with a truthy hasMarketGraph and onMarketGraphButtonTap defined", () => {
        init();
        expect(ExchangeMarketComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            hasMarketGraph: true,
            onMarketGraphButtonTap: expect.any(Function),
          }),
          undefined,
        );
      });

      it("should render ConnectedExchangeMarketRunner with onMarketGraphButtonTap defined", () => {
        init();
        expect(ConnectedExchangeMarketRunner).toHaveBeenCalledWith(
          expect.objectContaining({
            onMarketGraphButtonTap: expect.any(Function),
          }),
          undefined,
        );
      });

      describe("and on onMarketGraphButtonTap trigger", () => {
        const triggerMarketGraph = async () => {
          const { onMarketGraphButtonTap } = ExchangeMarketComponent.mock.calls[0][0];
          act(() => {
            onMarketGraphButtonTap();
          });
        };

        it("should trigger dispatchToggleMarketGraph", () => {
          init();
          triggerMarketGraph();
          expect(dispatchToggleMarketGraph).toHaveBeenCalledWith("runnerName", "marketName", false);
        });

        it("should render the market graph modal", () => {
          init();
          triggerMarketGraph();
          expect(ConnectedMarketGraph).toHaveBeenCalledWith(
            {
              market: "marketURN",
              onMarketGraphDismiss: expect.any(Function),
              component: MarketGraph,
              runner: "runnerUrn",
            },
            undefined,
          );
        });

        describe("and on triggerMarketGraphDismiss trigger", () => {
          const triggerMarketGraphDismiss = () => {
            const { onMarketGraphDismiss } = ConnectedMarketGraph.mock.calls[0][0];
            act(() => {
              onMarketGraphDismiss();
            });
          };

          it("should trigger dispatchDeleteView", () => {
            init();
            triggerMarketGraph();
            triggerMarketGraphDismiss();
            expect(dispatchToggleMarketGraph).toHaveBeenCalledWith("runnerName", "marketName", false);
          });
        });
      });
    });

    describe("when the market doesn't have a graph", () => {
      const init = () => {
        setup("1.123456789", {
          marketURN: "marketURN",
          marketId: "marketId",
          marketName: "marketName",
          liquidity: "fakeLiquidity",
          isRaceMarket: false,
          runners: [{ name: "runnerName", urn: "runnerUrn" }],
          status: "OPEN",
          i18nLabels: I18N_LABELS,
          intersectOffset: "210px 100%",
          bookPercentage: BOOK_PERCENTAGE,
          isMarketDepthActive: true,
          dispatchUpdateMarketDepth,
          dispatchMarketUpdatesSubscribe,
          dispatchMarketUpdatesUnsubscribe,
          runnerViewLinks: {
            urn1: { viewUrn: "runnerViewUrn" },
          },
          marketRulesViewURN: "marketRulesViewURN",
          dispatchFetchCatalogue,
          dispatchDeleteView,
          dispatchModalToggleAction,
          dispatchToggleMarketGraph,
        });
      };

      it("should render ExchangeMarketComponent with a truthy hasMarketGraph and onMarketGraphButtonTap defined", () => {
        init();
        expect(ExchangeMarketComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            hasMarketGraph: false,
          }),
          undefined,
        );
      });

      it("should render ConnectedExchangeMarketRunner with onMarketGraphButtonTap defined", () => {
        init();
        expect(ConnectedExchangeMarketRunner).toHaveBeenCalledWith(
          expect.objectContaining({
            onMarketGraphButtonTap: expect.any(Function),
          }),
          undefined,
        );
      });
    });

    describe("when component is unmount", () => {
      it("should call dispatchUnsubscribeExchangeCashout", () => {
        const { unmount } = setup("1.123456789", {
          i18nLabels: I18N_LABELS,
          exchangeCashoutURN: "mockCashoutURn/0",
          dispatchSubscribeExchangeCashout,
          dispatchUnsubscribeExchangeCashout,
          dispatchMarketUpdatesSubscribe,
          dispatchMarketUpdatesUnsubscribe,
          hasQuote: true,
        });

        act(() => {
          unmount();
        });

        expect(dispatchUnsubscribeExchangeCashout).toHaveBeenCalledWith("1.123456789");
      });
    });
  });
});
