import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import type { InterfaceEvent, NavigationEvent } from "tagging-library";
import { buildInterfaceEvent, buildNavigationEvent } from "tagging-library";
import { SportsbookChatbotEvents } from "@ppb/tbd-components-sports-betting/components/SportsbookChatbot/viewmodel/events";
import type { MessagePart } from "@ppb/tbd-components-sports-betting/components/SportsbookChatbot/viewmodel/SportsbookChatbotMessage.viewmodel";
import { getLayoutMetadata } from "@ppb/tbd-store/state/layout-snapshot";

const NULL_DIMENSION = "null";

type ContentType = "text" | "player stats" | "team stats" | "stats comparison" | "stats ranking";

const PART_CONTENT_TYPE_MAP: Partial<Record<Exclude<MessagePart["type"], "swimlane" | "bet-suggestion">, ContentType>> =
  {
    text: "text",
    "participant-stats-ranking": "stats ranking",
    "stats-comparison": "stats comparison",
  };

function collectContentTypes(parts: MessagePart[], seen: Set<ContentType>): void {
  for (const part of parts) {
    if (part.type === "swimlane") {
      collectContentTypes(part.items as MessagePart[], seen);
    } else if (part.type === "participant-stats") {
      const contentType = part.participantType === "team" ? "team stats" : "player stats";
      seen.add(contentType);
    } else if (part.type !== "bet-suggestion") {
      const contentType = PART_CONTENT_TYPE_MAP[part.type];
      if (contentType) seen.add(contentType);
    }
  }
}

function countBetSuggestions(parts: MessagePart[]): number {
  let count = 0;
  for (const part of parts) {
    if (part.type === "bet-suggestion") {
      count++;
    } else if (part.type === "swimlane") {
      count += countBetSuggestions(part.items as MessagePart[]);
    }
  }
  return count;
}

export const sportsbookChatbotNewMessageDisplayedResolver = (
  payload: SportsbookChatbotEvents["@@UI/SPORTSBOOK_CHATBOT_NEW_MESSAGE_DISPLAYED"],
  sendEvent: (event: InterfaceEvent) => void,
) => {
  let elementText: string;

  if (payload.type === "ERROR") {
    elementText = `error ${payload.errorType} - number of bets - 0`;
  } else {
    const { parts } = payload;
    const contentTypeSet = new Set<ContentType>();
    collectContentTypes(parts, contentTypeSet);
    const cardContentType = Array.from(contentTypeSet).join(", ");
    const betCount = countBetSuggestions(parts);
    elementText = `${cardContentType} - number of bets - ${betCount}`;
  }

  const cardMetadata = getLayoutMetadata(payload.cardUrn);

  sendEvent(
    buildInterfaceEvent({
      action: TaggingAction.DISPLAYED,
      elementText,
      eventContext: payload.eventName ?? "null",
      gameFilter: NULL_DIMENSION,
      module: `${cardMetadata.viewTitle || "event"} - null - bets you can explore - null - ${
        cardMetadata.tabName || "null"
      }`,
      swimlaneType: NULL_DIMENSION,
    }),
  );
};

export const sportsbookChatbotHistoryLoadedTrackingResolver = (
  payload: SportsbookChatbotEvents["@@UI/SPORTSBOOK_CHATBOT_HISTORY_LOADED"],
  sendEvent: (event: InterfaceEvent) => void,
) => {
  const cardMetadata = getLayoutMetadata(payload.urn);
  const SPORTSBOOK_CHATBOT_MODULE = `${cardMetadata.viewTitle || "event"} - null - bets you can explore - null - ${
    cardMetadata.tabName || NULL_DIMENSION
  }`;

  sendEvent(
    buildInterfaceEvent({
      action: TaggingAction.DISPLAYED,
      elementText: "previous prompt",
      eventContext: payload.eventName ?? NULL_DIMENSION,
      gameFilter: NULL_DIMENSION,
      module: SPORTSBOOK_CHATBOT_MODULE,
      swimlaneType: NULL_DIMENSION,
    }),
  );
};

export function sportsbookChatbotSuggestedPromptSelectedTrackingResolver(
  payload: SportsbookChatbotEvents["@@UI/SPORTSBOOK_CHATBOT_SUGGESTED_PROMPT_SELECTED"],
  sendEvent: (payload: InterfaceEvent) => void,
) {
  const { viewTitle, tabName } = getLayoutMetadata(payload.cardUrn);
  const isPebble = payload.source === "pebble";
  const moduleSegment = isPebble ? "bets you can explore" : "start with a prompt";

  sendEvent(
    buildInterfaceEvent({
      action: TaggingAction.CLICKED,
      elementText: isPebble ? `pebble - ${payload.prompt}` : payload.prompt,
      eventContext: payload.eventName ?? NULL_DIMENSION,
      module: `${viewTitle || "event"} - null - ${moduleSegment} - null - ${tabName || NULL_DIMENSION}`,
    }),
  );
}

export function sportsbookChatbotPromptInputTrackingResolver(
  payload: SportsbookChatbotEvents["@@UI/SPORTSBOOK_CHATBOT_PROMPT_INPUT"],
  sendEvent: (payload: InterfaceEvent) => void,
) {
  const { viewTitle, tabName } = getLayoutMetadata(payload.cardUrn);

  sendEvent(
    buildInterfaceEvent({
      action: TaggingAction.CLICKED,
      elementText: "enter",
      eventContext: payload.eventName ?? NULL_DIMENSION,
      module: `${viewTitle || "event"} - null - prompt input - null - ${tabName || NULL_DIMENSION}`,
    }),
  );
}

function resolveInputOpenedDisplay(source: SportsbookChatbotEvents["@@UI/SPORTSBOOK_CHATBOT_INPUT_OPENED"]["source"]): {
  elementText: string;
  moduleSegment: string;
} {
  if (source === "chat") return { elementText: "floating icon", moduleSegment: "bets you can explore" };
  if (source === "landing") return { elementText: "ask me about this match", moduleSegment: "prompt input" };
  return { elementText: "enter", moduleSegment: "prompt input" };
}

export function sportsbookChatbotInputOpenedTrackingResolver(
  payload: SportsbookChatbotEvents["@@UI/SPORTSBOOK_CHATBOT_INPUT_OPENED"],
  sendEvent: (payload: InterfaceEvent) => void,
) {
  const { viewTitle, tabName } = getLayoutMetadata(payload.cardUrn);
  const { elementText, moduleSegment } = resolveInputOpenedDisplay(payload.source);

  sendEvent(
    buildInterfaceEvent({
      action: TaggingAction.OPENED,
      elementText,
      eventContext: payload.eventName ?? NULL_DIMENSION,
      module: `${viewTitle || "event"} - null - ${moduleSegment} - null - ${tabName || NULL_DIMENSION}`,
    }),
  );
}

function resolveTermsAndConditionsDisplay(
  source: SportsbookChatbotEvents["@@UI/SPORTSBOOK_CHATBOT_TERMS_AND_CONDITIONS_CLICK"]["source"],
): { elementText: string; moduleSegment: string } {
  if (source === "chat") {
    return { elementText: "bet ai terms and conditions", moduleSegment: NULL_DIMENSION };
  }
  return { elementText: "terms and conditions", moduleSegment: "how bet ai works" };
}

export function sportsbookChatbotTermsAndConditionsClickTrackingResolver(
  payload: SportsbookChatbotEvents["@@UI/SPORTSBOOK_CHATBOT_TERMS_AND_CONDITIONS_CLICK"],
  sendEvent: (payload: NavigationEvent) => void,
) {
  const { viewTitle, tabName, verticalPosition } = getLayoutMetadata(payload.cardUrn);
  const { elementText, moduleSegment } = resolveTermsAndConditionsDisplay(payload.source);

  sendEvent(
    buildNavigationEvent({
      action: TaggingAction.NAVIGATED_TO,
      destinationUrl: payload.destinationUrl,
      elementText,
      eventContext: payload.eventName ?? NULL_DIMENSION,
      module: `${viewTitle || "event"} - null - ${moduleSegment} - null - ${tabName || NULL_DIMENSION}`,
      position: NULL_DIMENSION,
      moduleDisplayOrder: verticalPosition?.toString() ?? NULL_DIMENSION,
    }),
  );
}

export function sportsbookChatbotMarketPromoExpandedTrackingResolver(
  payload: SportsbookChatbotEvents["@@UI/SPORTSBOOK_CHATBOT_MARKET_PROMO_EXPANDED"],
  sendEvent: (payload: InterfaceEvent) => void,
) {
  const { viewTitle, tabName } = getLayoutMetadata(payload.cardUrn);

  sendEvent(
    buildInterfaceEvent({
      action: TaggingAction.OPENED,
      elementText: "how bet ai works",
      eventContext: payload.eventName ?? NULL_DIMENSION,
      module: `${viewTitle || "event"} - null - how bet ai works - null - ${tabName || NULL_DIMENSION}`,
    }),
  );
}
