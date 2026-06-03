import { shallowEqual } from "react-redux";
import { StateProps } from "./map-to-props-factory";
import { EventGroup, EventGroupMap } from "./multi-bet-builder-card-mapper";

type AllEventGroupComparison = {
  [k in `${keyof EventGroup}Comparison`]: boolean;
};

const compareAllGroupProps = (oldGroup: EventGroup, newGroup: EventGroup): AllEventGroupComparison => ({
  urnComparison: oldGroup.urn === newGroup.urn,
  titleComparison: oldGroup.title === newGroup.title,
  legIdsComparison: oldGroup.legIds?.join(",") === newGroup.legIds?.join(","),
});

const areGroupsEqual = (oldGroup: EventGroupMap, newGroup: EventGroupMap): boolean => {
  const oldGroupKeys = Object.keys(oldGroup);
  const newGroupKeys = Object.keys(newGroup);

  if (oldGroupKeys.join() !== newGroupKeys.join()) {
    return false;
  }

  return oldGroupKeys.every((key) => {
    const currentOldGroup = oldGroup[key];
    const newOldGroup = newGroup[key];

    if (!currentOldGroup || !newOldGroup) {
      return false;
    }

    return Object.values(compareAllGroupProps(currentOldGroup, newOldGroup)).every(Boolean);
  });
};

export const areStatePropsEqual = (next: StateProps | false, prev: StateProps | false): boolean => {
  if (prev === false || next === false) {
    return prev === next;
  }

  const { groups: prevGroups, ...restPrev } = prev;
  const { groups: nextGroups, ...restNext } = next;

  if (!prevGroups || !nextGroups) {
    return true;
  }

  const hasAllEqualGroups = areGroupsEqual(prevGroups, nextGroups);
  const isRestEqual = shallowEqual(restPrev, restNext);

  return isRestEqual && hasAllEqualGroups;
};
