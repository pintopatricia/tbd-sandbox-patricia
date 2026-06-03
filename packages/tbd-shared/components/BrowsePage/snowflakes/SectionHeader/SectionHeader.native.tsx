import { memo, FunctionComponent } from "react";
import { View } from "react-native";
import { TabsGroupSize } from "@ppb/the-wall-common/types";
import { TabsGroup, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import styles from "./SectionHeader.native.styles";
import { SECTION_HEADER, SECTION_HEADER_TITLE } from "./SectionHeader.native.selectors";
import { SectionHeaderProps } from "./SectionHeader.types";

export const SectionHeader: FunctionComponent<SectionHeaderProps> = memo(
  ({ tabsHeaders, tabsContents, defaultTabId, onTabSwitch, translations }) => (
    <View style={styles.sectionHeader} {...getTestProps(SECTION_HEADER, false)}>
      <Text style={styles.title} {...getTestProps(SECTION_HEADER_TITLE, false)}>
        {translations.i18n.title}
      </Text>
      <TabsGroup
        defaultTab={defaultTabId}
        label="Sports Tab Content"
        lazy={false}
        onTabSwitch={onTabSwitch}
        headers={tabsHeaders}
        contents={tabsContents}
        background={false}
        size={TabsGroupSize.Regular}
      />
    </View>
  ),
);

SectionHeader.displayName = "SectionHeader";
