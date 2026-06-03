import { FunctionComponent, RefObject, useCallback, KeyboardEvent } from "react";
import useStatelessOutsideEvents from "@ppb/the-wall-web/hooks/useStatelessOutsideEvents";
import styles from "./UserMenu.web.css";

export type UserMenuItemOnClick = () => void;

export type UserMenuItem = { label: string; onClick?: UserMenuItemOnClick; href?: string };

type UserMenuProps = {
  items: UserMenuItem[];
  onDismiss: () => void;
  exceptionList?: RefObject<HTMLElement | null>[];
};

const OUTSIDE_EVENTS = ["click"];

export const UserMenu: FunctionComponent<UserMenuProps> = ({ items, onDismiss, exceptionList }) => {
  const menuRef = useStatelessOutsideEvents<HTMLUListElement>(OUTSIDE_EVENTS, onDismiss, exceptionList);

  const onMenuPaneOnKeyUp = useCallback(
    (e: KeyboardEvent): void => {
      if (e.keyCode === 27) {
        // "ESC" key
        onDismiss();
      }
    },
    [onDismiss],
  );

  return (
    <ul ref={menuRef} role="menu" className={styles.userMenu} onKeyUp={onMenuPaneOnKeyUp}>
      {items.map(({ href, label, onClick }) => (
        <div key={label} role="menuitem" tabIndex={0} onClick={onClick} onKeyUp={() => {}}>
          {href ? (
            <a href={href} className={styles.userMenuLink}>
              <li className={`${styles.userMenuItem} typography-h280`}>{label}</li>
            </a>
          ) : (
            <li className={`${styles.userMenuItem} typography-h280`}>{label}</li>
          )}
        </div>
      ))}
    </ul>
  );
};
