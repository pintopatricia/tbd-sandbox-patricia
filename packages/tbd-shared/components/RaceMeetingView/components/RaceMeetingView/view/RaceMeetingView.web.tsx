import { type FunctionComponent, useEffect, useRef, useState } from "react";
import classnames from "classnames";
import LiveVideoCard from "../../LiveVideoCard/view/LiveVideoCard.web";
import RaceDetailsCard from "../../RaceDetailsCard/view/RaceDetailsCard.web";
import RaceItemsContent from "../../RaceItemsContent/view/RaceItemsContent.web";
import RaceSwitcherCard from "../../RaceSwitcherCard/view/RaceSwitcherCard.web";
import RaceViewLinksCard from "../../RaceViewLinksCard/view/RaceViewLinksCard.web";
import { useRaceMeetingViewVM } from "../viewmodel/RaceMeetingView.viewmodel";
import SELECTORS from "./RaceMeetingView.selectors";
import styles from "./RaceMeetingView.web.module.css";
import RaceMeetingViewPlaceholder from "./RaceMeetingViewPlaceholder.web";

const RaceMeetingView: FunctionComponent<{
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
    canRenderHeader,
    vm: { data, events },
  } = useRaceMeetingViewVM(activeViewUrn);

  const showFade = loading && !canRenderHeader;

  useEffect(() => {
    if (data && mountedUrnRef.current !== data.urn) {
      mountedUrnRef.current = data.urn;
      events.onMount(data.urn);
      events.fetchBars(data.urn);
    }
  }, [data, events]);

  // Change the active Meeting
  const onMeetingSelected = (viewLink: { viewUrn: string; viewUrl: string }) => {
    setActiveViewUrn(viewLink.viewUrn);
    setUserSelectedRace(undefined);
    events.onSiblingSelected(viewLink.viewUrn, viewLink);
  };

  // Change the active Race
  const onRaceSelected = (raceUrn: string, viewLink: { viewUrn: string; viewUrl: string }) => {
    setActiveViewUrn(viewLink.viewUrn);
    setUserSelectedRace(raceUrn);
    events.onRaceSelected(raceUrn, viewLink);
  };

  // Only show placeholder if we have no previous data. Otherwise we will show a
  // page transition animation.
  if (!data && loading) {
    return <RaceMeetingViewPlaceholder />;
  }

  if (!data) {
    return null;
  }

  // Get selected race from race list
  const effectiveRaceUrn = userSelectedRace ?? data.selectedRaceUrn;
  const selectedRace = data.races.find((r) => r.raceUrn === effectiveRaceUrn);
  const hasMatchingInitialItems = data.initialItems.selectedRace.race.urn === effectiveRaceUrn;
  const shouldDeferItemsQuery = !hasMatchingInitialItems;

  return (
    <div
      data-testid={SELECTORS.TEST_ID}
      className={classnames(styles.container, {
        [styles.transitioning]: showFade,
        [styles.highlighted]: data.isHighlighted,
      })}
    >
      <div
        className={classnames({
          [styles.headerHighlighted]: data.isHighlighted,
        })}
      >
        <RaceSwitcherCard
          viewUrn={data.urn}
          meeting={data.meeting}
          siblings={data.siblingMeetingData}
          locale={data.locale}
          timezone={data.timezone}
          onMeetingSelected={onMeetingSelected}
        />

        <div className={styles.offsetContainer}>
          <RaceViewLinksCard
            viewUrn={data.urn}
            selectedRaceUrn={effectiveRaceUrn ?? null}
            races={data.races}
            locale={data.locale}
            timezone={data.timezone}
            onRaceSelected={onRaceSelected}
          />
        </div>

        {selectedRace && (
          <RaceDetailsCard
            race={selectedRace}
            meeting={data.meeting}
            locale={data.locale}
            timezone={data.timezone}
            isHighlighted={data.isHighlighted}
          />
        )}

        {selectedRace && !selectedRace.isRaceClosed && (
          <div className={styles.offsetContainer}>
            <LiveVideoCard race={selectedRace} isHighlighted={data.isHighlighted} />
          </div>
        )}
      </div>

      <RaceItemsContent
        viewUrn={activeViewUrn}
        raceUrn={effectiveRaceUrn}
        initialItems={hasMatchingInitialItems ? data.initialItems : undefined}
        resultType={selectedRace?.resultType}
        deferQuery={shouldDeferItemsQuery}
      />
    </div>
  );
};

export default RaceMeetingView;
