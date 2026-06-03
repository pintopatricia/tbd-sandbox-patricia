import { FunctionComponent, useCallback, MouseEvent } from "react";
import { IconButton, ScrollableSwimlane } from "@ppb/the-wall-web";
import styles from "./SportRibbonCardGroup.web.css";
import { ComponentProps } from "./props";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";

const SportRibbonCardGroup: FunctionComponent<ComponentProps> = ({
  urn,
  items,
  isSportsRibbonHighlighted,
  getIcon,
  dispatchRouterPushAction,
  dispatchNavigationViewFromFavourites,
}) => {
  const onClick = useCallback(
    (event: MouseEvent, { viewLink, title }: (typeof items)[number]) => {
      event.preventDefault();
      dispatchRouterPushAction(viewLink);
      dispatchNavigationViewFromFavourites(title, viewLink.viewUrl, urn);
    },
    [dispatchNavigationViewFromFavourites, dispatchRouterPushAction, urn],
  );

  const hasTags = items.some((item) => item.label);

  return (
    <ScrollableSwimlane isHighlighted={isSportsRibbonHighlighted}>
      {items.map((item, index) => (
        <div key={`${urn}-${index}`} className={styles.sportViewLink}>
          <IconButton
            icon={getIcon(item.icon, item.badge, item.sportId)}
            text={i18n({ key: item.title as keyof TranslationKey })}
            isLargeIcon
            isHighlighted={hasTags || isSportsRibbonHighlighted}
            onPress={(e) => onClick(e, item)}
            tag={hasTags ? item.label || "" : undefined}
          />
        </div>
      ))}
    </ScrollableSwimlane>
  );
};

export default SportRibbonCardGroup;
