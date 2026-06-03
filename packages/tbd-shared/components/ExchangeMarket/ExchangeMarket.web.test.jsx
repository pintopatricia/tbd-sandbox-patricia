import "jest-dom/extend-expect";
import { getByTestId, render, waitFor, act } from "@testing-library/react";
import { BetSegments, Divider, FullScreenModal } from "@ppb/the-wall-web";
import { ExchangeMarket as ExchangeMarketComponent } from "./snowflakes/ExchangeMarket/ExchangeMarket.web";
import { InlineExchangeMarket } from "./snowflakes/InlineExchangeMarket/InlineExchangeMarket.web";
import ExchangeMarket from "./ExchangeMarket.web";
import ConnectedCashout from "../Cashout";
import ConnectedExchangeMarketRunnerComponent from "../ExchangeMarketRunner";
import ConnectedGenericView from "../GenericView";
import { GenericView, GenericViewPlaceholder } from "../GenericView/GenericView.web";
import ConnectedMarketGraph from "../MarketGraph";
import MarketGraph from "../MarketGraph/MarketGraph.web";

const dispatchMarketUpdatesSubscribe = jest.fn();
const dispatchMarketUpdatesUnsubscribe = jest.fn();
const dispatchUpdateMarketDepth = jest.fn();
const dispatchSubscribeExchangeCashout = jest.fn();
const dispatchUnsubscribeExchangeCashout = jest.fn();
const dispatchToggleMarketGraph = jest.fn();
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

const PARENTS = ["ppb:tab:1", "ppb:cardgroup:1"];

jest.mock("../GenericView", () => jest.fn(() => <connected-generic-view-mock data-testid="connected-generic-view" />));

jest.mock("../GenericView/GenericView.web", () => ({
  GenericView: jest.fn(() => <generic-view-mock data-testid="generic-view" />),
  GenericViewPlaceholder: jest.fn(() => <generic-view-placeholder-mock data-testid="generic-view-placeholder" />),
}));

jest.mock("../MarketGraph", () => jest.fn(() => <connected-market-graph-mock data-testid="connected-market-graph" />));

jest.mock("../MarketGraph/MarketGraph.web", () => ({
  MarketGraph: jest.fn(() => <market-graph-mock data-testid="market-graph" />),
}));

jest.mock("@ppb/tbd-store/actions/betting", () => ({
  createMarketExchangeBetButtonClickAction: jest.fn().mockReturnValue("createMarketExchangeBetButtonClickAction"),
}));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));
jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithoutDecimalPlaces: jest.fn(({ value }) => `€${value}`),
}));

jest.mock("@ppb/the-wall-web", () => ({
  FullScreenModal: jest.fn(({ children }) => <div data-testid="full-screen-modal">{children}</div>),
  BetSegments: jest.fn(() => <bet-segments-mock />),
  Divider: jest.fn(() => <divider-mock />),
}));

jest.mock("./snowflakes/InlineExchangeMarket/InlineExchangeMarket.web", () => ({
  InlineExchangeMarket: jest.fn(() => <inline-exchange-market-mock />),
}));

jest.mock("./snowflakes/ExchangeMarket/ExchangeMarket.web", () => ({
  ExchangeMarket: jest.fn(({ children }) => <exchange-market-mock>{children}</exchange-market-mock>),
}));

jest.mock("../Cashout", () =>
  jest.fn((props) => <connected-cashout-mock {...props} data-testid="connected-cashout" />),
);
jest.mock("../Cashout/Cashout.web", () => ({ Cashout: jest.fn().mockReturnValue(<cashout-mock />) }));
jest.mock("../GenericView", () => jest.fn(() => <connected-generic-view-mock data-testid="generic-page" />));
jest.mock("../GenericView/GenericView.web", () => ({
  GenericView: jest.fn(() => <generic-view-mock />),
  GenericViewPlaceholder: jest.fn(() => <generic-view-placeholder-mock />),
}));
jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => PARENTS),
}));

jest.mock(
  "../ExchangeMarketRunner",
  jest.fn(() => jest.fn(() => <connected-exchange-market-runner />)),
);

jest.mock("../ExchangeBetButtons", () => jest.fn(() => <connected-exchange-bet-buttons />));
jest.mock(
  "../ExchangeBetButtons/ExchangeBetButtons.web",
  jest.fn(() => <exchange-bet-buttons />),
);

jest.mock("../Betslip/withInlineBetslip/withInlineBetslip.web", () => ({
  withInlineBetslip: jest.fn((arg) => arg),
}));

function setup(marketId, exchangeMarketProps) {
  return render(
    <ExchangeMarket
      marketURN={`ppb:market:${marketId}`}
      marketId={marketId}
      isRaceMarket={false}
      turnInPlayEnabled={true}
      inplay={false}
      runners={[]}
      {...exchangeMarketProps}
    />,
  );
}

describe("Connected exchange market", () => {
  describe("when initializing the component", () => {
    beforeEach(() => {
      const dateSpy = jest.spyOn(Date, "now");
      dateSpy.mockReturnValue("timestamp");
      jest.clearAllMocks();
    });

    it("should create an empty component if no marketId is provided", () => {
      const { container } = setup();
      expect(container).toBeEmpty();
    });

    it("should create an Exchange Market component with the correct props", () => {
      const renderBetslipSpy = jest.fn();

      setup("1.123456789", {
        liquidity: "fakeLiquidity",
        runners: [],
        status: "fakeStatus",
        i18nLabels: I18N_LABELS,
        intersectOffset: "210px 100%",
        renderBetslip: renderBetslipSpy,
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
        onMarketPromoClick,
      });

      expect(ExchangeMarketComponent).toHaveBeenCalledWith(
        expect.objectContaining({
          bookPercentage: undefined,
          i18nLabels: I18N_LABELS,
          intersectOffset: "210px 100%",
          isMarketDepthActive: false,
          isRaceMarket: false,
          liquidity: "fakeLiquidity",
          marketURN: "ppb:market:1.123456789",
          onIntersectCallback: expect.any(Function),
          runners: [],
          status: "fakeStatus",
          marketPromo: {
            title: "market title",
            description: "market description",
            signposting: "EXTRA_PLACES",
          },
          onMarketPromoClick: expect.any(Function),
          turnInPlayEnabled: true,
          inplay: false,
        }),
        undefined,
      );
    });

    it("should instantiate an exchange market component for each runner", () => {
      setup("1.123456789", {
        eventViewLink: { viewUrl: "viewUrl", viewUrn: "viewUrn" },
        runners: [
          {
            urn: "ppb:excRunner:1.175327106/15285/0",
            name: "Albania",
            selectionId: 15285,
            isRaceRunner: false,
          },
          {
            urn: "ppb:excRunner:1.175327106/8541909/0",
            name: "Kosovo",
            selectionId: 8541909,
            isRaceRunner: false,
          },
        ],
      });
      expect(ConnectedExchangeMarketRunnerComponent).toHaveBeenCalledTimes(2);
      expect(ConnectedExchangeMarketRunnerComponent).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          eventViewLink: { viewUrl: "viewUrl", viewUrn: "viewUrn" },
        }),
        undefined,
      );
      expect(ConnectedExchangeMarketRunnerComponent).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          eventViewLink: { viewUrl: "viewUrl", viewUrn: "viewUrn" },
        }),
        undefined,
      );
    });

    describe("when the inline prop is set to true", () => {
      describe("and renderBetslip is defined", () => {
        it("should not call InlineExchangeMarket with renderBetslip", () => {
          const renderBetslipSpy = jest.fn();
          setup("1.123456789", {
            renderBetslip: renderBetslipSpy,
            inline: true,
            runners: [],
          });

          expect(InlineExchangeMarket).not.toHaveBeenCalledWith(
            expect.objectContaining({ renderBetslip: renderBetslipSpy }),
            undefined,
          );
        });
      });

      describe("and the market status is open", () => {
        describe("and there are no runners", () => {
          it("should create an Inline Exchange Market component with the correct props", () => {
            setup("1.123456789", {
              liquidity: "fakeLiquidity",
              runners: [],
              status: "OPEN",
              labels: { i18nLabels: undefined },
              intersectOffset: "210px 100%",
              inline: true,
            });

            expect(InlineExchangeMarket).toHaveBeenCalledWith(
              {
                intersectOffset: "210px 100%",
                onIntersectCallback: expect.any(Function),
                renderBackBetBtns: [],
                renderLayBetBtns: [],
                runners: [],
              },
              undefined,
            );
          });
        });

        describe("and there are runners", () => {
          it("should create an Inline Exchange Market component with selections", () => {
            setup("1.123456789", {
              liquidity: "fakeLiquidity",
              status: "OPEN",
              i18nLabels: I18N_LABELS,
              intersectOffset: "210px 100%",
              inline: true,
              runners: [
                {
                  urn: "ppb:excRunner:1.175327106/15285/0",
                  name: "Albania",
                  selectionId: 15285,
                  isRaceRunner: false,
                },
                {
                  urn: "ppb:excRunner:1.175327106/8541909/0",
                  name: "Kosovo",
                  selectionId: 8541909,
                  isRaceRunner: false,
                },
                {
                  urn: "ppb:excRunner:1.175327106/58805/0",
                  name: "The Draw",
                  selectionId: 58805,
                  isRaceRunner: false,
                },
              ],
            });

            expect(InlineExchangeMarket).toHaveBeenCalledWith(
              {
                intersectOffset: "210px 100%",
                onIntersectCallback: expect.any(Function),
                runners: [
                  {
                    urn: "ppb:excRunner:1.175327106/15285/0",
                    name: "Albania",
                    selectionId: 15285,
                    isRaceRunner: false,
                  },
                  {
                    urn: "ppb:excRunner:1.175327106/8541909/0",
                    name: "Kosovo",
                    selectionId: 8541909,
                    isRaceRunner: false,
                  },
                  {
                    urn: "ppb:excRunner:1.175327106/58805/0",
                    name: "The Draw",
                    selectionId: 58805,
                    isRaceRunner: false,
                  },
                ],
                renderBackBetBtns: expect.any(Array),
                renderLayBetBtns: expect.any(Array),
              },
              undefined,
            );
          });
        });
      });

      describe("and the market status is suspended", () => {
        it("should create an Inline Exchange Market component with the correct props", () => {
          setup("1.123456789", {
            liquidity: "fakeLiquidity",
            runners: [],
            status: "SUSPENDED",
            i18nLabels: I18N_LABELS,
            intersectOffset: "210px 100%",
            inline: true,
          });
          expect(InlineExchangeMarket).toHaveBeenCalledWith(
            {
              runners: [],
              intersectOffset: "210px 100%",
              onIntersectCallback: expect.any(Function),
              renderBackBetBtns: [],
              renderLayBetBtns: [],
            },
            undefined,
          );
        });
      });
    });

    describe("when the marketDepth prop isVisible is true", () => {
      describe("and marketDepth is active", () => {
        beforeEach(() => {
          setup("1.123456789", {
            liquidity: "fakeLiquidity",
            runners: [],
            marketURN: "marketURN",
            status: "OPEN",
            i18nLabels: I18N_LABELS,
            intersectOffset: "210px 100%",
            bookPercentage: BOOK_PERCENTAGE,
            isMarketDepthActive: true,
            runnerViewLinks: {
              urn1: { viewUrn: "runnerViewUrn" },
            },
            dispatchUpdateMarketDepth,
          });
        });

        it("should create an Exchange Market component with the correct props", () => {
          expect(ExchangeMarketComponent).toHaveBeenCalledWith(
            expect.objectContaining({
              bookPercentage: {
                back: 99.9,
                lay: 103.2,
              },
              i18nLabels: I18N_LABELS,
              intersectOffset: "210px 100%",
              isMarketDepthActive: true,
              isRaceMarket: false,
              liquidity: "fakeLiquidity",
              marketURN: "marketURN",
              onIntersectCallback: expect.any(Function),
              runners: [],
              status: "OPEN",
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

          const { onMarketDepthButtonTap } = ExchangeMarketComponent.mock.calls[0][0];
          onMarketDepthButtonTap();

          expect(dispatchUpdateMarketDepth).toHaveBeenCalledWith("marketURN", true);
        });
      });

      describe("and marketDepth is not active", () => {
        beforeEach(() => {
          setup("1.123456789", {
            liquidity: "fakeLiquidity",
            runners: [],
            status: "OPEN",
            i18nLabels: I18N_LABELS,
            intersectOffset: "210px 100%",
            bookPercentage: BOOK_PERCENTAGE,
            isMarketDepthActive: false,
            dispatchUpdateMarketDepth,
            marketURN: "marketURN",
          });
        });

        it("should create an Exchange Market component with the correct props", () => {
          expect(ExchangeMarketComponent).toHaveBeenCalledWith(
            expect.objectContaining({
              liquidity: "fakeLiquidity",
              runners: [],
              status: "OPEN",
              i18nLabels: I18N_LABELS,
              intersectOffset: "210px 100%",
              onIntersectCallback: expect.any(Function),
              bookPercentage: BOOK_PERCENTAGE,
              isMarketDepthActive: false,
              isRaceMarket: false,
              marketURN: "marketURN",
            }),
            undefined,
          );
        });
      });
    });

    describe("when market Id is defined", () => {
      describe("when intersect value is true", () => {
        it("should subscribe to market updates", () => {
          setup("1.123456789", {
            random: "exchangeMarketProps",
            dispatchMarketUpdatesSubscribe,
          });
          const { onIntersectCallback } = ExchangeMarketComponent.mock.calls[0][0];
          onIntersectCallback(true);
          expect(dispatchMarketUpdatesSubscribe).toHaveBeenCalledWith("1.123456789", false);
        });
      });
      describe("when intersect value is false", () => {
        it("should unsubscribe to market updates", () => {
          setup("1.123456789", {
            random: "exchangeMarketProps",
            dispatchMarketUpdatesUnsubscribe,
          });
          const { onIntersectCallback } = ExchangeMarketComponent.mock.calls[0][0];
          onIntersectCallback(false);
          expect(dispatchMarketUpdatesUnsubscribe).toHaveBeenCalledWith("1.123456789", false);
        });
      });
    });

    describe("when exchangeCashoutQuote is defined", () => {
      describe("and hasQuote is true", () => {
        it("should dispatch an action to subscribe to cashout updates", async () => {
          const { container } = setup("1.123456789", {
            i18nLabels: I18N_LABELS,
            exchangeCashoutURN: "mockCashoutURn/0",
            hasQuote: true,
            liabilityValue: "100",
            dispatchSubscribeExchangeCashout,
            dispatchUnsubscribeExchangeCashout,
          });

          await waitFor(() => getByTestId(container, "connected-cashout"));

          expect(dispatchSubscribeExchangeCashout).toHaveBeenCalledWith("1.123456789");
        });

        it("should render BetSegments", async () => {
          const { container } = setup("1.123456789", {
            i18nLabels: I18N_LABELS,
            exchangeCashoutURN: "mockCashoutURn/0",
            hasQuote: true,
            liabilityValue: "100",
            dispatchSubscribeExchangeCashout,
            dispatchUnsubscribeExchangeCashout,
          });

          await waitFor(() => getByTestId(container, "connected-cashout"));

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
          const { container } = setup("1.123456789", {
            i18nLabels: I18N_LABELS,
            exchangeCashoutURN: "mockCashoutURn/0",
            hasQuote: true,
            liabilityValue: "100",
            dispatchSubscribeExchangeCashout,
            dispatchUnsubscribeExchangeCashout,
          });

          await waitFor(() => getByTestId(container, "connected-cashout"));

          expect(ConnectedCashout).toHaveBeenCalledTimes(1);
          expect(ConnectedCashout).toHaveBeenCalledWith(
            { cashoutURN: "mockCashoutURn/0", component: expect.any(Object) },
            undefined,
          );
        });

        it("should render Divider", async () => {
          const { container } = setup("1.123456789", {
            i18nLabels: I18N_LABELS,
            exchangeCashoutURN: "mockCashoutURn/0",
            hasQuote: true,
            liabilityValue: "100",
            dispatchSubscribeExchangeCashout,
            dispatchUnsubscribeExchangeCashout,
          });

          await waitFor(() => getByTestId(container, "connected-cashout"));

          expect(Divider).toHaveBeenCalledTimes(1);
        });
      });

      describe("and hasQuote is false", () => {
        it("should dispatch an action to subscribe to cashout updates", () => {
          setup("1.123456789", {
            exchangeCashoutURN: "mockCashoutURn/0",
            dispatchSubscribeExchangeCashout,
            dispatchUnsubscribeExchangeCashout,
            hasQuote: false,
          });

          expect(dispatchSubscribeExchangeCashout).toHaveBeenCalledWith("1.123456789");
        });

        it("should not render Cashout", () => {
          setup("1.123456789", {
            exchangeCashoutURN: "mockCashoutURn/0",
            dispatchSubscribeExchangeCashout,
            dispatchUnsubscribeExchangeCashout,
          });

          expect(ConnectedCashout).not.toHaveBeenCalled();
        });
      });
    });

    describe("when exchangeCashoutQuote is not defined", () => {
      it("should not dispatch an action to subscribe to cashout updates", () => {
        setup("1.123456789", {
          exchangeCashoutURN: undefined,
          dispatchSubscribeExchangeCashout,
          dispatchUnsubscribeExchangeCashout,
        });

        expect(dispatchSubscribeExchangeCashout).not.toHaveBeenCalled();
      });

      it("should not render Cashout", () => {
        setup("1.123456789", {
          exchangeCashoutURN: undefined,
          dispatchSubscribeExchangeCashout,
          dispatchUnsubscribeExchangeCashout,
        });

        expect(ConnectedCashout).not.toHaveBeenCalled();
      });
    });

    describe("when marketRulesViewURN is defined", () => {
      let container;

      const init = () => {
        ({ container } = setup("1.123456789", {
          liquidity: "fakeLiquidity",
          runners: [],
          status: "fakeStatus",
          i18nLabels: I18N_LABELS,
          intersectOffset: "210px 100%",
          marketRulesViewURN: "marketRulesViewURN",
          dispatchFetchCatalogue,
          dispatchDeleteView,
          dispatchModalToggleAction,
        }));
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

      it("should not render the market rules modal", () => {
        init();
        expect(FullScreenModal).not.toHaveBeenCalled();
      });

      describe("and on onMarketRulesButtonTap trigger", () => {
        const triggerMarketRules = async () => {
          const { onMarketRulesButtonTap } = ExchangeMarketComponent.mock.calls[0][0];
          act(() => {
            onMarketRulesButtonTap();
          });
          await waitFor(() => getByTestId(container, "full-screen-modal"));
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

        it("should render the market rules modal", () => {
          init();
          triggerMarketRules();
          expect(FullScreenModal).toHaveBeenCalledWith(
            {
              title: "Market Rules",
              onDismiss: expect.any(Function),
              children: expect.any(Object),
            },
            undefined,
          );
        });

        it("should render the market rules view", () => {
          init();
          triggerMarketRules();
          expect(ConnectedGenericView).toHaveBeenCalledWith(
            {
              urn: "marketRulesViewURN",
              component: GenericView,
              placeholder: GenericViewPlaceholder,
            },
            undefined,
          );
        });

        describe("and on modal onDismiss trigger", () => {
          const triggerModalDismiss = () => {
            const { onDismiss } = FullScreenModal.mock.calls[0][0];
            act(() => {
              onDismiss();
            });
          };

          it("should trigger dispatchDeleteView", () => {
            init();
            triggerMarketRules();
            triggerModalDismiss();
            expect(dispatchDeleteView).toHaveBeenCalledWith("marketRulesViewURN");
          });

          it("should trigger dispatchModalToggleAction with isOpen as false", () => {
            init();
            triggerMarketRules();
            triggerModalDismiss();
            expect(dispatchModalToggleAction).toHaveBeenCalledWith(false);
          });
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

      it("should not render the market rules modal", () => {
        init();
        expect(FullScreenModal).not.toHaveBeenCalled();
      });
    });

    describe("when the market has a graph", () => {
      let container;

      const init = () => {
        ({ container } = setup("1.123456789", {
          liquidity: "fakeLiquidity",
          marketName: "marketName",
          runners: [{ urn: "runnerURN", name: "runnerName" }],
          status: "fakeStatus",
          i18nLabels: I18N_LABELS,
          intersectOffset: "210px 100%",
          isRaceMarket: true,
          dispatchFetchCatalogue,
          dispatchDeleteView,
          dispatchModalToggleAction,
          dispatchToggleMarketGraph,
        }));
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

      it("should render ConnectedExchangeMarketRunnerComponent with onMarketGraphButtonTap defined", () => {
        init();
        expect(ConnectedExchangeMarketRunnerComponent).toHaveBeenCalledWith(
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
          await waitFor(() => getByTestId(container, "full-screen-modal"));
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
              market: "ppb:market:1.123456789",
              onMarketGraphDismiss: expect.any(Function),
              component: MarketGraph,
              runner: "runnerURN",
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
          liquidity: "fakeLiquidity",
          marketName: "marketName",
          runners: [{ urn: "runnerURN", name: "runnerName" }],
          status: "fakeStatus",
          i18nLabels: I18N_LABELS,
          intersectOffset: "210px 100%",
          isRaceMarket: false,
          dispatchFetchCatalogue,
          dispatchDeleteView,
          dispatchModalToggleAction,
          dispatchToggleMarketGraph,
        });
      };

      it("should render ExchangeMarketComponent with a false hasMarketGraph", () => {
        init();
        expect(ExchangeMarketComponent).toHaveBeenCalledWith(
          expect.objectContaining({
            hasMarketGraph: false,
          }),
          undefined,
        );
      });

      it("should render ConnectedExchangeMarketRunnerComponent with onMarketGraphButtonTap defined", () => {
        init();
        expect(ConnectedExchangeMarketRunnerComponent).toHaveBeenCalledWith(
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
          hasQuote: true,
          dispatchSubscribeExchangeCashout,
          dispatchUnsubscribeExchangeCashout,
        });

        unmount();

        expect(dispatchUnsubscribeExchangeCashout).toHaveBeenCalledWith("1.123456789");
      });
    });
  });
});
