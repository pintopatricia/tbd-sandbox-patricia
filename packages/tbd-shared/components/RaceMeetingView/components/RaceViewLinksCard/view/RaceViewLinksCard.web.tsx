import { SelectableItems } from "@ppb/the-wall-web";
import { useEffect, useRef, type FunctionComponent } from "react";
import type { RaceNavigationItemData } from "../viewmodel/RaceViewLinksCard.viewmodel";
import { useRaceViewLinksCardVM } from "../viewmodel/RaceViewLinksCard.viewmodel";
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

const RaceViewLinksCard: FunctionComponent<RaceViewLinksCardProps> = ({
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

  const hasScrolledRef = useRef(false);
  const selectedItemRef = useRef<HTMLButtonElement | null>(null);
  const listContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = selectedItemRef.current;
    if (node && !hasScrolledRef.current) {
      hasScrolledRef.current = true;
      const { x, width } = node.getBoundingClientRect();
      node.parentElement?.scrollTo(x - width, 0);
    }
  });

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

  if (!data.items.length) {
    return null;
  }

  return (
    <div data-testid={SELECTORS.TEST_ID}>
      <SelectableItems
        items={data.items}
        onRaceTimeClick={onClick}
        defaultItemIndex={data.defaultRaceIndex}
        selectedItemRef={selectedItemRef}
        listContainerRef={listContainerRef}
        isDesktop={window.innerWidth > 768}
        isHighlighted={false}
      />
    </div>
  );
};

export default RaceViewLinksCard;
