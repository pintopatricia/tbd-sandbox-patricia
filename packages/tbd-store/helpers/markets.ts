import URN from "../state/layout/URN";
import {
  Hierarchy,
  MarketRunner,
  RaceHierarchy,
  EventCompetitionHierarchy,
  EventHierarchy,
  SportsbookMarket,
  RaceRunners,
  RunnerDetails,
  ExchangeMarket,
} from "../state/entities";

function isSportsbookMarket(urn: URN): boolean {
  return urn.includes("ppb:sbkMarket");
}

function isExchangeMarket(urn: URN): boolean {
  return urn.includes("ppb:excMarket");
}

function doesMarketHierarchyHaveRace(hierarchy: Hierarchy): boolean {
  return "race" in hierarchy;
}

function isRaceHierarchy(hierarchy: Hierarchy): hierarchy is RaceHierarchy {
  const raceHierarchy = hierarchy as RaceHierarchy;

  return raceHierarchy && raceHierarchy.race !== undefined && raceHierarchy.meeting !== undefined;
}

function isCompetitionEventHierarchy(hierarchy: Hierarchy): hierarchy is EventCompetitionHierarchy {
  const eventCompetitionHierarchy = hierarchy as EventCompetitionHierarchy;

  return (
    eventCompetitionHierarchy &&
    eventCompetitionHierarchy.competition !== undefined &&
    eventCompetitionHierarchy.sportevent !== undefined
  );
}

function isEventHierarchy(hierarchy: Hierarchy): hierarchy is EventHierarchy {
  const eventHierarchy = hierarchy as EventCompetitionHierarchy;

  return eventHierarchy && eventHierarchy.competition === undefined && eventHierarchy.sportevent !== undefined;
}

function isRaceMarket(market: ExchangeMarket | SportsbookMarket): boolean {
  return !!isRaceHierarchy(market.hierarchy);
}

function getRaceRunnerDetails(
  market: SportsbookMarket | ExchangeMarket,
  runners: RaceRunners,
  runnerSelectionId: number,
): (RunnerDetails & { horseName: string; form?: string }) | Record<string, never> {
  const raceRunner = Object.values(runners)?.find(({ selectionId }) => selectionId === runnerSelectionId);

  if (doesMarketHierarchyHaveRace(market?.hierarchy) && raceRunner) {
    return {
      horseName: raceRunner.horse.name,
      form: raceRunner.form,
      ...raceRunner.details,
    };
  }

  return {};
}

function getMarketRunnersByDisplayRunners(marketRunners: MarketRunner[], displayRunners: URN[]): MarketRunner[] {
  return displayRunners
    .map((runnerUrn) => marketRunners.find((marketRunner) => marketRunner.urn === runnerUrn))
    .filter((runner): runner is MarketRunner => !!runner);
}

export {
  isExchangeMarket,
  isSportsbookMarket,
  isRaceHierarchy,
  isEventHierarchy,
  isCompetitionEventHierarchy,
  doesMarketHierarchyHaveRace,
  getRaceRunnerDetails,
  isRaceMarket,
  getMarketRunnersByDisplayRunners,
};
