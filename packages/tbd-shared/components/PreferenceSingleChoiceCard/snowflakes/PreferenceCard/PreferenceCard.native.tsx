import { Children, isValidElement, FunctionComponent, useMemo } from "react";
import { colors } from "@ppb/the-wall-common/base-theme";
import { View, Pressable } from "react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { PreferenceCardProps } from "./PreferenceCard.types";
import styles from "./PreferenceCard.native.styles";
import {
  PREFERENCES_CARD,
  PREFERENCES_CARD_TITLE,
  PREFERENCES_CARD_INFO_BTN,
  PREFERENCES_CARD_OPTION,
  PREFERENCES_CARD_HINT,
  PREFERENCES_CARD_EXTRA_CONTENT,
} from "./PreferenceCard.native.selectors";

export const PreferenceCard: FunctionComponent<PreferenceCardProps> = ({
  title,
  hint,
  extraContent,
  children,
  onInfoButtonClick,
}) => {
  // Conditionally remove horizontal padding if there is a RadioList
  const shouldRemoveHorizontalPadding = Children.toArray(children).some(
    (child) => isValidElement(child) && typeof child.type !== "string" && child.type.name === "RadioList",
  );
  const cardClassNames = [styles.card, shouldRemoveHorizontalPadding && styles.cardWithoutHorizontalPadding];

  const notificationIcon = useMemo(
    () => <GenericIcon name={SystemIconName.NOTIFICATION_INFO} color={colors.ActionTertiaryIconDefault} />,
    [],
  );

  return (
    <View {...getTestProps(PREFERENCES_CARD, false)}>
      {!!title || !!onInfoButtonClick ? (
        <View style={styles.header}>
          {!!title && (
            <Text {...getTestProps(PREFERENCES_CARD_TITLE)} style={styles.title}>
              {title}
            </Text>
          )}
          {!!onInfoButtonClick && (
            <Pressable
              {...getTestProps(PREFERENCES_CARD_INFO_BTN)}
              style={styles.infoContainer}
              onPress={onInfoButtonClick}
            >
              {notificationIcon}
            </Pressable>
          )}
        </View>
      ) : null}
      {extraContent && (
        <View style={styles.extraContent} {...getTestProps(PREFERENCES_CARD_EXTRA_CONTENT, false)}>
          {extraContent}
        </View>
      )}
      <View {...getTestProps(PREFERENCES_CARD_OPTION, false)} style={cardClassNames}>
        {!!hint && (
          <Text {...getTestProps(PREFERENCES_CARD_HINT)} style={styles.hint}>
            {hint}
          </Text>
        )}
        {children}
      </View>
    </View>
  );
};
