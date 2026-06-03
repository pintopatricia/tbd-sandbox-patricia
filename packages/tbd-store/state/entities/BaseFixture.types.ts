import URN from "../layout/URN";

export type BaseFixture = {
  urn: URN;
  typename: "BaseFixture";
  sportevent: URN;
  mainMarket: {
    exchange?: URN;
    sportsbook?: URN;
  };
};
