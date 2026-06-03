import type { SelectorItem } from "@ppb/the-wall-common/types";
import { Selector, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import React, { useState } from "react";
import { Image, View } from "react-native";
import type { MeetingData, SiblingMeetingData } from "../viewmodel/RaceSwitcherCard.viewmodel";
import { useRaceSwitcherCardVM } from "../viewmodel/RaceSwitcherCard.viewmodel";
import SELECTORS from "./RaceSwitcherCard.selectors";
import styles from "./RaceSwitcherCard.native.styles";

export type RaceSwitcherCardProps = {
  viewUrn: string;
  meeting: MeetingData;
  siblings: SiblingMeetingData[];
  locale: string;
  timezone: string;
  onMeetingSelected?: (viewLink: { viewUrn: string; viewUrl: string }) => void;
};

const RaceSwitcherCard: React.FunctionComponent<RaceSwitcherCardProps> = ({
  viewUrn,
  meeting,
  siblings,
  locale,
  timezone,
  onMeetingSelected,
}) => {
  const {
    vm: { data, events },
  } = useRaceSwitcherCardVM(meeting, siblings, locale, timezone);

  const [selectedItemId, setSelectedItemId] = useState(data.defaultValue.id);

  const onClose = (itemClicked: SelectorItem | undefined): void => {
    const viewLink = itemClicked && data.links[itemClicked.id];

    if (viewLink) {
      const selectedItem = data.items.find((item) => item.id === itemClicked.id);

      if (selectedItem && selectedItem.id !== selectedItemId) {
        if (!onMeetingSelected) {
          events.onClose(viewUrn, viewLink);
        }
        setSelectedItemId(selectedItem.id);
        onMeetingSelected?.(viewLink);
      }
    }
  };

  const handleOnOpen = (): void => {
    events.onOpen(viewUrn);
  };

  const itemsWithIcons = data.items.map((item) => ({
    ...item,
    icon: item.iconUrl?.small ? (
      <Image source={{ uri: item.iconUrl.small, cache: "force-cache" }} style={styles.icon} />
    ) : undefined,
  }));

  return (
    <View style={styles.switcher} {...getTestProps(SELECTORS.TEST_ID, false)}>
      <View style={styles.titleWrapper} {...getTestProps(SELECTORS.DETAILS, false)}>
        {!!data.icon && (
          <Image
            {...getTestProps(SELECTORS.ICON)}
            style={styles.icon}
            source={{ uri: data.icon.small, cache: "force-cache" }}
          />
        )}
        <View style={styles.selectorWrapper}>
          <Selector
            title={data.title}
            items={itemsWithIcons}
            defaultId={data.defaultValue.id}
            onClose={onClose}
            onOpen={handleOnOpen}
          />
        </View>
      </View>
      {data.date && (
        <Text style={styles.date} {...getTestProps(SELECTORS.DATE)}>
          {data.date}
        </Text>
      )}
    </View>
  );
};

export default RaceSwitcherCard;
