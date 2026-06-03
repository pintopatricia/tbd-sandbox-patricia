import { SportsbookBetFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { SportsbookOdds } from "../../../../../state/entities/SportsbookOdds.types";
import {
  BetEdgeEnum,
  BetEdgeStatusEnum,
  BetProduct,
  SportsbookBet,
} from "../../../../../state/betting/sportsbook-bets/SportsbookBet.types";
import { BetType, Result, ResultType } from "../../../../../state/constants";

type SportsbookOddsFragment = NonNullable<
  SportsbookBetFragment["betPrice"] | SportsbookBetFragment["originalBetPrice"]
>;

const transformGQLSportsbookOddsToSportsbookOdds = ({
  decimal,
  fractional,
}: SportsbookOddsFragment): SportsbookOdds => ({
  decimal,
  fractional: fractional || undefined,
});

export default function normalizeSportsbookBetFragmentIntoSportsbookBet(
  sportsbookBet: SportsbookBetFragment,
): TransformedFragment<SportsbookBet> {
  const {
    urn,
    id,
    betReceiptId,
    isSettled,
    betType,
    isEachWay,
    isSGM,
    isSGMMulti,
    isPBM,
    isPBS,
    isAccaInsuranceReward,
    isMoneyBackReward,
    ghostLegToken,
    has90MinBet,
    currentSize,
    profitAndLoss,
    originalPotentialWin,
    potentialWinForPlace,
    isOddsBoosted,
    isLotteries,
    numLines,
    currentSizePerLine,
    legs,
    result,
    resultType,
    cashoutQuote,
    bonus,
    betPrice,
    originalBetPrice,
    product,
    edges,
    lowestEventStartTime,
    mutations,
    __typename,
  } = sportsbookBet;
  return {
    data: {
      urn,
      typename: __typename,
      betId: id,
      betReceiptId,
      isSettled,
      betType: BetType[betType as keyof typeof BetType],
      isEachWay,
      isSGM,
      isSGMMulti,
      isPBM,
      isPBS,
      isAccaInsuranceReward,
      isMoneyBackReward,
      ghostLegToken,
      has90MinBet,
      currentSize,
      isOddsBoosted,
      isLotteries: !!isLotteries,
      profitAndLoss: profitAndLoss ?? undefined,
      originalPotentialWin: originalPotentialWin ?? undefined,
      potentialWinForPlace: potentialWinForPlace ?? undefined,
      betPrice: (betPrice && transformGQLSportsbookOddsToSportsbookOdds(betPrice)) || undefined,
      originalBetPrice: (originalBetPrice && transformGQLSportsbookOddsToSportsbookOdds(originalBetPrice)) || undefined,
      numLines,
      currentSizePerLine,
      legs: legs.map(({ urn: legUrn }) => legUrn),
      result: result ? Result[result as keyof typeof Result] : undefined,
      resultType: resultType ? ResultType[resultType] : undefined,
      cashoutQuoteURN: cashoutQuote?.urn || undefined,
      bonus: bonus ?? undefined,
      product: (product as BetProduct) || undefined,
      edges: edges.map(({ reason, status }) => ({
        reason: BetEdgeEnum[reason],
        status: status ? BetEdgeStatusEnum[status] : undefined,
      })),
      lowestEventStartTime: lowestEventStartTime ?? undefined,
      mutations,
    },
  };
}
