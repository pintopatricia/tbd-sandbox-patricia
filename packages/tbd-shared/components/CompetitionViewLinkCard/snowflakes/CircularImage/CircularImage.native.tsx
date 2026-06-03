import { FunctionComponent } from "react";
import { View } from "react-native";

import { tokens } from "@ppb/the-wall-common/base-theme";
import type { TBDImageProps } from "@ppb/the-wall-common/types/native";
import { SportsIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { TBDImage, Text } from "@ppb/the-wall-native";
import { type CircularImageCommonProps, CircularImageSize } from "./CircularImage.types";

import { CIRCULAR_IMAGE, CIRCULAR_IMAGE_CONTAINER, CIRCULAR_IMAGE_TEXT } from "./CircularImage.native.selectors";
import styles from "./CircularImage.native.styles";

export type CircularImageProps = CircularImageCommonProps & {
  imageURL?: TBDImageProps["source"];
};

export const CircularImage: FunctionComponent<CircularImageProps> = ({
  imageURL,
  fallbackIcon = SportsIconName.COMPETITION,
  text,
  size = CircularImageSize.Large,
}) => {
  const imageContainerStyle = [
    size === CircularImageSize.Small && styles.small,
    size === CircularImageSize.Large && styles.large,
  ];

  return (
    <View {...getTestProps(CIRCULAR_IMAGE, false)} style={styles.container}>
      <View {...getTestProps(CIRCULAR_IMAGE_CONTAINER, false)} style={imageContainerStyle}>
        {imageURL ? (
          <TBDImage style={styles.image} source={imageURL} />
        ) : (
          <GenericIcon name={fallbackIcon} color={tokens.NeutralsIconSecondary} />
        )}
      </View>
      {!!text && (
        <Text {...getTestProps(CIRCULAR_IMAGE_TEXT)} numberOfLines={2} ellipsizeMode="tail" style={styles.text}>
          {text}
        </Text>
      )}
    </View>
  );
};
