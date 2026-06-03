import { codecs } from "@ppb/tbd-urn-codecs";
import normalizeMarketExtendedCardFragmentIntoMarketExtendedCard from "./market-extended-card-normalizer";

const BFF_RESPONSE = {
  __typename: "MarketExtendedCard",
  urn: "ppb:tbd:card:marketExtended:1.175361044;924.245006225",
  cardTitle: "Win",
  viewLinks: [
    {
      viewUrn: "ppb:tbd:view:market:1.175361044",
      viewUrl: "horse-racing/extr-11th-nov/2m2f-nov-hrd/rc-1.175361044",
    },
    {
      viewUrn: "ppb:tbd:view:market:924.245006225",
      viewUrl: "horse-racing/extr-11th-nov/2m2f-nov-hrd/r-924.245006225",
    },
  ],
  displayRunners: {
    exchange: {
      market: {
        __typename: "ExchangeMarket",
        urn: "ppb:excMarket:1.175361044",
        name: "2m2f Nov Hrd",
        runners: [],
      },
      runners: [
        { runnerURN: "ppb:excRunner:1.175293571/36710835/0" },
        { runnerURN: "ppb:excRunner:1.175293571/36710836/0" },
      ],
    },
    sportsbook: {
      market: {
        __typename: "SportsbookMarket",
        urn: "ppb:sbkMarket:1234567",
        name: "2m2f Nov Hrd",
        runners: [],
      },
      runners: [
        { runnerURN: "ppb:sbkRunner:1.175293571/36710835" },
        { runnerURN: "ppb:sbkRunner:1.175293571/36710836" },
      ],
    },
  },
  cashoutQuotes: {
    exchangeCashoutQuotes: [
      {
        urn: "ppb:excCashoutQuote:1.175361044/0",
        marketURN: "ppb:excMarket:1.175361044",
        value: "123",
        profit: "123",
        status: "UNAVAILABLE",
      },
      {
        urn: "ppb:excCashoutQuote:1.175361044/0",
        marketURN: "ppb:excMarket:1.175361044",
        value: null,
        profit: null,
        status: "UNAVAILABLE",
      },
    ],
  },
  runnerViewLinks: [
    {
      runnerUrn: "ppb:excRunner:1.175361142/15069/0",
      viewUrl: "Not Implemented",
      viewUrn: "ppb:tbd:view:runner:1.175361142/15069/0",
    },
    {
      runnerUrn: "ppb:excRunner:1.175361142/21155051/0",
      viewUrl: "Not Implemented",
      viewUrn: "ppb:tbd:view:runner:1.175361142/21155051/0",
    },
  ],
  raceViewLink: {
    viewUrl: "race/url",
    viewUrn: codecs.raceView.encode("1", "1"),
  },
  numberOfItemsToDisplay: 4,
  marketPromo: {
    title: "market title",
    description: "market description",
    signposting: "EXTRA_PLACES",
  },
};

describe("Market extended card normalizer", () => {
  describe("normalizeMarketExtendedCardFragmentIntoMarketExtendedCard", () => {
    describe("when receiving valid props", () => {
      it("should correctly transform and return the data object", () => {
        const { data } = normalizeMarketExtendedCardFragmentIntoMarketExtendedCard(BFF_RESPONSE);

        expect(data).toEqual({
          typename: "MarketExtendedCard",
          urn: "ppb:tbd:card:marketExtended:1.175361044;924.245006225",
          title: "Win",
          viewLinks: [
            {
              viewUrn: "ppb:tbd:view:market:1.175361044",
              viewUrl: "horse-racing/extr-11th-nov/2m2f-nov-hrd/rc-1.175361044",
            },
            {
              viewUrn: "ppb:tbd:view:market:924.245006225",
              viewUrl: "horse-racing/extr-11th-nov/2m2f-nov-hrd/r-924.245006225",
            },
          ],
          cashoutQuotes: {
            exchangeCashoutQuotesURNs: ["ppb:excCashoutQuote:1.175361044/0"],
          },
          runnerViewLinks: {
            "ppb:excRunner:1.175361142/15069/0": {
              runnerUrn: "ppb:excRunner:1.175361142/15069/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.175361142/15069/0",
            },
            "ppb:excRunner:1.175361142/21155051/0": {
              runnerUrn: "ppb:excRunner:1.175361142/21155051/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.175361142/21155051/0",
            },
          },
          displayRunners: {
            exchange: {
              market: "ppb:excMarket:1.175361044",
              runners: [
                { urn: "ppb:excRunner:1.175293571/36710835/0" },
                { urn: "ppb:excRunner:1.175293571/36710836/0" },
              ],
            },
            sportsbook: {
              market: "ppb:sbkMarket:1234567",
              runners: [{ urn: "ppb:sbkRunner:1.175293571/36710835" }, { urn: "ppb:sbkRunner:1.175293571/36710836" }],
            },
          },
          raceViewLink: {
            viewUrl: "race/url",
            viewUrn: codecs.raceView.encode("1", "1"),
          },
          numberOfItemsToDisplay: 4,
          marketPromo: {
            title: "market title",
            description: "market description",
            signposting: "EXTRA_PLACES",
          },
        });
      });
    });
    describe("when the cashoutQuotes is not defined", () => {
      it("should corectly return the data object", () => {
        const UPDATE_BFF_RESPONSE = {
          ...BFF_RESPONSE,
          cashoutQuotes: null,
        };
        const { data } = normalizeMarketExtendedCardFragmentIntoMarketExtendedCard(UPDATE_BFF_RESPONSE);

        expect(data).toEqual(
          expect.objectContaining({
            cashoutQuotes: {
              exchangeCashoutQuotesURNs: [],
            },
          }),
        );
      });
    });

    describe("when the race view link is not defined", () => {
      it("should correctly return the data object", () => {
        const UPDATE_BFF_RESPONSE = {
          ...BFF_RESPONSE,
          raceViewLink: null,
        };
        const { data } = normalizeMarketExtendedCardFragmentIntoMarketExtendedCard(UPDATE_BFF_RESPONSE);

        expect(data).toEqual(
          expect.objectContaining({
            raceViewLink: undefined,
          }),
        );
      });
    });

    describe("when there's no numberOfItemsToDisplay", () => {
      it("should not keep any 'numberOfItemsToDisplay' information", () => {
        const UPDATE_BFF_RESPONSE = {
          ...BFF_RESPONSE,
          numberOfItemsToDisplay: null,
        };
        const { data } = normalizeMarketExtendedCardFragmentIntoMarketExtendedCard(UPDATE_BFF_RESPONSE);

        expect(data).toEqual(
          expect.objectContaining({
            numberOfItemsToDisplay: undefined,
          }),
        );
      });
    });
  });
});
