import { createSelectorCreator, defaultMemoize } from "reselect";
import URN from "../../layout/URN";
import { Jackpot, JackpotProps, JackpotWithType, Jackpots } from "../index";

export const getJackpotByURN = (state: Jackpots, urn: URN): Jackpot | undefined => state[urn];

export const createJackpotItemsSelector = () =>
  createSelectorCreator(
    defaultMemoize,
    (previousStats: JackpotWithType[], newStats: JackpotWithType[]) =>
      JSON.stringify(previousStats) === JSON.stringify(newStats),
  )([(results: JackpotWithType[]) => results], (results): JackpotProps[] => {
    const sortedJackpots = results.sort((a, b) => (a.type >= b.type ? 1 : -1));
    return sortedJackpots.map((jackpot) => jackpot.props);
  });
