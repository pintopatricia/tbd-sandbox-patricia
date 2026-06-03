import URN from "@ppb/tbd-store/state/layout/URN";
import { SbkMarketRunner } from "../SportsbookRunner/SportsbookRunner.types";

export type InlineMarketRunnerNativeViewModel = {
  runner: SbkMarketRunner;
  cardUrn: URN;
  marketOpen: boolean;
  marketUrn: URN;
  isSecondaryLabelRunnerName?: boolean;
  isSecondaryLabelUppercase?: boolean;
  runnerIdx: number;
  numberOfRunners: number;
  showHandicap?: boolean;
};
