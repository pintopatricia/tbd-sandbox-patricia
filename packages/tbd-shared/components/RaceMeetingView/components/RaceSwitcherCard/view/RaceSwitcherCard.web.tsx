import { Selector } from "@ppb/the-wall-web";
import type { FunctionComponent } from "react";
import { useState } from "react";
import type { MeetingData, SelectorItemWithVector, SiblingMeetingData } from "../viewmodel/RaceSwitcherCard.viewmodel";
import { useRaceSwitcherCardVM } from "../viewmodel/RaceSwitcherCard.viewmodel";
import SELECTORS from "./RaceSwitcherCard.selectors";
import styles from "./RaceSwitcherCard.web.module.css";

export type RaceSwitcherCardProps = {
  viewUrn: string;
  meeting: MeetingData;
  siblings: SiblingMeetingData[];
  locale: string;
  timezone: string;
  onMeetingSelected?: (viewLink: { viewUrn: string; viewUrl: string }) => void;
};

const RaceSwitcherCard: FunctionComponent<RaceSwitcherCardProps> = ({
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

  const handleOnOpen = (): void => {
    events.onOpen(viewUrn);
  };

  const onClose = (itemClicked: SelectorItemWithVector | undefined): void => {
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

  data.items.forEach((item) => {
    item.icon = item.iconUrl?.vector ? (
      <img
        loading="lazy"
        src={item.iconUrl.vector}
        alt="switcher header icon"
        className={styles.icon}
        data-testid={SELECTORS.ICON}
      />
    ) : undefined;
  });

  return (
    <div className={styles.container} data-testid={SELECTORS.TEST_ID}>
      <div className={styles.titleWrapper} data-testid={SELECTORS.DETAILS}>
        {data.icon && (
          <img
            loading="lazy"
            srcSet={data.icon.vector}
            alt="switcher header icon"
            className={styles.icon}
            data-testid={SELECTORS.ICON}
          />
        )}
        <Selector
          title={data.title}
          isDesktop={window.innerWidth > 768}
          items={data.items}
          defaultId={data.defaultValue.id}
          onClose={onClose}
          onOpen={handleOnOpen}
        />
      </div>
      {data.date && (
        <span className={styles.label} data-testid={SELECTORS.DATE}>
          {data.date}
        </span>
      )}
    </div>
  );
};

export default RaceSwitcherCard;
