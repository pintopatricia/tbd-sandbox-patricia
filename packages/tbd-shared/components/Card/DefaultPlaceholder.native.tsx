 
import { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";
import { colors } from "@ppb/the-wall-common/base-theme";

const styles: { [key: string]: ViewStyle } = {
  placeholder: {
    width: "100%",
    height: 200,
    backgroundColor: colors.PlaceholderBackgroundColour,
    borderRadius: 4,
  },
};

const DefaultPlacehoder: FunctionComponent = () => <View style={styles.placeholder} />;

export default DefaultPlacehoder;
