import URN from "@ppb/tbd-store/state/layout/URN";
import { SbkMarketRunner } from "../SportsbookRunner/SportsbookRunner.types";

export type InlineMarketRunnerWebViewModel = {
  runner: SbkMarketRunner;
  cardUrn: URN;
  marketOpen: boolean;
  marketUrn: URN;
  isSecondaryLabelRunnerName?: boolean;
  isSecondaryLabelUppercase?: boolean;
  showHandicap?: boolean;
};
