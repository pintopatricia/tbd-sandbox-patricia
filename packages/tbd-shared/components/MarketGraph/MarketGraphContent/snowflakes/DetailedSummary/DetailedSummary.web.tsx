import type { JSX } from "react";
import { FunctionComponent } from "react";
import { Divider } from "@ppb/the-wall-web";

import { DetailedSummaryItem, DetailedSummaryProps } from "./DetailedSummary.types";
import styles from "./DetailedSummary.web.css";

const renderGroup = (item: DetailedSummaryItem, index: number): JSX.Element => (
  <div key={index} className={styles.item}>
    <div className={styles.itemTitle}>{item.title}</div>
    <div className={styles.itemAmount}>{item.amount}</div>
  </div>
);

export const DetailedSummary: FunctionComponent<DetailedSummaryProps> = ({ details, showHorizontalRule }) => (
  <div className={styles.detailed}>
    {showHorizontalRule ? <Divider /> : null}
    {details.map(({ title, groups }, index) => (
      <div key={index} className={styles.group}>
        <div className={styles.groupTitle}>{title}</div>
        {groups.map((item, dataIndex) => renderGroup(item, dataIndex))}
      </div>
    ))}
  </div>
);
