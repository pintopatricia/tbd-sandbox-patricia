import { Hierarchy, RaceHierarchy, SportsbookMarket, ExchangeMarket } from "../../state/entities";

function isRaceHierarchy(hierarchy: Hierarchy): hierarchy is RaceHierarchy {
  const raceHierarchy = hierarchy as RaceHierarchy;

  return raceHierarchy && raceHierarchy.race !== undefined && raceHierarchy.meeting !== undefined;
}

function isRaceMarket(market: ExchangeMarket | SportsbookMarket): boolean {
  return !!isRaceHierarchy(market.hierarchy);
}

export { isRaceHierarchy, isRaceMarket };
