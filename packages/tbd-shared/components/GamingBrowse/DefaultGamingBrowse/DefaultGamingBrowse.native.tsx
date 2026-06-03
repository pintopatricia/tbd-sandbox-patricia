import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";
import { QuickLink, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { navigate } from "@ppb/tbd-router/native";
import { ComponentProps } from "./props";
import ConnectedCard from "../../Card";
import Card from "../../Card/Card.native";
import styles from "./DefaultGamingBrowse.native.styles";
import selectors from "./DefaultGamingBrowse.native.selectors";
import { getQuicklinkRoundCorners } from "../../../helpers/quicklink";

const DefaultGamingBrowse: FunctionComponent<ComponentProps> = ({
  urn,
  defaultGamingi18n,
  categoryLinks,
  typename,
}) => {
  const handleOnPress = useCallback(
    (viewLink: ViewLink) => () => {
      navigate(viewLink);
    },
    [],
  );

  return (
    <View style={styles.defaultGamingContainer} {...getTestProps(selectors.DEFAULT_GAMING_CONTAINER, false)}>
      <ConnectedCard component={Card} urn={urn} typename={typename} />
      <Text style={styles.quickLinksSubtitle} {...getTestProps(selectors.QUICK_LINKS_SUBTITLE, false)}>
        {defaultGamingi18n.i18n.subtitle}
      </Text>
      <View style={styles.quickLinksContainer} {...getTestProps(selectors.QUICK_LINKS_CONTAINER, false)}>
        {categoryLinks.map((item, index) => {
          const roundCorners = getQuicklinkRoundCorners(categoryLinks, index);

          return (
            <QuickLink
              key={`${item.viewLink.viewUrn}:${item.text}`}
              item={item}
              roundCorners={roundCorners}
              onPress={handleOnPress(item.viewLink)}
            />
          );
        })}
      </View>
    </View>
  );
};

export default DefaultGamingBrowse;
