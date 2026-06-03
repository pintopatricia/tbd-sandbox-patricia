 
import { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";
import { colors } from "@ppb/the-wall-common/base-theme";

const placeholderStyle: ViewStyle = {
  width: "100%",
  backgroundColor: colors.NeutralsBackgroundElevation2,
  borderRadius: 4,
  minHeight: 64,
};

const MatchStatSelectionCardPlaceholder: FunctionComponent = () => <View style={placeholderStyle} />;

export default MatchStatSelectionCardPlaceholder;
