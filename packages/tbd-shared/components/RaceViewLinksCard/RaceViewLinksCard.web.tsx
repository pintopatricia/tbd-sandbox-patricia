import { FunctionComponent, useCallback, useEffect, useRef, useContext } from "react";
import { SelectableItems } from "@ppb/the-wall-web";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { ComponentProps } from "./props";
import { ConfigContext } from "../Config/ConfigContext";

/**
 *
 * @param props The props mapped by mapStateToProps
 * @returns The react component
 */
const RaceViewLinksCard: FunctionComponent<ComponentProps> = ({
  urn,
  races,
  defaultRaceIndex,
  dispatchPush,
  dispatchRaceViewLinksLinkClick,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);

  const onRaceTimeClick = useCallback(
    (_: number, isRaceClosed: boolean, raceViewLink?: ViewLink): void => {
      if (raceViewLink) {
        dispatchRaceViewLinksLinkClick(urn, raceViewLink.viewUrl, isRaceClosed);
        dispatchPush(raceViewLink);
      }
    },
    [dispatchPush, dispatchRaceViewLinksLinkClick, urn],
  );

  const selectedRaceTime = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (selectedRaceTime?.current && listRef?.current) {
      const { x, width } = selectedRaceTime.current.getBoundingClientRect();

      listRef.current?.scrollTo(x - width, 0);
    }
  }, [selectedRaceTime, listRef]);

  return (
    <SelectableItems
      items={races}
      onRaceTimeClick={onRaceTimeClick}
      defaultItemIndex={defaultRaceIndex}
      selectedItemRef={selectedRaceTime}
      listContainerRef={listRef}
      isDesktop={isDesktopLayout}
      isHighlighted={false}
    />
  );
};

export default RaceViewLinksCard;
