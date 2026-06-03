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
import { OnIntersectCallback } from "@ppb/the-wall-common/types/useOnIntersect.web.types";
import { SportsbookMarket } from "@ppb/the-wall-web";
import type { JSX } from "react";
import { FunctionComponent } from "react";
import INTERSECTION_CONFIG from "../../../config/cards-intersection";
import ConnectedSportsbookRunner from "../../SportsbookRunner";
import { SbkMarketRunner } from "../../SportsbookRunner/SportsbookRunner.types";
import SportsbookRunner from "../../SportsbookRunner/SportsbookRunner.web";

type ComponentProps = {
  cardUrn: URN;
  marketUrn: URN;
  runners: SbkMarketRunner[];
  status: SportsbookMarketStatus;
  onIntersectCallback: OnIntersectCallback;
  isRunnerExpandable?: boolean;
  runnerViewLinks?: RunnerViewLinks;
  eachWayTermsLabel?: string;
  eventViewLink?: ViewLink;
  guaranteedPriceAvailable: boolean;
  i18n: SportsbookMarketI18N;
  runnerViewsTitles?: { [k: string]: string };
} & Pick<SportsbookMarketProps, "onMarketPromoClick" | "onLinkClick"> &
  Pick<MarketCard, "infoBlurbs" | "marketPromo">;

/**
/**
 * Function component that wraps the sportsbook market component
 *
 * @param marketUrn The market Urn
 * @param status The market status
 * @param runners The market runners
 * @param guaranteedPriceAvailable Is guaranteed the price available
 * @param i18n The i18n object
 * @param isRunnerExpandable Is the runner expandable
 * @param cardUrn The card Urn
 * @param eventViewLink The event view link
 * @param runnerViewLinks The runner view links
 * @param runnerViewsTitles The runner view titles
 * @param onIntersectCallback The on interaction callback
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
  runnerViewsTitles,
  onIntersectCallback,
  marketPromo,
  onMarketPromoClick,
  onLinkClick,
  infoBlurbs,
}) => {
  const hasJerseys = runners.some((runner) => runner.jerseyUrl);
  const hasStats = runners.some((runner) => !!runner.statValue);

  return (
    <>
      <SportsbookMarket
        status={status}
        guaranteedPriceAvailable={guaranteedPriceAvailable}
        i18n={i18n}
        marketPromo={marketPromo as unknown as SportsbookMarketBlurbPromotionProps}
        intersectOffset={INTERSECTION_CONFIG.rootMargin}
        onIntersectCallback={onIntersectCallback}
        onMarketPromoClick={onMarketPromoClick}
        infoBlurbs={infoBlurbs as unknown as SportsbookMarketBlurbInfoProps[]}
        onLinkClick={onLinkClick}
      >
        {runners.map(
          ({ urn, jerseyUrl, useFallbackJersey, statValue, statValueInterpolation, statLabel }): JSX.Element => {
            const runnerViewLink = runnerViewLinks?.[urn];
            const runnerViewTitle = runnerViewLink && runnerViewsTitles && runnerViewsTitles[runnerViewLink.viewUrn];

            return (
              <ConnectedSportsbookRunner
                key={urn}
                cardUrn={cardUrn}
                marketUrn={marketUrn}
                runnerURN={urn}
                component={SportsbookRunner}
                runnerViewLink={runnerViewLink}
                eventViewLink={eventViewLink}
                runnerViewTitle={runnerViewTitle}
                isRunnerExpandable={isRunnerExpandable}
                jerseyUrl={jerseyUrl}
                useFallbackJersey={useFallbackJersey}
                statValue={statValue}
                statValueInterpolation={statValueInterpolation}
                statLabel={statLabel}
                hasJerseys={hasJerseys}
                hasStats={hasStats}
              />
            );
          },
        )}
      </SportsbookMarket>
    </>
  );
};

export default DefaultTemplate;
