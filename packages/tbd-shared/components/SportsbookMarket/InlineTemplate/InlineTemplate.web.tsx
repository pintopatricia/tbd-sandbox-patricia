import { SportsbookMarketStatus } from "@ppb/tbd-store";
import URN from "@ppb/tbd-store/state/layout/URN";
import {
  InlineSportsbookMarketBlurbInfoProps,
  InlineSportsbookMarketBlurbPromotionProps,
  SportsbookMarketProps,
} from "@ppb/the-wall-common/types";
import { OnIntersectCallback } from "@ppb/the-wall-common/types/useOnIntersect.web.types";
import { InlineSportsbookMarket } from "@ppb/the-wall-web";
import { FunctionComponent } from "react";
import { MarketCard } from "@ppb/tbd-store/state/layout/cards/Card.types";
import INTERSECTION_CONFIG from "../../../config/cards-intersection";
import InlineMarketRunner from "../../InlineMarketRunner/InlineMarketRunner.web";
import { SbkMarketRunner } from "../../SportsbookRunner/SportsbookRunner.types";
import ConnectedNinetyMinuteBlurb from "../NinetyMinuteBlurb";
import NinetyMinuteBlurb from "../NinetyMinuteBlurb/NinetyMinuteBlurb.web";

type ComponentProps = {
  cardUrn: URN;
  marketUrn: URN;
  runners: SbkMarketRunner[];
  status: SportsbookMarketStatus;
  isUppercase?: boolean;
  show90MinBlurb?: boolean;
  onIntersectCallback: OnIntersectCallback;
} & Pick<SportsbookMarketProps, "onMarketPromoClick" | "onLinkClick"> &
  Pick<MarketCard, "infoBlurbs" | "marketPromo">;

/**
 * Function component that wraps the inline sportsbook market
 *
 * @param marketUrn The market Urn
 * @param status The market status
 * @param runners The market runners
 * @param cardUrn The card Urn
 * @param isUppercase Flag that indicates if the label is in uppercase
 * @param show90MinBlurb Flag to control the display of 90 Minute Blurb
 * @param onIntersectCallback The On Intersect Callback
 * @returns The InlineTemplate component
 */
const InlineTemplate: FunctionComponent<ComponentProps> = ({
  marketUrn,
  status,
  runners,
  cardUrn,
  isUppercase,
  show90MinBlurb = true,
  onIntersectCallback,
  infoBlurbs,
  marketPromo,
  onMarketPromoClick,
  onLinkClick,
}) => (
  <>
    {show90MinBlurb && (
      <ConnectedNinetyMinuteBlurb
        component={NinetyMinuteBlurb}
        onMarketPromoClick={onMarketPromoClick}
        marketURN={marketUrn}
      />
    )}
    <InlineSportsbookMarket
      intersectOffset={INTERSECTION_CONFIG.rootMargin}
      onIntersectCallback={onIntersectCallback}
      numberOfRunners={runners.length}
      isInlineMarketLarge={true}
      infoBlurbs={infoBlurbs as unknown as InlineSportsbookMarketBlurbInfoProps[]}
      marketPromo={marketPromo as unknown as InlineSportsbookMarketBlurbPromotionProps}
      onMarketPromoClick={onMarketPromoClick}
      onLinkClick={onLinkClick}
    >
      {runners.map(({ urn, name, handicapLabel }) => (
        <InlineMarketRunner
          key={urn}
          runner={{ urn, name, handicapLabel }}
          marketUrn={marketUrn}
          marketOpen={status === "OPEN"}
          cardUrn={cardUrn}
          isSecondaryLabelRunnerName
          isSecondaryLabelUppercase={isUppercase}
          showHandicap
        />
      ))}
    </InlineSportsbookMarket>
  </>
);

export default InlineTemplate;
