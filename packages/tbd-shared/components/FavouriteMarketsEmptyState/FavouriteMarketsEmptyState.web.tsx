import type { FunctionComponent, JSX } from "react";
import { EmptyStateIconSize } from "@ppb/the-wall-common/types";
import { AssetsIconName } from "@ppb/the-wall-icons/types";
import { Card, EmptyState } from "@ppb/the-wall-web";
import { i18n } from "../../helpers/i18n";
import styles from "./FavouriteMarketsEmptyState.web.css";
import { ComponentProps } from "./props";

export const FavouriteMarketsEmptyState: FunctionComponent<ComponentProps> = ({ hasImage }): JSX.Element => {
  return (
    <div className={styles.favouriteMarketsEmptyState}>
      <Card fullWidthContent>
        <div className={styles.cardContent}>
          <EmptyState
            hasImage={hasImage}
            icon={AssetsIconName.NO_FAVOURITES_ADDED}
            iconSize={EmptyStateIconSize.SMALL}
            title={i18n({ key: "I18N.FAVOURITE_MARKETS.EMPTY_STATE.TITLE" })}
            message={i18n({ key: "I18N.FAVOURITE_MARKETS.EMPTY_STATE.MESSAGE" })}
          />
        </div>
      </Card>
    </div>
  );
};
