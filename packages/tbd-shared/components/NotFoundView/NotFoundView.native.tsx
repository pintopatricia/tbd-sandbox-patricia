import type { JSX } from "react";
import { FunctionComponent, useCallback, useMemo } from "react";
import { View, Pressable } from "react-native";
import { EmptyState, Text } from "@ppb/the-wall-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { NavigationIconName, SportsIconName } from "@ppb/the-wall-icons";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { colors } from "@ppb/the-wall-common/base-theme";
import { QuickLink } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { navigate } from "@ppb/tbd-router/native";
import { LINK, LINKS_CONTAINER, NOT_FOUND_VIEW } from "./NotFoundView.native.selectors";
import { ComponentProps } from "./props";
import styles from "./NotFoundView.native.styles";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";

const iconMap = {
  HOME: <GenericIcon name={NavigationIconName.HOME} color={colors.NeutralsIconSecondary} />,
  MY_BETS: <GenericIcon name={NavigationIconName.MY_BETS} color={colors.NeutralsIconSecondary} />,
  IN_PLAY: <GenericIcon name={SportsIconName.IN_PLAY} color={colors.NeutralsIconSecondary} />,
};

const NotFoundView: FunctionComponent<ComponentProps> = ({ messages, links, items, hasErrorViewImage }) => {
  const renderItems = (): JSX.Element[] | JSX.Element | null => {
    if (items?.length) {
      return items.map(({ urn: cardUrn, typename }, index) => (
        <ConnectedCard key={`${cardUrn}-${index}`} urn={cardUrn} component={Card} typename={typename} visible={true} />
      ));
    }

    return null;
  };

  const onPress = useCallback((link: QuickLink) => {
    const { viewUrn, viewUrl } = link.viewLink;

    navigate({ viewUrn, viewUrl });
  }, []);

  const iconsMemo = useMemo(
    () => (
      <>
        {links.map((link, index) => {
          const Icon = iconMap[link.icon];
          return (
            <View key={`not-found-icon-${index}`} style={styles.link}>
              <Pressable style={styles.iconContainer} onPress={() => onPress(link)}>
                <View style={styles.icon}>{Icon}</View>
              </Pressable>
              <Text style={styles.text} {...getTestProps(LINK, false)}>
                {link.label}
              </Text>
            </View>
          );
        })}
      </>
    ),
    [links, onPress],
  );

  return (
    <>
      <View style={styles.notFoundViewContainer} {...getTestProps(NOT_FOUND_VIEW, false)}>
        <EmptyState title={messages.title} message={messages.message} hasImage={hasErrorViewImage} />
        <View {...getTestProps(LINKS_CONTAINER, false)} style={styles.relatedLinks}>
          {iconsMemo}
        </View>
        {renderItems()}
      </View>
    </>
  );
};

export default NotFoundView;
