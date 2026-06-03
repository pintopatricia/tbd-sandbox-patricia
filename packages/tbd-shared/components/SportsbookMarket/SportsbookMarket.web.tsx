import { FunctionComponent, useCallback, useEffect, useId } from "react";
import { OnIntersectCallback } from "@ppb/the-wall-common/types/web";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { ComponentProps } from "./props";

import CouponTemplate from "./CouponTemplate/CouponTemplate.web";
import DefaultTemplate from "./DefaultTemplate/DefaultTemplate.web";
import InlineTemplate from "./InlineTemplate/InlineTemplate.web";
import OutrightTemplate from "./OutrightTemplate/OutrightTemplate.web";

/**
 * Function component that wraps the sportsbook market component and trigger the updates
 *
 * @param marketId The market ID
 * @param sportsbookMarketProps The market view model
 * @returns The Sportsbook Market component
 */
const SportsbookMarket: FunctionComponent<ComponentProps> = ({
  marketUrn,
  marketId,
  status,
  runners,
  guaranteedPriceAvailable,
  i18n,
  isRunnerExpandable,
  cardUrn,
  eventViewLink,
  runnerViewLinks,
  runnerViewsTitles,
  template,
  isShowMoreAvailable,
  isItemsListCollapsed,
  numberOfItemsToDisplay,
  marketPromo,
  infoBlurbs,
  isUppercase,
  show90MinBlurb,
  dispatchMarketUpdatesSubscribe,
  dispatchMarketUpdatesUnsubscribe,
  dispatchAzSwitchClick,
  onMarketPromoClick,
  onLinkClick,
}) => {
  const id = useId();
  const onIntersectCallback = useCallback<OnIntersectCallback>(
    (isIntersecting) => {
      if (marketId) {
        if (isIntersecting) {
          dispatchMarketUpdatesSubscribe(marketId, id);
        } else {
          dispatchMarketUpdatesUnsubscribe(marketId, id);
        }
      }
    },
    [dispatchMarketUpdatesSubscribe, dispatchMarketUpdatesUnsubscribe, marketId, id],
  );

  useEffect(() => {
    return () => {
      if (marketId) {
        dispatchMarketUpdatesUnsubscribe(marketId, id);
      }
    };
  }, [dispatchMarketUpdatesUnsubscribe, marketId, id]);

  if (!marketId) {
    return <></>;
  }

  switch (template) {
    case "COUPON":
      return (
        <CouponTemplate
          cardUrn={cardUrn}
          marketUrn={marketUrn}
          onIntersectCallback={onIntersectCallback}
          runners={runners}
          status={status}
        />
      );
    case MarketTemplate.Inline:
      return (
        <InlineTemplate
          cardUrn={cardUrn}
          marketUrn={marketUrn}
          onIntersectCallback={onIntersectCallback}
          runners={runners}
          status={status}
          isUppercase={isUppercase}
          show90MinBlurb={show90MinBlurb}
          marketPromo={marketPromo}
          infoBlurbs={infoBlurbs}
          onMarketPromoClick={onMarketPromoClick}
          onLinkClick={onLinkClick}
        />
      );

    case MarketTemplate.Outright:
      return (
        <OutrightTemplate
          cardUrn={cardUrn}
          marketUrn={marketUrn}
          runners={runners}
          onIntersectCallback={onIntersectCallback}
          i18n={i18n}
          isShowMoreAvailable={!!isShowMoreAvailable}
          isItemsListCollapsed={!!isItemsListCollapsed}
          numberOfItemsToDisplay={numberOfItemsToDisplay}
          dispatchAzSwitchClick={dispatchAzSwitchClick}
          infoBlurbs={infoBlurbs}
          marketPromo={marketPromo}
          onMarketPromoClick={onMarketPromoClick}
          onLinkClick={onLinkClick}
        />
      );

    case MarketTemplate.Default:
    default:
      return (
        <DefaultTemplate
          cardUrn={cardUrn}
          marketUrn={marketUrn}
          onIntersectCallback={onIntersectCallback}
          runners={runners}
          status={status}
          guaranteedPriceAvailable={guaranteedPriceAvailable}
          i18n={i18n}
          eventViewLink={eventViewLink}
          isRunnerExpandable={isRunnerExpandable}
          runnerViewLinks={runnerViewLinks}
          runnerViewsTitles={runnerViewsTitles}
          marketPromo={marketPromo}
          infoBlurbs={infoBlurbs}
          onMarketPromoClick={onMarketPromoClick}
          onLinkClick={onLinkClick}
        />
      );
  }
};

export default SportsbookMarket;
