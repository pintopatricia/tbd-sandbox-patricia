import { FunctionComponent } from "react";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { PRICE_HISTORY } from "./PriceHistory.native.selectors";
import styles from "./PriceHistory.native.styles";
import { ComponentProps } from "./props";

const PriceHistory: FunctionComponent<ComponentProps> = ({ previousOdds }) =>
  previousOdds ? (
    <Text {...getTestProps(PRICE_HISTORY, false)} style={styles.priceHistory} numberOfLines={2}>
      {previousOdds}
    </Text>
  ) : null;

export default PriceHistory;
