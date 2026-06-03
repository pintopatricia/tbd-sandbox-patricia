import { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";
import { colors, spacings } from "@ppb/the-wall-common/base-theme";

const styles: { [key: string]: ViewStyle } = {
  placeholder: {
    width: "100%",
    minHeight: 126,

    backgroundColor: colors.NeutralsBackgroundElevation2,
    borderRadius: spacings["spacing-2"],
  },
};

const RaceViewLinksCardPlaceholder: FunctionComponent = () => <View style={styles.placeholder} />;

export default RaceViewLinksCardPlaceholder;
