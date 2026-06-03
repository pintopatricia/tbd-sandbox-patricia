import { buildAddedSelectionEvent, buildBetslipEvent, buildInterfaceEvent } from "tagging-library";
import {
  upsellSuggestionsItemClickTrackingResolver,
  upsellSuggestionsLoadedTrackingResolver,
} from "./upsell-suggestions-resolvers";
import { Product } from "@ppb/tbd-store";
import { BetDirection } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";

jest.mock("tagging-library", () => ({
  buildAddedSelectionEvent: jest.fn(),
  buildBetslipEvent: jest.fn(),
  buildInterfaceEvent: jest.fn(),
}));

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn().mockReturnValue({
    getState: jest.fn(),
  }),
}));

jest.mock("@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers", () => ({
  getSportsbookRunnerMetrics: jest.fn().mockReturnValue({
    selection: "Selection Name",
    selection_id: 54321,
    competition_name: "Competition name",
    competition_id: 12345,
    event_name: "Event name",
    event_id: 67890,
    market_name: "Market name",
    market_id: 98765,
    sport_name: "Sport name",
    sport_id: 56789,
    in_play_indicator: false,
    price_at_selection: 2.5,
    antepost_flag: false,
  }),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn().mockReturnValue({
    currencyCode: "GBP",
  }),
}));

jest.mock("@ppb/tbd-store/helpers/betting", () => ({
  getRunnerUniqueTaggingId: jest.fn().mockReturnValue("unique-tagging-id"),
}));

const mockPayloadOnClickPayload = {
  runnerUrn: "urn:book:1:runner:12345",
  marketUrn: "urn:book:1:market:67890",
  odds: null,
  position: "1",
  isRemovingFromBetslip: false,
};

const mockRunnerMetrics = {
  selection: "Selection Name",
  selection_id: 54321,
  competition_name: "Competition name",
  competition_id: 12345,
  event_name: "Event name",
  event_id: 67890,
  market_name: "Market name",
  market_id: 98765,
  sport_name: "Sport name",
  sport_id: 56789,
  in_play_indicator: false,
  price_at_selection: 2.5,
  antepost_flag: false,
};

describe("UpsellSuggestions resolvers", () => {
  const sendEvent = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("upsellSuggestionsItemClickTrackingResolver", () => {
    it("should call sendEvent when adding upsell suggestion to betslip", () => {
      buildAddedSelectionEvent.mockReturnValue("add upsell suggestion to betslip");
      upsellSuggestionsItemClickTrackingResolver(mockPayloadOnClickPayload, sendEvent);

      expect(buildAddedSelectionEvent).toHaveBeenCalledWith({
        antepostFlag: mockRunnerMetrics.antepost_flag,
        betDirection: BetDirection.Back,
        betIdentifier: "unique-tagging-id",
        bettingProduct: Product.Sportsbook,
        competition: mockRunnerMetrics.competition_name,
        competitionId: mockRunnerMetrics.competition_id?.toString(),
        currency: "GBP",
        eventId: mockRunnerMetrics.event_id.toString(),
        eventName: mockRunnerMetrics.event_name,
        inPlayIndicator: mockRunnerMetrics.in_play_indicator,
        market: mockRunnerMetrics.market_name,
        marketId: mockRunnerMetrics.market_id,
        module: "betslip - upsell",
        moduleDisplayOrder: "null",
        position: "1",
        priceAtSelection: mockRunnerMetrics.price_at_selection?.toString(),
        selection: mockRunnerMetrics.selection,
        selectionId: mockRunnerMetrics.selection_id.toString(),
        sport: mockRunnerMetrics.sport_name,
        sportId: mockRunnerMetrics.sport_id?.toString(),
      });

      expect(buildAddedSelectionEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("add upsell suggestion to betslip");
      expect(sendEvent).toHaveBeenCalledTimes(1);
    });

    it("should call sendEvent when removing upsell suggestion from betslip", () => {
      buildBetslipEvent.mockReturnValue("remove upsell suggestion from betslip");
      const payload = {
        ...mockPayloadOnClickPayload,
        isRemovingFromBetslip: true,
      };
      upsellSuggestionsItemClickTrackingResolver(payload, sendEvent);

      expect(buildBetslipEvent).toHaveBeenCalledWith({
        action: "removed selection",
        betId: "null",
        selection: mockRunnerMetrics.selection,
        selectionId: mockRunnerMetrics.selection_id.toString(),
        bettingProduct: Product.Sportsbook,
      });

      expect(buildBetslipEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("remove upsell suggestion from betslip");
      expect(sendEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("upsellSuggestionsLoadedTrackingResolver", () => {
    it("should call sendEvent with the correct payload", () => {
      const sendEvent = jest.fn();
      buildInterfaceEvent.mockReturnValue("display upsell suggestions");

      upsellSuggestionsLoadedTrackingResolver(sendEvent);

      expect(buildInterfaceEvent).toHaveBeenCalledWith({
        action: "displayed",
        elementText: "buildabet upsell",
        module: "betslip - upsell",
      });

      expect(buildInterfaceEvent).toHaveBeenCalledTimes(1);
      expect(sendEvent).toHaveBeenCalledWith("display upsell suggestions");
      expect(sendEvent).toHaveBeenCalledTimes(1);
    });
  });
});
