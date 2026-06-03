import { SelectableItems } from "@ppb/the-wall-native/components/SelectableItems/SelectableItems";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import React, { useEffect, useRef } from "react";
import { type FlatList, View } from "react-native";
import type { RaceNavigationItemData } from "../viewmodel/RaceViewLinksCard.viewmodel";
import { useRaceViewLinksCardVM } from "../viewmodel/RaceViewLinksCard.viewmodel";
import styles from "./RaceViewLinksCard.native.styles";
import SELECTORS from "./RaceViewLinksCard.selectors";

type ViewLink = {
  viewUrn: string;
  viewUrl: string;
};

export type RaceViewLinksCardProps = {
  viewUrn: string;
  selectedRaceUrn: string | null;
  races: RaceNavigationItemData[];
  locale: string;
  timezone: string;
  onRaceSelected?: (raceUrn: string, viewLink: ViewLink) => void;
};

const RaceViewLinksCard: React.FunctionComponent<RaceViewLinksCardProps> = ({
  viewUrn,
  selectedRaceUrn,
  races,
  locale,
  timezone,
  onRaceSelected,
}) => {
  const {
    vm: { data, events, viewUrn: urn },
  } = useRaceViewLinksCardVM(viewUrn, selectedRaceUrn, races, locale, timezone);

  const onClick = (_: number, __: boolean, viewLink?: ViewLink) => {
    if (viewLink) {
      events.onClick(urn, viewLink);
      if (onRaceSelected) {
        const race = races.find(
          (r) => r.viewLink.viewUrn === viewLink.viewUrn,
        );
        if (race) {
          onRaceSelected(race.raceUrn, viewLink);
        }
      }
    }
  };

  const listContainer = useRef<FlatList>(null);

  useEffect(() => {
    if (listContainer?.current && data.items.length > 0 && data.defaultRaceIndex < data.items.length) {
      try {
        listContainer.current.scrollToIndex({ index: data.defaultRaceIndex, viewPosition: 0.5, animated: false });
      } catch {
        // FlatList may not have measured layout yet; safe to ignore
      }
    }
  }, [data.defaultRaceIndex, data.items.length]);

  if (!data.items.length) {
    return null;
  }

  return (
    <View {...getTestProps(SELECTORS.TEST_ID, false)} style={styles.container}>
      <SelectableItems
        items={data.items}
        onRaceTimeClick={onClick}
        defaultItemIndex={data.defaultRaceIndex}
        listContainerRef={listContainer}
        isHighlighted={false}
      />
    </View>
  );
};

export default RaceViewLinksCard;
