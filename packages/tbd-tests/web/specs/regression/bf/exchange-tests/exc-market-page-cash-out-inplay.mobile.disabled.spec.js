// TODO "pending" not available when running in MR

// const { getQuote, getTakeCashoutResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").CASHOUT;
// const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
// const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
// const CashoutPO = require("../../tbd-page-objects/cashout/cashout.po");
// const MarketPagePO = require("../../tbd-page-objects/market-page/market-page.po");
// const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
// const { getMarketLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
// const MockService = require("../../../../mock-essentials/mocking-service");
// const AppPO = require("../../tbd-page-objects/app/app.po");
// const routes = require("../../../../../utils/routes");

// const cashoutPO = new CashoutPO();
// const marketPagePO = new MarketPagePO();

// const mockService = new MockService();

// const EVENT_ID = "29359895";
// const EXCHANGE_MATCH_ODDS_MARKET_ID = "1.123456789";
// const delay = 10;

// const FIXTURE = {
//   node: {
//     __typename: "FixtureCard",
//     urn: `ppb:tbd:card:fixture:${EVENT_ID}`,
//     sportevent: { urn: `ppb:event:${EVENT_ID}` },
//     fixture: {
//       urn: `ppb:fixture:${EVENT_ID}`,
//       home: { name: "Man Utd" },
//       away: { name: "Wolves" },
//     },
//   },
// };

// const MARKET_CARD_WITH_CASHOUT = {
//   node: {
//     __typename: "MarketExtendedCard",
//     urn: `ppb:tbd:card:marketExtended:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
//     displayRunners: {
//       exchange: {
//         market: {
//           __typename: "ExchangeMarket",
//           urn: `ppb:excMarket:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
//           sportevent: {
//             urn: `ppb:event:${EVENT_ID}`,
//           },
//           runners: [
//             {
//               runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/55190/0`,
//               selectionId: 55190,
//             },
//             {
//               runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/48224/0`,
//               selectionId: 48224,
//             },
//             {
//               runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/58805/0`,
//               selectionId: 58805,
//             },
//           ],
//         },
//         runners: [
//           { runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/55190/0` },
//           { runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/48224/0` },
//           { runnerURN: `ppb:excRunner:${EXCHANGE_MATCH_ODDS_MARKET_ID}/58805/0` },
//         ],
//       },
//     },
//   },
//   cashoutQuotes: {
//     exchangeCashoutQuotes: [
//       {
//         urn: `ppb:excCashoutQuote:${EXCHANGE_MATCH_ODDS_MARKET_ID}/0`,
//         marketURN: `ppb:excMarket:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
//         value: 1.98,
//         profit: -0.02,
//         status: "AVAILABLE",
//       },
//     ],
//   },
// };

// const BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT = {
//   __typename: "MarketExtendedCard",
//   urn: `ppb:tbd:view:market:${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
//   mainMarket: { urn: `ppb:excMarket:${EXCHANGE_MATCH_ODDS_MARKET_ID}` },
//   edges: [FIXTURE, MARKET_CARD_WITH_CASHOUT],
// };

// const ERO_RUNNERS_MOCK = [
//   {
//     selectionId: "55190",
//     availableToBack: [{ price: 2.5, size: 100 }],
//     availableToLay: [{ price: 5.8, size: 110 }],
//   },
//   {
//     selectionId: "48224",
//     availableToBack: [{ price: 3.5, size: 100 }],
//     availableToLay: [{ price: 6.8, size: 110 }],
//   },
//   {
//     selectionId: "58805",
//     availableToBack: [{ price: 1.5, size: 100 }],
//     availableToLay: [{ price: 1.8, size: 110 }],
//   },
// ];

// const MATCH_ODDS_ERO_MOCK = [
//   {
//     marketId: EXCHANGE_MATCH_ODDS_MARKET_ID,
//     state: { betDelay: delay },
//     runners: ERO_RUNNERS_MOCK,
//   },
// ];

// const POSITION_VIEWS = {
//   marketPositions: [
//     {
//       marketId: `${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
//       selections: [
//         {
//           selectionId: "55190",
//           orders: [
//             {
//               marketId: `${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
//               selectionId: "55190",
//               betId: "1:11111111111",
//               price: 6,
//               size: 3,
//               averagePriceMatched: 6,
//               sizeMatched: 3,
//               sizeRemaining: 0,
//               status: "EXECUTION_COMPLETE",
//             },
//           ],
//         },
//         {
//           selectionId: "48224",
//           orders: [
//             {
//               marketId: `${EXCHANGE_MATCH_ODDS_MARKET_ID}`,
//               selectionId: "48224",
//               betId: "2:22222222222",
//               price: 2.5,
//               size: 2,
//               averagePriceMatched: 2.5,
//               sizeMatched: 2,
//               sizeRemaining: 0,
//               status: "EXECUTION_COMPLETE",
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

// const CASHOUT_QUOTE = [
//   {
//     marketId: EXCHANGE_MATCH_ODDS_MARKET_ID,
//     value: 1.98,
//     currentLiability: 2,
//     profit: -0.02,
//     minPartialPercentage: 5,
//     maxPartialPercentage: 100,
//     status: "AVAILABLE",
//     algorithm: "ZERO_BACK",
//   },
// ];

// describe("Exchange Cashout - Bet Delay", () => {
//   beforeAll(async () => {
//     await mockService.mockHttpRequest(getMarkets(MATCH_ODDS_ERO_MOCK));
//     await mockService.mockHttpRequest(getMarketPositionViews(POSITION_VIEWS));
//     await mockService.mockHttpRequest(getMarketLayout(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT));
//     await mockService.mockHttpRequest(getQuote(CASHOUT_QUOTE));
//     await mockService.mockHttpRequest(getTakeCashoutResponse({ status: "SUCCESS" }, delay));
//   });

//   describe("When the user clicks on the cashout button, the market has bet delay and the confirm cashout option is on", () => {
//     beforeAll(async () => {
//       await mockService.mockHttpRequest(
//         await getIndexHTML(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT.urn, {
//           currencyCode: "EUR",
//           countryCode: "GB",
//           confirmCashout: true,
//         })
//       );
//       await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
//       await browser.waitUntil(
//         AppPO.exchangeRunnerBetButtonHasPrice({
//           market: marketPagePO.market,
//           price: 2.5,
//         })
//       );
//       await browser.waitUntilEquals(cashoutPO.element, "Cash Out: €1.98\nProfit: -€0.02");
//       await cashoutPO.element.waitForClickable();
//       await cashoutPO.element.click();
//       await browser.waitUntilEquals(cashoutPO.element, "Confirm: €1.98\nProfit: -€0.02");
//       await cashoutPO.element.click();
//     });
//     it("[747628] the cashout button should show 'Cashing Out' text", async () => {
//       await browser.waitUntilEquals(cashoutPO.element, "Cashing Out: €1.98\nProfit: -€0.02");
//     });
//   });

//   describe("When the user clicks on the cashout button, the market has bet delay but the confirm cashout option is off", () => {
//     beforeAll(async () => {
//       await mockService.mockHttpRequest(
//         await getIndexHTML(BFF_MATCH_ODDS_MARKET_PAGE_MOCK_WITH_CASHOUT.urn, {
//           currencyCode: "EUR",
//           countryCode: "GB",
//         })
//       );
//       await browser.url(routes.getMarketViewUrl(EXCHANGE_MATCH_ODDS_MARKET_ID));
//       await browser.waitUntil(
//         AppPO.exchangeRunnerBetButtonHasPrice({
//           market: marketPagePO.market,
//           price: 2.5,
//         })
//       );
//       await browser.waitUntilEquals(cashoutPO.element, "Cash Out: €1.98\nProfit: -€0.02");
//       await cashoutPO.element.waitForClickable();
//       await cashoutPO.element.click();
//       await browser.waitUntilEquals(cashoutPO.element, "Cashing Out: €1.98\nProfit: -€0.02");
//     });

//     it("[747629] the cashout button should show 'Cashing Out' text", async () => {
//       await browser.waitUntilEquals(cashoutPO.element, "Cashing Out: €1.98\nProfit: -€0.02");
//     });
//   });
// });
