import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key, interpolationValues }) => ({ key, interpolationValues }),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => {
  const getImsPromotionDetailsCardByURN = jest.fn();
  return {
    createCardByURNSelector: jest.fn(() => getImsPromotionDetailsCardByURN),
  };
});

const STATE = {
  layouts: {
    cards: {
      imspromotiondetails: { urn: "props" },
    },
  },
};

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should return props when card exist", () => {
    const getImsPromotionDetailsCardByURN = createCardByURNSelector();

    getImsPromotionDetailsCardByURN.mockReturnValue({
      details: [
        {
          spans: [{ start: 0, end: 134, style: "em" }],
          text: "When I say JACKPOT, you say SLOTS!",
          type: "paragraph",
        },
      ],
    });

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:imsPromotionDetails:uid/gaming-win" });

    expect(getImsPromotionDetailsCardByURN).toHaveBeenCalledWith(
      { urn: "props" },
      "ppb:tbd:card:imsPromotionDetails:uid/gaming-win",
    );
    expect(props).toEqual({
      title: i18n({ key: "I18N.PROMO.DETAILS" }),
      details: [
        {
          spans: [{ start: 0, end: 134, style: "em" }],
          text: "When I say JACKPOT, you say SLOTS!",
          type: "paragraph",
        },
      ],
    });
  });

  it("should return an empty object when card does not exist", () => {
    const getImsPromotionDetailsCardByURN = createCardByURNSelector();

    getImsPromotionDetailsCardByURN.mockReturnValue(null);

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:imsPromotionDetails:uid/gaming-win" });

    expect(getImsPromotionDetailsCardByURN).toHaveBeenCalledWith(
      { urn: "props" },
      "ppb:tbd:card:imsPromotionDetails:uid/gaming-win",
    );
    expect(props).toEqual({});
  });

  it("should return an empty object when details is empty on card", () => {
    const getImsPromotionDetailsCardByURN = createCardByURNSelector();

    getImsPromotionDetailsCardByURN.mockReturnValue({
      details: [],
    });

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:imsPromotionDetails:uid/gaming-win" });

    expect(getImsPromotionDetailsCardByURN).toHaveBeenCalledWith(
      { urn: "props" },
      "ppb:tbd:card:imsPromotionDetails:uid/gaming-win",
    );
    expect(props).toEqual({});
  });
});
