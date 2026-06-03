import { FunctionComponent, useEffect, useState } from "react";
import { Linking, Pressable, StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import FastImage from "react-native-fast-image";

import { tokens } from "@ppb/the-wall-common/base-theme";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { TBDImage } from "@ppb/the-wall-native/components/TBDImage/TBDImage";
import { Text } from "@ppb/the-wall-native";
import {
  Item,
  RegulatorySection,
  SessionItem,
} from "../../../UserProfile/snowflakes/RegulatorySectionsSession/RegulatorySections.types";
import {
  REGULATORY_HEADER_CONTAINER,
  REGULATORY_HEADER_IMAGE,
  REGULATORY_HEADER_LINK,
  REGULATORY_HEADER_SESSION,
  REGULATORY_HEADER_TEXT,
} from "./RegulatoryHeader.native.selectors";
import styles from "./RegulatoryHeader.native.styles";
import { Alignment, RegulatorySectionsHeaderProps } from "./RegulatoryHeader.types";

function convertMillisecondsToTime(milliseconds: number, format = "HH:MM:SS"): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);

  return format
    .toLowerCase()
    .replace("hh", hours.toString().padStart(2, "0"))
    .replace("mm", minutes.toString().padStart(2, "0"))
    .replace("ss", seconds.toString().padStart(2, "0"));
}

const Session: FunctionComponent<Pick<SessionItem, "time" | "timeFormat" | "text">> = ({ time, timeFormat, text }) => {
  const [dateGap, setDateGap] = useState<number>(() => Date.now() - new Date(time).getTime());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDateGap(dateGap + 1000);
    }, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [dateGap, time]);

  return (
    <>
      <View {...getTestProps(REGULATORY_HEADER_SESSION, false)} style={styles.sessionItem}>
        <Text style={styles.sessionItemLabel}>{text}</Text>
        <Text style={styles.sessionItemTime}>{convertMillisecondsToTime(dateGap, timeFormat)}</Text>
      </View>
    </>
  );
};

const RegulatoryHeaderItem: FunctionComponent<{ item: Item }> = ({ item }) => {
  switch (item.type) {
    case "TEXT":
      return (
        <Text {...getTestProps(REGULATORY_HEADER_TEXT, false)} style={styles.textItem}>
          {item.text}
        </Text>
      );

    case "LINK":
      return (
        <TouchableOpacity style={styles.linkItemContainer}>
          <Text
            {...getTestProps(REGULATORY_HEADER_LINK, false)}
            style={styles.linkItem}
            onPress={() => Linking.openURL(item.viewLink.viewUrl)}
          >
            {item.text}
          </Text>
        </TouchableOpacity>
      );

    case "IMAGE":
      if (item.viewLink) {
        const { viewLink } = item;

        return (
          <View {...getTestProps(REGULATORY_HEADER_IMAGE, false)}>
            <Pressable onPress={() => Linking.openURL(viewLink.viewUrl)}>
              <TBDImage
                style={styles.imageItem}
                source={item.imageURL}
                shouldAutoSize
                resizeMode={FastImage.resizeMode.contain}
              />
            </Pressable>
          </View>
        );
      }
      return (
        <View {...getTestProps(REGULATORY_HEADER_IMAGE, false)}>
          <TBDImage style={styles.imageItem} source={item.imageURL} />
        </View>
      );

    case "SESSION":
      return <Session time={item.time} text={item.text} timeFormat={item.timeFormat}></Session>;

    default:
      return null;
  }
};

const getSectionStyles = (section: RegulatorySection): StyleProp<ViewStyle> => ({
  ...(section.items.every((item: Item) => "alignment" in item && item.alignment === Alignment.Center) && {
    justifyContent: "center",
  }),
});

// This fixed height is to prevent an issue happening on Android in Denmark jurisdiction when the regulatory header does
// not expand to display all images and sometimes some of them stay behind the header. This issue doesn't seem to happen
// when running locally (either on the emulator or on a real device), but we are able to replicate it when opening the
// app created in the Flexible Environment.
const FIXED_DENMARK_HEADER_HEIGHT =
  tokens.RegulatoryHeaderPadding.paddingTop +
  tokens.RegulatoryHeaderVerticalGap.gap +
  2 * tokens.RegulatoryHeaderLogoSizing +
  tokens.RegulatoryHeaderPadding.paddingBottom;

export const RegulatoryHeader: FunctionComponent<RegulatorySectionsHeaderProps> = ({
  regulatorySections,
  isFixedHeight = false,
}) => (
  <View
    {...getTestProps(REGULATORY_HEADER_CONTAINER, false)}
    style={[styles.container, isFixedHeight && { height: FIXED_DENMARK_HEADER_HEIGHT }]}
  >
    {regulatorySections.map((section, index) => (
      <View key={`${section.sectionType}-${index}`} style={[styles.section, getSectionStyles(section)]}>
        {section.items.map((item, itemIndex) => (
          <RegulatoryHeaderItem key={`${item.type}-${itemIndex}`} item={item} />
        ))}
      </View>
    ))}
  </View>
);
