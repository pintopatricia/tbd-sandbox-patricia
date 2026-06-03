import { ExchangeMarket } from "../../../../../state/entities";
import {
  ExchangeCashoutQuoteFragment,
  ExchangeMarketFragment,
  ExchangeMarketLiveDataFragment,
  ExchangeMarketStatus,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeMarketHierarchyFragmentIntoMarketHierarchy from "../market-hierarchy/market-hierarchy-normalizer";

function isHydrated(
  market: ExchangeMarketLiveDataFragment | ExchangeMarketFragment,
): market is ExchangeMarketLiveDataFragment {
  return (market as ExchangeMarketLiveDataFragment).liveData !== undefined;
}

const normalizeExchangeMarketFragmentIntoExchangeMarket = (
  market: ExchangeMarketLiveDataFragment | ExchangeMarketFragment,
): TransformedFragment<ExchangeMarket> => {
  const {
    marketType,
    marketTypeName,
    name,
    runners,
    urn,
    bettingType,
    eachWayDivisor,
    numberOfWinners,
    hierarchy,
    sport,
    __typename,
  } = market;

  const { liveData = undefined, marketRulesViewLink = undefined } = isHydrated(market) ? market : {};
  const marketHierarchyData = normalizeMarketHierarchyFragmentIntoMarketHierarchy(hierarchy);

  return {
    data: {
      typename: __typename,
      urn,
      name,
      marketId: urn.split(":").pop() || "",
      sport: sport.urn,
      runners: runners.map(({ runnerURN, selectionId, name: runnerName, handicap, resultType }) => ({
        urn: runnerURN,
        selectionId,
        name: runnerName,
        handicap,
        resultType,
      })),
      status: ExchangeMarketStatus.Open,
      totalMatched: liveData?.totalMatched ?? 0,
      type: marketType,
      inplay: liveData?.inplay,
      turnInPlayEnabled: liveData?.turnInPlayEnabled,
      bettingType,
      eachWayDivisor: eachWayDivisor || undefined,
      numberOfWinners: numberOfWinners || undefined,
      marketType,
      marketTypeName,
      hierarchy: marketHierarchyData.data,
      cashoutQuotesURNs: liveData?.cashoutQuotes
        ?.filter((quote): quote is ExchangeCashoutQuoteFragment => !!quote)
        .map(({ urn }) => urn),
      ...(marketRulesViewLink ? { marketRulesViewLink } : undefined),
    },
  };
};

export default normalizeExchangeMarketFragmentIntoExchangeMarket;
