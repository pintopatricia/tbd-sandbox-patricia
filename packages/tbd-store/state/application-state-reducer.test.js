import tbdApp from "./application-state-reducer";

describe("application-state-reducer", () => {
  it("exposes all expected slice keys", () => {
    expect(Object.keys(tbdApp).sort()).toEqual(
      [
        "betting",
        "boot",
        "confirmation",
        "cookieConsent",
        "entities",
        "favouriteMarkets",
        "hamburgerMenu",
        "layouts",
        "modules",
        "myBets",
        "network",
        "notifications",
        "notificationsCenter",
        "predicts",
        "router",
      ].sort(),
    );
  });

  describe("predicts slice", () => {
    const initialState = { isOpen: false };

    it("initialises with isOpen=false", () => {
      const state = tbdApp.predicts(undefined, { type: "@@INIT" });
      expect(state).toStrictEqual(initialState);
    });

    it("sets isOpen=true when UI/OPEN_PREDICTS is dispatched", () => {
      const state = tbdApp.predicts(initialState, { type: "UI/OPEN_PREDICTS" });
      expect(state).toStrictEqual({ isOpen: true });
    });

    it("sets isOpen=false when UI/CLOSE_PREDICTS is dispatched", () => {
      const state = tbdApp.predicts({ isOpen: true }, { type: "UI/CLOSE_PREDICTS" });
      expect(state).toStrictEqual({ isOpen: false });
    });
  });
});
