import { colors, tokens } from "@ppb/the-wall-common/base-theme";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  NativeModules,
  Platform,
  RefreshControl,
  ScrollView,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from "react-native";
import { useRefreshEnabled } from "../../../../../hooks/useRefreshEnabled.native";
import LiveVideoCard from "../../LiveVideoCard/view/LiveVideoCard.native";
import RaceDetailsCard from "../../RaceDetailsCard/view/RaceDetailsCard.native";
import RaceItemsContent from "../../RaceItemsContent/view/RaceItemsContent.native";
import RaceSwitcherCard from "../../RaceSwitcherCard/view/RaceSwitcherCard.native";
import RaceViewLinksCard from "../../RaceViewLinksCard/view/RaceViewLinksCard.native";
import { useRaceMeetingViewVM } from "../viewmodel/RaceMeetingView.viewmodel";
import SELECTORS from "./RaceMeetingView.selectors";
import styles from "./RaceMeetingView.native.styles";
import RaceMeetingViewPlaceholder from "./RaceMeetingViewPlaceholder.native";

const { LaunchArgumentsModule } = NativeModules;

const RaceMeetingView: React.FunctionComponent<{
  urn: string;
}> = ({ urn }) => {
  const [activeViewUrn, setActiveViewUrn] = useState(urn);
  const [userSelectedRace, setUserSelectedRace] = useState<string | undefined>(undefined);
  const [prevUrn, setPrevUrn] = useState(urn);
  const mountedUrnRef = useRef<string | null>(null);

  if (prevUrn !== urn) {
    setPrevUrn(urn);
    setActiveViewUrn(urn);
    setUserSelectedRace(undefined);
  }

  const {
    loading,
    refresh,
    vm: { data, events },
  } = useRaceMeetingViewVM(activeViewUrn);

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isIOSDisabled, setIsIOSDisabled] = useState(true);
  const [isAndroidEnabled, setIsAndroidEnabled] = useState(true);
  const { refreshEnabled } = useRefreshEnabled();

  useEffect(() => {
    async function getLaunchArgs(): Promise<void> {
      const result: { pullToRefresh?: boolean } = await LaunchArgumentsModule.getLaunchArguments();
      setIsIOSDisabled(Platform.OS === "ios" && result.pullToRefresh === false);
      setIsAndroidEnabled(Platform.OS === "android" && result.pullToRefresh !== false);
    }
    getLaunchArgs();
  }, []);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refresh();
    } finally {
      setIsRefreshing(false);
    }
  }, [refresh]);

  const refreshControl = isIOSDisabled ? undefined : (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={onRefresh}
      enabled={isAndroidEnabled && refreshEnabled}
      colors={[tokens.PullRefreshIconColour]}
      progressBackgroundColor={colors.NeutralsBackgroundElevation4}
      tintColor={tokens.PullRefreshIconColour}
    />
  );

  const [isSticky, setIsSticky] = useState(false);
  const scrollOffsetRef = useRef(0);
  const raceDetailsLayoutRef = useRef<{ y: number; height: number } | null>(null);

  const updateStickyState = useCallback(() => {
    const layout = raceDetailsLayoutRef.current;
    if (!layout) {
      setIsSticky(false);
      return;
    }
    setIsSticky(scrollOffsetRef.current > layout.y + layout.height);
  }, []);

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
      updateStickyState();
    },
    [updateStickyState],
  );

  const onRaceDetailsLayout = useCallback(
    (e: LayoutChangeEvent) => {
      raceDetailsLayoutRef.current = {
        y: e.nativeEvent.layout.y,
        height: e.nativeEvent.layout.height,
      };
      updateStickyState();
    },
    [updateStickyState],
  );

  const onMeetingSelected = (viewLink: { viewUrn: string; viewUrl: string }) => {
    setActiveViewUrn(viewLink.viewUrn);
    setUserSelectedRace(undefined);
    events.onSiblingSelected(viewLink.viewUrn, viewLink);
  };

  useEffect(() => {
    if (data && mountedUrnRef.current !== data.urn) {
      mountedUrnRef.current = data.urn;
      events.onMount(data.urn);
    }
  }, [data, events]);

  if (!data && loading) {
    return <RaceMeetingViewPlaceholder />;
  }

  if (!data) {
    return null;
  }

  const effectiveRaceUrn = userSelectedRace ?? data.selectedRaceUrn;
  const selectedRace = data.races.find((r) => r.raceUrn === effectiveRaceUrn);
  const hasMatchingInitialItems = data.initialItems.selectedRace.race.urn === effectiveRaceUrn;
  const shouldDeferItemsQuery = !hasMatchingInitialItems;

  const onRaceSelected = (raceUrn: string, viewLink: { viewUrn: string; viewUrl: string }) => {
    setActiveViewUrn(viewLink.viewUrn);
    setUserSelectedRace(raceUrn);
    events.onRaceSelected(raceUrn, viewLink);
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        {...getTestProps(SELECTORS.TEST_ID, false)}
        style={styles.container}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        refreshControl={refreshControl}
      >
        <View style={[data.isHighlighted ? styles.headerHighlighted : undefined]}>
          <RaceSwitcherCard
            viewUrn={data.urn}
            meeting={data.meeting}
            siblings={data.siblingMeetingData}
            locale={data.locale}
            timezone={data.timezone}
            onMeetingSelected={onMeetingSelected}
          />

          <View style={styles.offsetContainer}>
            <RaceViewLinksCard
              viewUrn={data.urn}
              selectedRaceUrn={effectiveRaceUrn ?? null}
              races={data.races}
              locale={data.locale}
              timezone={data.timezone}
              onRaceSelected={onRaceSelected}
            />
          </View>

          {selectedRace && (
            <View onLayout={onRaceDetailsLayout}>
              <RaceDetailsCard
                race={selectedRace}
                meeting={data.meeting}
                locale={data.locale}
                timezone={data.timezone}
                isHighlighted={data.isHighlighted}
              />
            </View>
          )}

          {selectedRace && !selectedRace.isRaceClosed && (
            <View style={styles.offsetContainer}>
              <LiveVideoCard race={selectedRace} isHighlighted={data.isHighlighted} />
            </View>
          )}
        </View>

        <RaceItemsContent
          viewUrn={activeViewUrn}
          raceUrn={effectiveRaceUrn}
          initialItems={hasMatchingInitialItems ? data.initialItems : undefined}
          resultType={selectedRace?.resultType}
          deferQuery={shouldDeferItemsQuery}
        />
      </ScrollView>

      {isSticky && selectedRace && (
        <View style={styles.stickyOverlay}>
          <RaceDetailsCard
            race={selectedRace}
            meeting={data.meeting}
            locale={data.locale}
            timezone={data.timezone}
            isHighlighted={data.isHighlighted}
            isSticky
          />
        </View>
      )}
    </View>
  );
};

export default RaceMeetingView;
