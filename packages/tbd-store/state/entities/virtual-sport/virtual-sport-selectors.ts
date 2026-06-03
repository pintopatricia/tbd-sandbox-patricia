import { createSelector, ParametricSelector } from "reselect";
import URN from "../../layout/URN";
import { VirtualSport, VirtualSports } from "./VirtualSport.types";

export const getVirtualSportByURN = (state: VirtualSports, urn: URN): VirtualSport | undefined => state[urn];

export const getVirtualSportById = (state: VirtualSports, sportId: number): VirtualSport | undefined =>
  Object.values(state).find((virtualsport) => virtualsport.sportId === sportId);

export const createVirtualSportByURNSelector = (): ParametricSelector<VirtualSports, URN, VirtualSport | undefined> =>
  createSelector(
    [(virtualSports: VirtualSports) => virtualSports, (_: VirtualSports, urn: URN) => urn],
    getVirtualSportByURN,
  );

export const createVirtualSportByIdSelector = (): ParametricSelector<VirtualSports, number, VirtualSport | undefined> =>
  createSelector(
    [(virtualSports: VirtualSports) => virtualSports, (_: VirtualSports, sportId: number) => sportId],
    getVirtualSportById,
  );
