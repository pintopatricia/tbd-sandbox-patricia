import { FunctionComponent, JSX, useCallback, useMemo } from "react";
import { FlatList, View } from "react-native";

import type { ExchangeSide } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import { heights } from "@ppb/the-wall-common/base-theme";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { InlineExchangeMarketProps } from "./InlineExchangeMarket.types";
import styles from "./InlineExchangeMarket.native.styles";
import { SNAP_GROUP, INLINE_EXCHANGE_MARKET, BET_BUTTON_VIEW } from "./InlineExchangeMarket.native.selectors";

export type InlineExchangeMarketViewModel = {
  renderExcBetButtons: (urn: string, side: ExchangeSide) => JSX.Element | null;
  renderBetslip?: (urn: string) => JSX.Element | null;
} & InlineExchangeMarketProps;

const BUTTON_SIDES: ExchangeSide[] = ["BACK", "LAY"];

/**
 * @param {string} marketURN Market URN
 * @param {boolean} disabled Boolean to distinguish between active and disbled markets
 * @param {InlineExchangeMarketSelections[]} selections Market selections
 * @param {InlineSportsbookMarketOnBetClick} onBetClick callback for the bet buttons
 */
export const InlineExchangeMarket: FunctionComponent<InlineExchangeMarketViewModel> = ({
  runners,
  renderExcBetButtons,
}) => {
  const filteredSelectionsByName = runners.filter(
    (element, index, array) => array.findIndex((s) => s.name === element.name) === index,
  );
  const inlineExchangeMarketStyle = [
    styles.inlineExchangeMarket,
    filteredSelectionsByName.length === 2 && styles.inlineExchangeMarketSmall,
  ];

  const data = useMemo(() => [runners], [runners]);

  const renderItem = useCallback(
    ({ item: selections }: { item: typeof runners }) => (
      <>
        {BUTTON_SIDES.map((side: ExchangeSide) => (
          <View
            key={side}
            {...getTestProps(SNAP_GROUP, false)}
            style={[
              styles.snapGroup,
              filteredSelectionsByName.length === 2 && styles.snapGroupSmall,
              side === "BACK" && styles.snapGroupLeft,
              side === "LAY" && styles.snapGroupRight,
            ]}
          >
            {selections.map(({ urn }, i) => (
              <View
                key={urn}
                {...getTestProps(BET_BUTTON_VIEW, false)}
                style={[styles.betButton, i < selections.length && styles.betButtonNotLast]}
              >
                {renderExcBetButtons(urn, side)}
              </View>
            ))}
          </View>
        ))}
      </>
    ),
    [filteredSelectionsByName.length, renderExcBetButtons],
  );

  const keyExtractor = useCallback((_: unknown, index: number) => `inline-exchange-market-${index}`, []);

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({
      length: heights["bet-button-width"],
      offset: heights["bet-button-width"] * index,
      index,
    }),
    [],
  );

  return (
    <View {...getTestProps(INLINE_EXCHANGE_MARKET, false)} style={inlineExchangeMarketStyle}>
      <ScrollableSwimlane>
        <FlatList
          data={data}
          horizontal={true}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          getItemLayout={getItemLayout}
          contentContainerStyle={styles.contentContainerStyle}
          pagingEnabled={true}
          bounces={false}
          decelerationRate={0.98}
        />
      </ScrollableSwimlane>
    </View>
  );
};
