import { sportsbookChatbotMessageFeedbackTrackingResolver } from "./sportsbook-chatbot-resolvers";

const sendEvent = jest.fn();

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => ({ viewTitle: "event", tabName: "bet ai" })),
}));

describe("SportsbookChatbot tracking resolvers", () => {
  beforeEach(jest.clearAllMocks);

  it("should send the like feedback GA4 interface event", () => {
    sportsbookChatbotMessageFeedbackTrackingResolver(
      {
        cardUrn: "card-urn",
        chatId: "chat-id",
        eventName: "premier league",
        messageUrn: "message-urn",
        type: "like",
      },
      sendEvent,
    );

    expect(sendEvent).toHaveBeenCalledWith({
      action: "clicked",
      element_text: "like",
      event: "interface",
      event_context: "premier league",
      game_filter: "null",
      module: "event - null - bets you can explore - null - bet ai",
      swimlane_type: "null",
    });
  });

  it("should send the dislike feedback GA4 interface event", () => {
    sportsbookChatbotMessageFeedbackTrackingResolver(
      {
        cardUrn: "card-urn",
        chatId: "chat-id",
        messageUrn: "message-urn",
        type: "dislike",
      },
      sendEvent,
    );

    expect(sendEvent).toHaveBeenCalledWith({
      action: "clicked",
      element_text: "dislike",
      event: "interface",
      event_context: "null",
      game_filter: "null",
      module: "event - null - bets you can explore - null - bet ai",
      swimlane_type: "null",
    });
  });
});
