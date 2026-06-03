import { FunctionComponent, useMemo } from "react";
import { View } from "react-native";
import { ExchangeMarketStatus } from "@ppb/tbd-store";
import { BookPercentage } from "@ppb/the-wall-common/types";
import { MarketBlurbs } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { ExchangeMarketViewModel } from "./ExchangeMarket.types";
import styles from "./ExchangeMarket.native.styles";
import { EXCHANGE_MARKET, EXCHANGE_MARKET_BLURBS } from "./ExchangeMarket.native.selectors";

const getBookPercentage = (side?: number): string => (side ? `${(side * 100).toFixed(1)}%` : "");

export const ExchangeMarket: FunctionComponent<ExchangeMarketViewModel> = ({
  liquidity,
  status,
  i18nLabels,
  bookPercentage,
  isMarketDepthActive = false,
  onMarketDepthButtonTap,
  hasMarketRules = false,
  hasMarketGraph = false,
  onMarketRulesButtonTap,
  onMarketGraphButtonTap,
  children,
  marketPromo,
  onMarketPromoClick,
  turnInPlayEnabled,
  inplay,
}) => {
  const statusLabel = status === ExchangeMarketStatus.Suspended ? i18nLabels.marketSuspended : i18nLabels.marketClosed;
  const backBooking = bookPercentage?.back;
  const layBooking = bookPercentage?.lay;
  const bookPercentageValue: BookPercentage = {
    back: useMemo(
      () => ({ label: i18nLabels.back, percentage: getBookPercentage(backBooking) }),
      [backBooking, i18nLabels.back],
    ),
    lay: useMemo(
      () => ({ label: i18nLabels.lay, percentage: getBookPercentage(layBooking) }),
      [layBooking, i18nLabels.lay],
    ),
  };

  let columns: string[] = [];

  if (!isMarketDepthActive) {
    columns = [i18nLabels.back, i18nLabels.lay];
  }

  return (
    <View {...getTestProps(EXCHANGE_MARKET, false)}>
      <View style={styles.headerContainer} {...getTestProps(EXCHANGE_MARKET_BLURBS, false)}>
        <MarketBlurbs
          text={`${i18nLabels.matched}: ${liquidity}`}
          marketStatus={status === ExchangeMarketStatus.Open ? undefined : statusLabel}
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
        />
      </View>
      {children}
    </View>
  );
};
