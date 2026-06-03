import { createSelector, ParametricSelector } from "reselect";
import URN from "../../layout/URN";
import { VirtualEvent, VirtualEvents } from "./VirtualEvent.types";

export const getVirtualEventByURN = (state: VirtualEvents, urn: URN): VirtualEvent | undefined => state[urn];

const getVirtualSportEventsByURN = (state: VirtualEvents, sport: URN): VirtualEvent[] =>
  Object.values(state).filter((virtualEvent) => virtualEvent.sport === sport);

export const createVirtualEventByURNSelector = (): ParametricSelector<VirtualEvents, URN, VirtualEvent | undefined> =>
  createSelector(
    [(virtualEvents: VirtualEvents) => virtualEvents, (_: VirtualEvents, urn: URN) => urn],
    getVirtualEventByURN,
  );

export const createVirtualSportEventsByURNSelector = (): ParametricSelector<VirtualEvents, URN, VirtualEvent[]> =>
  createSelector(
    [(virtualEvents: VirtualEvents) => virtualEvents, (_: VirtualEvents, sport: URN) => sport],
    getVirtualSportEventsByURN,
  );
