import { PredictsMessage, PredictsMessageType } from "./Predicts.types";

export function isPredictsMessage(data: unknown): data is PredictsMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    Object.values(PredictsMessageType).includes((data as PredictsMessage).type)
  );
}
