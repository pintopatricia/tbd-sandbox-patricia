import { FunctionComponent, MouseEvent, useCallback } from "react";
import * as React from "react";
import classnames from "classnames";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName, SystemIconName } from "@ppb/the-wall-icons";
import styles from "./RaceViewLinkCard.web.css";
import { RaceViewLinkCardProps } from "./RaceViewLinkCard.types";

export const RaceViewLinkCard: FunctionComponent<RaceViewLinkCardProps> = ({
  countryFlag,
  imageAlt,
  onClick,
  title,
  subtitleLabel,
  subtitle,
}) => {
  const titleClass = classnames(styles.title, "typography-h152");
  const subTitleClass = classnames("typography-h082", styles.subtitleLabel);
  const wrapperClass = classnames(styles.wrapper, subtitle ? styles.space : styles.flexEnd);
  const onClickCallback = useCallback(
    (event: MouseEvent | React.KeyboardEvent<HTMLDivElement>) => {
      event.preventDefault();
      onClick();
    },
    [onClick],
  );
  const hasCountryFlag = countryFlag && (countryFlag.small || countryFlag.medium || countryFlag.large);

  return (
    <div
      className={styles.raceViewLinkCard}
      onClick={onClickCallback}
      role="link"
      tabIndex={0}
      onKeyPress={onClickCallback}
    >
      {hasCountryFlag ? (
        <img
          loading="lazy"
          srcSet={`${countryFlag?.small} 1x, ${countryFlag?.medium} 2x, ${countryFlag?.large} 3x`}
          alt={imageAlt}
          className={styles.image}
        />
      ) : (
        <div className={styles.image}>
          <GenericIcon name={AssetsIconName.CIRCULAR_PLACEHOLDER} />
        </div>
      )}
      <span className={titleClass}>{title}</span>
      <div className={wrapperClass}>
        {subtitle && subtitleLabel && (
          <div className={styles.subTitleContainer}>
            <span className={subTitleClass}>{subtitleLabel}</span>
            <span className={"typography-h152"}>{subtitle}</span>
          </div>
        )}
        <div className={styles.arrow}>
          <GenericIcon name={SystemIconName.ARROW_BIG_RIGHT} color={"var(--neutrals-icon-secondary)"} />
        </div>
      </div>
    </div>
  );
};
