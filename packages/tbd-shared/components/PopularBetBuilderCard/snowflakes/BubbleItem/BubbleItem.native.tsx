import type { JSX } from "react";
import { View } from "react-native";
import FastImage from "react-native-fast-image";
import { ShadowedView } from "react-native-fast-shadow";

import { TBDImage, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import type { TBDImageProps } from "@ppb/the-wall-common/types/native";

import { BubbleItemCommonProps } from "./BubbleItem.types";
import {
  BUBBLE_ITEM,
  TITLE,
  CIRCLE,
  LINE,
  TEXT,
  DESCRIPTION,
  ICON_CONTAINER,
  SUB_DESCRIPTION,
  CHILDREN_CONTAINER,
} from "./BubbleItem.native.selectors";
import styles from "./BubbleItem.native.styles";

export type BubbleItemProps = BubbleItemCommonProps & {
  titleIconFallback?: TBDImageProps["fallbackSource"];
};

export const BubbleItem = ({
  titleIcon,
  titleIconFallback,
  title,
  description,
  subDescription,
  isLast,
  children,
}: BubbleItemProps): JSX.Element => {
  const containerStyles = [styles.container, styles.label, isLast && styles.lastLabel];
  const lineStyles = [styles.line, isLast && styles.lastLine];
  const titleStyles = [styles.titleInfo, styles.boldTitle];

  return (
    <View style={containerStyles} {...getTestProps(BUBBLE_ITEM, false)}>
      <View style={styles.leftArea}>
        <View style={lineStyles} {...getTestProps(LINE)} />
        <View style={styles.circle} {...getTestProps(CIRCLE)} />
      </View>

      <View style={styles.informationContainer}>
        <View style={styles.firstLineContainer}>
          <View style={styles.iconAndTitleContainer}>
            {titleIcon && (
              <ShadowedView style={styles.iconContainer} {...getTestProps(ICON_CONTAINER, false)}>
                <TBDImage
                  source={titleIcon}
                  style={styles.icon}
                  fallbackSource={titleIconFallback}
                  resizeMode={FastImage.resizeMode.contain}
                />
              </ShadowedView>
            )}
            <Text style={titleStyles} {...getTestProps(TITLE)}>
              {title.bold}
              {!!title.regular && (
                <Text style={styles.regularTitle} {...getTestProps(TEXT)}>
                  {` - ${title.regular}`}
                </Text>
              )}
            </Text>
          </View>
          {children && (
            <View style={styles.children} {...getTestProps(CHILDREN_CONTAINER, false)}>
              {children}
            </View>
          )}
        </View>

        {!!description && (
          <View>
            <Text style={styles.description} {...getTestProps(DESCRIPTION)}>
              {description}
            </Text>
          </View>
        )}

        {!!subDescription && (
          <View>
            <Text {...getTestProps(SUB_DESCRIPTION)} style={styles.subDescription}>
              {subDescription}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};
