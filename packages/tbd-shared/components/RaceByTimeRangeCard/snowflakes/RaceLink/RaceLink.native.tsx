import { FunctionComponent, useMemo } from "react";
import { View, Pressable } from "react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { RichContentIconName, ValueIconName } from "@ppb/the-wall-icons/types";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { LinkOnPress } from "@ppb/the-wall-common/types/Link/Link.native.types";
import { Text } from "@ppb/the-wall-native";
import {
  RACE_LINK,
  RACE_LINK_ICON,
  RACE_LINK_ICON_WRAPPER,
  RACE_LINK_TIME,
  RACE_LINK_SUBTITLE,
  RACE_LINK_TEXT_WRAPPER,
} from "./RaceLink.native.selectors";
import styles from "./RaceLink.native.styles";
import { RaceLinkCommonProps, RaceLinkIcon } from "./RaceLink.types";

export type RaceLinkProps = {
  onPress: LinkOnPress;
} & RaceLinkCommonProps;

const raceLinkIconToGenericIcon = {
  [RaceLinkIcon.RaceClosed]: (
    <GenericIcon name={RichContentIconName.HORSE_LOLLIPOP_SELECTED} color={tokens.RaceLinkIconSecondaryColour} />
  ),
  [RaceLinkIcon.Promotion]: <GenericIcon name={ValueIconName.MONEY_BACK} color={tokens.RaceLinkIconColour} />,
  [RaceLinkIcon.ExtraPlaces]: <GenericIcon name={ValueIconName.EXTRA_PLACES} color={tokens.RaceLinkIconColour} />,
};

export const RaceLink: FunctionComponent<RaceLinkProps> = ({
  item,
  onPress,
  iconStates,
  isDetailed = false,
  isGrid = false,
}) => {
  const raceLinkContainerStyle = useMemo(
    () => [styles.container, isDetailed && styles.detailed, isGrid && styles.grid],
    [isDetailed, isGrid],
  );

  const iconsToShow = useMemo(() => iconStates.slice(0, 2), [iconStates]);

  return (
    <Pressable {...getTestProps(RACE_LINK, false)} style={raceLinkContainerStyle} onPress={onPress}>
      {!!iconsToShow.length && (
        <View {...getTestProps(RACE_LINK_ICON_WRAPPER, false)} style={styles.iconWrapper}>
          {iconsToShow.map((iconState, index) => (
            <View key={index} {...getTestProps(RACE_LINK_ICON, false)} style={styles.icon}>
              {raceLinkIconToGenericIcon[iconState]}
            </View>
          ))}
        </View>
      )}
      <View {...getTestProps(RACE_LINK_TEXT_WRAPPER, false)} style={styles.textWrapper}>
        {!!item.title && (
          <Text {...getTestProps(RACE_LINK_TIME)} style={styles.raceTitle}>
            {item.title}
          </Text>
        )}
        {!!item.subtitle && (
          <Text {...getTestProps(RACE_LINK_SUBTITLE)} numberOfLines={2} style={styles.subtitle}>
            {item.subtitle}
          </Text>
        )}
      </View>
    </Pressable>
  );
};
