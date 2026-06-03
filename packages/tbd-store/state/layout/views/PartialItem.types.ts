import type { ViewItemEdge } from "../../../clients/catalogue/catalogue-response-types";
import URN from "../URN";

export type PartialItem = {
  urn: URN;
  typename: string;
  theme?: ViewItemEdge["theme"];
  red7Scoreboard?: {
    fullURL?: string | null;
    origin?: string | null;
  } | null;
};
