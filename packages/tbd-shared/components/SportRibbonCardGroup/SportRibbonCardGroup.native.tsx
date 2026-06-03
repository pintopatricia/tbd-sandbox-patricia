import { FunctionComponent, useCallback } from "react";
import { IconButton, ScrollableSwimlane } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router/native";
import { ScrollView, View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ComponentProps } from "./props";
import { SPORTS_RIBBON_CARD_ITEM } from "./SportRibbonCardGroup.native.selectors";
import styles from "./SportRibbonCardGroup.native.styles";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";

const SportRibbonCardGroup: FunctionComponent<ComponentProps> = ({
  urn,
  items,
  isSportsRibbonHighlighted,
  getIcon,
  dispatchNavigationViewFromFavourites,
}) => {
  const onPress = useCallback(
    ({ viewLink, title }: (typeof items)[number]) => {
      dispatchNavigationViewFromFavourites(title, viewLink.viewUrl, urn);
      navigate(viewLink);
    },
    [urn, dispatchNavigationViewFromFavourites],
  );

  const hasTags = items.some((item) => item.label);

  return (
    <ScrollableSwimlane isHighlighted={isSportsRibbonHighlighted}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
        {items.map((item, index) => (
          <View
            key={`sports-ribbon-card-${index}`}
            style={styles.iconButton}
            {...getTestProps(SPORTS_RIBBON_CARD_ITEM, false)}
          >
            <IconButton
              icon={getIcon(item.icon, item.badge, item.sportId)}
              text={i18n({ key: item.title as keyof TranslationKey })}
              isLargeIcon
              isHighlighted={hasTags || isSportsRibbonHighlighted}
              onPress={() => onPress(item)}
              tag={hasTags ? item.label || "" : undefined}
            />
          </View>
        ))}
      </ScrollView>
    </ScrollableSwimlane>
  );
};

export default SportRibbonCardGroup;
