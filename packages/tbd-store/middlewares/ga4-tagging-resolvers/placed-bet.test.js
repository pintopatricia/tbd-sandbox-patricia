import { buildPlacedBetEvent, buildPlacedBetSelectionEvent } from "tagging-library";
import {
  getExchangeBetEditSuccessfullEvents,
  getExchangeSuccessPlaceBetEvents,
  getSportsbookSuccessPlaceBetsEvents,
  getObbPlaceBetSuccessEvent,
} from "./placed-bet";
import { Product } from "../../state";
import { ExchangeSide } from "../../state/constants";

jest.mock("tagging-library", () => ({
  buildPlacedBetEvent: jest.fn().mockReturnValue("placed bet event"),
  buildPlacedBetSelectionEvent: jest.fn().mockReturnValue("placed bet selection event"),
}));
jest.mock("../../state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn().mockReturnValue({ currencyCode: "eur" }),
}));
jest.mock("../../helpers/betting", () => ({
  getRunnerUniqueTaggingId: jest.fn().mockReturnValue("999999"),
}));

jest.mock("../../state/layout/layout-selectors", () => ({
  createViewTypeSelector: jest.fn(() => jest.fn(() => "home")),
}));

jest.mock("./helpers.ts", () => ({
  getModuleData: jest.fn(() => "getModuleData"),
  getBetMetrics: jest.fn(() => ({
    betDirection: ExchangeSide.BACK,
    price_at_selection: "price_at_selection",
    currency: "eur",
    betId: "betId",
    betResponse: "betResponse",
    antepost_flag: "no",
    competition_id: "c123",
    competition_name: "competition_name",
    event_id: "e123",
    event_name: "event_name",
    in_play_indicator: "no",
    market_id: "market_id",
    market_name: "market_name",
    selection_id: "selection_id",
    selection: "selection",
    sport_id: "s123",
    sport_name: "sport_name",
  })),
  getBetResponseFromReport: jest.fn(() => "matched"),
  getSportsbookRunnerMetrics: jest.fn().mockReturnValue({
    antepost_flag: "no",
    competition_id: "c123",
    competition_name: "competition_name",
    event_id: "e123",
    event_name: "event_name",
    in_play_indicator: "no",
    market_id: "m123",
    market_name: "market_name",
    selection_id: "selection_id",
    selection: "selection",
    sport_id: "sport_id",
    sport_name: "sport_name",
  }),
  getExchangeRunnerMetrics: jest.fn(() => ({
    antepost_flag: "no",
    competition_id: "c123",
    competition_name: "competition_name",
    event_id: "e123",
    event_name: "event_name",
    in_play_indicator: "no",
    market_id: "market_id",
    market_name: "market_name",
    selection_id: "selection_id",
    selection: "selection",
    sport_id: "s123",
    sport_name: "sport_name",
  })),
}));

describe("placed bet", () => {
  let action = {
    payload: {
      betId: "12345",
      report: {
        matched: {
          betId: "12345",
          price: 10,
          size: 3,
        },
        priceAtSelection: 2,
        side: ExchangeSide.BACK,
      },
      betOriginURL: "betOriginURL",
    },
  };
  const appState = {
    entities: {
      sports: "sports",
      competitions: "competitions",
      exchangemarkets: "exchangemarkets",
      exchangerunners: "exchangerunners",
      sportevents: "sportevents",
      exchangePotentialBets: [],
    },
  };

  beforeEach(jest.clearAllMocks);

  describe("getExchangeSuccessPlaceBetEvents", () => {
    it("should return the correct event payload", () => {
      const result = getExchangeSuccessPlaceBetEvents(action, appState);

      expect(buildPlacedBetEvent).toHaveBeenCalledTimes(1);
      expect(buildPlacedBetSelectionEvent).toHaveBeenCalledTimes(1);
      expect(buildPlacedBetEvent).toHaveBeenCalledWith({
        price: "10",
        betType: "null",
        transactionId: "null",
        currency: "eur",
        betDirection: ExchangeSide.BACK,
        betId: "12345",
        totalStake: 3,
        eachWayIndicator: "no",
        module: "betslip",
        bettingProduct: Product.Exchange,
        numberOfLegs: 1,
        selectionsNumber: 1,
        numberOfLines: 1,
        numberOfPowerUps: 0,
        betTokenApplied: "null",
      });
      expect(buildPlacedBetSelectionEvent).toHaveBeenCalledWith({
        antepostFlag: "no",
        betDirection: ExchangeSide.BACK,
        betId: "12345",
        betIdentifier: "999999",
        betOriginLocation: "null",
        betResponse: "matched",
        betSource: "null",
        bettingProduct: "Exchange",
        betTokenApplied: "null",
        betType: "SINGLE",
        cashoutIndicator: "null",
        competition: "competition_name",
        competitionId: "c123",
        currency: "eur",
        eachWayIndicator: "no",
        eventId: "e123",
        eventName: "event_name",
        inPlayIndicator: "no",
        market: "market_name",
        marketId: "market_id",
        module: "betslip",
        numberOfLegs: 0,
        numberOfLines: 0,
        numberOfPowerUps: 0,
        priceAtSelection: "10",
        selection: "selection",
        selectionId: "selection_id",
        selectionsNumber: 1,
        sport: "sport_name",
        sportId: "s123",
        totalStake: 3,
        transactionId: "null",
      });

      expect(result).toEqual(["placed bet event", "placed bet selection event"]);
    });
  });

  describe("getExchangeBetEditSuccessfullEvents", () => {
    it("should return the correct event payload", () => {
      const result = getExchangeBetEditSuccessfullEvents(action, appState);

      expect(buildPlacedBetEvent).toHaveBeenCalledTimes(1);
      expect(buildPlacedBetSelectionEvent).toHaveBeenCalledTimes(1);
      expect(buildPlacedBetEvent).toHaveBeenCalledWith({
        price: "10",
        betType: "null",
        transactionId: "null",
        currency: "eur",
        betDirection: ExchangeSide.BACK,
        betId: "12345",
        totalStake: 3,
        eachWayIndicator: "no",
        module: "betslip - update bet",
        bettingProduct: Product.Exchange,
        numberOfLegs: 1,
        selectionsNumber: 1,
        numberOfLines: 1,
        numberOfPowerUps: 0,
        betTokenApplied: "null",
      });
      expect(buildPlacedBetSelectionEvent).toHaveBeenCalledWith({
        antepostFlag: "no",
        betDirection: ExchangeSide.BACK,
        betId: "12345",
        betIdentifier: "999999",
        betOriginLocation: "null",
        betResponse: "matched",
        betSource: "null",
        betTokenApplied: "null",
        betType: "SINGLE",
        bettingProduct: "Exchange",
        cashoutIndicator: "null",
        competition: "competition_name",
        competitionId: "c123",
        currency: "eur",
        eachWayIndicator: "no",
        eventId: "e123",
        eventName: "event_name",
        inPlayIndicator: "no",
        market: "market_name",
        marketId: "market_id",
        module: "betslip - update bet",
        numberOfLegs: 0,
        numberOfLines: 0,
        numberOfPowerUps: 0,
        priceAtSelection: "10",
        selection: "selection",
        selectionId: "selection_id",
        selectionsNumber: 1,
        sport: "sport_name",
        sportId: "s123",
        totalStake: 3,
        transactionId: "null",
      });

      expect(result).toEqual(["placed bet event", "placed bet selection event"]);
    });
  });

  describe("getSportsbookSuccessPlaceBetsEvents", () => {
    it("should return the correct event payload", () => {
      action = {
        payload: {
          report: {
            metadata: {
              runner1: {
                bettingGroup: "REAL",
              },
              runner2: {
                bettingGroup: "REAL",
              },
              runner3: {
                bettingGroup: "REAL",
              },
            },
            result: {
              combinations: {
                combination1: {
                  betId: 12345,
                  betReceiptId: "betReceiptId",
                  betType: "DOUBLE",
                  displayOdds: {
                    decimalOdds: 2.21,
                  },
                  legs: ["leg1", "leg2"],
                  lines: 1,
                  totalStake: 0.11,
                },
                combination2: {
                  betId: 12346,
                  betReceiptId: "betReceiptId",
                  betType: "DOUBLE",
                  displayOdds: {
                    decimalOdds: 2.21,
                  },
                  legs: ["leg1", "leg2"],
                  lines: 1,
                  totalStake: 0.11,
                  isPriceBoosted: true,
                  wallets: [{ id: "fake_wallet_id", type: "DEPOSITS" }],
                },
                combination3: {
                  betId: 12347,
                  betReceiptId: "betReceiptId",
                  betType: "SINGLE",
                  displayOdds: {
                    decimalOdds: 2.21,
                  },
                  legs: ["leg3"],
                  lines: 1,
                  totalStake: 0.11,
                  isPriceBoosted: false,
                  wallets: [{ id: "fake_wallet_id", type: "BONUS_CASH" }],
                },
              },
              legs: {
                leg1: {
                  displayOdds: {
                    decimalOdds: 1.53,
                  },
                  runners: ["runner1"],
                },
                leg2: {
                  displayOdds: {
                    decimalOdds: 1.44,
                  },
                  runners: ["runner2"],
                },
                leg3: {
                  displayOdds: {
                    decimalOdds: 2.21,
                  },
                  runners: ["runner3"],
                },
              },
            },
          },
        },
      };

      const result = getSportsbookSuccessPlaceBetsEvents(action, appState);

      expect(buildPlacedBetEvent).toHaveBeenCalledTimes(3);
      expect(buildPlacedBetSelectionEvent).toHaveBeenCalledTimes(5);

      expect(buildPlacedBetEvent).toHaveBeenNthCalledWith(1, {
        price: "2.21",
        betType: "DOUBLE",
        transactionId: "betReceiptId",
        currency: "eur",
        betDirection: "back",
        betId: "12345",
        totalStake: 0.11,
        eachWayIndicator: "no",
        module: "betslip",
        bettingProduct: Product.Sportsbook,
        numberOfLegs: 2,
        selectionsNumber: 2,
        numberOfLines: 1,
        numberOfPowerUps: 0,
        betTokenApplied: "null",
      });

      expect(buildPlacedBetEvent).toHaveBeenNthCalledWith(2, {
        price: "2.21",
        betType: "DOUBLE",
        transactionId: "betReceiptId",
        currency: "eur",
        betDirection: "back",
        betId: "12346",
        totalStake: 0.11,
        eachWayIndicator: "no",
        module: "betslip",
        bettingProduct: Product.Sportsbook,
        numberOfLegs: 2,
        selectionsNumber: 2,
        numberOfLines: 1,
        numberOfPowerUps: 0,
        betTokenApplied: "price boosted",
      });

      expect(buildPlacedBetEvent).toHaveBeenNthCalledWith(3, {
        price: "2.21",
        betType: "SINGLE",
        transactionId: "betReceiptId",
        currency: "eur",
        betDirection: "back",
        betId: "12347",
        totalStake: 0.11,
        eachWayIndicator: "no",
        module: "betslip",
        bettingProduct: Product.Sportsbook,
        numberOfLegs: 1,
        selectionsNumber: 1,
        numberOfLines: 1,
        numberOfPowerUps: 0,
        betTokenApplied: "freebet",
      });

      expect(buildPlacedBetSelectionEvent).toHaveBeenNthCalledWith(1, {
        antepostFlag: "no",
        betDirection: "back",
        betId: "12345",
        betIdentifier: "999999",
        betOriginLocation: "null",
        betResponse: "matched",
        betSource: "null",
        betTokenApplied: "null",
        betType: "DOUBLE",
        bettingProduct: Product.Sportsbook,
        cashoutIndicator: "null",
        competition: "competition_name",
        competitionId: "c123",
        currency: "eur",
        eachWayIndicator: "no",
        eventId: "e123",
        eventName: "event_name",
        inPlayIndicator: "no",
        market: "market_name",
        marketId: "m123",
        module: "betslip",
        numberOfLegs: 2,
        numberOfLines: 1,
        numberOfPowerUps: 0,
        priceAtSelection: "1.53",
        selection: "selection",
        selectionId: "selection_id",
        selectionsNumber: 2,
        sport: "sport_name",
        sportId: "sport_id",
        totalStake: 0.11,
        transactionId: "betReceiptId",
      });

      expect(buildPlacedBetSelectionEvent).toHaveBeenNthCalledWith(2, {
        antepostFlag: "no",
        betDirection: "back",
        betId: "12345",
        betIdentifier: "999999",
        betOriginLocation: "null",
        betResponse: "matched",
        betSource: "null",
        betTokenApplied: "null",
        betType: "DOUBLE",
        bettingProduct: Product.Sportsbook,
        cashoutIndicator: "null",
        competition: "competition_name",
        competitionId: "c123",
        currency: "eur",
        eachWayIndicator: "no",
        eventId: "e123",
        eventName: "event_name",
        inPlayIndicator: "no",
        market: "market_name",
        marketId: "m123",
        module: "betslip",
        numberOfLegs: 2,
        numberOfLines: 1,
        numberOfPowerUps: 0,
        priceAtSelection: "1.44",
        selection: "selection",
        selectionId: "selection_id",
        selectionsNumber: 2,
        sport: "sport_name",
        sportId: "sport_id",
        totalStake: 0.11,
        transactionId: "betReceiptId",
      });

      expect(buildPlacedBetSelectionEvent).toHaveBeenNthCalledWith(3, {
        antepostFlag: "no",
        betDirection: "back",
        betId: "12346",
        betIdentifier: "999999",
        betOriginLocation: "null",
        betResponse: "matched",
        betSource: "null",
        betTokenApplied: "price boosted",
        betType: "DOUBLE",
        bettingProduct: Product.Sportsbook,
        cashoutIndicator: "null",
        competition: "competition_name",
        competitionId: "c123",
        currency: "eur",
        eachWayIndicator: "no",
        eventId: "e123",
        eventName: "event_name",
        inPlayIndicator: "no",
        market: "market_name",
        marketId: "m123",
        module: "betslip",
        numberOfLegs: 2,
        numberOfLines: 1,
        numberOfPowerUps: 0,
        priceAtSelection: "1.53",
        selection: "selection",
        selectionId: "selection_id",
        selectionsNumber: 2,
        sport: "sport_name",
        sportId: "sport_id",
        totalStake: 0.11,
        transactionId: "betReceiptId",
      });

      expect(buildPlacedBetSelectionEvent).toHaveBeenNthCalledWith(4, {
        antepostFlag: "no",
        betDirection: "back",
        betId: "12346",
        betIdentifier: "999999",
        betOriginLocation: "null",
        betResponse: "matched",
        betSource: "null",
        betTokenApplied: "price boosted",
        betType: "DOUBLE",
        bettingProduct: Product.Sportsbook,
        cashoutIndicator: "null",
        competition: "competition_name",
        competitionId: "c123",
        currency: "eur",
        eachWayIndicator: "no",
        eventId: "e123",
        eventName: "event_name",
        inPlayIndicator: "no",
        market: "market_name",
        marketId: "m123",
        module: "betslip",
        numberOfLegs: 2,
        numberOfLines: 1,
        numberOfPowerUps: 0,
        priceAtSelection: "1.44",
        selection: "selection",
        selectionId: "selection_id",
        selectionsNumber: 2,
        sport: "sport_name",
        sportId: "sport_id",
        totalStake: 0.11,
        transactionId: "betReceiptId",
      });

      expect(buildPlacedBetSelectionEvent).toHaveBeenNthCalledWith(5, {
        antepostFlag: "no",
        betDirection: "back",
        betId: "12347",
        betIdentifier: "999999",
        betOriginLocation: "null",
        betResponse: "matched",
        betSource: "null",
        betTokenApplied: "freebet",
        betType: "SINGLE",
        bettingProduct: Product.Sportsbook,
        cashoutIndicator: "null",
        competition: "competition_name",
        competitionId: "c123",
        currency: "eur",
        eachWayIndicator: "no",
        eventId: "e123",
        eventName: "event_name",
        inPlayIndicator: "no",
        market: "market_name",
        marketId: "m123",
        module: "betslip",
        numberOfLegs: 1,
        numberOfLines: 1,
        numberOfPowerUps: 0,
        priceAtSelection: "2.21",
        selection: "selection",
        selectionId: "selection_id",
        selectionsNumber: 1,
        sport: "sport_name",
        sportId: "sport_id",
        totalStake: 0.11,
        transactionId: "betReceiptId",
      });

      expect(result).toEqual([
        "placed bet event",
        "placed bet selection event",
        "placed bet selection event",
        "placed bet event",
        "placed bet selection event",
        "placed bet selection event",
        "placed bet event",
        "placed bet selection event",
      ]);
    });
  });

  describe("getObbPlaceBetSuccessEvent", () => {
    const obbAction = {
      payload: {
        bets: {
          bet1: {
            betId: "12345",
            price: { decimal: 2.5 },
            betType: "SINGLE",
            receiptId: "receipt123",
            stake: 10,
            legs: [
              {
                legId: "legId1",
                price: { decimal: 2.5 },
                event: {
                  eventId: 1,
                  name: "event1",
                  urn: "eventUrn1",
                },
                metadata: {
                  legTypeDescription: "type1",
                  legDescription: "part1 - outcome1",
                  participantsDescription: "part1",
                  outcomeDescription: "outcome1",
                },
              },
            ],
            numberOfBaseBets: 1,
          },
          bet2: {
            betId: "67890",
            price: { decimal: 5.5 },
            betType: "SINGLE",
            receiptId: "receipt456",
            stake: 10,
            legs: [
              {
                legId: "legId2",
                price: { decimal: 3.5 },
                event: {
                  eventId: 1,
                  name: "event1",
                  urn: "eventUrn1",
                },
                metadata: {
                  legTypeDescription: "type2",
                  legDescription: "part2 - outcome2",
                  participantsDescription: "part2",
                  outcomeDescription: "outcome2",
                  eventsNames: "event1 | event2",
                  obbBettingLegsQuotes: "3.5 | 2.5",
                },
              },
            ],
            numberOfBaseBets: 2,
          },
        },
      },
    };

    const obbAppState = {
      entities: {
        obbLegs: {
          legId1: {
            event: { urn: "eventUrn1", name: "event1", eventId: 1 },
          },
          legId2: {
            event: { urn: "eventUrn2", name: "event2", eventId: 2 },
          },
        },
        sportevents: {
          eventUrn1: { eventId: "eventId1", competition: "compUrn1" },
          eventUrn2: { eventId: "eventId2", competition: "compUrn2" },
        },
        competitions: {
          compUrn1: { competitionId: "compId1", name: "compName1", sport: "sportUrn1" },
          compUrn2: { competitionId: "compId2", name: "compName2", sport: "sportUrn2" },
        },
        sports: {
          sportUrn1: { sportId: "sportId1", name: "sportName1" },
          sportUrn2: { sportId: "sportId2", name: "sportName2" },
        },
        sportsbookmarkets: {
          market1: {
            hierarchy: { sportevent: "eventUrn1" },
            marketId: "marketId1",
          },
        },
      },
      betting: {
        obbBetting: {
          totalStake: 10,
        },
      },
      router: {
        currentUrl: "currentUrl",
      },
      betslip: {
        obbTaggingMetadata: {
          legId1: {
            eventId: "null",
            competitionId: "null",
            competition: "null",
            sportId: "null",
            sport: "null",
            uniqueId: 9999,
          },
          legId2: {
            eventId: "null",
            competitionId: "null",
            competition: "null",
            sportId: "null",
            sport: "null",
            uniqueId: 9998,
          },
        },
      },
    };

    beforeEach(jest.clearAllMocks);

    it("should return the correct event payload", () => {
      const result = getObbPlaceBetSuccessEvent(obbAction, obbAppState);

      expect(buildPlacedBetEvent).toHaveBeenCalledTimes(2);
      expect(buildPlacedBetSelectionEvent).toHaveBeenCalledTimes(2);

      expect(buildPlacedBetEvent).toHaveBeenNthCalledWith(1, {
        price: "2.5",
        betType: "SINGLE",
        transactionId: "receipt123",
        currency: "eur",
        betDirection: "back",
        betId: "12345",
        totalStake: 10,
        eachWayIndicator: "no",
        module: "betslip",
        bettingProduct: "Sportsbook",
        numberOfLegs: 1,
        selectionsNumber: 1,
        numberOfLines: 1,
        numberOfPowerUps: 0,
        betTokenApplied: "null",
      });

      expect(buildPlacedBetEvent).toHaveBeenNthCalledWith(2, {
        price: "5.5",
        betType: "MULTIPLE",
        transactionId: "receipt456",
        currency: "eur",
        betDirection: "back",
        betId: "67890",
        totalStake: 10,
        eachWayIndicator: "no",
        module: "betslip",
        bettingProduct: "Sportsbook",
        numberOfLegs: 1,
        selectionsNumber: 2,
        numberOfLines: 1,
        numberOfPowerUps: 0,
        betTokenApplied: "null",
      });

      expect(buildPlacedBetSelectionEvent).toHaveBeenNthCalledWith(1, {
        sport: "null",
        sportId: "null",
        competition: "null",
        competitionId: "null",
        betType: "SINGLE",
        inPlayIndicator: "no",
        currency: "eur",
        betDirection: "back",
        priceAtSelection: "2.5",
        eventName: "event1",
        eventId: "null",
        antepostFlag: "no",
        totalStake: 10,
        eachWayIndicator: "no",
        module: "betslip",
        betSource: "getModuleData",
        selectionId: "null",
        selection: "part1 - outcome1",
        marketId: "null",
        selectionsNumber: 1,
        transactionId: "receipt123",
        betTokenApplied: "null",
        cashoutIndicator: "null",
        betResponse: "matched",
        betOriginLocation: "currentUrl",
        bettingProduct: "Sportsbook",
        betIdentifier: 9999,
        numberOfLegs: 1,
        numberOfLines: 1,
        market: "type1",
        numberOfPowerUps: 0,
        betId: "12345",
      });

      expect(buildPlacedBetSelectionEvent).toHaveBeenNthCalledWith(2, {
        sport: "null",
        sportId: "null",
        competition: "null",
        competitionId: "null",
        betType: "MULTIPLE",
        inPlayIndicator: "no",
        currency: "eur",
        betDirection: "back",
        priceAtSelection: "3.5 | 2.5",
        eventName: "event1 | event2",
        eventId: "null",
        antepostFlag: "no",
        totalStake: 10,
        eachWayIndicator: "no",
        module: "betslip",
        betSource: "getModuleData",
        selectionId: "null",
        selection: "part2 - outcome2",
        marketId: "null",
        selectionsNumber: 2,
        transactionId: "receipt456",
        betTokenApplied: "null",
        cashoutIndicator: "null",
        betResponse: "matched",
        betOriginLocation: "currentUrl",
        bettingProduct: "Sportsbook",
        betIdentifier: 9998,
        numberOfLegs: 1,
        numberOfLines: 1,
        market: "type2",
        numberOfPowerUps: 0,
        betId: "67890",
      });

      expect(result).toEqual([
        "placed bet event",
        "placed bet selection event",
        "placed bet event",
        "placed bet selection event",
      ]);
    });
  });
});
