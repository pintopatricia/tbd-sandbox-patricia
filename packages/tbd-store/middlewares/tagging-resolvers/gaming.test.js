import {
  loadPrizeMachine,
  getGameLaunchFromGameInfoEvent,
  getGameTileClickEvent,
  loadPlayNew,
  getMoreInfoPlayNewClickEvent,
  getPlayNowPlayNewClickEvent,
  getGameLaunchFromPNEvent,
} from "./gaming";

describe("Gaming GTM resolvers", () => {
  describe("loadPrizeMachine", () => {
    describe("when loading prize machine widget on a view", () => {
      it("should return the correct object when prize machine doesn't have jackpot and hasPlus", () => {
        expect(loadPrizeMachine("https://viewlink", 1, false, undefined, "")).toEqual({
          event: "ga_event",
          action: "displayed",
          category: "gaming",
          label: "prize machine",
          cd3: "prize machine",
          cd13: "prize pinball",
          cd12: "prize pinball",
          cd74: "ppb-internal",
          cd34: "https://viewlink",
          cd143: null,
          cd67: null,
          cd103: 1,
          cd42: null,
          cd43: null,
          cd138: null,
          cd99: null,
          cd68: null,
          cd69: null,
        });
      });
      it("should return the correct object when prize machine doesn't have jackpot but has hasPlus", () => {
        expect(loadPrizeMachine("https://viewlink", 1, false, undefined, " plus")).toEqual({
          event: "ga_event",
          action: "displayed",
          category: "gaming",
          label: "prize machine plus",
          cd3: "prize machine",
          cd13: "prize pinball",
          cd12: "prize pinball",
          cd74: "ppb-internal",
          cd34: "https://viewlink",
          cd143: null,
          cd67: null,
          cd103: 1,
          cd42: null,
          cd43: null,
          cd138: null,
          cd99: null,
          cd68: null,
          cd69: null,
        });
      });
      it("should return the correct object when prize machine have jackpot", () => {
        expect(loadPrizeMachine("https://viewlink", 1, true, "hot", "")).toEqual({
          event: "ga_event",
          action: "displayed",
          category: "gaming",
          label: "prize machine - active jackpot - hot",
          cd3: "prize machine",
          cd13: "prize pinball",
          cd12: "prize pinball",
          cd74: "ppb-internal",
          cd34: "https://viewlink",
          cd143: null,
          cd67: null,
          cd103: 1,
          cd42: null,
          cd43: null,
          cd138: null,
          cd99: null,
          cd68: null,
          cd69: null,
        });
      });

      it("should return the correct object when prize machine has isPlus", () => {
        expect(loadPrizeMachine("https://viewlink", 1, true, "hot", " plus -")).toEqual({
          event: "ga_event",
          action: "displayed",
          category: "gaming",
          label: "prize machine - plus - active jackpot - hot",
          cd3: "prize machine",
          cd13: "prize pinball",
          cd12: "prize pinball",
          cd74: "ppb-internal",
          cd34: "https://viewlink",
          cd143: null,
          cd67: null,
          cd103: 1,
          cd42: null,
          cd43: null,
          cd138: null,
          cd99: null,
          cd68: null,
          cd69: null,
        });
      });
    });
  });

  describe("loadPlayNew", () => {
    describe("when loading play new widget on a view", () => {
      it("should return the correct object when play new is a static promo", () => {
        expect(loadPlayNew(1, true)).toEqual({
          event: "ga_event",
          action: "displayed",
          category: "gaming",
          label: "spin until you win - hype building",
          cd3: "spin until you win",
          cd103: 1,
        });
      });

      it("should return the correct object when play new is an active promo", () => {
        expect(loadPlayNew(1, false)).toEqual({
          event: "ga_event",
          action: "displayed",
          category: "gaming",
          label: "spin until you win - active",
          cd3: "spin until you win",
          cd103: 1,
        });
      });
    });
  });

  describe("getMoreInfoPlayNewClickEvent", () => {
    describe("when clicking on more info button from play new widget", () => {
      it("should return the correct object when play new is a static promo", () => {
        expect(getMoreInfoPlayNewClickEvent("https://viewlink", 1, true)).toEqual({
          event: "ga_event",
          action: "navigated to",
          category: "navigation",
          label: "terms & conditions - hype building state",
          cd3: "spin until you win",
          cd34: "https://viewlink",
          cd103: 1,
        });
      });

      it("should return the correct object when play new is an active promo", () => {
        expect(getMoreInfoPlayNewClickEvent("https://viewlink", 1, false)).toEqual({
          event: "ga_event",
          action: "navigated to",
          category: "navigation",
          label: "terms & conditions - active state",
          cd3: "spin until you win",
          cd34: "https://viewlink",
          cd103: 1,
        });
      });
    });
  });

  describe("getPlayNowPlayNewClickEvent", () => {
    describe("when clicking on play now button from play new widget", () => {
      it("should return the correct object when play new is an active promo", () => {
        expect(getPlayNowPlayNewClickEvent("https://viewlink", 1, true)).toEqual({
          event: "ga_event",
          action: "navigated to",
          category: "navigation",
          label: "play now - active state",
          cd3: "spin until you win",
          cd34: "https://viewlink",
          cd103: 1,
        });
      });
    });
  });

  describe("getGameTileClickEvent", () => {
    describe("when clicking in a game tile to launch a game", () => {
      it("should return the correct object", () => {
        expect(
          getGameTileClickEvent(
            "Curated Games",
            "Label",
            "Ted",
            "https://launcher.betfair.com/?gameId=BP_Ted&channel=c",
            "gp-bp",
            "ted-gbp",
            2,
            1,
            2,
            3,
            "web",
          ),
        ).toEqual({
          event: "ga_event",
          category: "gaming",
          action: "clicked play now",
          label: "Label",
          cd3: "Curated Games",
          cd13: "ted-gbp",
          cd12: "Ted",
          cd74: "gp-bp",
          cd143: undefined,
          cd67: 3,
          cd34: "https://launcher.betfair.com/?gameId=BP_Ted&channel=c",
          cd103: 1,
          cd42: 2,
          cd43: 3,
          cd109: "rebuild",
          cd110: "web",
        });
      });
    });
  });

  describe("getGameLaunchFromGameInfoEvent", () => {
    describe("when clicking on a Play now button from Game Info Page", () => {
      it("should return the correct object", () => {
        expect(
          getGameLaunchFromGameInfoEvent("Rainbow Riches", "href.com", "Provider", "rainbow-riches", "web"),
        ).toEqual({
          event: "ga_event",
          action: "clicked play now",
          category: "gaming",
          label: "Rainbow Riches",
          cd3: "game info cta",
          cd13: "rainbow-riches",
          cd12: "Rainbow Riches",
          cd74: "Provider",
          cd143: undefined,
          cd67: undefined,
          cd34: "href.com",
          cd103: undefined,
          cd42: undefined,
          cd43: undefined,
          cd109: "rebuild",
          cd110: "web",
        });
      });
    });
  });

  describe("getGameLaunchFromPNEvent", () => {
    describe("when clicking on a push notification that contain gameLaunchURL", () => {
      it("should return the correct object", () => {
        expect(getGameLaunchFromPNEvent("Rainbow Riches", "href.com", "Provider", "rainbow-riches", "native")).toEqual({
          event: "ga_event",
          action: "clicked play now",
          category: "gaming",
          label: "Rainbow Riches",
          cd3: "push notification",
          cd13: "rainbow-riches",
          cd12: "Rainbow Riches",
          cd74: "Provider",
          cd143: undefined,
          cd67: undefined,
          cd34: "href.com",
          cd103: undefined,
          cd42: undefined,
          cd43: undefined,
          cd109: "rebuild",
          cd110: "native",
        });
      });
    });
  });
});
