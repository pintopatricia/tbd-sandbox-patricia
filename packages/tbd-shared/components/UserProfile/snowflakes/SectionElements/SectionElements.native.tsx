import type { JSX } from "react";
import { Fragment, FunctionComponent, useMemo } from "react";
import { FlexStyle, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Card, Divider, QuickLink, TBDImage, Text } from "@ppb/the-wall-native";
import { ShadowedView } from "react-native-fast-shadow";
import { Clock } from "../Clock/Clock.native";
import {
  Alignment,
  ClockItem,
  CookieConsent,
  ImageItem,
  Item,
  Labels,
  RegulatoryLinkItem,
  SectionElementsProps,
} from "../RegulatorySectionsSession/RegulatorySections.types";
import { RegulatorySectionsSession } from "../RegulatorySectionsSession/RegulatorySectionsSession.native";

import { isDGALogo } from "./SectionElements.helper";
import {
  SECTION_ELEMENTS,
  SECTION_ELEMENTS_ELEMENT,
  SECTION_ELEMENTS_IMAGE_ELEMENT,
  SECTION_ELEMENTS_LINK_ELEMENT,
  SECTION_ELEMENTS_CLOCK_ELEMENT,
  SECTION_ELEMENTS_TITLE,
} from "./SectionElements.native.selectors";
import styles from "./SectionElements.native.styles";
import { getQuicklinkRoundCorners } from "../../../../helpers/quicklink";

export type OnSectionPress = (item: RegulatoryLinkItem | ImageItem | CookieConsent) => void;

type SectionElementsNativeProps = {
  onSectionPress: OnSectionPress;
};

export type SectionElementsNativeViewModel = SectionElementsProps & SectionElementsNativeProps;

const ALIGNMENTS: Alignment[] = ["left", "right", "center"];

const getAlignment = (alignment: Alignment): FlexStyle["alignItems"] => {
  switch (alignment) {
    case "left":
      return "flex-start";
    case "center":
      return "center";
    case "right":
      return "flex-end";
    default:
      return "center";
  }
};

type RegulatoryClockViewModel = {
  item: ClockItem;
};

const RegulatoryClock: FunctionComponent<RegulatoryClockViewModel> = ({ item }) => {
  const clockStyles = useMemo(
    () => [
      styles.clockContainer,
      {
        alignItems: getAlignment(item.alignment),
      },
    ],
    [item.alignment],
  );

  const renderClock = useMemo(() => <Clock timeZone={item.timeZone} />, [item.timeZone]);

  return (
    <View {...getTestProps(SECTION_ELEMENTS_CLOCK_ELEMENT, false)} style={clockStyles}>
      {item.text ? (
        <View style={styles.clockWithText}>
          <Text style={styles.clockText}>{item.text}</Text>
          {renderClock}
        </View>
      ) : (
        renderClock
      )}
    </View>
  );
};

function renderQuickLinksSection(
  quickLinks: (RegulatoryLinkItem | CookieConsent)[],
  onSectionPress: OnSectionPress,
  isCollapsable = false,
): JSX.Element | null {
  const links = quickLinks.map((item, index) => {
    const isNextQuickLink = ["LINK", "COOKIE_CONSENT"].includes(quickLinks[index + 1]?.type);
    const roundCorners = !isCollapsable ? getQuicklinkRoundCorners(quickLinks, index) : undefined;

    return (
      <View key={`${item.text}-${index}`}>
        <QuickLink
          item={item}
          onPress={() => onSectionPress(item)}
          isLightBackground={isCollapsable}
          withShadow={false}
          roundCorners={roundCorners}
        />

        {isCollapsable && isNextQuickLink && <Divider></Divider>}
      </View>
    );
  });

  return (
    <View style={[!isCollapsable && styles.quickLinksContainer]}>
      <ShadowedView style={styles.shadow}>
        <View style={[!isCollapsable && styles.quickLinksList]} {...getTestProps(SECTION_ELEMENTS_LINK_ELEMENT, false)}>
          {links}
        </View>
      </ShadowedView>
    </View>
  );
}

function renderSectionElement(
  item: Item,
  index: number,
  array: Item[],
  onSectionPress: OnSectionPress,
  labels?: Labels,
): JSX.Element | null {
  switch (item.type) {
    case "TEXT": {
      const isPreviousImage = ["IMAGE"].includes(array[index - 1]?.type);
      const isNextImage = ["IMAGE"].includes(array[index + 1]?.type);

      const textStyles = [
        styles.text,
        (isPreviousImage || index === 0) && styles.resetMarginTop,
        {
          textAlign: item.alignment || "left",
        },
        isNextImage && styles.marginBottom,
      ];
      return (
        <Text key={`${item.text}-${index}`} style={textStyles} {...getTestProps(SECTION_ELEMENTS_ELEMENT, false)}>
          {item.text}
        </Text>
      );
    }

    case "IMAGE":
      if (item.viewLink) {
        // Behaviour from Web -> when an image is followed by other image, alignment should be ignored
        const isNextImage = array[index + 1]?.type === "IMAGE";
        const isPreviousImage = array[index - 1]?.type === "IMAGE";
        const imageStyles: StyleProp<ViewStyle>[] = [
          (isNextImage || isPreviousImage) && styles.imageSection,
          !isNextImage &&
            !isPreviousImage && {
              ...styles.imageSectionStretched,
              alignItems:
                (item.alignment === "left" && "flex-start") || (item.alignment === "right" && "flex-end") || "center",
            },
        ];
        return (
          <View
            key={`${index}-${item.imageURL}`}
            style={imageStyles}
            {...getTestProps(SECTION_ELEMENTS_IMAGE_ELEMENT, false)}
          >
            <Pressable onPress={() => onSectionPress(item)}>
              <TBDImage
                style={[styles.image, isDGALogo(item) && styles.largeImage]}
                resizeMode="contain"
                source={item.imageURL}
              />
            </Pressable>
          </View>
        );
      }
      return (
        <View
          key={`${item.imageURL}-${index}`}
          style={styles.imageSection}
          {...getTestProps(SECTION_ELEMENTS_IMAGE_ELEMENT, false)}
        >
          <TBDImage style={styles.image} resizeMode="contain" source={item.imageURL} />
        </View>
      );

    case "SESSION":
    case "LOGGED_IN_SINCE":
    case "LAST_LOG_IN": {
      const sessionStyles: StyleProp<ViewStyle>[] = [
        styles.section,
        styles.session,
        item.alignment && {
          alignSelf:
            (item.alignment === "left" && "flex-start") || (item.alignment === "right" && "flex-end") || "center",
        },
      ];
      return (
        <View key={`${item.text}-${index}`} style={sessionStyles} {...getTestProps(SECTION_ELEMENTS_ELEMENT, false)}>
          <RegulatorySectionsSession item={item} />
        </View>
      );
    }
    case "USER_DETAILS": {
      const textStyles = [
        styles.userDetails,
        styles.text,
        {
          textAlign: ALIGNMENTS.find((value) => value === item.alignment) || "center",
        },
      ];
      return (
        <Text key={`userDetails-${index}`} style={textStyles} {...getTestProps(SECTION_ELEMENTS_ELEMENT, false)}>
          {`${item.firstName} ${item.lastName} - ${
            item.nationalIdentifier && labels?.nationalIdentifierLabel ? labels.nationalIdentifierLabel : ""
          }
            ${item.nationalIdentifier || ""} - ${
              item.contractNumber && labels?.contractNumberLabel ? labels.contractNumberLabel : ""
            } ${item.contractNumber || ""}`}
        </Text>
      );
    }
    case "CLOCK":
      return <RegulatoryClock key={`${item.timeFormat}-${index}`} item={item} />;

    default:
      return null;
  }
}

export const SectionElements: FunctionComponent<SectionElementsNativeViewModel> = ({
  section,
  onSectionPress,
  labels,
}) => {
  const items = useMemo(() => {
    const quicklinksArray: (RegulatoryLinkItem | CookieConsent)[] = [];

    return section.items.map((item, index, array) => {
      if (item.type === "LINK" || item.type === "COOKIE_CONSENT") {
        const isNextItemLink = ["LINK", "COOKIE_CONSENT"].includes(array[index + 1]?.type);
        quicklinksArray.push(item);

        if (!isNextItemLink) {
          const linksArray = [...quicklinksArray];
          quicklinksArray.length = 0; // reset quicklinks array for next sections

          const isCollapsable = section.sectionType === "ACCORDION";
          return (
            <Fragment key={`section-elements-quicklinks-${index}`}>
              {renderQuickLinksSection(linksArray, onSectionPress, isCollapsable)}
            </Fragment>
          );
        }
      }

      return renderSectionElement(item, index, array, onSectionPress, labels);
    });
  }, [labels, onSectionPress, section.items, section.sectionType]);

  switch (section.sectionType) {
    case "GENERIC":
      return (
        <View style={styles.section} {...getTestProps(SECTION_ELEMENTS, false)}>
          {section.title && (
            <Text style={styles.sectionTitle} {...getTestProps(SECTION_ELEMENTS_TITLE)}>
              {section.title}
            </Text>
          )}
          <View style={styles.sectionElements}>{items}</View>
        </View>
      );

    case "ACCORDION":
      return (
        <View {...getTestProps(SECTION_ELEMENTS, false)}>
          <Card
            startOpen
            title={section.title}
            theme={section.theme ?? CardTheme.PRIMARY}
            size={CardHeaderSize.LARGE}
            isCollapsible
            fullWidthContent
          >
            {items}
          </Card>
        </View>
      );

    default:
      return null;
  }
};
