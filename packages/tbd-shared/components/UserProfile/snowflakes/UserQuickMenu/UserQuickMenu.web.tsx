import { FunctionComponent, MouseEvent } from "react";
import classnames from "classnames";
import { ViewLink } from "@ppb/the-wall-common/types";
import { NavButton } from "../NavButton/NavButton.web";
import styles from "./UserQuickMenu.web.css";

export type UserQuickMenuItem = {
  label: string;
  viewLink: ViewLink;
};

export type UserQuickMenuOnClick = (event: MouseEvent, url: string) => void;

type UserQuickMenuProps = {
  items: UserQuickMenuItem[];
};

type UserQuickMenuViewModel = {
  onItemClick: UserQuickMenuOnClick;
} & UserQuickMenuProps;

export const UserQuickMenu: FunctionComponent<UserQuickMenuViewModel> = ({ items, onItemClick }) => (
  <div className={styles.userQuickMenu}>
    {items.map(({ label, viewLink }, index) => (
      <div key={index} className={styles.userQuickMenuContainer}>
        <div className={classnames(styles.userQuickMenuItem, styles.userQuickMenuContainerHeight)}>
          <NavButton url={viewLink.viewUrl} onClick={(event: MouseEvent) => onItemClick(event, viewLink.viewUrl)}>
            <span className="typography-h280">{label}</span>
          </NavButton>
        </div>
      </div>
    ))}
  </div>
);
