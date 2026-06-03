import { PEBBLES_IDS } from "@ppb/tbd-components-sports-betting/components/LottoCard/viewmodel/LottoCard.viewmodel";
import { getSportsbookRunnerMetrics } from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers";
import { getLottoCard } from "./LottoCard.graphql";
import {
  lottoDrawsSelectedTrackingResolver,
  lottoLuckyDipClearAllTrackingResolver,
  lottoLuckyDipNumbersTrackingResolver,
  lottoLuckyDipRefreshButtonTrackingResolver,
  lottoPebbleClickTrackingResolver,
  lottoAddToBetslipTrackingResolver,
} from "./lotto-card-resolvers";

jest.mock("@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers", () => ({
  getSportsbookRunnerMetrics: jest.fn(),
}));

jest.mock("./LottoCard.graphql", () => ({
  getLottoCard: jest.fn(),
}));

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn().mockReturnValue({
    getState: jest.fn(),
  }),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn().mockReturnValue({
    localeCodeBcp47: "en-GB",
    timezone: "Europe/London",
    currencyCode: "gbp",
  }),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn().mockReturnValue({
    tabName: "Bananas",
  }),
}));

jest.mock("@ppb/formatters", () => ({
  formatDateWithOrdinal: jest.fn().mockReturnValue("5th June, 12:00"),
}));

jest.mock("../../../../helpers/i18n", () => ({
  i18n: jest.fn((key) => key.key),
}));

const sendEvent = jest.fn();
const cardMock = {
  __typename: "LottoCard",
  urn: "ppb:tbd:card:lotto:aIIz6REAACMAysy6/s/29125756",
  shouldShowCompetitionName: true,
  competition: {
    __typename: "Competition",
    urn: "ppb:competition:511511",
    name: "UK 49s",
  },
  lottoMarkets: [
    {
      __typename: "SportsbookMarket",
      urn: "ppb:sbkMarket:1",
      name: "Standard Bet",
      marketType: "STANDARD_BET",
      runners: [
        {
          runnerURN: "ppb:sbkRunner:1/47251301",
          selectionId: 47251301,
          name: "1",
          resultType: null,
          __typename: "Runner",
        },
        {
          runnerURN: `ppb:sbkRunner:1/47251302`,
          selectionId: 47251302,
          name: "2",
          resultType: null,
          __typename: "Runner",
        },
      ],
      hierarchy: {
        __typename: "EventCompetitionHierarchy",
        sportevent: {
          __typename: "SportsEvent",
          eventId: 1,
          urn: "ppb:event:1",
          name: "Main 1",
          openDate: "2024-06-01T12:00:00Z",
        },
        competition: {
          urn: "ppb:competition:511511",
          competitionId: 511511,
        },
      },
      liveData: {
        urn: "ppb:sbkMarketLiveData:1",
        sportsbookMarketStatus: "OPEN",
      },
    },
  ],
  marketIds: ["ppb:sbkMarket:1"],
};

describe("LottoCardtracking resolvers", () => {
  beforeEach(jest.clearAllMocks);

  describe("lottoPebbleClickTrackingResolver", () => {
    describe("when we're not able to fetch the card data", () => {
      it("should not call the 'sendEvent' function", async () => {
        getLottoCard.mockResolvedValueOnce(null);

        await lottoPebbleClickTrackingResolver(
          {
            cardUrn: "urn",
            pebbleId: PEBBLES_IDS.PICK_NUMBERS,
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no urn", () => {
      it("should not call the 'sendEvent' function", async () => {
        await lottoPebbleClickTrackingResolver(
          {
            pebbleId: PEBBLES_IDS.PICK_NUMBERS,
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card data", () => {
      beforeEach(() => {
        getLottoCard.mockResolvedValueOnce(cardMock);
      });

      describe("when pebbleId is PICK_NUMBERS", () => {
        it("should call the 'sendEvent' function", async () => {
          await lottoPebbleClickTrackingResolver(
            {
              cardUrn: "urn",
              pebbleId: PEBBLES_IDS.PICK_NUMBERS,
            },
            sendEvent,
          );

          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith({
            action: "clicked",
            element_text: "i18n.lotteries.pick_numbers",
            event: "interface",
            module: "lotto - bananas - pick ribbon",
            event_context: "null",
            game_filter: "null",
            swimlane_type: "null",
          });
        });
      });

      describe("when pebbleId is LUCKY_DIP", () => {
        it("should call the 'sendEvent' function", async () => {
          await lottoPebbleClickTrackingResolver(
            {
              cardUrn: "urn",
              pebbleId: PEBBLES_IDS.LUCKY_DIP,
            },
            sendEvent,
          );

          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith({
            action: "clicked",
            element_text: "i18n.lotteries.lucky_dip",
            event: "interface",
            module: "lotto - bananas - pick ribbon",
            event_context: "null",
            game_filter: "null",
            swimlane_type: "null",
          });
        });
      });
    });
  });

  describe("lottoLuckyDipRefreshButtonTrackingResolver", () => {
    describe("when we're not able to fetch the card data", () => {
      it("should not call the 'sendEvent' function", async () => {
        getLottoCard.mockResolvedValueOnce(null);

        await lottoLuckyDipRefreshButtonTrackingResolver(
          {
            cardUrn: "urn",
            pebbleId: PEBBLES_IDS.PICK_NUMBERS,
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no urn", () => {
      it("should not call the 'sendEvent' function", async () => {
        await lottoLuckyDipRefreshButtonTrackingResolver(
          {
            pebbleId: PEBBLES_IDS.PICK_NUMBERS,
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card data", () => {
      it("should call the 'sendEvent' function", async () => {
        getLottoCard.mockResolvedValueOnce(cardMock);

        await lottoLuckyDipRefreshButtonTrackingResolver(
          {
            cardUrn: "urn",
            pebbleId: PEBBLES_IDS.PICK_NUMBERS,
          },
          sendEvent,
        );

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          action: "clicked",
          element_text: "refresh",
          event: "interface",
          module: "lotto - bananas - i18n.lotteries.pick_numbers",
          event_context: "null",
          game_filter: "null",
          swimlane_type: "null",
        });
      });
    });
  });

  describe("lottoLuckyDipClearAllTrackingResolver", () => {
    describe("when we're not able to fetch the card data", () => {
      it("should not call the 'sendEvent' function", async () => {
        getLottoCard.mockResolvedValueOnce(null);

        await lottoLuckyDipClearAllTrackingResolver(
          {
            cardUrn: "urn",
            pebbleId: PEBBLES_IDS.PICK_NUMBERS,
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no urn", () => {
      it("should not call the 'sendEvent' function", async () => {
        await lottoLuckyDipClearAllTrackingResolver(
          {
            pebbleId: PEBBLES_IDS.PICK_NUMBERS,
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card data", () => {
      it("should call the 'sendEvent' function", async () => {
        getLottoCard.mockResolvedValueOnce(cardMock);

        await lottoLuckyDipClearAllTrackingResolver(
          {
            cardUrn: "urn",
            pebbleId: PEBBLES_IDS.PICK_NUMBERS,
          },
          sendEvent,
        );

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          action: "clicked",
          element_text: "clear all",
          event: "interface",
          module: "lotto - bananas - i18n.lotteries.pick_numbers",
          event_context: "null",
          game_filter: "null",
          swimlane_type: "null",
        });
      });
    });
  });

  describe("lottoLuckyDipNumbersTrackingResolver", () => {
    describe("when we're not able to fetch the card data", () => {
      it("should not call the 'sendEvent' function", async () => {
        getLottoCard.mockResolvedValueOnce(null);

        await lottoLuckyDipNumbersTrackingResolver(
          {
            cardUrn: "urn",
            pebbleId: PEBBLES_IDS.PICK_NUMBERS,
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no urn", () => {
      it("should not call the 'sendEvent' function", async () => {
        await lottoLuckyDipNumbersTrackingResolver(
          {
            pebbleId: PEBBLES_IDS.PICK_NUMBERS,
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card data", () => {
      it("should call the 'sendEvent' function", async () => {
        getLottoCard.mockResolvedValueOnce(cardMock);

        await lottoLuckyDipNumbersTrackingResolver(
          {
            cardUrn: "urn",
            pebbleId: PEBBLES_IDS.PICK_NUMBERS,
            numbers: 4,
          },
          sendEvent,
        );

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          action: "clicked",
          element_text: "4 numbers",
          event: "interface",
          module: "lotto - bananas - i18n.lotteries.pick_numbers",
          event_context: "null",
          game_filter: "null",
          swimlane_type: "null",
        });
      });
    });
  });

  describe("lottoDrawsSelectedTrackingResolver", () => {
    describe("when we're not able to fetch the card data", () => {
      it("should not call the 'sendEvent' function", async () => {
        getLottoCard.mockResolvedValueOnce(null);

        await lottoDrawsSelectedTrackingResolver(
          {
            cardUrn: "urn",
            pebbleId: PEBBLES_IDS.PICK_NUMBERS,
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no urn", () => {
      it("should not call the 'sendEvent' function", async () => {
        await lottoDrawsSelectedTrackingResolver(
          {
            pebbleId: PEBBLES_IDS.PICK_NUMBERS,
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card data", () => {
      describe("when a draw was added", () => {
        it("should call the 'sendEvent' function", async () => {
          getLottoCard.mockResolvedValueOnce(cardMock);

          await lottoDrawsSelectedTrackingResolver(
            {
              cardUrn: "urn",
              drawUrn: "ppb:sbkMarket:1",
              added: true,
            },
            sendEvent,
          );

          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith({
            action: "added",
            element_text: "main 1 - 5th june, 12:00",
            event: "interface",
            module: "lotto - bananas - select draws",
            event_context: "null",
            game_filter: "null",
            swimlane_type: "null",
          });
        });
      });

      describe("when a draw was removed", () => {
        it("should call the 'sendEvent' function", async () => {
          getLottoCard.mockResolvedValueOnce(cardMock);

          await lottoDrawsSelectedTrackingResolver(
            {
              cardUrn: "urn",
              drawUrn: "ppb:sbkMarket:1",
              added: false,
            },
            sendEvent,
          );

          expect(sendEvent).toHaveBeenCalledTimes(1);
          expect(sendEvent).toHaveBeenCalledWith({
            action: "removed",
            element_text: "main 1 - 5th june, 12:00",
            event: "interface",
            module: "lotto - bananas - select draws",
            event_context: "null",
            game_filter: "null",
            swimlane_type: "null",
          });
        });
      });
    });
  });

  describe("lottoAddToBetslipTrackingResolver", () => {
    describe("when we're not able to fetch the card data", () => {
      it("should not call the 'sendEvent' function", async () => {
        getLottoCard.mockResolvedValueOnce(null);

        await lottoAddToBetslipTrackingResolver(
          {
            cardUrn: "urn",
            runners: [{ selectionId: 1, runnerURN: "runner:1" }],
            markets: [{ markeUrn: "market:1", marketId: 1 }],
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has no urn", () => {
      it("should not call the 'sendEvent' function", async () => {
        await lottoAddToBetslipTrackingResolver({}, sendEvent);

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when doesn't have runnerMetrics", () => {
      it("should not call the 'sendEvent' function", async () => {
        getLottoCard.mockResolvedValueOnce(cardMock);

        await lottoAddToBetslipTrackingResolver(
          {
            cardUrn: "urn",
            runners: [],
            markets: [{ markeUrn: "market:1", marketId: 1 }],
          },
          sendEvent,
        );

        expect(sendEvent).not.toHaveBeenCalled();
      });
    });

    describe("when we're able to fetch the card data", () => {
      it("should call the 'sendEvent' function", async () => {
        getLottoCard.mockResolvedValueOnce(cardMock);
        getSportsbookRunnerMetrics.mockReturnValueOnce({
          competition_id: 511511,
          competition_name: "UK 49s",
          sport_id: 1,
          sport_name: "Lottery",
          event_id: 1,
          event_name: "Main 1",
          market_id: "1",
          market_name: "Standard Bet",
          selection_id: "47251301",
          selection: "1",
          price_at_selection: "2.00",
          in_play_indicator: "null",
          antepost_flag: "null",
        });
        await lottoAddToBetslipTrackingResolver(
          {
            cardUrn: "urn",
            runners: [{ selectionId: 1, runnerURN: "runner:1" }],
            markets: [{ markeUrn: "market:1", marketId: 1 }],
            pebbleId: "PICK_NUMBERS",
          },
          sendEvent,
        );

        expect(sendEvent).toHaveBeenCalledTimes(1);
        expect(sendEvent).toHaveBeenCalledWith({
          antepost_flag: "null",
          bet_direction: "back",
          bet_identifier: "null",
          betting_product: "sportsbook",
          competition: "uk 49s",
          competition_id: "511511",
          currency: "gbp",
          event: "added_selection",
          event_id: "1",
          event_name: "main 1",
          in_play_indicator: "null",
          market: "standard bet",
          market_id: "1",
          module: "uk 49s - i18n.lotteries.pick_numbers",
          module_display_order: "null",
          position: "null",
          price_at_selection: "2.00",
          selection: "1",
          selection_id: "47251301",
          sport: "lottery",
          sport_id: "1",
        });
      });
    });
  });
});
