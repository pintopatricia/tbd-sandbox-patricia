import { createSelector, ParametricSelector } from "reselect";
import URN from "../../layout/URN";
import { VirtualMarket, VirtualMarkets } from "./VirtualMarket.types";

export const getVirtualMarketByURN = (state: VirtualMarkets, urn: URN): VirtualMarket | undefined => state[urn];

export const createVirtualMarketByURNSelector = (): ParametricSelector<
  VirtualMarkets,
  URN,
  VirtualMarket | undefined
> =>
  createSelector(
    [(virtualMarkets: VirtualMarkets) => virtualMarkets, (_: VirtualMarkets, urn: URN) => urn],
    getVirtualMarketByURN,
  );

export const getVirtualMarketByRunnerURN = (state: VirtualMarkets, urn: URN): VirtualMarket | undefined =>
  Object.values(state).find((market) => market.runners.some((runnerURN) => runnerURN === urn));

export const createVirtualMarketByRunnerURNSelector = (): ParametricSelector<
  VirtualMarkets,
  URN,
  VirtualMarket | undefined
> =>
  createSelector(
    [(virtualMarkets: VirtualMarkets) => virtualMarkets, (_: VirtualMarkets, urn: URN) => urn],
    getVirtualMarketByRunnerURN,
  );

export const getVirtualMarketById = (state: VirtualMarkets, id: string): VirtualMarket | undefined =>
  Object.values(state).find((market) => market.marketId === id);

export const createVirtualMarketByIdSelector = (): ParametricSelector<
  VirtualMarkets,
  string,
  VirtualMarket | undefined
> =>
  createSelector(
    [(virtualMarkets: VirtualMarkets) => virtualMarkets, (_: VirtualMarkets, id: string) => id],
    getVirtualMarketById,
  );
