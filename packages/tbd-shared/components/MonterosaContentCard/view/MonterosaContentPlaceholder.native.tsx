import { ViewStyle } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";

const styles: { [key: string]: ViewStyle } = {
  placeholder: {
    width: "100%",
    height: 250,
  },
};

const MonterosaContentPlaceholder = () => <Placeholder style={styles.placeholder} />;

export default MonterosaContentPlaceholder;
