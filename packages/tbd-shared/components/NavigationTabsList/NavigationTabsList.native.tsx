import { FunctionComponent, memo, useCallback, useState } from "react";
import { View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";

import { TabsGroup } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { TabsGroupHeaderProps, TabsGroupContentProps, TabsGroupSize } from "@ppb/the-wall-common/types";
import { ComponentProps } from "./props";
import { NAVIGATION_TABS_LIST_CONTAINER } from "./NavigationTabsList.native.selectors";
import { buildNavigationTabsContent } from "./NavigationTabsContent/NavigationTabsContent.native";
import styles from "./NavigationTabsList.native.styles";

type MemoizedProps = ComponentProps & {
  onTabSwitch: (tabUrn: string, label: string) => void;
  headers: TabsGroupHeaderProps[];
  contentsComponents: TabsGroupContentProps[];
};

const MemoizedNavigationTabsList: FunctionComponent<MemoizedProps> = memo(
  ({ title, selectedTabUrn, onTabSwitch, headers, contentsComponents }) => (
    <View {...getTestProps(NAVIGATION_TABS_LIST_CONTAINER, false)} style={styles.navigationTabsListContainer}>
      <TabsGroup
        defaultTab={selectedTabUrn || ""}
        headers={headers}
        contents={contentsComponents}
        onTabSwitch={onTabSwitch}
        label={title}
        size={TabsGroupSize.Regular}
        background={false}
      />
    </View>
  ),
);

MemoizedNavigationTabsList.displayName = "MemoizedNavigationTabsList";

const NavigationTabsList: FunctionComponent<ComponentProps> = (props) => {
  const {
    urn,
    headers,
    contents,
    selectedTabUrn,
    dispatchFetchCardsFromList,
    dispatchFetchCards,
    dispatchOnTabClick,
    dispatchOnTabSwitch,
  } = props;

  const [currentTab, setCurrentTab] = useState(selectedTabUrn);
  const [prevSelectedTabUrn, setPrevSelectedTabUrn] = useState(selectedTabUrn);
  const [tabResetCount, setTabResetCount] = useState(0);

  if (selectedTabUrn && selectedTabUrn !== prevSelectedTabUrn) {
    setPrevSelectedTabUrn(selectedTabUrn);
    if (selectedTabUrn !== currentTab) {
      setCurrentTab(selectedTabUrn);
      setTabResetCount(tabResetCount + 1);
    }
  }

  useFocusEffect(
    useCallback((): void => {
      if (currentTab) {
        dispatchFetchCards([currentTab]);
      }
    }, [currentTab, dispatchFetchCards]),
  );

  const contentsComponents = buildNavigationTabsContent(contents, dispatchFetchCardsFromList);
  const onTabSwitch = useCallback(
    (tabUrn: string, label: string) => {
      dispatchOnTabClick(label, urn);
      setCurrentTab(tabUrn);
      dispatchOnTabSwitch(urn, tabUrn);
    },
    [dispatchOnTabClick, urn, dispatchOnTabSwitch],
  );

  return (
    <MemoizedNavigationTabsList
      key={tabResetCount}
      onTabSwitch={onTabSwitch}
      {...props}
      headers={headers}
      contentsComponents={contentsComponents}
    />
  );
};

export default NavigationTabsList;
