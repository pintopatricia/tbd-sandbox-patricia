import { TabsGroupOnTabSwitch, TabsGroupContentProps, TabsGroupHeaderProps } from "@ppb/the-wall-common/types";

export type SectionHeaderi18n = {
  i18n: {
    title: string;
  };
};

export type SectionHeaderProps = {
  tabsHeaders: TabsGroupHeaderProps[];
  tabsContents: TabsGroupContentProps[];
  defaultTabId: string;
  onTabSwitch: TabsGroupOnTabSwitch;
  translations: SectionHeaderi18n;
};
