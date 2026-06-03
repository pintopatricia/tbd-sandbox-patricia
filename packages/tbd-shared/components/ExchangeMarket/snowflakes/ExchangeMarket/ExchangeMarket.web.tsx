import { FunctionComponent, useEffect } from "react";
import { BookPercentage } from "@ppb/the-wall-common/types";
import { IntersectionProps, OnIntersectCallback } from "@ppb/the-wall-common/types/web";
import styles from "@ppb/the-wall-web/components/Markets/Market.module.css";
import useOnIntersect from "@ppb/the-wall-web/hooks/useOnIntersect";
import { MarketBlurbs } from "@ppb/the-wall-web";
import { ExchangeMarketStatus } from "@ppb/tbd-store";
import { ExchangeMarketViewModel } from "./ExchangeMarket.types";

const getBookPercentage = (side?: number): string => (side ? `${(side * 100).toFixed(1)}%` : "");

export type ExchangeMarketWebViewModel = {
  onIntersectCallback?: OnIntersectCallback;
} & ExchangeMarketViewModel &
  IntersectionProps;

export const ExchangeMarket: FunctionComponent<ExchangeMarketWebViewModel> = ({
  status,
  liquidity,
  i18nLabels,
  intersectOffset,
  onIntersectCallback,
  bookPercentage,
  isMarketDepthActive = false,
  onMarketDepthButtonTap,
  hasMarketRules = false,
  hasMarketGraph = false,
  marketPromo,
  onMarketRulesButtonTap,
  onMarketGraphButtonTap,
  children,
  onMarketPromoClick,
  turnInPlayEnabled,
  inplay,
}) => {
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null, intersectOffset);

  useEffect(() => {
    if (onIntersectCallback) {
      onIntersectCallback(isIntersecting);
    }
  }, [isIntersecting, onIntersectCallback]);

  const statusLabel = status === ExchangeMarketStatus.Suspended ? i18nLabels.marketSuspended : i18nLabels.marketClosed;
  let columns: string[] = [];

  if (!isMarketDepthActive) {
    columns = [i18nLabels.back, i18nLabels.lay];
  }

  const bookPercentageValue: BookPercentage = {
    back: {
      label: i18nLabels.back,
      percentage: getBookPercentage(bookPercentage?.back),
    },
    lay: {
      label: i18nLabels.lay,
      percentage: getBookPercentage(bookPercentage?.lay),
    },
  };

  return (
    <div className={styles.market} ref={ref}>
      <div className={styles.marketHeader}>
        <MarketBlurbs
          text={`${i18nLabels.matched}: ${liquidity}`}
          marketStatus={status !== ExchangeMarketStatus.Open ? statusLabel : undefined}
          marketDepthActive={isMarketDepthActive}
          marketDepthCallback={onMarketDepthButtonTap}
          marketInfoCallback={hasMarketRules ? onMarketRulesButtonTap : undefined}
          marketGraphCallback={hasMarketGraph ? onMarketGraphButtonTap : undefined}
          bookPercentage={isMarketDepthActive ? bookPercentageValue : undefined}
          columns={columns}
          marketPromo={marketPromo}
          onMarketPromoClick={onMarketPromoClick}
          turnInPlayEnabled={turnInPlayEnabled}
          inplay={inplay}
        ></MarketBlurbs>
      </div>
      {children}
    </div>
  );
};
