import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => {
  const getMarketViewLinkCardByURN = jest.fn();
  return {
    createCardByURNSelector: jest.fn(() => getMarketViewLinkCardByURN),
  };
});

const STATE = {
  layouts: {
    cards: {
      marketviewlinks: { urn: "props" },
    },
  },
};

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should return props when card exist", () => {
    const getMarketViewLinkCardByURN = createCardByURNSelector();

    getMarketViewLinkCardByURN.mockReturnValue({
      type: "MARKET_VIEW_LINK_CARD",
      marketName: "Winner Covid League 2020",
      viewLink: {
        viewUrn: "viewUrnMock",
        viewUrl: "viewUrlMock",
      },
      badge: "CUP",
    });

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:marketViewLink:924.238454488" });

    expect(getMarketViewLinkCardByURN).toHaveBeenCalledWith(
      { urn: "props" },
      "ppb:tbd:card:marketViewLink:924.238454488",
    );
    expect(props).toEqual({
      name: "Winner Covid League 2020",
      viewLink: {
        viewUrn: "viewUrnMock",
        viewUrl: "viewUrlMock",
      },
      badge: "CUP",
    });
  });

  it("should return an empty object when card does not exist", () => {
    const getMarketViewLinkCardByURN = createCardByURNSelector();

    getMarketViewLinkCardByURN.mockReturnValue(null);

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:marketViewLink:924.238454488" });

    expect(getMarketViewLinkCardByURN).toHaveBeenCalledWith(
      { urn: "props" },
      "ppb:tbd:card:marketViewLink:924.238454488",
    );
    expect(props).toEqual({});
  });
});
