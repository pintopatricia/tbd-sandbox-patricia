import { memo, FunctionComponent } from "react";
import { TabsGroupSize } from "@ppb/the-wall-common/types";

import { TabsGroup } from "@ppb/the-wall-web";
import styles from "./SectionHeader.web.css";
import { SectionHeaderProps } from "./SectionHeader.types";

export const SectionHeader: FunctionComponent<SectionHeaderProps> = memo(
  ({ tabsHeaders, tabsContents, defaultTabId, onTabSwitch, translations }) => (
    <div className={styles.sectionHeader}>
      <span className={styles.title}>{translations.i18n.title}</span>
      <div>
        <TabsGroup
          defaultTab={defaultTabId}
          label="Sports Tab Content"
          lazy={false}
          onTabSwitch={onTabSwitch}
          size={TabsGroupSize.Regular}
          headers={tabsHeaders}
          contents={tabsContents}
          background={false}
          stickyTabs
        />
      </div>
    </div>
  ),
);

SectionHeader.displayName = "SectionHeader";
