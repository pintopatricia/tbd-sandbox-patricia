import { FunctionComponent, memo, useEffect, useId } from "react";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { ComponentProps } from "./props";

import CouponTemplate from "./CouponTemplate/CouponTemplate.native";
import DefaultTemplate from "./DefaultTemplate/DefaultTemplate.native";
import OutrightTemplate from "./OutrightTemplate/OutrightTemplate.native";
import InlineTemplate from "./InlineTemplate/InlineTemplate.native";

const MemoizedSportsbookMarket: FunctionComponent<ComponentProps> = memo(
  ({
    marketId,
    marketUrn,
    status,
    runners,
    guaranteedPriceAvailable,
    i18n,
    eachWayTermsLabel,
    isRunnerExpandable,
    cardUrn,
    eventViewLink,
    runnerViewLinks,
    template,
    isShowMoreAvailable,
    isItemsListCollapsed,
    numberOfItemsToDisplay,
    marketPromo,
    show90MinBlurb,
    dispatchAzSwitchClick,
    isUppercase,
    onMarketPromoClick,
    infoBlurbs,
    onLinkClick,
  }) => {
    if (!marketId) {
      return null;
    }

    switch (template) {
      case "COUPON":
        return <CouponTemplate cardUrn={cardUrn} marketUrn={marketUrn} runners={runners} status={status} />;

      case MarketTemplate.Inline:
        return (
          <InlineTemplate
            cardUrn={cardUrn}
            marketUrn={marketUrn}
            runners={runners}
            status={status}
            isUppercase={isUppercase}
            show90MinBlurb={show90MinBlurb}
            infoBlurbs={infoBlurbs}
            marketPromo={marketPromo}
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
            i18n={i18n}
            eachWayTermsLabel={eachWayTermsLabel}
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
            runners={runners}
            status={status}
            guaranteedPriceAvailable={guaranteedPriceAvailable}
            i18n={i18n}
            eachWayTermsLabel={eachWayTermsLabel}
            eventViewLink={eventViewLink}
            isRunnerExpandable={isRunnerExpandable}
            runnerViewLinks={runnerViewLinks}
            marketPromo={marketPromo}
            onMarketPromoClick={onMarketPromoClick}
            infoBlurbs={infoBlurbs}
            onLinkClick={onLinkClick}
          />
        );
    }
  },
);

MemoizedSportsbookMarket.displayName = "MemoizedSportsbookMarket";

/**
 * Function component that wraps the sportsbook market component and trigger the updates
 *
 * @param marketId The market ID
 * @param sportsbookMarketProps The market view model
 * @returns The Sportsbook Market component
 */
const SportsbookMarket: FunctionComponent<ComponentProps> = (props) => {
  const { marketId, visible, dispatchMarketUpdatesSubscribe, dispatchMarketUpdatesUnsubscribe } = props;
  const id = useId();
  useEffect(() => {
    if (marketId) {
      if (visible) {
        dispatchMarketUpdatesSubscribe(marketId, id);
      } else {
        dispatchMarketUpdatesUnsubscribe(marketId, id);
      }

      return () => {
        dispatchMarketUpdatesUnsubscribe(marketId, id);
      };
    }
    return () => {};
  }, [dispatchMarketUpdatesSubscribe, dispatchMarketUpdatesUnsubscribe, marketId, visible]);

  return <MemoizedSportsbookMarket {...props} />;
};

export default SportsbookMarket;
