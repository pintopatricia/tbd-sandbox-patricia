import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { makeMapStateToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key, interpolationValues }) => ({ key, interpolationValues }),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => {
  const getImsPromotionTermsCardByURN = jest.fn();
  return {
    createCardByURNSelector: jest.fn(() => getImsPromotionTermsCardByURN),
  };
});

const STATE = {
  layouts: {
    cards: {
      imspromotiontermsandconditions: { urn: "props" },
    },
  },
};

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should return props when card exist", () => {
    const getImsPromotionTermsCardByURN = createCardByURNSelector();

    getImsPromotionTermsCardByURN.mockReturnValue({
      termsAndConditions: [
        {
          spans: [{ start: 0, end: 134, style: "em" }],
          text: "When I say JACKPOT, you say SLOTS!",
          type: "paragraph",
        },
      ],
    });

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:imsPromotionTermsAndConditions:uid/gaming-win" });

    expect(getImsPromotionTermsCardByURN).toHaveBeenCalledWith(
      { urn: "props" },
      "ppb:tbd:card:imsPromotionTermsAndConditions:uid/gaming-win",
    );
    expect(props).toEqual({
      title: i18n({ key: "I18N.PROMO.TERMS_CONDITIONS" }),
      termsAndConditions: [
        {
          spans: [{ start: 0, end: 134, style: "em" }],
          text: "When I say JACKPOT, you say SLOTS!",
          type: "paragraph",
        },
      ],
    });
  });

  it("should return an empty object when card does not exist", () => {
    const getImsPromotionTermsCardByURN = createCardByURNSelector();

    getImsPromotionTermsCardByURN.mockReturnValue(null);

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:imsPromotionTermsAndConditions:uid/gaming-win" });

    expect(getImsPromotionTermsCardByURN).toHaveBeenCalledWith(
      { urn: "props" },
      "ppb:tbd:card:imsPromotionTermsAndConditions:uid/gaming-win",
    );
    expect(props).toEqual({});
  });

  it("should return an empty object when termsAndConditions is empty on card", () => {
    const getImsPromotionTermsCardByURN = createCardByURNSelector();

    getImsPromotionTermsCardByURN.mockReturnValue({
      termsAndConditions: [],
    });

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:imsPromotionTermsAndConditions:uid/gaming-win" });

    expect(getImsPromotionTermsCardByURN).toHaveBeenCalledWith(
      { urn: "props" },
      "ppb:tbd:card:imsPromotionTermsAndConditions:uid/gaming-win",
    );
    expect(props).toEqual({});
  });
});
