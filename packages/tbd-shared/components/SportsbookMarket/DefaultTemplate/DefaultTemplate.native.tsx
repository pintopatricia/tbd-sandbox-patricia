import { MarketCard, RunnerViewLinks } from "@ppb/tbd-store/state/layout/cards/Card.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import {
  SportsbookMarketBlurbInfoProps,
  SportsbookMarketBlurbPromotionProps,
  SportsbookMarketI18N,
  SportsbookMarketProps,
  SportsbookMarketStatus,
  ViewLink,
} from "@ppb/the-wall-common/types";
import { SportsbookMarket } from "@ppb/the-wall-native";
import { FunctionComponent } from "react";
import ConnectedSportsbookRunner from "../../SportsbookRunner";
import { SbkMarketRunner } from "../../SportsbookRunner/SportsbookRunner.types";
import SportsbookRunner from "../../SportsbookRunner/SportsbookRunner.native";

type ComponentProps = {
  cardUrn: URN;
  marketUrn: URN;
  runners: SbkMarketRunner[];
  status: SportsbookMarketStatus;
  isRunnerExpandable?: boolean;
  runnerViewLinks?: RunnerViewLinks;
  eventViewLink?: ViewLink;
  guaranteedPriceAvailable: boolean;
  i18n: SportsbookMarketI18N;
  eachWayTermsLabel?: string;
  runnerViewsTitles?: { [k: string]: string };
} & Pick<SportsbookMarketProps, "onMarketPromoClick" | "onLinkClick"> &
  Pick<MarketCard, "infoBlurbs" | "marketPromo">;

/**
 * Function component that wraps the sportsbook market component
 *
 * @param marketUrn The market Urn
 * @param status The market status
 * @param runners The market runners
 * @param guaranteedPriceAvailable Is guaranteed the price available
 * @param i18n The i18n object
 * @param eachWayTermsLabel The each way terms label
 * @param isRunnerExpandable Is the runner expandable
 * @param cardUrn The card Urn
 * @param eventViewLink The event view link
 * @param runnerViewLinks The runner view links
 * @param marketPromo The market promo
 * @param onMarketPromoClick The market promo click callback
 * @returns The Default Template Component
 */
const DefaultTemplate: FunctionComponent<ComponentProps> = ({
  marketUrn,
  status,
  runners,
  guaranteedPriceAvailable,
  i18n,
  isRunnerExpandable,
  cardUrn,
  eventViewLink,
  runnerViewLinks,
  marketPromo,
  infoBlurbs,
  onMarketPromoClick,
  onLinkClick,
}) => {
  const hasJerseys = runners.some((runner) => runner.jerseyUrl);
  const hasStats = runners.some((runner) => !!runner.statValue);

  return (
    <SportsbookMarket
      status={status}
      guaranteedPriceAvailable={guaranteedPriceAvailable}
      i18n={i18n}
      marketPromo={marketPromo as unknown as SportsbookMarketBlurbPromotionProps}
      infoBlurbs={infoBlurbs as unknown as SportsbookMarketBlurbInfoProps[]}
      onMarketPromoClick={onMarketPromoClick}
      onLinkClick={onLinkClick}
    >
      {runners.map((runner, idx) => (
        <ConnectedSportsbookRunner
          key={runner.urn}
          marketUrn={marketUrn}
          runnerURN={runner.urn}
          cardUrn={cardUrn}
          runnerIdx={idx}
          numberOfRunners={runners.length}
          component={SportsbookRunner}
          runnerViewLink={runnerViewLinks?.[runner.urn]}
          eventViewLink={eventViewLink}
          isRunnerExpandable={isRunnerExpandable}
          jerseyUrl={runner.jerseyUrl}
          useFallbackJersey={runner.useFallbackJersey}
          statValue={runner.statValue}
          statValueInterpolation={runner.statValueInterpolation}
          statLabel={runner.statLabel}
          hasJerseys={hasJerseys}
          hasStats={hasStats}
        />
      ))}
    </SportsbookMarket>
  );
};
export default DefaultTemplate;
