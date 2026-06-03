import { Placeholder } from "@ppb/the-wall-native";
import { View } from "react-native";
import styles from "./StatsContentCardGroupPlaceholder.native.styles";

const StatsContentCardGroupPlaceholder = () => {
  const items = Array.from({ length: 3 }, (_, i) => i);

  return (
    <View style={styles.statsContent}>
      {items.map((_, index) => (
        <Placeholder style={styles.supportingContentItem} key={index} />
      ))}
    </View>
  );
};

export default StatsContentCardGroupPlaceholder;
