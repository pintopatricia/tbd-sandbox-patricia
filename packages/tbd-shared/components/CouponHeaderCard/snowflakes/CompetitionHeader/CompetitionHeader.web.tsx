import type { MouseEventHandler } from "react";
import { FunctionComponent, useMemo } from "react";
import classnames from "classnames";
import { ViewLink } from "@ppb/the-wall-common/types";

import { CompetitionHeaderCommonProps } from "./CompetitionHeader.types";
import styles from "./CompetitionHeader.web.css";

type CompetitionHeaderWebCallbacks = {
  onTitleClick?: MouseEventHandler;
};

type CompetitionHeaderWebProps = CompetitionHeaderCommonProps & {
  titleLink?: ViewLink;
};

export type CompetitionHeaderWebViewModel = CompetitionHeaderWebProps & CompetitionHeaderWebCallbacks;

export const CompetitionHeader: FunctionComponent<CompetitionHeaderWebViewModel> = ({
  title,
  titleLink,
  columns,
  hasStats,
  onTitleClick,
}) => {
  const titleLinkElement = useMemo(() => {
    const titleElement = <span className={styles.title}>{title}</span>;

    if (titleLink) {
      return (
        <a className={styles.titleLink} href={titleLink.viewUrl} onClick={onTitleClick}>
          {titleElement}
        </a>
      );
    }

    return titleElement;
  }, [title, titleLink, onTitleClick]);

  return (
    <div className={styles.competitionHeader}>
      {titleLinkElement}
      <div className={styles.columns}>
        {columns?.length > 0 &&
          columns.map((columnTitle, index) => (
            <div
              className={classnames(styles.column, {
                [styles.columnStats]: hasStats && columns.length - 1 === index,
              })}
              key={`${columnTitle}-${index}`}
            >
              <span className={styles.columnText}>{columnTitle}</span>
            </div>
          ))}
      </div>
    </div>
  );
};
