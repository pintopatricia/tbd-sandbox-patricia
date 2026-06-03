import { FunctionComponent, useContext } from "react";
import * as React from "react";
import { PebbleList } from "@ppb/the-wall-web";
import { PebbleListViewModel } from "@ppb/the-wall-common/types/Pebbles/PebbleList.web.types";
import styles from "./PebbleMarketTemplate.web.css";
import { ConfigContext } from "../../../Config/ConfigContext";

export type PebbleMarketTemplateProps = PebbleListViewModel & {
  children: React.ReactNode;
};

/**
 * Over and under dual usage market component
 *
 * @param items Pebble items list
 * @param defaultSelectedPebble The selected pebble
 * @param onPebbleClick Pebble click callback
 * @returns The component html
 */
export const PebbleMarketTemplate: FunctionComponent<PebbleMarketTemplateProps> = ({
  items,
  defaultSelectedPebble,
  onPebbleClick,
  children,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);
  return (
    <div className={styles.pebbleMarketCardContainer}>
      {items.length > 0 && (
        <div className={styles.pebbleListContainer}>
          <PebbleList
            onPebbleClick={onPebbleClick}
            items={items}
            defaultSelectedPebble={defaultSelectedPebble}
            isDesktopLayout={isDesktopLayout}
          />
        </div>
      )}
      {children}
    </div>
  );
};
