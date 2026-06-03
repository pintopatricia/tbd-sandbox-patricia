import { DisplayNameTranslationKey } from "../../layout/cardgroups/CardGroup.types";
import URN from "../../layout/URN";

type VirtualSportKind = "FOOTBALL" | "RACING" | "OTHER";

export type VirtualSport = {
  typename: "VirtualSport";
  name: DisplayNameTranslationKey;
  sportId: number;
  urn: URN;
  kind: VirtualSportKind;
};

export type VirtualSports = {
  [urn: string]: VirtualSport;
};
