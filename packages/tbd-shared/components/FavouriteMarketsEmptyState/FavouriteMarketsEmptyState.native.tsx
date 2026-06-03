import type { FunctionComponent, JSX } from "react";
import { View } from "react-native";
import { EmptyStateIconSize } from "@ppb/the-wall-common/types";
import { AssetsIconName } from "@ppb/the-wall-icons/types";
import { Card, EmptyState } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { i18n } from "../../helpers/i18n";
import styles from "./FavouriteMarketsEmptyState.native.styles";
import { FAVOURITE_MARKETS_EMPTY_STATE } from "./FavouriteMarketsEmptyState.native.selectors";
import { ComponentProps } from "./props";

export const FavouriteMarketsEmptyState: FunctionComponent<ComponentProps> = ({ hasImage }): JSX.Element => {
  return (
    <View {...getTestProps(FAVOURITE_MARKETS_EMPTY_STATE, false)} style={styles.favouriteMarketsEmptyState}>
      <Card fullWidthContent>
        <View style={styles.cardContent}>
          <EmptyState
            hasImage={hasImage}
            icon={AssetsIconName.NO_FAVOURITES_ADDED}
            iconSize={EmptyStateIconSize.SMALL}
            title={i18n({ key: "I18N.FAVOURITE_MARKETS.EMPTY_STATE.TITLE" })}
            message={i18n({ key: "I18N.FAVOURITE_MARKETS.EMPTY_STATE.MESSAGE" })}
          />
        </View>
      </Card>
    </View>
  );
};
