import {
  createSelector,
  createSelectorCreator,
  defaultMemoize,
  OutputParametricSelector,
  ParametricSelector,
  Selector,
} from "reselect";
import {
  BettingState,
  LEG_TYPES,
  COMBINABLE_LEG_TYPES_LIST,
  PlaceResult,
  Updaters,
  updateStake,
} from "@ppb/betslip-core";

import {
  SportsbookBettingState,
  SportsbookBettingRunner,
  RunnersMetadata,
  BettingGroup,
  AddLegOptions,
} from "./SportsbookBetting.types";
import { MarketRunner, Sport, SportsbookRunner, SportsbookMarket, Entities, getThrottles } from "../../entities";
import { ApplicationState } from "../../ApplicationState.types";
import {
  getSportsbookMarketByURN,
  getSportsbookMarketRunnerById,
} from "../../entities/sportsbook-markets/sportsbook-market-selectors";
import { getSportByURN } from "../../entities/sports/sport-selectors";
import { getSportsbookRunnerByURN } from "../../entities/sportsbook-runners/sportsbook-runners-reducer";
import {
  processAllUniqueRunnersFailures,
  processAllUniqueCombinationsFailures,
  isMultiple,
  isSingle,
  isBetBuilder,
  groupCombinationsByMarketId,
  CastGroup,
  getUniqueFailedSGMCombinationGroups,
  isMultiBetBuilder,
  generateCastRunnersIds,
  generateCastGroupIds,
  isSingleLike,
  isBoostedMultiple,
  hasAnyInvalidCombinationFailure,
} from "../../../helpers/sportsbook-betting";
import {
  AddSelectionByGroup,
  createBettingRunnersMetadataSelector,
  createGetAddOneLinePayloadSelector,
  createGetAddPayloadSelector,
  createGetAddSelectionsPayloadSelector,
  createGetMarketRunnerIdAssociationSelector,
  createGetMarketRunnerURNAssociationSelector,
  createGetVirtualAddOneLinePayloadSelector,
  createGetVirtualAddPayloadSelector,
  createGetVirtualAddSelectionsPayloadSelector,
  createGetVirtualMarketRunnerIdAssociationSelector,
  createGetVirtualMarketRunnerURNAssociationSelector,
  createVirtualBettingRunnersMetadataSelector,
  MarketRunnerIdAssociation,
  MarketRunnerURNAssociation,
} from "../../entities/entities-selectors";
import { createShallowEqualSelector } from "../../../helpers/selectors";
import URN from "../../layout/URN";
import { WalletTypes } from "../../../clients/catalogue/catalogue-response-types";
import { QuickBetslipBet } from "../../betslip";
import { EventType } from "../../constants";

export type SportsbookRunnerTree = {
  runner: SportsbookRunner;
  marketRunner: MarketRunner;
  market: SportsbookMarket;
  sport: Sport;
} | null;

export type SportsbookMarketTree = {
  marketRunner: MarketRunner;
  market: SportsbookMarket;
  sport: Sport;
} | null;

type BettingResolver = {
  getMarketRunnerIdAssociation: (entities: Entities, urn: URN) => MarketRunnerIdAssociation | undefined;
  getMarketRunnerURNAssociation: (
    entities: Entities,
    idAssociationMap: MarketRunnerIdAssociation[],
  ) => MarketRunnerURNAssociation[];
  getAddLegPayload: (entities: Entities, urn: URN, legOptions?: AddLegOptions) => Updaters.AddLegPayload | undefined;
  getAddOneLinePayload: (
    runners: BettingState.Runner[],
    legType: LEG_TYPES,
    legOptions?: AddLegOptions,
  ) => Updaters.AddLegPayload | undefined;
  getAddSelectionsPayload: (entities: Entities, report: PlaceResult.PlacedBetResults) => AddSelectionByGroup;
  getMetadata: (state: ApplicationState) => RunnersMetadata;
};

type BettingResolverMap = Record<BettingGroup, BettingResolver>;

export type WalletToken = {
  walletId: string;
  type: WalletTypes;
} & Pick<BettingState.Wallet, "combinationId"> &
  Pick<BettingState.AccaInsuranceOffer, "numberOfLegs" | "amountLimit"> &
  Partial<Pick<BettingState.PriceBoostOffer, "generosity">> &
  Partial<Pick<BettingState.Wallet, "amount">> &
  Partial<Pick<BettingState.MoneyBackOffer, "numberOfPlaces">>;

export type WalletsTokensMap = {
  [walletId: string]: WalletToken;
};

const BETTING_RESOLVER_MAP: BettingResolverMap = {
  VIRTUAL: {
    getMarketRunnerIdAssociation: createGetVirtualMarketRunnerIdAssociationSelector(),
    getMarketRunnerURNAssociation: createGetVirtualMarketRunnerURNAssociationSelector(),
    getAddLegPayload: createGetVirtualAddPayloadSelector(),
    getAddOneLinePayload: createGetVirtualAddOneLinePayloadSelector,
    getAddSelectionsPayload: createGetVirtualAddSelectionsPayloadSelector(),
    getMetadata: createVirtualBettingRunnersMetadataSelector(),
  },
  REAL: {
    getMarketRunnerIdAssociation: createGetMarketRunnerIdAssociationSelector(),
    getMarketRunnerURNAssociation: createGetMarketRunnerURNAssociationSelector(),
    getAddLegPayload: createGetAddPayloadSelector(),
    getAddOneLinePayload: createGetAddOneLinePayloadSelector,
    getAddSelectionsPayload: createGetAddSelectionsPayloadSelector(),
    getMetadata: createBettingRunnersMetadataSelector(),
  },
};

export const getBettingResolvers = (group: BettingGroup = "REAL"): BettingResolver => BETTING_RESOLVER_MAP[group];

export const getSportsbookBettingState = (state: ApplicationState): SportsbookBettingState =>
  state.betting.sportsbookBetting;

export const getSportsbookBettingCombinations = (state: ApplicationState): BettingState.CombinationsMap =>
  state.betting.sportsbookBetting.combinations;

export const getSportsbookBettingLegs = (state: ApplicationState): BettingState.LegsMap =>
  state.betting.sportsbookBetting.legs;

export const getSportsbookBettingRunners = (state: ApplicationState): BettingState.RunnersMap =>
  state.betting.sportsbookBetting.runners;

export const getSportsbookBettingReviewLines = (state: ApplicationState): BettingState.LinesMap =>
  state.betting.sportsbookBetting.reviews.lines;

export const getSportsbookBettingReviewCombinations = (state: ApplicationState): BettingState.CombinationReviewMap =>
  state.betting.sportsbookBetting.reviews.combinations;

export const getSportsbookBettingImplyRunnerFailures = (state: ApplicationState): BettingState.ImplyRunnerFailuresMap =>
  state.betting.sportsbookBetting.failures.imply.runners;

export const getSportsbookBettingSBGBetslipBrandSettingIsSet = (state: ApplicationState): boolean =>
  !!state.entities.brandSettings?.SBG_BETSLIP_ERROR_MESSAGE;

export const getSportsbookBettingNumRunners = (state: ApplicationState): number =>
  Object.keys(state.betting.sportsbookBetting.runners).length;

export const getSportsbookBettingImplyLegFailures = (state: ApplicationState): BettingState.ImplyLegFailuresMap =>
  state.betting.sportsbookBetting.failures.imply.legs;

const filterPriceBoostTokenInformation = ({ tokenId, generosity }: BettingState.PriceBoostOffer) => ({
  tokenId,
  generosity,
});

const sortTokens = (
  {
    tokenId: tokenId1,
  }:
    | BettingState.AccaInsuranceOffer
    | BettingState.PriceBoostOffer
    | BettingState.MoneyBackOffer
    | BettingState.GhostLegOffer,
  {
    tokenId: tokenId2,
  }:
    | BettingState.AccaInsuranceOffer
    | BettingState.PriceBoostOffer
    | BettingState.MoneyBackOffer
    | BettingState.GhostLegOffer,
) => {
  if (tokenId1 < tokenId2) return -1;
  if (tokenId1 > tokenId2) return 1;
  return 0;
};

const areArraysEqual = <T>(obj1: T[], obj2: T[]) =>
  obj1.length === obj2.length &&
  obj1.every((dataObj1, index) => JSON.stringify(dataObj1) === JSON.stringify(obj2[index]));

const areWalletsEqual = (
  prevWallets: BettingState.WalletsMap | WalletsTokensMap,
  newWallets: BettingState.WalletsMap | WalletsTokensMap,
) =>
  prevWallets === newWallets ||
  (JSON.stringify(Object.keys(prevWallets).sort()) === JSON.stringify(Object.keys(newWallets).sort()) &&
    Object.values(prevWallets).every(
      (wallet) => JSON.stringify(wallet) === JSON.stringify(newWallets[wallet.walletId]),
    ));

const areTokensEqual = (prevCombination: BettingState.Combination, newCombination: BettingState.Combination) => {
  const {
    accaInsuranceOffers: prevAccas,
    priceBoostOffers: prevPriceBoosts,
    moneyBackOffers: prevMoneyBacks,
    ghostLegOffers: prevGhostLegs,
  } = prevCombination;
  const {
    accaInsuranceOffers: actualAccas,
    priceBoostOffers: actualPriceBoosts,
    moneyBackOffers: actualMoneyBacks,
    ghostLegOffers: actualGhostLegs,
  } = newCombination;

  return (
    areArraysEqual(prevAccas.slice().sort(sortTokens), actualAccas.slice().sort(sortTokens)) &&
    areArraysEqual(prevMoneyBacks.slice().sort(sortTokens), actualMoneyBacks.slice().sort(sortTokens)) &&
    areArraysEqual((prevGhostLegs || []).slice().sort(sortTokens), (actualGhostLegs || []).slice().sort(sortTokens)) &&
    areArraysEqual(
      prevPriceBoosts
        .slice()
        .sort(sortTokens)
        .map((token) => filterPriceBoostTokenInformation(token)),
      actualPriceBoosts
        .slice()
        .sort(sortTokens)
        .map((token) => filterPriceBoostTokenInformation(token)),
    )
  );
};

export const isGenerosityContextEqual = (
  prevState: {
    wallets: BettingState.WalletsMap | WalletsTokensMap;
    combinations: BettingState.CombinationsMap;
    selectedCombinationId: string;
  },
  newState: {
    wallets: BettingState.WalletsMap | WalletsTokensMap;
    combinations: BettingState.CombinationsMap;
    selectedCombinationId: string;
  },
) => {
  const {
    wallets: prevWallets,
    combinations: prevCombinations,
    selectedCombinationId: prevSelectedCombinationId,
  } = prevState;
  const {
    wallets: newWallets,
    combinations: newCombinations,
    selectedCombinationId: newSelectedCombinationId,
  } = newState;

  return (
    prevSelectedCombinationId === newSelectedCombinationId &&
    areWalletsEqual(prevWallets, newWallets) &&
    !!prevSelectedCombinationId &&
    !!newSelectedCombinationId &&
    areTokensEqual(prevCombinations[prevSelectedCombinationId], newCombinations[newSelectedCombinationId])
  );
};

export const createGetCombinationEligibleGenerosityWalletsSelector = () =>
  createSelectorCreator(defaultMemoize, isGenerosityContextEqual)(
    [
      (state: ApplicationState) => ({
        wallets: state.betting.sportsbookBetting.wallets,
        combinations: state.betting.sportsbookBetting.combinations,
        selectedCombinationId: state.betslip?.selectedCombinationId,
      }),
    ],
    ({ wallets, combinations, selectedCombinationId }): WalletsTokensMap => {
      if (!selectedCombinationId) {
        return {};
      }

      const combination = combinations[selectedCombinationId];
      const result: WalletsTokensMap = {};

      combination.applicableWallets?.forEach((walletId) => {
        result[walletId] = { ...wallets[walletId], walletId: String(walletId), type: WalletTypes.BonusCash };
      });

      combination.priceBoostOffers?.forEach((offer) => {
        result[offer.tokenId] = {
          ...offer,
          walletId: offer.tokenId,
          type: WalletTypes.PriceBoostToken,
        };
      });

      combination.accaInsuranceOffers?.forEach((offer) => {
        result[offer.tokenId] = {
          ...offer,
          walletId: offer.tokenId,
          type: WalletTypes.AccaInsuranceToken,
        };
      });

      combination.moneyBackOffers?.forEach((offer) => {
        result[offer.tokenId] = {
          ...offer,
          walletId: offer.tokenId,
          type: WalletTypes.MoneyBackToken,
        };
      });

      combination.ghostLegOffers?.forEach((offer) => {
        result[offer.tokenId] = {
          ...offer,
          walletId: offer.tokenId,
          type: WalletTypes.GhostLegToken,
        };
      });

      return result;
    },
  );

const isSelectedWalletsAmountsContextEqual = (prevState: BettingState.Group, newState: BettingState.Group) =>
  areWalletsEqual(prevState?.wallets, newState?.wallets);

/**
 * Returns the combination selected wallets
 */
const getCombinationSelectedBonusWallets = (
  combinationId: string,
  wallets: BettingState.WalletsMap,
): BettingState.Wallet[] =>
  Object.values(wallets).filter(({ combinationId: walletCombinationId }) => combinationId === walletCombinationId);

const sumWalletsAmounts = (value1 = 0, value2 = 0): number =>
  value1 || value2 ? (value1 * 100 + value2 * 100) / 100 : 0;

export const createGetCombinationsSelectedWalletsAmounts = () =>
  createSelectorCreator(defaultMemoize, isSelectedWalletsAmountsContextEqual)(
    [(sportsbookBetting: BettingState.Group) => sportsbookBetting],
    ({
      wallets,
      combinations,
    }): {
      [combinationId: string]: Pick<BettingState.Wallet, "combinationAmountPerLine" | "combinationAmount"> &
        Pick<BettingState.Combination, "numLines">;
    } =>
      Object.values(combinations).reduce((acc, combination) => {
        const { id, numLines, isEachWaySelected } = combination;
        const selectedWallets = getCombinationSelectedBonusWallets(id, wallets);

        if (!selectedWallets.length) {
          return acc;
        }

        const walletsAmounts = selectedWallets.reduce(
          (
            { combinationAmountPerLine: accAmountPerLine, combinationAmount: accAmount },
            { combinationAmountPerLine, combinationAmount },
          ) => ({
            combinationAmountPerLine: sumWalletsAmounts(accAmountPerLine, combinationAmountPerLine),
            combinationAmount: sumWalletsAmounts(accAmount, combinationAmount),
          }),
          {
            combinationAmountPerLine: 0,
            combinationAmount: 0,
          },
        );

        return {
          ...acc,
          [id]: {
            ...walletsAmounts,
            numLines: isEachWaySelected ? numLines * 2 : numLines,
          },
        };
      }, {}),
  );

export const createSimpleSelectionsCounterSelector = () =>
  createSelector(
    [getSportsbookBettingLegs],
    (legs): number =>
      Object.values(legs).filter((leg: BettingState.Leg) => COMBINABLE_LEG_TYPES_LIST.includes(leg.legType)).length,
  );

export const createCombinationCounterSelector = (): OutputParametricSelector<
  ApplicationState,
  string,
  number,
  (combinations: BettingState.CombinationsMap, combinationId: string) => number
> => {
  return createSelector(
    [getSportsbookBettingCombinations, (_, combinationId) => combinationId],
    (combinations, combinationId): number => {
      const combination = combinations[combinationId];

      if (!combination) {
        return 0;
      }

      return combination.legs.length;
    },
  );
};

type CombinationCalculationsValues = {
  combinationId: string;
  stake?: number;
};
export const createGetCalculatedCombination = (): OutputParametricSelector<
  ApplicationState,
  CombinationCalculationsValues,
  BettingState.Combination | undefined,
  (betting: SportsbookBettingState, values: CombinationCalculationsValues) => BettingState.Combination | undefined
> =>
  createSelector(
    [getSportsbookBettingState, (_: ApplicationState, values: CombinationCalculationsValues) => values],
    (betting, values) => {
      const { combinationId, stake } = values;

      if (!combinationId || !betting.combinations[combinationId]) {
        return undefined;
      }

      const calculatedGroup = updateStake(betting, { combinationId, stake });

      return calculatedGroup.combinations[combinationId];
    },
  );

export const pickGreatestOddCombination = (
  combinations: BettingState.CombinationsMap,
  legs: BettingState.LegsMap,
): BettingState.Combination | undefined => {
  const [greatestCombination] = Object.values(combinations)
    .filter(
      (combination: BettingState.Combination) =>
        combination.odds &&
        (isSingle(combination, legs) ||
          isMultiple(combination) ||
          isBetBuilder(combination) ||
          isMultiBetBuilder(combination) ||
          isBoostedMultiple(combination)) &&
        combination.numLines === 1,
    )
    .sort((combinationA, combinationB) => {
      if (!combinationA.odds || !combinationB.odds) {
        return 0;
      }

      return combinationB.odds.decimalOdds - combinationA.odds.decimalOdds;
    });

  return greatestCombination;
};

export const createGetGreatestOddCombinationSelector = (): Selector<
  ApplicationState,
  BettingState.Combination | undefined
> =>
  createSelector([getSportsbookBettingCombinations, getSportsbookBettingLegs], (combinations, legs) =>
    pickGreatestOddCombination(combinations, legs),
  );

export const createHasMultiplesSelector = () =>
  createSelector([getSportsbookBettingCombinations], (combinations): boolean =>
    Object.values(combinations).some((combination) => isMultiple(combination)),
  );

export const getSportsbookMarketTree = (
  state: ApplicationState,
  marketUrn: URN,
  selectionRunnerUrn: URN,
): SportsbookMarketTree => {
  const { sportsbookmarkets, sports } = state.entities;

  const market = getSportsbookMarketByURN(sportsbookmarkets, marketUrn);
  if (!market) {
    return null;
  }

  const runner = market.runners.find((run) => run.urn === selectionRunnerUrn);

  if (!runner) {
    return null;
  }

  const { runners } = market;
  if (!runners) {
    return null;
  }
  const marketRunner = getSportsbookMarketRunnerById(runners, runner.selectionId);
  if (!marketRunner) {
    return null;
  }

  const sport = getSportByURN(sports, market.sport);
  if (!sport) {
    return null;
  }

  return {
    marketRunner,
    market,
    sport,
  };
};

export const getSportsbookRunnerTree = (
  state: ApplicationState,
  runnerUrn: URN,
  isLotto?: boolean,
): SportsbookRunnerTree => {
  const { sportsbookrunners, sportsbookmarkets, sports } = state.entities;

  const runner = getSportsbookRunnerByURN(sportsbookrunners, runnerUrn);

  if (!runner) {
    return null;
  }

  const market = getSportsbookMarketByURN(sportsbookmarkets, runner.market);
  if (!market) {
    return null;
  }

  const { runners } = market;
  if (!runners) {
    return null;
  }
  const marketRunner = getSportsbookMarketRunnerById(runners, runner.selectionId);
  if (!marketRunner) {
    return null;
  }

  const lottoSport = {
    urn: "ppb:eventType:29125756",
    typename: "Sport" as const,
    name: "Lotteries",
    sportId: 29125756,
  };

  const sport = isLotto ? lottoSport : getSportByURN(sports, market.sport);
  if (!sport) {
    return null;
  }

  return {
    runner,
    marketRunner,
    market,
    sport,
  };
};

export const getPlaceFailures = (state: ApplicationState): BettingState.PlaceFailureGroup =>
  state.betting.sportsbookBetting.failures.place;

export const getPlaceRunnersFailures = (state: ApplicationState): BettingState.PlaceRunnerFailuresMap =>
  state.betting.sportsbookBetting.failures.place.runners;

export const getPlaceCombinationsFailures = (state: ApplicationState): BettingState.PlaceCombinationFailuresMap =>
  state.betting.sportsbookBetting.failures.place.combinations;

export const getOperationalFailure = (state: ApplicationState): BettingState.PlaceOperationFailure | undefined =>
  state.betting.sportsbookBetting.failures.place.operational;

export const getAllUniqueRunnersFailures = createSelector([getPlaceRunnersFailures], processAllUniqueRunnersFailures);

export const getAllUniqueCombinationsFailures = createSelector(
  [getPlaceCombinationsFailures],
  processAllUniqueCombinationsFailures,
);

export const getSportsbookBettingValidations = (state: ApplicationState): BettingState.GroupValidationsResult =>
  state.betting.sportsbookBetting.validations;

export const createSportsbookCombinationValidationsSelector = () =>
  createSelector(
    [getSportsbookBettingValidations, (_: ApplicationState, combinationId: string) => combinationId],
    (validations, combinationId) => validations.combinations[combinationId] || [],
  );

const createSingleCombinationIds = createSelector(
  [getSportsbookBettingLegs, getSportsbookBettingCombinations],
  (legs, combinations) =>
    Object.values(combinations)
      .filter((combination) => isSingleLike(combination, legs))
      .sort((combinationA, combinationB) => combinationA.creationTimestamp - combinationB.creationTimestamp)
      .map(({ id }) => id),
);

export const createGetSelectionIdsSelector = () =>
  createShallowEqualSelector(
    (state: BettingState.LegsMap): string[] =>
      Object.values(state)
        .filter(({ legType }) => COMBINABLE_LEG_TYPES_LIST.includes(legType))
        .map(({ id }) => id),
    (legIds: string[]) => legIds,
  );

export const createGetReviewCombinationLineIdsSelector = (): ParametricSelector<ApplicationState, string, string[]> =>
  createShallowEqualSelector(
    createSelector(
      [getSportsbookBettingReviewCombinations, (_: ApplicationState, id: string) => id],
      (combinations, id) => combinations[id]?.lineIds || [],
    ),
    (lineIds: string[]) => lineIds,
  );

export const getSingleCombinationIds = createShallowEqualSelector(
  createSingleCombinationIds,
  (combinationIds: string[]) => combinationIds,
);

export const createGetBetBuilderCombinationIdsSelector = (): Selector<ApplicationState, string[]> =>
  createShallowEqualSelector(
    createSelector([getSportsbookBettingCombinations], (combinations) =>
      Object.values(combinations)
        .filter((combination) => isBetBuilder(combination))
        .map(({ id }) => id),
    ),
    (combinationIds: string[]) => combinationIds,
  );

export const createGetBoostedCombinationsSelector = (): Selector<ApplicationState, BettingState.Combination[]> =>
  createSelector([getSportsbookBettingCombinations], (combinations) =>
    Object.values(combinations).filter((combination) => combination.isBoosted),
  );

export const createGetCastRunnerIdsSelector = (): ParametricSelector<ApplicationState, string | undefined, string[]> =>
  createShallowEqualSelector(
    createSelector(
      [
        getSportsbookBettingCombinations,
        getSportsbookBettingLegs,
        getSportsbookBettingRunners,
        (_: ApplicationState, combinationId?: string) => combinationId,
      ],
      generateCastRunnersIds,
    ),
    (runnerIds: string[]) => runnerIds,
  );

export const createGetFailureLegIdsByCombinationGroupIdSelector = (): ParametricSelector<
  ApplicationState,
  number | null,
  string[]
> =>
  createShallowEqualSelector(
    createSelector(
      [
        getSportsbookBettingLegs,
        getSportsbookBettingImplyRunnerFailures,
        (_: ApplicationState, combinationGroup: number | null) => combinationGroup,
      ],
      (legs, failures, combinationGroup) => {
        if (combinationGroup) {
          const runnersOfCombinationGroup = Object.keys(failures).filter((failedRunnerId) => {
            const runnerFailures = failures[failedRunnerId];

            return runnerFailures.some(({ combinationGroups }) => combinationGroups.includes(combinationGroup));
          });

          return Object.keys(legs).filter((legId) =>
            legs[legId].runners.some((runnerId) => runnersOfCombinationGroup.includes(runnerId)),
          );
        }

        return [];
      },
    ),
    (legIds: string[]) => legIds,
  );

export const createGetLegIdsByCombinationGroupIdSelector = (): ParametricSelector<
  ApplicationState,
  string | null,
  string[]
> =>
  createShallowEqualSelector(
    createSelector(
      [getSportsbookBettingLegs, (_: ApplicationState, combinationGroupId: string | null) => combinationGroupId],
      (legs, combinationGroupId) => {
        if (combinationGroupId) {
          return Object.keys(legs).filter((legId) => legs[legId].groupId === combinationGroupId);
        }

        return [];
      },
    ),
    (legIds: string[]) => legIds,
  );

export const createGetBoostedUncombinedGroupIdsSelector = (): Selector<ApplicationState, string[]> =>
  createShallowEqualSelector(
    createSelector(
      [getSportsbookBettingLegs, getSportsbookBettingImplyLegFailures, getSportsbookBettingImplyRunnerFailures],
      (legs, legFailures, runnerFailures) => {
        const failedBoostGroupIds = Object.values(legs)
          .filter((leg) => {
            if (!leg.isBoosted || !leg.groupId) {
              return false;
            }

            const isBoostedLegFailing = !!legFailures[leg.id];
            const hasFailingRunners = leg.runners.some((runnerId) => !!runnerFailures[runnerId]);

            return isBoostedLegFailing || hasFailingRunners;
          })
          .map((leg) => leg.groupId as string); // Only boosted legs with groupId will be present in this map

        return Array.from(new Set(failedBoostGroupIds));
      },
    ),
    (combinationGroupIds: string[]) => combinationGroupIds,
  );

export const createCombinationGroupFailuresSelector = (): Selector<ApplicationState, number[]> =>
  createShallowEqualSelector(
    createSelector(
      [getSportsbookBettingImplyRunnerFailures, getSportsbookBettingCombinations],
      (failures, combinations) => {
        const allUniqueFailedCombinationGroups = getUniqueFailedSGMCombinationGroups(failures);
        const allValidCombinationGroups = Object.values(combinations).map(({ combinationGroup }) => combinationGroup);

        return allUniqueFailedCombinationGroups.filter(
          (failedCombinationGroup) => !allValidCombinationGroups.includes(failedCombinationGroup),
        );
      },
    ),
    (combinationGroups: number[]) => combinationGroups,
  );

export const createGetLegsByRunnerSelector = (): ParametricSelector<ApplicationState, string[], string[]> =>
  createShallowEqualSelector(
    createSelector(
      [getSportsbookBettingLegs, (_: ApplicationState, runnerIds: string[]) => runnerIds],
      (legs, runnerIds) =>
        Object.keys(legs).filter((legId) => legs[legId].runners.some((runnerId) => runnerIds.includes(runnerId))),
    ),
    (legIds: string[]) => legIds,
  );

export const createGetRunnerByCombinationGroupSelector = (): ParametricSelector<ApplicationState, number, string[]> =>
  createShallowEqualSelector(
    createSelector(
      [getSportsbookBettingImplyRunnerFailures, (_: ApplicationState, combinationGroup: number) => combinationGroup],
      (failures, combinationGroup) =>
        Object.keys(failures).filter((failedRunnerId) => {
          const runnerFailures = failures[failedRunnerId];

          return !!runnerFailures.some(({ combinationGroups }) => combinationGroups.includes(combinationGroup));
        }),
    ),
    (runnerIds: string[]) => runnerIds,
  );

export const createGetCastGroupIdsSelector = (): Selector<ApplicationState, string[]> =>
  createShallowEqualSelector(
    createSelector(
      [getSportsbookBettingState, (state) => getBettingResolvers(state.betslip?.group).getMetadata(state)],
      (bettingState, bettingMetadata) =>
        generateCastGroupIds(groupCombinationsByMarketId(bettingState), bettingMetadata),
    ),
    (combinationIds: string[]) => combinationIds,
  );

export const createGetCastGroupSelector = (): OutputParametricSelector<
  ApplicationState,
  string,
  CastGroup,
  (bettingState: SportsbookBettingState, castGroupId: string) => CastGroup
> =>
  createSelector(
    [getSportsbookBettingState, (_: ApplicationState, castGroupId: string) => castGroupId],
    (bettingState, castGroupId) => {
      const castGroups = groupCombinationsByMarketId(bettingState);

      return castGroups[castGroupId];
    },
  );

export const createSportsbookBettingRunnerSelector = (): ParametricSelector<
  BettingState.RunnersMap,
  string,
  SportsbookBettingRunner
> =>
  createSelector(
    (sportsbookBettingRunnersState: BettingState.RunnersMap, runnerId: string) =>
      sportsbookBettingRunnersState[runnerId],
    (runner) => runner,
  );

export const getBoostedCombination = (state: ApplicationState, id: string): BettingState.Combination | undefined =>
  Object.values(state.betting.sportsbookBetting.combinations).find(
    (combination) => combination.isBoosted && combination.id === id,
  );

export const createQuickBetslipBetPickerSelector = () => {
  const getGreatestOddCombination = createGetGreatestOddCombinationSelector();
  const isLoggedIn = (state: ApplicationState) => state.entities.userdetails.loggedIn;
  const getRunnersMetadata = (state: ApplicationState) => getBettingResolvers(state.betslip?.group).getMetadata(state);

  return createSelector(
    [getThrottles, isLoggedIn, getRunnersMetadata, getGreatestOddCombination, getSportsbookBettingImplyRunnerFailures],
    (throttles, isLoggedIn, metadata, combination, runnerFailures): QuickBetslipBet | null => {
      const isThrottleActive = throttles["QUICK_BETSLIP"]?.isActive;

      if (!isThrottleActive) {
        return null;
      }

      if (!isLoggedIn) {
        return null;
      }

      const runnersMetadata = Object.values(metadata);
      const areAllLegsFromFootballSport =
        runnersMetadata.length > 0 &&
        runnersMetadata.every((runnerMetadata) => runnerMetadata.sportId === EventType.FOOTBALL);

      if (!areAllLegsFromFootballSport) {
        if (runnersMetadata.length > 0) {
          return { status: "fallback", reason: "non_football" };
        }
        return null;
      }

      const hasInvalidCombinationFailure = Object.values(runnerFailures).some((failures) =>
        hasAnyInvalidCombinationFailure(failures),
      );

      if (hasInvalidCombinationFailure) {
        return { status: "fallback", reason: "invalid_combination" };
      }

      if (!combination) {
        return { status: "fallback", reason: "invalid_combination" };
      }

      const { id } = combination;

      return {
        status: "valid",
        combinationId: id,
      };
    },
  );
};
