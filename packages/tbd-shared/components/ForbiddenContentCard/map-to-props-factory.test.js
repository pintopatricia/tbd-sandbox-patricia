import { ComponentTheme } from "@ppb/the-wall-common/types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { EXTERNAL_PUSH } from "@ppb/tbd-store/actions/router";
import { SAW_CARD } from "@ppb/tbd-store/actions/interface";

import { getAuthData } from "../../config/endpoints";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../helpers/i18n";

const authDataWithContentLabel = {
  JOIN_DATA: {
    joinNowLabel: "joinNowLabel",
  },
};

const authDataWithoutContentLabel = {
  JOIN_DATA: {},
};

jest.mock("../../config/endpoints", () => ({
  getAuthData: jest.fn(() => authDataWithoutContentLabel),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => {
  const getForbiddenContentCardByURN = jest.fn(() => null);
  return {
    createCardByURNSelector: () => getForbiddenContentCardByURN,
  };
});

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const STATE_MOCK = {
  layouts: { cards: { forbiddencontent: "forbiddencontent" } },
};

let props;

describe("makeMapStateToProps", () => {
  describe("when the container URN is valid", () => {
    describe("and the forbiddenCardType is 'MY_BETS'", () => {
      beforeEach(() => {
        createCardByURNSelector().mockReturnValue({
          urn: "ppb:tbd:card:forbiddenContent:MyBets",
          typename: "ForbiddenContentCard",
          forbiddenCardType: "MY_BETS",
        });
        props = makeMapStateToProps()(STATE_MOCK, { urn: "VALID_URN" });
      });

      it("should try to fetch the card", () => {
        expect(createCardByURNSelector()).toHaveBeenCalledWith(STATE_MOCK.layouts.cards.forbiddencontent, "VALID_URN");
      });

      it("should translate the default forbidden message", () => {
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.FORBIDDEN_CARD.MY_BETS",
          interpolationValues: {
            logIn: "I18N.FORBIDDEN_CARD.LOG_IN",
            joinNow: "I18N.FORBIDDEN_CARD.JOIN_NOW",
          },
        });
      });

      it("should return the My Bets forbidden card view model", () => {
        expect(props).toEqual({
          message: "I18N.FORBIDDEN_CARD.MY_BETS",
          theme: ComponentTheme.DarkTransparent,
          labels: {
            logIn: "I18N.FORBIDDEN_CARD.LOG_IN",
            joinNow: "I18N.FORBIDDEN_CARD.JOIN_NOW",
          },
          authData: authDataWithoutContentLabel,
          anchorTextGTM: "MY BETS",
        });
      });
    });

    describe("and the forbiddenCardType is 'MARKET_GRAPHS'", () => {
      beforeEach(() => {
        createCardByURNSelector().mockReturnValue({
          urn: "ppb:tbd:card:forbiddenContent:MarketGraphs",
          typename: "ForbiddenContentCard",
          forbiddenCardType: "MARKET_GRAPHS",
        });
        props = makeMapStateToProps()(STATE_MOCK, { urn: "VALID_URN" });
      });

      it("should try to fetch the card", () => {
        expect(createCardByURNSelector()).toHaveBeenCalledWith(STATE_MOCK.layouts.cards.forbiddencontent, "VALID_URN");
      });

      it("should translate the default forbidden message", () => {
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.FORBIDDEN_CARD.MARKET_GRAPH",
          interpolationValues: {
            logIn: "|LOG_IN|",
            joinNow: "|JOIN_NOW|",
          },
        });
      });

      it("should return the Market Graphs forbidden card view model", () => {
        expect(props).toEqual({
          message: "I18N.FORBIDDEN_CARD.MARKET_GRAPH",
          labels: {
            logIn: "I18N.FORBIDDEN_CARD.LOG_IN",
            joinNow: "I18N.FORBIDDEN_CARD.JOIN_NOW",
          },
          authData: authDataWithoutContentLabel,
          anchorTextGTM: "MARKET GRAPHS",
        });
      });
    });

    describe("and the forbiddenCardType is none of the above", () => {
      beforeEach(() => {
        createCardByURNSelector().mockReturnValue({
          urn: "ppb:tbd:card:forbiddenContent:Generic",
          typename: "ForbiddenContentCard",
          forbiddenCardType: "GENERIC",
        });
        props = makeMapStateToProps()(STATE_MOCK, { urn: "VALID_URN" });
      });

      it("should try to fetch the card", () => {
        expect(createCardByURNSelector()).toHaveBeenCalledWith(STATE_MOCK.layouts.cards.forbiddencontent, "VALID_URN");
      });

      it("should translate the default forbidden message", () => {
        expect(i18n).toHaveBeenCalledWith({
          key: "I18N.FORBIDDEN_CARD",
          interpolationValues: {
            logIn: "|LOG_IN|",
            joinNow: "|JOIN_NOW|",
          },
        });
      });

      it("should return the Generic forbidden card view model", () => {
        expect(props).toEqual({
          message: "I18N.FORBIDDEN_CARD",
          labels: {
            logIn: "I18N.FORBIDDEN_CARD.LOG_IN",
            joinNow: "I18N.FORBIDDEN_CARD.JOIN_NOW",
          },
          authData: authDataWithoutContentLabel,
          anchorTextGTM: "",
        });
      });
    });
  });

  describe("when exists a join now defined from content management", () => {
    it("should return the defined label", () => {
      getAuthData.mockReturnValue(authDataWithContentLabel);
      createCardByURNSelector().mockReturnValue({
        urn: "ppb:tbd:card:forbiddenContent:MyBets",
        typename: "ForbiddenContentCard",
        forbiddenCardType: "MY_BETS",
      });
      props = makeMapStateToProps()(STATE_MOCK, { urn: "VALID_URN" });

      expect(props.labels.joinNow).toEqual(authDataWithContentLabel.JOIN_DATA.joinNowLabel);
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("on dispatchExternalPushAction trigger", () => {
    it("should dispatch the external URN", () => {
      const { dispatchExternalPushAction } = mapDispatchToProps;

      expect(dispatchExternalPushAction("label", "anchorTextGTM", "FANCY_URL")).toEqual({
        type: EXTERNAL_PUSH,
        payload: {
          viewUrn: "",
          viewUrl: "FANCY_URL",
          gtmData: {
            label: "label",
            moduleName: "forbidden card - anchorTextGTM",
          },
        },
      });
    });
  });

  describe("on dispatchSawCardAction trigger", () => {
    it("should dispatch the saw action", () => {
      const { dispatchSawCardAction } = mapDispatchToProps;

      expect(dispatchSawCardAction("card name")).toEqual({
        type: SAW_CARD,
        payload: {
          label: "forbidden card",
          moduleName: "forbidden card - card name",
        },
      });
    });
  });
});
