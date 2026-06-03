import { FunctionComponent } from "react";
import { SportsbookMarketStatus } from "@ppb/tbd-store";
import { InlineSportsbookMarket } from "@ppb/the-wall-native";
import URN from "@ppb/tbd-store/state/layout/URN";
import InlineMarketRunner from "../../InlineMarketRunner/InlineMarketRunner.native";
import { SbkMarketRunner } from "../../SportsbookRunner/SportsbookRunner.types";

type ComponentProps = {
  cardUrn: URN;
  marketUrn: URN;
  runners: SbkMarketRunner[];
  status: SportsbookMarketStatus;
};

/**
 * Function component that wraps the inline sportsbook market component
 *
 * @param marketUrn The market Urn
 * @param status The market status
 * @param runners The market runners
 * @param cardUrn The card Urn
 * @returns The Coupon component
 */
const Coupon: FunctionComponent<ComponentProps> = ({ marketUrn, status, runners, cardUrn }) => (
  <InlineSportsbookMarket numberOfRunners={runners.length}>
    {runners.map((runner, idx) => (
      <InlineMarketRunner
        key={runner.urn}
        runner={runner}
        marketUrn={marketUrn}
        cardUrn={cardUrn}
        marketOpen={status === "OPEN"}
        runnerIdx={idx}
        numberOfRunners={runners.length}
      />
    ))}
  </InlineSportsbookMarket>
);

export default Coupon;
