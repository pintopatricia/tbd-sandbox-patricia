import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";
import { Card, Divider, QuickLink, Text } from "@ppb/the-wall-native";
import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SportIcon } from "@ppb/the-wall-icons/SportIcon/SportIcon";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { ViewLink } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { navigate } from "@ppb/tbd-router/native";
import { ShadowedView } from "react-native-fast-shadow";
import { ComponentProps } from "./props";
import styles from "./QuickLinksCard.native.styles";
import { QUICK_LINKS, QUICK_LINKS_TITLE } from "./QuickLinksCard.native.selectors";
import { getQuicklinkRoundCorners } from "../../helpers/quicklink";

/**
 * Function component that wraps quick links card
 *
 * @param props The component props
 * @returns The react component
 */
const QuickLinksCard: FunctionComponent<ComponentProps> = ({
  title,
  accordionTitle,
  accordionExpanded,
  links,
  urn,
  navigateToQuickLink,
}) => {
  const handleOnPress = useCallback(
    (viewLinkProp: ViewLink, text: string) => {
      navigateToQuickLink(viewLinkProp, text, urn, title);
      navigate(viewLinkProp);
    },
    [navigateToQuickLink, urn, title],
  );

  const linksMap = useCallback(
    (isLightBackground = false) => (
      <ShadowedView style={styles.shadow}>
        <View style={[!isLightBackground && styles.primaryList]}>
          {links.map(({ label, target, viewLink, icon }, index) => {
            const roundCorners = !isLightBackground ? getQuicklinkRoundCorners(links, index) : undefined;

            const color = isLightBackground
              ? tokens.QuickLinkSecondaryDefaultPrefixIconColour
              : tokens.QuickLinkPrimaryDefaultPrefixIconColour;

            return (
              <View key={`quick-link-card-item-${viewLink.viewUrn}`}>
                <QuickLink
                  key={viewLink.viewUrn}
                  item={{ viewLink, text: label, target: target ?? undefined }}
                  icon={
                    icon ? (
                      <View style={styles.icon}>
                        <SportIcon sportId={icon} color={color} />
                      </View>
                    ) : undefined
                  }
                  onPress={() => handleOnPress(viewLink, label)}
                  isLightBackground={isLightBackground}
                  withShadow={false}
                  roundCorners={roundCorners}
                />
                {isLightBackground && links.length > 1 && <Divider />}
              </View>
            );
          })}
        </View>
      </ShadowedView>
    ),
    [links, handleOnPress],
  );

  if (!links.length) {
    return null;
  }

  return (
    <View {...getTestProps(QUICK_LINKS, false)} style={styles.container}>
      {title && (
        <Text {...getTestProps(QUICK_LINKS_TITLE)} style={styles.title}>
          {title}
        </Text>
      )}
      <View style={styles.listContainer}>
        {accordionTitle ? (
          <Card
            key={urn}
            startOpen={accordionExpanded}
            title={accordionTitle}
            theme={CardTheme.SECONDARY}
            size={CardHeaderSize.LARGE}
            isCollapsible
            fullWidthContent
          >
            {linksMap(true)}
          </Card>
        ) : (
          linksMap()
        )}
      </View>
    </View>
  );
};

export default QuickLinksCard;
