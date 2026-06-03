import { FunctionComponent } from "react";
import { SportsbookMarketStatus } from "@ppb/tbd-store";
import { InlineSportsbookMarket } from "@ppb/the-wall-native";
import URN from "@ppb/tbd-store/state/layout/URN";
import {
  InlineSportsbookMarketBlurbInfoProps,
  InlineSportsbookMarketBlurbPromotionProps,
  SportsbookMarketProps,
} from "@ppb/the-wall-common/types";
import { MarketCard } from "@ppb/tbd-store/state/layout/cards/Card.types";
import InlineMarketRunner from "../../InlineMarketRunner/InlineMarketRunner.native";
import { SbkMarketRunner } from "../../SportsbookRunner/SportsbookRunner.types";
import NinetyMinuteBlurb from "../NinetyMinuteBlurb/NinetyMinuteBlurb.native";
import ConnectedNinetyMinuteBlurb from "../NinetyMinuteBlurb";

type ComponentProps = {
  cardUrn: URN;
  marketUrn: URN;
  runners: SbkMarketRunner[];
  status: SportsbookMarketStatus;
  isUppercase?: boolean;
  show90MinBlurb?: boolean;
} & Pick<SportsbookMarketProps, "onMarketPromoClick" | "onLinkClick"> &
  Pick<MarketCard, "infoBlurbs" | "marketPromo">;

const InlineTemplate: FunctionComponent<ComponentProps> = ({
  marketUrn,
  status,
  runners,
  cardUrn,
  isUppercase,
  show90MinBlurb = true,
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
      numberOfRunners={runners.length}
      isInlineMarketLarge={true}
      infoBlurbs={infoBlurbs as unknown as InlineSportsbookMarketBlurbInfoProps[]}
      marketPromo={marketPromo as unknown as InlineSportsbookMarketBlurbPromotionProps}
      onMarketPromoClick={onMarketPromoClick}
      onLinkClick={onLinkClick}
    >
      {runners.map(({ urn, name, handicapLabel }, idx) => (
        <InlineMarketRunner
          key={urn}
          runner={{ urn, name, handicapLabel }}
          marketUrn={marketUrn}
          marketOpen={status === "OPEN"}
          cardUrn={cardUrn}
          isSecondaryLabelRunnerName={true}
          runnerIdx={idx}
          numberOfRunners={runners.length}
          isSecondaryLabelUppercase={isUppercase}
          showHandicap
        />
      ))}
    </InlineSportsbookMarket>
  </>
);

export default InlineTemplate;
