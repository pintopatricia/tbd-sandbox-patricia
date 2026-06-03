import type { FunctionComponent, MouseEvent } from "react";
import { HighlightedLinkCardIcon } from "@ppb/the-wall-web";
import type { GamingCategoryLinkProps } from "./GamingCategoryLink.types";
import styles from "./GamingCategoryLink.web.css";

type GamingCategoryLinkViewModelOnClick = (
  event: MouseEvent,
  viewLink: GamingCategoryLinkProps["viewLink"],
  categoryName: string,
  gamingZoneTitle: string,
) => void;

export type GamingCategoryLinkPropsViewModel = {
  onClick: GamingCategoryLinkViewModelOnClick;
  gamingZoneTitle: string;
} & GamingCategoryLinkProps;

export const GamingCategoryLink: FunctionComponent<GamingCategoryLinkPropsViewModel> = ({
  gamingZoneTitle,
  viewLink,
  cardIcon,
  label,
  buttonText,
  onClick,
}) => (
  <a
    className={styles.gamingCategory}
    href={viewLink.viewUrl}
    onClick={(e) => onClick(e, viewLink, label, gamingZoneTitle)}
  >
    {cardIcon && <div className={styles.icon}>{HighlightedLinkCardIcon[cardIcon]}</div>}
    <h3 className="typography-h380">{label}</h3>
    <span className={styles.categoryButton}>{buttonText}</span>
  </a>
);
