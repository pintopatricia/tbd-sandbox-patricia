import { FunctionComponent } from "react";
import classnames from "classnames";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { RichContentIconName, ValueIconName } from "@ppb/the-wall-icons/types";
import { LinkOnClick } from "@ppb/the-wall-common/types/Link/Link.web.types";
import styles from "./RaceLink.web.css";

import { RaceLinkCommonProps, RaceLinkIcon } from "./RaceLink.types";

export type RaceLinkProps = {
  onLinkClick: LinkOnClick;
} & RaceLinkCommonProps;

export const RaceLink: FunctionComponent<RaceLinkProps> = ({
  item,
  onLinkClick,
  iconStates,
  isDetailed = false,
  isGrid = false,
}) => {
  const iconsToShow = iconStates.slice(0, 2);

  const iconComponent = {
    [RaceLinkIcon.RaceClosed]: (
      <GenericIcon name={RichContentIconName.HORSE_LOLLIPOP_SELECTED} color="var(--race-link-icon-secondary-colour)" />
    ),
    [RaceLinkIcon.Promotion]: <GenericIcon name={ValueIconName.MONEY_BACK} color="var(--race-link-icon-colour)" />,
    [RaceLinkIcon.ExtraPlaces]: <GenericIcon name={ValueIconName.EXTRA_PLACES} color="var(--race-link-icon-colour)" />,
  };

  return (
    <a
      className={classnames(styles.link, isDetailed && styles.detailed, isGrid && styles.grid)}
      href={item.viewLink.viewUrl}
      onClick={onLinkClick}
    >
      {!!iconsToShow.length && (
        <div className={styles.iconWrapper}>
          {iconsToShow.map((iconState, index) => (
            <div key={index} className={styles.icon}>
              {iconComponent[iconState]}
            </div>
          ))}
        </div>
      )}
      <div className={classnames(styles.textWrapper)}>
        <div className={styles.racetime}>{item.title}</div>
        {item.subtitle && <div className={styles.subtitle}>{item.subtitle}</div>}
      </div>
    </a>
  );
};
