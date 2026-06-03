import { SportsbookChatbotEvents } from "@ppb/tbd-components-sports-betting/components/SportsbookChatbot/viewmodel/events";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";
import type { InterfaceEvent } from "tagging-library";
import { buildInterfaceEvent } from "tagging-library";

const NULL_DIMENSION = "null";

export const sportsbookChatbotMessageFeedbackTrackingResolver = (
  payload: SportsbookChatbotEvents["@@UI/SPORTSBOOK_CHATBOT_MESSAGE_FEEDBACK_SENT"],
  sendEvent: (event: InterfaceEvent) => void,
) => {
  if (!payload.cardUrn) {
    return;
  }

  const elementText = payload.type === "dislike" ? "dislike" : "like";
  const eventName = payload.eventName || NULL_DIMENSION;
  const cardMetadata = getLayoutMetadata(payload.cardUrn);
  const SPORTSBOOK_CHATBOT_MODULE = `${cardMetadata.viewTitle || "event"} - null - bets you can explore - null - ${
    cardMetadata.tabName || "null"
  }`;

  sendEvent(
    buildInterfaceEvent({
      action: TaggingAction.CLICKED,
      elementText,
      eventContext: eventName,
      gameFilter: NULL_DIMENSION,
      module: SPORTSBOOK_CHATBOT_MODULE,
      swimlaneType: NULL_DIMENSION,
    }),
  );
};
