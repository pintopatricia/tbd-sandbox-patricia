import type { FunctionComponent } from "react";
import { Pressable, View } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native/components/Text/Text";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";

import type { MiniBannerNativeProps } from "./MiniBanner.types";
import { BANNER, BRAND_TITLE, LEFT_ICON, RIGHT_CHEVRON, SUB_TEXT, TEST_ID, TITLE } from "./MiniBanner.native.selectors";
import styles from "./MiniBanner.native.styles";

export const MiniBanner: FunctionComponent<MiniBannerNativeProps> = ({
  brandTitle,
  title,
  subText,
  onMiniBannerTap,
}) => {
  const iconColour = tokens.MiniBannerDefaultIconColour;

  return (
    <View style={styles.miniBanner} {...getTestProps(TEST_ID)}>
      <Pressable style={styles.banner} {...getTestProps(BANNER, false)} onPress={() => onMiniBannerTap?.()}>
        <View style={styles.leftIcon} {...getTestProps(LEFT_ICON, false)}>
          <GenericIcon color={iconColour} name={SystemIconName.NOTIFICATION_INFO} />
        </View>

        <View style={styles.content}>
          {brandTitle ? (
            <Text
              {...getTestProps(BRAND_TITLE, false)}
              ellipsizeMode="tail"
              numberOfLines={1}
              style={styles.brandTitle}
            >
              {brandTitle}
            </Text>
          ) : null}
          {title ? (
            <Text {...getTestProps(TITLE, false)} ellipsizeMode="tail" numberOfLines={2} style={styles.title}>
              {title}
            </Text>
          ) : null}
          {subText ? (
            <Text {...getTestProps(SUB_TEXT, false)} ellipsizeMode="tail" numberOfLines={2} style={styles.subText}>
              {subText}
            </Text>
          ) : null}
        </View>

        <View style={styles.rightChevron} pointerEvents="none" {...getTestProps(RIGHT_CHEVRON, false)}>
          <GenericIcon color={iconColour} name={SystemIconName.CHEVRON_RIGHT} />
        </View>
      </Pressable>
    </View>
  );
};
