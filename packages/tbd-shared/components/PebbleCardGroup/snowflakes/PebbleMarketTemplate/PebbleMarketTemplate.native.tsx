import { FunctionComponent } from "react";
import * as React from "react";
import { View } from "react-native";

import { PebbleList } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { PebbleListViewModel } from "@ppb/the-wall-common/types/Pebbles/PebbleList.native.types";
import { PEBBLE_MARKET_TEMPLATE } from "./PebbleMarketTemplate.native.selectors";
import styles from "./PebbleMarketTemplate.native.styles";

export type PebbleMarketTemplateProps = PebbleListViewModel & {
  children: React.ReactNode;
};

/**
 * Over and under dual usage market component
 *
 * @param items Pebble items list
 * @param defaultSelectedPebble The selected pebble
 * @param onPebblePress Pebble press callback
 * @returns The component html
 */
export const PebbleMarketTemplate: FunctionComponent<PebbleMarketTemplateProps> = ({
  items,
  defaultSelectedPebble,
  onPebblePress,
  children,
}) => (
  <View {...getTestProps(PEBBLE_MARKET_TEMPLATE, false)} style={styles.pebbleMarketTemplate}>
    {items.length > 0 && (
      <View style={styles.pebbleListContainer}>
        <PebbleList
          scrollStyle={styles.scrollViewStyle}
          items={items}
          defaultSelectedPebble={defaultSelectedPebble}
          onPebblePress={onPebblePress}
        />
      </View>
    )}
    {children}
  </View>
);
