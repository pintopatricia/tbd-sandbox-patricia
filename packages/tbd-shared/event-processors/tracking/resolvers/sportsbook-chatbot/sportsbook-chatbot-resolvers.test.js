import {
  sportsbookChatbotHistoryLoadedTrackingResolver,
  sportsbookChatbotNewMessageDisplayedResolver,
  sportsbookChatbotSuggestedPromptSelectedTrackingResolver,
  sportsbookChatbotPromptInputTrackingResolver,
  sportsbookChatbotInputOpenedTrackingResolver,
  sportsbookChatbotTermsAndConditionsClickTrackingResolver,
  sportsbookChatbotMarketPromoExpandedTrackingResolver,
} from "./sportsbook-chatbot-resolvers";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { buildInterfaceEvent } from "tagging-library";

const sendEvent = jest.fn();

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => ({ viewTitle: "event", tabName: "bet ai" })),
}));

jest.mock("tagging-library", () => ({
  buildInterfaceEvent: jest.fn((config) => config),
  buildNavigationEvent: jest.fn((config) => config),
}));

describe("sportsbookChatbotNewMessageDisplayedResolver", () => {
  beforeEach(jest.clearAllMocks);

  const basePayload = {
    cardUrn: "card-urn",
    eventName: "Man Utd v Arsenal",
  };

  describe("successful response", () => {
    it("should send 'text' when the message contains only text parts", () => {
      sportsbookChatbotNewMessageDisplayedResolver(
        {
          ...basePayload,
          type: "SUCCESS",
          parts: [{ type: "text", text: "Here are some bets" }],
        },
        sendEvent,
      );

      expect(sendEvent).toHaveBeenCalledWith({
        action: TaggingAction.DISPLAYED,
        elementText: "text - number of bets - 0",
        eventContext: "Man Utd v Arsenal",
        gameFilter: "null",
        module: "event - null - bets you can explore - null - bet ai",
        swimlaneType: "null",
      });
    });

    it("should concatenate all unique content types excluding bet-suggestions", () => {
      sportsbookChatbotNewMessageDisplayedResolver(
        {
          ...basePayload,
          type: "SUCCESS",
          parts: [
            { type: "text", text: "Here are some bets" },
            { type: "participant-stats", participantType: "team", stats: [] },
            {
              type: "stats-comparison",
              participantA: { name: "A" },
              participantB: { name: "B" },
              stats: [],
            },
            { type: "bet-suggestion", selections: [], odds: null },
            { type: "bet-suggestion", selections: [], odds: null },
          ],
        },
        sendEvent,
      );

      expect(sendEvent).toHaveBeenCalledWith({
        action: TaggingAction.DISPLAYED,
        elementText: "text, team stats, stats comparison - number of bets - 2",
        eventContext: "Man Utd v Arsenal",
        gameFilter: "null",
        module: "event - null - bets you can explore - null - bet ai",
        swimlaneType: "null",
      });
    });

    it("should not repeat content types when the same type appears more than once", () => {
      sportsbookChatbotNewMessageDisplayedResolver(
        {
          ...basePayload,
          type: "SUCCESS",
          parts: [
            { type: "text", text: "intro" },
            { type: "participant-stats", participantType: "player", stats: [] },
            { type: "text", text: "outro" },
            { type: "participant-stats", participantType: "player", stats: [] },
          ],
        },
        sendEvent,
      );

      expect(sendEvent).toHaveBeenCalledWith(
        expect.objectContaining({ elementText: "text, player stats - number of bets - 0" }),
      );
    });

    it("should count bet suggestions inside swimlane items", () => {
      sportsbookChatbotNewMessageDisplayedResolver(
        {
          ...basePayload,
          type: "SUCCESS",
          parts: [
            { type: "text", text: "intro" },
            {
              type: "swimlane",
              items: [
                { type: "bet-suggestion", selections: [], odds: null },
                { type: "participant-stats", participantType: "player", stats: [] },
              ],
            },
          ],
        },
        sendEvent,
      );

      expect(sendEvent).toHaveBeenCalledWith(
        expect.objectContaining({ elementText: "text, player stats - number of bets - 1" }),
      );
    });

    it("should set eventContext to 'null' when eventName is null", () => {
      sportsbookChatbotNewMessageDisplayedResolver(
        {
          ...basePayload,
          type: "SUCCESS",
          eventName: null,
          parts: [{ type: "text", text: "Here are some bets" }],
        },
        sendEvent,
      );

      expect(sendEvent).toHaveBeenCalledWith(expect.objectContaining({ eventContext: "null" }));
    });

    it("should use viewTitle and tabName from getLayoutMetadata for module", () => {
      getLayoutMetadata.mockReturnValueOnce({ viewTitle: "sport", tabName: "markets" });

      sportsbookChatbotNewMessageDisplayedResolver(
        {
          ...basePayload,
          type: "SUCCESS",
          parts: [{ type: "text", text: "Here are some bets" }],
        },
        sendEvent,
      );

      expect(sendEvent).toHaveBeenCalledWith(
        expect.objectContaining({ module: "sport - null - bets you can explore - null - markets" }),
      );
    });

    it("should fall back to 'event' and 'null' in module when getLayoutMetadata returns no viewTitle or tabName", () => {
      getLayoutMetadata.mockReturnValueOnce({});

      sportsbookChatbotNewMessageDisplayedResolver(
        {
          ...basePayload,
          type: "SUCCESS",
          parts: [{ type: "text", text: "Here are some bets" }],
        },
        sendEvent,
      );

      expect(sendEvent).toHaveBeenCalledWith(
        expect.objectContaining({ module: "event - null - bets you can explore - null - null" }),
      );
    });
  });

  describe("error response", () => {
    it("should send error generic elementText when errorType is 'generic'", () => {
      sportsbookChatbotNewMessageDisplayedResolver(
        {
          ...basePayload,
          type: "ERROR",
          errorType: "generic",
        },
        sendEvent,
      );

      expect(sendEvent).toHaveBeenCalledWith({
        action: TaggingAction.DISPLAYED,
        elementText: "error generic - number of bets - 0",
        eventContext: "Man Utd v Arsenal",
        gameFilter: "null",
        module: "event - null - bets you can explore - null - bet ai",
        swimlaneType: "null",
      });
    });

    it("should send error timeout elementText when errorType is 'timeout'", () => {
      sportsbookChatbotNewMessageDisplayedResolver(
        {
          ...basePayload,
          type: "ERROR",
          errorType: "timeout",
        },
        sendEvent,
      );

      expect(sendEvent).toHaveBeenCalledWith({
        action: TaggingAction.DISPLAYED,
        elementText: "error timeout - number of bets - 0",
        eventContext: "Man Utd v Arsenal",
        gameFilter: "null",
        module: "event - null - bets you can explore - null - bet ai",
        swimlaneType: "null",
      });
    });
  });
});

describe("sportsbookChatbotHistoryLoadedTrackingResolver", () => {
  beforeEach(jest.clearAllMocks);

  const basePayload = {
    urn: "card-urn",
    chatId: "chat-id",
    eventName: "Man Utd v Arsenal",
  };

  it("should send the previous prompt displayed GA4 interface event when history is available", () => {
    sportsbookChatbotHistoryLoadedTrackingResolver({ ...basePayload, hasHistory: true }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith({
      action: TaggingAction.DISPLAYED,
      elementText: "previous prompt",
      eventContext: "Man Utd v Arsenal",
      gameFilter: "null",
      module: "event - null - bets you can explore - null - bet ai",
      swimlaneType: "null",
    });
  });

  it("should set eventContext to 'null' when eventName is null", () => {
    sportsbookChatbotHistoryLoadedTrackingResolver({ ...basePayload, eventName: null, hasHistory: true }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(expect.objectContaining({ eventContext: "null" }));
  });

  it("should send the previous prompt displayed GA4 interface event when history is unavailable", () => {
    sportsbookChatbotHistoryLoadedTrackingResolver({ ...basePayload, hasHistory: false }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith({
      action: TaggingAction.DISPLAYED,
      elementText: "previous prompt",
      eventContext: "Man Utd v Arsenal",
      gameFilter: "null",
      module: "event - null - bets you can explore - null - bet ai",
      swimlaneType: "null",
    });
  });
});

describe("sportsbookChatbotSuggestedPromptSelectedTrackingResolver", () => {
  beforeEach(jest.clearAllMocks);

  const basePayload = {
    cardUrn: "card-urn",
    eventName: "Man Utd v Arsenal",
    prompt: "Who should I bet on?",
  };

  it("should send a clicked event with the prompt as elementText when source is landing", () => {
    sportsbookChatbotSuggestedPromptSelectedTrackingResolver({ ...basePayload, source: "landing" }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith({
      action: "clicked",
      elementText: "Who should I bet on?",
      eventContext: "Man Utd v Arsenal",
      module: "event - null - start with a prompt - null - bet ai",
    });
  });

  it("should prefix elementText with 'pebble - ' and use 'bets you can explore' module segment when source is pebble", () => {
    sportsbookChatbotSuggestedPromptSelectedTrackingResolver({ ...basePayload, source: "pebble" }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith({
      action: "clicked",
      elementText: "pebble - Who should I bet on?",
      eventContext: "Man Utd v Arsenal",
      module: "event - null - bets you can explore - null - bet ai",
    });
  });

  it("should set eventContext to 'null' when eventName is null", () => {
    sportsbookChatbotSuggestedPromptSelectedTrackingResolver(
      { ...basePayload, source: "landing", eventName: null },
      sendEvent,
    );

    expect(sendEvent).toHaveBeenCalledWith(expect.objectContaining({ eventContext: "null" }));
  });

  it("should use viewTitle and tabName from getLayoutMetadata in module", () => {
    getLayoutMetadata.mockReturnValueOnce({ viewTitle: "sport", tabName: "markets" });

    sportsbookChatbotSuggestedPromptSelectedTrackingResolver({ ...basePayload, source: "landing" }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ module: "sport - null - start with a prompt - null - markets" }),
    );
  });

  it("should fall back to 'event' and 'null' in module when getLayoutMetadata returns no viewTitle or tabName", () => {
    getLayoutMetadata.mockReturnValueOnce({});

    sportsbookChatbotSuggestedPromptSelectedTrackingResolver({ ...basePayload, source: "pebble" }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ module: "event - null - bets you can explore - null - null" }),
    );
  });
});

describe("sportsbookChatbotPromptInputTrackingResolver", () => {
  beforeEach(jest.clearAllMocks);

  const basePayload = {
    cardUrn: "card-urn",
    eventName: "Man Utd v Arsenal",
  };

  it("should send a clicked 'enter' event in the 'prompt input' module segment", () => {
    sportsbookChatbotPromptInputTrackingResolver(basePayload, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith({
      action: "clicked",
      elementText: "enter",
      eventContext: "Man Utd v Arsenal",
      module: "event - null - prompt input - null - bet ai",
    });
  });

  it("should set eventContext to 'null' when eventName is null", () => {
    sportsbookChatbotPromptInputTrackingResolver({ ...basePayload, eventName: null }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(expect.objectContaining({ eventContext: "null" }));
  });

  it("should use viewTitle and tabName from getLayoutMetadata in module", () => {
    getLayoutMetadata.mockReturnValueOnce({ viewTitle: "sport", tabName: "markets" });

    sportsbookChatbotPromptInputTrackingResolver(basePayload, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ module: "sport - null - prompt input - null - markets" }),
    );
  });

  it("should fall back to 'event' and 'null' in module when getLayoutMetadata returns no viewTitle or tabName", () => {
    getLayoutMetadata.mockReturnValueOnce({});

    sportsbookChatbotPromptInputTrackingResolver(basePayload, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ module: "event - null - prompt input - null - null" }),
    );
  });
});

describe("sportsbookChatbotInputOpenedTrackingResolver", () => {
  beforeEach(jest.clearAllMocks);

  const basePayload = {
    cardUrn: "card-urn",
    eventName: "Man Utd v Arsenal",
  };

  it("should send an opened 'ask me about this match' event in the 'prompt input' segment when source is landing", () => {
    sportsbookChatbotInputOpenedTrackingResolver({ ...basePayload, source: "landing" }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith({
      action: "opened",
      elementText: "ask me about this match",
      eventContext: "Man Utd v Arsenal",
      module: "event - null - prompt input - null - bet ai",
    });
  });

  it("should send an opened 'floating icon' event in the 'bets you can explore' segment when source is chat", () => {
    sportsbookChatbotInputOpenedTrackingResolver({ ...basePayload, source: "chat" }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith({
      action: "opened",
      elementText: "floating icon",
      eventContext: "Man Utd v Arsenal",
      module: "event - null - bets you can explore - null - bet ai",
    });
  });

  it("should set eventContext to 'null' when eventName is null", () => {
    sportsbookChatbotInputOpenedTrackingResolver({ ...basePayload, source: "chat", eventName: null }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(expect.objectContaining({ eventContext: "null" }));
  });

  it("should use viewTitle and tabName from getLayoutMetadata in module", () => {
    getLayoutMetadata.mockReturnValueOnce({ viewTitle: "sport", tabName: "markets" });

    sportsbookChatbotInputOpenedTrackingResolver({ ...basePayload, source: "chat" }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ module: "sport - null - bets you can explore - null - markets" }),
    );
  });

  it("should fall back to 'event' and 'null' in module when getLayoutMetadata returns no viewTitle or tabName", () => {
    getLayoutMetadata.mockReturnValueOnce({});

    sportsbookChatbotInputOpenedTrackingResolver({ ...basePayload, source: "landing" }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ module: "event - null - prompt input - null - null" }),
    );
  });
});

describe("sportsbookChatbotTermsAndConditionsClickTrackingResolver", () => {
  beforeEach(jest.clearAllMocks);

  const basePayload = {
    cardUrn: "card-urn",
    eventName: "Man Utd v Arsenal",
    destinationUrl: "https://support.skybet.com/terms",
  };

  it("should send a navigated-to event with 'terms and conditions' and how-bet-ai-works module when source is landing", () => {
    sportsbookChatbotTermsAndConditionsClickTrackingResolver({ ...basePayload, source: "landing" }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith({
      action: TaggingAction.NAVIGATED_TO,
      destinationUrl: "https://support.skybet.com/terms",
      elementText: "terms and conditions",
      eventContext: "Man Utd v Arsenal",
      module: "event - null - how bet ai works - null - bet ai",
      position: "null",
      moduleDisplayOrder: "null",
    });
  });

  it("should send a navigated-to event with 'bet ai terms and conditions' and no how-bet-ai-works segment when source is chat", () => {
    sportsbookChatbotTermsAndConditionsClickTrackingResolver({ ...basePayload, source: "chat" }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith({
      action: TaggingAction.NAVIGATED_TO,
      destinationUrl: "https://support.skybet.com/terms",
      elementText: "bet ai terms and conditions",
      eventContext: "Man Utd v Arsenal",
      module: "event - null - null - null - bet ai",
      position: "null",
      moduleDisplayOrder: "null",
    });
  });

  it("should use tabName from getLayoutMetadata in module", () => {
    getLayoutMetadata.mockReturnValueOnce({ viewTitle: "sport", tabName: "markets" });

    sportsbookChatbotTermsAndConditionsClickTrackingResolver({ ...basePayload, source: "landing" }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ module: "sport - null - how bet ai works - null - markets" }),
    );
  });

  it("should set eventContext to 'null' when eventName is null", () => {
    sportsbookChatbotTermsAndConditionsClickTrackingResolver(
      { ...basePayload, source: "landing", eventName: null },
      sendEvent,
    );

    expect(sendEvent).toHaveBeenCalledWith(expect.objectContaining({ eventContext: "null" }));
  });

  it("should use verticalPosition from getLayoutMetadata as moduleDisplayOrder", () => {
    getLayoutMetadata.mockReturnValueOnce({ viewTitle: "event", verticalPosition: 3 });

    sportsbookChatbotTermsAndConditionsClickTrackingResolver({ ...basePayload, source: "chat" }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(expect.objectContaining({ moduleDisplayOrder: "3" }));
  });

  it("should fall back to 'event' in module when getLayoutMetadata returns no viewTitle", () => {
    getLayoutMetadata.mockReturnValueOnce({});

    sportsbookChatbotTermsAndConditionsClickTrackingResolver({ ...basePayload, source: "chat" }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(expect.objectContaining({ module: "event - null - null - null - null" }));
  });
});

describe("sportsbookChatbotMarketPromoExpandedTrackingResolver", () => {
  beforeEach(jest.clearAllMocks);

  const basePayload = {
    cardUrn: "card-urn",
    eventName: "Man Utd v Arsenal",
  };

  it("should send an opened 'how bet ai works' interface event", () => {
    sportsbookChatbotMarketPromoExpandedTrackingResolver(basePayload, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith({
      action: TaggingAction.OPENED,
      elementText: "how bet ai works",
      eventContext: "Man Utd v Arsenal",
      module: "event - null - how bet ai works - null - bet ai",
    });
  });

  it("should set eventContext to 'null' when eventName is null", () => {
    sportsbookChatbotMarketPromoExpandedTrackingResolver({ ...basePayload, eventName: null }, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(expect.objectContaining({ eventContext: "null" }));
  });

  it("should use viewTitle and tabName from getLayoutMetadata in module", () => {
    getLayoutMetadata.mockReturnValueOnce({ viewTitle: "sport", tabName: "markets" });

    sportsbookChatbotMarketPromoExpandedTrackingResolver(basePayload, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ module: "sport - null - how bet ai works - null - markets" }),
    );
  });

  it("should fall back to 'event' and 'null' in module when getLayoutMetadata returns no viewTitle or tabName", () => {
    getLayoutMetadata.mockReturnValueOnce({});

    sportsbookChatbotMarketPromoExpandedTrackingResolver(basePayload, sendEvent);

    expect(sendEvent).toHaveBeenCalledWith(
      expect.objectContaining({ module: "event - null - how bet ai works - null - null" }),
    );
  });
});
