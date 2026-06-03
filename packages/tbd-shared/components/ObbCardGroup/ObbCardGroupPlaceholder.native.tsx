 
import { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./ObbCardGroupPlaceholder.native.styles";

const ComponentPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholder}>
    <Placeholder style={styles.placeholderTitle}></Placeholder>
    <Placeholder style={styles.placeholderContainer}></Placeholder>
  </View>
);

const ObbCardGroupPlaceholder: FunctionComponent = () => (
  <>
    {Array(3)
      .fill({})
      .map((_, i) => (
        <ComponentPlaceholder key={i} />
      ))}
  </>
);

export default ObbCardGroupPlaceholder;
