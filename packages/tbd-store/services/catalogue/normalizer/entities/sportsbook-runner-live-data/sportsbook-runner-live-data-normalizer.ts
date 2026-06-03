import { TransformedFragment } from "../../Normalizer.types";
import { SportsbookRunnerLiveDataFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { SportsbookRunner } from "../../../../../state/entities/sportsbook-runners/SportsbookRunner.types";

const normalizeSportsbookRunnerLiveDataFragmentIntoSportsbookRunnerLiveData = (
  data: SportsbookRunnerLiveDataFragment,
): TransformedFragment<SportsbookRunner> => {
  let odds;
  let trueOdds;

  if (data.displayOdds?.decimal && data.displayOdds?.fractional) {
    const { decimal, fractional } = data.displayOdds;

    odds = {
      decimal,
      fractional,
    };
  }

  if (data.odds?.decimal && data.odds?.fractional) {
    const { decimal, fractional } = data.odds;

    trueOdds = {
      decimal,
      fractional,
    };
  }

  return {
    data: {
      urn: data.runnerURN,
      market: data.marketURN,
      selectionId: data.selectionId,
      status: data.runnerStatus,
      odds,
      trueOdds,
    },
  };
};

export default normalizeSportsbookRunnerLiveDataFragmentIntoSportsbookRunnerLiveData;
