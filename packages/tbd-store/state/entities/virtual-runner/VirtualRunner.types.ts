import URN from "../../layout/URN";
import { SportsbookOdds } from "../SportsbookOdds.types";

export type VirtualRunner = {
  typename: "VirtualRunner";
  name: string;
  odds: SportsbookOdds;
  urn: URN;
  selectionId: number;
  humanName?: string;
  racerIndex?: number;
  humanTexture: string;
  selectionTexture: string;
};

export type VirtualRunners = {
  [urn: string]: VirtualRunner;
};
