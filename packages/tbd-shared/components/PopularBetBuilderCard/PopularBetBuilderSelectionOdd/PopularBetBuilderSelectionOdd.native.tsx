import { FunctionComponent, useEffect, useId } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { TEST_ID, ODD } from "./PopularBetBuilderSelectionOdd.native.selectors";
import styles from "./PopularBetBuilderSelectionOdd.native.styles";
import { ComponentProps } from "./props";

const PopularBetBuilderSelectionOdd: FunctionComponent<ComponentProps> = ({
  dispatchSportsbookMarketUpdatesSubscribe,
  dispatchSportsbookMarketUpdatesUnsubscribe,
  marketId,
  isRacing,
  odd,
  visible,
}) => {
  const titleTypography = isRacing ? styles.racingTitle : styles.defaultTitle;
  const id = useId();
  useEffect(() => {
    const callbackUpdateMarketPrice = visible
      ? dispatchSportsbookMarketUpdatesSubscribe
      : dispatchSportsbookMarketUpdatesUnsubscribe;

    callbackUpdateMarketPrice(marketId, id);

    return () => {
      dispatchSportsbookMarketUpdatesUnsubscribe(marketId, id);
    };
  }, [dispatchSportsbookMarketUpdatesSubscribe, dispatchSportsbookMarketUpdatesUnsubscribe, marketId, visible]);

  return (
    <View {...getTestProps(TEST_ID, false)}>
      <Text {...getTestProps(ODD)} style={[titleTypography, styles.titleInfo]}>
        {odd}
      </Text>
    </View>
  );
};

export default PopularBetBuilderSelectionOdd;
