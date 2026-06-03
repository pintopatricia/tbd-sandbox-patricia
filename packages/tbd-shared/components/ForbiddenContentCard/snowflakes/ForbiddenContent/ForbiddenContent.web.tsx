import { ComponentTheme } from "@ppb/the-wall-common/types";
import { FunctionComponent } from "react";
import * as React from "react";
import classnames from "classnames";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { ForbiddenCardSize, type ForbiddenContentBaseProps } from "./ForbiddenContent.types";
import styles from "./ForbiddenContent.web.css";

export type ForbiddenContentProps = {
  children: React.ReactNode;
} & ForbiddenContentBaseProps;

export const ForbiddenContent: FunctionComponent<ForbiddenContentProps> = ({
  children,
  theme = ComponentTheme.Dark,
  size = ForbiddenCardSize.Default,
}) => {
  // FIXME: the `lightTheme` should have been deleted when this component was deleted from the betslip
  const containerStyles = classnames(styles.container, {
    [styles.light]: [ComponentTheme.Light, ComponentTheme.LightTransparent].includes(theme),
    [styles.dark]: [ComponentTheme.Dark, ComponentTheme.DarkTransparent].includes(theme),
    [styles.transparent]: [ComponentTheme.LightTransparent, ComponentTheme.DarkTransparent].includes(theme),
    [styles.default]: size === ForbiddenCardSize.Default,
    [styles.small]: size === ForbiddenCardSize.Small,
  });

  return (
    <div className={containerStyles}>
      <div className={styles.lock}>
        <GenericIcon name={SystemIconName.LOCK_BIG} />
      </div>
      <div className={styles.label}>{children}</div>
    </div>
  );
};
