 
import { Placeholder } from "@ppb/the-wall-native";
import { FunctionComponent } from "react";
import { View } from "react-native";
import styles from "./HalfTimeSpecialsSwimlaneCardGroup.native.styles";

export type SwimlaneCardGroupPlaceholderProps = { withAction?: boolean };

const HalfTimeSpecialsSwimlaneCardGroupPlaceholder: FunctionComponent<SwimlaneCardGroupPlaceholderProps> = ({
  withAction = false,
}) => (
  <View style={styles.placeholder}>
    <View style={styles.placeholderHeader}>
      <Placeholder style={styles.placeholderTitle} />
      {withAction && <Placeholder style={styles.placeholderAction} />}
    </View>
    <Placeholder style={styles.placeholderContainer} />
  </View>
);

export default HalfTimeSpecialsSwimlaneCardGroupPlaceholder;
