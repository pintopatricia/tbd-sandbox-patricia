 
import { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";
import { colors } from "@ppb/the-wall-common/base-theme";

const styles: { [key: string]: ViewStyle } = {
  placeholder: {
    width: "100%",
    minHeight: 94,

    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: 4,
  },
};

const DefaultPlacehoder: FunctionComponent = () => <View style={styles.placeholder} />;

export default DefaultPlacehoder;
