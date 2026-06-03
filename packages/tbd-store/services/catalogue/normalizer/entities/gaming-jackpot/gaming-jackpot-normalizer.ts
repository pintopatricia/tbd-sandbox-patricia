import { Jackpot } from "../../../../../state/entities";
import { TransformedFragment } from "../../Normalizer.types";
import { GamingJackpotFragment } from "../../../../../clients/catalogue/catalogue-response-types";

const normalizeGamingJackpotFragmentIntoGamingJackpot = (
  gamingJackpot: GamingJackpotFragment,
): TransformedFragment<Jackpot> => {
  const { urn, name, value, state, progress, dropText, dropTime, dropValue, __typename } = gamingJackpot;

  return {
    data: {
      typename: __typename,
      urn,
      name,
      value,
      state: state === "COLD" ? "COLD" : "HOT",
      progress,
      dropValue: dropValue || undefined,
      dropTime: dropTime || undefined,
      dropText: dropText || undefined,
    },
  };
};

export default normalizeGamingJackpotFragmentIntoGamingJackpot;
