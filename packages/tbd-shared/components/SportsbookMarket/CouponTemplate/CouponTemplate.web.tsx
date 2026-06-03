import { FunctionComponent } from "react";
import { SportsbookMarketStatus } from "@ppb/tbd-store";
import { InlineSportsbookMarket } from "@ppb/the-wall-web";
import URN from "@ppb/tbd-store/state/layout/URN";
import { OnIntersectCallback } from "@ppb/the-wall-common/types/useOnIntersect.web.types";
import INTERSECTION_CONFIG from "../../../config/cards-intersection";
import InlineMarketRunner from "../../InlineMarketRunner/InlineMarketRunner.web";
import { SbkMarketRunner } from "../../SportsbookRunner/SportsbookRunner.types";

type ComponentProps = {
  cardUrn: URN;
  marketUrn: URN;
  runners: SbkMarketRunner[];
  status: SportsbookMarketStatus;
  onIntersectCallback: OnIntersectCallback;
};

/**
 * Function component that wraps the inline sportsbook market component
 *
 * @param marketUrn The market Urn
 * @param status The market status
 * @param runners The market runners
 * @param cardUrn The card Urn
 * @param onIntersectCallback The On Intersect Callback
 * @returns The Coupon component
 */
const Coupon: FunctionComponent<ComponentProps> = ({ marketUrn, status, runners, cardUrn, onIntersectCallback }) => (
  <InlineSportsbookMarket
    intersectOffset={INTERSECTION_CONFIG.rootMargin}
    onIntersectCallback={onIntersectCallback}
    numberOfRunners={runners.length}
  >
    {runners.map(({ urn, name, handicapLabel }) => (
      <InlineMarketRunner
        key={urn}
        runner={{ urn, name, handicapLabel }}
        marketUrn={marketUrn}
        marketOpen={status === "OPEN"}
        cardUrn={cardUrn}
      />
    ))}
  </InlineSportsbookMarket>
);

export default Coupon;
