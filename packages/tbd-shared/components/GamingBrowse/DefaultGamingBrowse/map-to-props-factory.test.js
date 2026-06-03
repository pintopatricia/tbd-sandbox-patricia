import { PUSH, EXTERNAL_PUSH } from "@ppb/tbd-store/actions/router";
import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";
import { i18n } from "../../../helpers/i18n";

jest.mock("../../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  getUserDetails: jest.fn(() => ({
    jurisdiction: { jurisdiction: "INTERNATIONAL" },
    localeCode: "en-GB",
    loggedIn: true,
  })),
}));

describe("makeMapStateToProps", () => {
  it("should initialize DeafultGamingBrowse component with the correct props", () => {
    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps({}, { typename: "ViewZone" });
    expect(props).toEqual({
      defaultGamingi18n: {
        i18n: {
          title: "I18N.CATEGORY.CASINO_ESSENTIALS",
          subtitle: "I18N.CATEGORY.MORE_CASINO_GAMES",
        },
      },
      typename: "ViewZone",
      categoryLinks: [
        {
          text: i18n({ key: "I18N.CATEGORY.CASINO_HOME" }),
          viewLink: {
            viewUrl: "casino/gm-1",
            viewUrn: "ppb:tbd:view:gaming:1",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.CASINO_PROMOTIONS" }),
          viewLink: {
            viewUrl: "casino/p-1",
            viewUrn: "ppb:tbd:view:promotions:1",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.SLOTS" }),
          viewLink: {
            viewUrl: "casino/p/gaming-slots/gs-gaming-slots",
            viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-slots",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.LIVE_CASINO" }),
          viewLink: {
            viewUrl: "casino/c/casino-live-casino/gc-casino-live-casino",
            viewUrn: "ppb:tbd:view:gamingCategory:casino-live-casino",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.NEW" }),
          viewLink: {
            viewUrl: "casino/p/gaming-new/gs-gaming-new",
            viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-new",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.CASINO_PREMIUM" }),
          viewLink: {
            viewUrl: "casino/p/gaming-premium-casino/gs-gaming-premium-casino",
            viewUrn: "ppb:tbd:view:gamingSegmentation:gaming-premium-casino",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.MEGAWAYS" }),
          viewLink: {
            viewUrl: "casino/c/gaming-megaways-slots/gc-gaming-megaways-slots",
            viewUrn: "ppb:tbd:view:gamingCategory:gaming-megaways-slots",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.JACKPOT_KINGS" }),
          viewLink: {
            viewUrl: "casino/c/gaming-jackpot-king/gc-gaming-jackpot-king",
            viewUrn: "ppb:tbd:view:gamingCategory:gaming-jackpot-king",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.DAILY_JACKPOT" }),
          viewLink: {
            viewUrl: "casino/c/gaming-daily-jackpot/gc-gaming-daily-jackpot",
            viewUrn: "ppb:tbd:view:gamingCategory:gaming-daily-jackpot",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.EXCLUSIVE" }),
          viewLink: {
            viewUrl: "casino/c/gaming-exclusive/gc-gaming-exclusive",
            viewUrn: "ppb:tbd:view:gamingCategory:gaming-exclusive",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.ROULETTE" }),
          viewLink: {
            viewUrl: "casino/c/gaming-roulette/gc-gaming-roulette",
            viewUrn: "ppb:tbd:view:gamingCategory:gaming-roulette",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.BLACKJACK" }),
          viewLink: {
            viewUrl: "casino/c/gaming-blackjack/gc-gaming-blackjack",
            viewUrn: "ppb:tbd:view:gamingCategory:gaming-blackjack",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.TABLE_GAMES" }),
          viewLink: {
            viewUrl: "casino/c/gaming-table-games/gc-gaming-table-games",
            viewUrn: "ppb:tbd:view:gamingCategory:gaming-table-games",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.ALL_JACKPOTS" }),
          viewLink: {
            viewUrl: "casino/c/gaming-jackpots/gc-gaming-jackpots",
            viewUrn: "ppb:tbd:view:gamingCategory:gaming-jackpots",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.ALL_GAMES" }),
          viewLink: {
            viewUrl: "casino/c/gaming-all-games/gc-gaming-all-games",
            viewUrn: "ppb:tbd:view:gamingCategory:gaming-all-games",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.BINGO" }),
          viewLink: {
            viewUrl: "https://bingo.betfair.com/",
            viewUrn: "ppb:tbd:view:external:external",
            viewDisplayMode: "SELF_INAPP",
          },
          target: "_self",
        },
        {
          text: i18n({ key: "I18N.CATEGORY.POKER" }),
          viewLink: {
            viewUrl: "https://mpoker.betfair.com/",
            viewUrn: "ppb:tbd:view:external:external",
            viewDisplayMode: "SELF_INAPP",
          },
          target: "_self",
        },
      ],
    });
  });
});

describe("makeMapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should be a factory function", () => {
    expect(makeMapDispatchToProps()).toEqual(expect.any(Function));
  });

  it("should return dispatchRouterPushAction and dispatchExternalRouterPushAction", () => {
    const dispatchMock = jest.fn();

    expect(makeMapDispatchToProps()(dispatchMock, { urn: "ppb:tbd:view:browse:browse" })).toEqual({
      dispatchRouterPushAction: expect.any(Function),
      dispatchExternalRouterPushAction: expect.any(Function),
    });
  });

  describe("dispatchRouterPushAction", () => {
    it("should dispatch router push action", () => {
      const dispatchMock = jest.fn();
      const viewLink = { viewUrn: "urn:fake", viewUrl: "https://url" };

      const { dispatchRouterPushAction } = makeMapDispatchToProps()(dispatchMock, {
        viewLink: { viewUrn: "urn:fake", viewUrl: "https://url" },
      });

      expect(dispatchRouterPushAction(viewLink)).toEqual(undefined);
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: PUSH,
        payload: viewLink,
      });
    });
  });

  describe("dispatchExternalRouterPushAction", () => {
    it("should dispatch external router push action", () => {
      const dispatchMock = jest.fn();
      const viewLink = { viewUrn: "urn:fake", viewUrl: "https://url" };

      const { dispatchExternalRouterPushAction } = makeMapDispatchToProps()(dispatchMock, {
        viewLink: { viewUrn: "urn:fake", viewUrl: "https://url" },
      });

      expect(dispatchExternalRouterPushAction(viewLink)).toEqual(undefined);
      expect(dispatchMock).toHaveBeenCalledTimes(1);
      expect(dispatchMock).toHaveBeenCalledWith({
        type: EXTERNAL_PUSH,
        payload: viewLink,
      });
    });
  });
});
