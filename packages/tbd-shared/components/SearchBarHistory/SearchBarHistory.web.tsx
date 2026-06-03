import { QuickLink } from "@ppb/the-wall-web";
import { FC } from "react";
import styles from "./SearchBarHistory.web.css";
import { SearchBarHistoryProps } from "./SearchBarHistory.types";

const VIEW_LINK = { viewUrl: "", viewUrn: "" };

export const SearchBarHistory: FC<SearchBarHistoryProps> = ({ historyLabel, onHistoryClick, searchHistory }) =>
  searchHistory.length > 0 && (
    <div className={styles.searchHistoryContainer}>
      <p className={`${styles.searchHistoryLabel} typography-h120`}>{historyLabel}</p>
      <div className={styles.searchHistoryItemsContainer}>
        {searchHistory.map((result) => (
          <QuickLink
            withShadow={false}
            withBorder={false}
            isLightBackground
            key={result}
            item={{ viewLink: VIEW_LINK, text: result }}
            onLinkClick={() => onHistoryClick(result)}
          />
        ))}
      </div>
    </div>
  );
