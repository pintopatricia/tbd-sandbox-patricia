import { codecs } from "@ppb/tbd-urn-codecs";
import { SportsbookMarket } from "../../../../../state";
import {
  SportsbookMarketLiveDataFragment,
  SportsbookMarketFragment,
  SportsbookRunnerLiveData,
  SportsbookMarketStatus as SportsbookMarketStatusFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import marketHierarchyNormalizer from "../market-hierarchy/market-hierarchy-normalizer";
import { SportsbookMarketStatus } from "../../../../../state/constants";

function isHydrated(
  market: SportsbookMarketLiveDataFragment | SportsbookMarketFragment,
): market is SportsbookMarketLiveDataFragment {
  return (market as SportsbookMarketLiveDataFragment).liveData !== undefined;
}

function getMarketStatus(status?: SportsbookMarketStatusFragment): SportsbookMarketStatus | undefined {
  if (status) {
    return SportsbookMarketStatus[status];
  }

  return undefined;
}

const normalizeSportsbookMarketFragmentIntoSportsbookMarket = (
  sportsbookMarket: SportsbookMarketLiveDataFragment | SportsbookMarketFragment,
): TransformedFragment<SportsbookMarket> => {
  const {
    isOddsboostMarketType,
    isAutomaticEachWayMarketType,
    marketType,
    marketTypeName,
    isSuperSub,
    name,
    runners,
    urn,
    hierarchy,
    bettingType,
    sport,
    isAccaFreezeEligible,
    __typename,
  } = sportsbookMarket;

  const liveData = isHydrated(sportsbookMarket) ? sportsbookMarket.liveData : undefined;
  const liveRunners = liveData?.runners?.reduce(
    (acc: { [key: string]: Pick<SportsbookRunnerLiveData, "urn" | "runnerURN" | "handicap"> }, sbkLiveRunner) =>
      sbkLiveRunner
        ? {
            ...acc,
            [sbkLiveRunner.runnerURN]: sbkLiveRunner,
          }
        : acc,
    {},
  );

  const marketHierarchyData = marketHierarchyNormalizer(hierarchy);

  return {
    data: {
      typename: __typename,
      ...(liveData?.inplay !== undefined ? { inplay: liveData.inplay } : {}),
      turnInPlayEnabled: liveData ? liveData?.turnInPlayEnabled : null,
      bspMarket: liveData ? liveData?.bspMarket : null,
      eachWayAvailable: liveData?.eachwayAvailable ?? undefined,
      isOddsboostMarketType: isOddsboostMarketType || undefined,
      isAutomaticEachWayMarketType: isAutomaticEachWayMarketType || undefined,
      marketId: codecs.sportsbookMarket.decode(urn) || "",
      marketType,
      marketTypeName,
      isSuperSub: isSuperSub ?? false,
      bettingType,
      hierarchy: marketHierarchyData.data,
      name,
      runners: runners.map(({ runnerURN, selectionId, name: runnerName, handicap, resultType }) => {
        const liveRunner = liveRunners && liveRunners[runnerURN];

        return {
          handicap: liveRunner ? liveRunner.handicap : handicap,
          name: runnerName,
          resultType,
          selectionId,
          urn: runnerURN,
        };
      }),
      sport: sport?.urn,
      status: getMarketStatus(liveData?.sportsbookMarketStatus),
      isAccaFreezeEligible: isAccaFreezeEligible || false,
      urn,
    },
  };
};

export default normalizeSportsbookMarketFragmentIntoSportsbookMarket;
