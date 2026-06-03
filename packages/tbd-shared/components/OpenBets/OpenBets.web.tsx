import { FunctionComponent, useCallback, useMemo } from "react";
import * as React from "react";

import { Link } from "@ppb/the-wall-web";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { NavigationIconName } from "@ppb/the-wall-icons/types";
import { ComponentProps } from "./props";
import styles from "./OpenBets.web.css";

export const OpenBets: FunctionComponent<ComponentProps> = ({ viewLink, dispatchOpenBetsNavigation }) => {
  const onOpenBetsPress = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      return viewLink && dispatchOpenBetsNavigation(viewLink);
    },
    [dispatchOpenBetsNavigation, viewLink],
  );
  const item = useMemo(() => ({ viewLink, isTextLink: false }), [viewLink]);

  if (!viewLink) {
    return null;
  }

  return (
    <Link item={item} onClick={onOpenBetsPress}>
      <div className={styles.openBets}>
        <GenericIcon name={NavigationIconName.MY_BETS} />
      </div>
    </Link>
  );
};
