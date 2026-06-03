import { FunctionComponent, useCallback, useEffect, useRef, RefObject } from "react";
import { View, FlatList } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SelectableItems } from "@ppb/the-wall-native/components/SelectableItems/SelectableItems";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { navigate } from "@ppb/tbd-router/native";
import { ComponentProps } from "./props";
import { RACE_VIEWLINKS_CARD } from "./RaceViewLinksCard.native.selectors";

const RaceViewLinksCard: FunctionComponent<ComponentProps> = ({
  urn,
  races,
  defaultRaceIndex,
  dispatchRaceViewLinksLinkClick,
}) => {
  const onRaceTimeClick = useCallback(
    (_: number, isRaceClosed: boolean, raceViewLink?: ViewLink): void => {
      if (raceViewLink) {
        dispatchRaceViewLinksLinkClick(urn, raceViewLink.viewUrl, isRaceClosed);
        navigate(raceViewLink);
      }
    },
    [dispatchRaceViewLinksLinkClick, urn],
  );

  const listContainer = useRef<FlatList>(null) as RefObject<FlatList>;

  useEffect(() => {
    if (listContainer?.current && defaultRaceIndex !== undefined && defaultRaceIndex >= 0) {
      listContainer.current.scrollToIndex({ index: defaultRaceIndex, viewPosition: 0.5 });
    }
  }, [listContainer, defaultRaceIndex]);

  if (races?.length) {
    return (
      <View {...getTestProps(RACE_VIEWLINKS_CARD, false)}>
        <SelectableItems
          items={races}
          onRaceTimeClick={onRaceTimeClick}
          defaultItemIndex={defaultRaceIndex}
          listContainerRef={listContainer}
          isHighlighted={false}
        />
      </View>
    );
  }

  return null;
};

export default RaceViewLinksCard;
