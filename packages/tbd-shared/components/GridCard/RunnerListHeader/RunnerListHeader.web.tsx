import * as React from "react";
import { AzSwitcherProps } from "@ppb/the-wall-common/types";
import { MarketBlurbs } from "@ppb/the-wall-web";
import { GridCardItem } from "../map-to-props-factory";
import styles from "./RunnerListHeader.web.css";

type RunnerListHeaderProps = {
  items: GridCardItem[];
  azSwitcherProps?: AzSwitcherProps;
};

const RunnerListHeader: React.FC<RunnerListHeaderProps> = ({ items, azSwitcherProps }) => {
  const columns = items.map(({ label: itemLabel }) => itemLabel);

  return (
    <div className={styles.marketHeader}>
      <MarketBlurbs columns={columns} columnGrid azSwitcherProps={azSwitcherProps} />
    </div>
  );
};

export default RunnerListHeader;
