import {
  UI__PLAY_NEW_LOADED,
  UI__PLAY_NEW_MORE_INFO_BUTTON_CLICK,
  UI__PLAY_NEW_PLAY_NOW_BUTTON_CLICK,
} from "@ppb/tbd-store/actions/navigation";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getGamingPlayNewCardByURN = jest.fn();

global.Date.now = jest.fn(() => new Date("2022-01-01T15:15:00Z"));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getGamingPlayNewCardByURN),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("../../view-model-factories/game.web", () => ({
  getImagePath: jest.fn().mockReturnValue("play-new-union"),
}));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const STATE = {
  layouts: {
    cards: {
      gamingplaynews: { urn: "ppb:tbd:gaming:masterConfigElement:styw/0" },
    },
  },
};

const MOCK_BASE = {
  type: "GAMING_PLAY_NEW_CARD",
  title: "SPIN UNTIL YOU WIN",
  subtitle: "IS NOW LIVE. ENJOY THE FUN!",
  logoImage: {
    url: "logoImageUrl",
    width: 900,
    height: 900,
  },
  termsAndConditions: {
    url: "termsUrl",
  },
  endDate: "2022-06-10T20:25:09.515Z",
  optInState: "NOT_OPTED_IN",
  tags: ["styw-static"],
};

describe("makeMapStateToProps", () => {
  afterEach(jest.clearAllMocks);

  describe("when promotion is not in completed state", () => {
    let props;

    it("should return default props for pre-campagne state", () => {
      getGamingPlayNewCardByURN.mockReturnValue(MOCK_BASE);
      props = makeMapStateToProps()(STATE, { urn: "ppb:tbd:gaming:masterConfigElement:styw/0" });
      expect(props).toEqual({
        urn: "ppb:tbd:gaming:masterConfigElement:styw/0",
        title: "SPIN UNTIL YOU WIN",
        subtitle: "IS NOW LIVE. ENJOY THE FUN!",
        backgroundImage: "play-new-union",
        logoImage: null,
        termsAndConditions: {
          url: "termsUrl",
        },
        isStaticPromo: true,
        hours: 99,
        minutes: 59,
        isExceededTime: true,
        translations: {
          i18n: {
            playNowLabel: "I18N.PLAY_NEW.PLAY_NOW",
            badgeLabel: "I18N.GAME_CARD.BADGE.NEW",
            moreInfoLabel: "I18N.PLAY_NEW.T&C".substring(0, 15),
            hoursLabel: "I18N.PLAY_NEW.HOURS",
            minutesLabel: "I18N.PLAY_NEW.MINUTES",
          },
        },
      });
    });

    it("should return default props for active state", () => {
      getGamingPlayNewCardByURN.mockReturnValue({
        ...MOCK_BASE,
        tags: ["styw"],
      });
      props = makeMapStateToProps()(STATE, { urn: "ppb:tbd:gaming:masterConfigElement:styw/0" });

      expect(props).toEqual({
        urn: "ppb:tbd:gaming:masterConfigElement:styw/0",
        title: "SPIN UNTIL YOU WIN",
        subtitle: "IS NOW LIVE. ENJOY THE FUN!",
        backgroundImage: "play-new-union",
        logoImage: null,
        termsAndConditions: {
          url: "termsUrl",
        },
        isStaticPromo: false,
        hours: 0,
        minutes: 0,
        isExceededTime: false,
        translations: {
          i18n: {
            playNowLabel: "I18N.PLAY_NEW.PLAY_NOW",
            badgeLabel: "I18N.GAME_CARD.BADGE.NEW",
            moreInfoLabel: "I18N.PLAY_NEW.T&C".substring(0, 15),
            hoursLabel: "I18N.PLAY_NEW.HOURS",
            minutesLabel: "I18N.PLAY_NEW.MINUTES",
          },
        },
      });
    });

    it("should call getGamingPlayNewCardByURN", () => {
      getGamingPlayNewCardByURN.mockReturnValue(MOCK_BASE);
      props = makeMapStateToProps()(STATE, { urn: "ppb:tbd:gaming:masterConfigElement:styw/0" });
      expect(getGamingPlayNewCardByURN).toHaveBeenCalledWith(
        { urn: "ppb:tbd:gaming:masterConfigElement:styw/0" },
        "ppb:tbd:gaming:masterConfigElement:styw/0",
      );
    });
  });

  describe("when promotion is in completed state", () => {
    let props;

    it("should return default props for pre-campagne state", () => {
      getGamingPlayNewCardByURN.mockReturnValue({
        ...MOCK_BASE,
        optInState: "COMPLETED",
      });
      props = makeMapStateToProps()(STATE, { urn: "ppb:tbd:gaming:masterConfigElement:styw/0" });
      expect(props).toEqual({});
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchClickToMoreInfoButtonAction", () => {
    it("should dispatch click on more info button from Play New widget", () => {
      const { dispatchClickToMoreInfoButtonAction } = mapDispatchToProps;
      const viewLink = "viewLink";
      const urn = "ppb:tbd:gaming:masterConfigElement:play_new/0";
      const isStaticPromo = true;

      expect(dispatchClickToMoreInfoButtonAction(viewLink, urn, isStaticPromo)).toEqual({
        type: UI__PLAY_NEW_MORE_INFO_BUTTON_CLICK,
        payload: { viewLink, urn, isStaticPromo },
      });
    });
  });
  describe("dispatchClickToPlayNowButtonAction", () => {
    it("should dispatch click on play now button from Play New widget", () => {
      const { dispatchClickToPlayNowButtonAction } = mapDispatchToProps;
      const viewLink = "viewLink";
      const urn = "ppb:tbd:gaming:masterConfigElement:play_new/0";

      expect(dispatchClickToPlayNowButtonAction(viewLink, urn)).toEqual({
        type: UI__PLAY_NEW_PLAY_NOW_BUTTON_CLICK,
        payload: { viewLink, urn },
      });
    });
  });
  describe("dispatchGamingPlayNewLoaded", () => {
    it("should dispatch load play new widget", () => {
      const { dispatchGamingPlayNewLoaded } = mapDispatchToProps;
      const urn = "ppb:tbd:gaming:masterConfigElement:play_new/0";
      const isStaticPromo = false;

      expect(dispatchGamingPlayNewLoaded(urn, isStaticPromo)).toEqual({
        type: UI__PLAY_NEW_LOADED,
        payload: { urn, isStaticPromo },
      });
    });
  });
});
