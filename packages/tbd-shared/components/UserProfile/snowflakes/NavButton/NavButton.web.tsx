import { FunctionComponent } from "react";
import classnames from "classnames";
import { ButtonAlign, ButtonProps, ButtonViewModel } from "@ppb/the-wall-web/components/Buttons/button";

import styles from "./NavButton.web.css";

type NavButtonProps = {
  url: string;
} & ButtonProps;

type NavButtonViewModel = ButtonViewModel & NavButtonProps;

export const NavButton: FunctionComponent<NavButtonViewModel> = ({
  url,
  hasOutline = true,
  contentAlign,
  children,
  onClick,
}) => {
  const className = classnames(styles.button, styles.navButton, {
    [styles.alignLeft]: contentAlign === ButtonAlign.Left,
    [styles.alignRight]: contentAlign === ButtonAlign.Right,
    [styles.withoutOutline]: !hasOutline,
  });

  return (
    <a className={className} href={url} onClick={onClick}>
      {children}
    </a>
  );
};
