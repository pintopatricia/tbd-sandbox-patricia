import { StyleSheet } from "react-native";

export default StyleSheet.create({
  placeholder: {
    height: 168,
  },
  placeholderForMinHeight: {
    height: 206,
  },
  // TODO: The native placeholder doesnt currently expand to fill the parent container
  temporaryPlaceholderOverride: {
    height: "100%",
  },
});
