import { BaseFixture } from "../../../../../state/entities";
import { BaseFixtureFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeBaseFixtureFragmentIntoBaseFixture = (
  fragment: BaseFixtureFragment,
): TransformedFragment<BaseFixture> => {
  const { urn, __typename, sportevent, mainMarket } = fragment;

  return {
    data: {
      urn,
      typename: __typename,
      sportevent: sportevent.urn,
      mainMarket: {
        exchange: mainMarket.exchange?.urn,
        sportsbook: mainMarket.sportsbook?.urn,
      },
    },
  };
};

export default normalizeBaseFixtureFragmentIntoBaseFixture;
