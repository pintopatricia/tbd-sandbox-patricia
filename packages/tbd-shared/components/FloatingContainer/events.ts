type Events = {
  "@@UI/SPORTSBOOK_CHATBOT_MOUNTED": { urn: string };
  "@@UI/SPORTSBOOK_CHATBOT_UNMOUNTED": { urn: string };
  "@@UI/SPORTSBOOK_CHATBOT_INPUT_STATE_CHANGED": { state: "active" | "inactive" };
};

export type { Events as FloatingContainerEvents };
