import { FunctionComponent } from "react";
import { View } from "react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { colors } from "@ppb/the-wall-common/base-theme";
import { Text } from "@ppb/the-wall-native";
import styles from "./NoContentAvailableCard.native.styles";
import {
  NO_CONTENT_AVAILABLE,
  NO_CONTENT_AVAILABLE_ICON_CONTAINER,
  NO_CONTENT_AVAILABLE_ICON,
  NO_CONTENT_AVAILABLE_FIRST_LABEL,
  NO_CONTENT_AVAILABLE_SECOND_LABEL,
} from "./NoContentAvailableCard.native.selectors";
import { i18n } from "../../helpers/i18n";

export const NoContentAvailableCard: FunctionComponent = () => (
  <View {...getTestProps(NO_CONTENT_AVAILABLE, false)} style={styles.noContentAvailableContainer}>
    <View {...getTestProps(NO_CONTENT_AVAILABLE_ICON_CONTAINER, false)} style={styles.iconContainer}>
      <View {...getTestProps(NO_CONTENT_AVAILABLE_ICON, false)} style={styles.icon}>
        <GenericIcon name={SystemIconName.CLOSE} color={colors.NeutralsIconSecondary}></GenericIcon>
      </View>
    </View>
    <Text {...getTestProps(NO_CONTENT_AVAILABLE_FIRST_LABEL)} style={styles.firstLabel}>
      {i18n({ key: "I18N.NO_PRICE_AVAILABLE.TITLE" })}
    </Text>
    <Text {...getTestProps(NO_CONTENT_AVAILABLE_SECOND_LABEL)} style={styles.secondLabel}>
      {i18n({ key: "I18N.NO_CONTENT_AVAILABLE.TEXT" })}
    </Text>
  </View>
);
