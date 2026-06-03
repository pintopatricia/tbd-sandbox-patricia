import { FunctionComponent } from "react";
import { View } from "react-native";
import { CounterColor, CounterSize } from "@ppb/the-wall-common/types";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ActionLink, Counter, Text } from "@ppb/the-wall-native";
import { CounterAggregatorProps } from "./CounterAggregator.types";
import {
  COUNTER_AGGREGATOR,
  COUNTER_AGGREGATOR_SUBTITLE,
  COUNTER_AGGREGATOR_TITLE,
} from "./CounterAggregator.native.selectors";
import styles from "./CounterAggregator.native.styles";

export const CounterAggregator: FunctionComponent<CounterAggregatorProps> = ({
  count,
  title,
  subtitle,
  buttonText,
  onButtonTap,
}) => (
  <View style={styles.headerContainer} {...getTestProps(COUNTER_AGGREGATOR, false)}>
    <View style={styles.titleContainer}>
      <View style={styles.contentTop}>
        <Counter value={count} color={CounterColor.Yellow} size={CounterSize.Small} />
        {!!title && (
          <Text style={styles.titleText} {...getTestProps(COUNTER_AGGREGATOR_TITLE)}>
            {title}
          </Text>
        )}
      </View>
      {!!buttonText && !!onButtonTap && (
        <View style={styles.button}>
          <ActionLink text={buttonText} onClick={onButtonTap} noPadding={true} />
        </View>
      )}
    </View>
    {!!subtitle && (
      <Text style={styles.subtitle} {...getTestProps(COUNTER_AGGREGATOR_SUBTITLE)}>
        {subtitle}
      </Text>
    )}
  </View>
);
