import type { JSX } from "react";
import { FunctionComponent } from "react";
import { useVisibilityObserver } from "../../../hooks/useVisibilityObserver.web";
import { ComponentProps } from "./props";
import ConnectedSwimlaneCardGroup from "../../SwimlaneCardGroup";
import ConnectedByTimeRangeMeetingCardGroup from "../../ByTimeRangeMeetingCardGroup";
import SwimlaneCardGroup from "../../SwimlaneCardGroup/SwimlaneCardGroup.web";
import ByTimeRangeMeetingCardGroup from "../../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroup.web";
import SwimlaneCardGroupPlaceholder from "../../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import ByTimeRangeMeetingCardGroupPlaceholder from "../../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroupPlaceholder.web";
import styles from "./FilteredRacesByTimeRangeList.web.css";
import { Nodes } from "../../../hooks/useVisibilityObserver.types";

const getCardGroupComponent = (urn: string, typename: string, visibility: Nodes): JSX.Element => {
  if (typename === "ByTimeRangeMeetingCardGroup") {
    return (
      <ConnectedByTimeRangeMeetingCardGroup
        urn={urn}
        component={ByTimeRangeMeetingCardGroup}
        placeholder={ByTimeRangeMeetingCardGroupPlaceholder}
        visible={visibility[urn]}
      />
    );
  }

  return (
    <ConnectedSwimlaneCardGroup
      urn={urn}
      component={SwimlaneCardGroup}
      placeholder={SwimlaneCardGroupPlaceholder}
      visible={visibility[urn]}
    />
  );
};

const FilteredRacesByTimeRangeList: FunctionComponent<ComponentProps> = ({ items, dispatchFetchCards }) => {
  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => dispatchFetchCards(urn, items),
  });

  return (
    <>
      {items.map(({ urn, typename }) => (
        <div
          key={urn}
          ref={(node) => {
            observe(node, urn);
          }}
          className={styles.cardGroup}
        >
          {getCardGroupComponent(urn, typename, visibility)}
        </div>
      ))}
    </>
  );
};

export default FilteredRacesByTimeRangeList;
