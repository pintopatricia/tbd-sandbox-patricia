import { movableInkMiddleware } from "./movable-ink-middleware";

const setup = (appState, nextSpy, actionType) => {
  movableInkMiddleware(appState)(nextSpy)(actionType);
};

describe("movableInkMiddleware", () => {
  let getState;
  let state;

  beforeEach(jest.clearAllMocks);

  describe("When the throttle is active", () => {
    describe("and the cookie consent category is active", () => {
      beforeEach(() => {
        getState = jest.fn().mockReturnValue({
          entities: {
            throttles: {
              INJECT_MI_SCRIPT: {
                isActive: true,
              },
            },
          },
          cookieConsent: {
            activeCategories: ["C0004"],
          },
        });

        state = { getState };

        document.head.innerHTML = "";
      });

      it("should inject the MI script", () => {
        const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        const action = {};
        const head = document.getElementsByTagName("head")[0];

        setup(state, nextSpy, action);

        expect(head.getElementsByTagName("script")[0].attributes.getNamedItem("src").value).toContain(
          "//movableink.betfair.com/p/js/1.js",
        );
      });
    });

    describe("and the cookie consent category is not active", () => {
      beforeEach(() => {
        getState = jest.fn().mockReturnValue({
          entities: {
            throttles: {
              INJECT_MI_SCRIPT: {
                isActive: true,
              },
            },
          },
          cookieConsent: {
            activeCategories: [],
          },
        });

        state = { getState };

        document.head.innerHTML = "";
      });

      it("should not inject the MI script", () => {
        const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        const action = {};
        const head = document.getElementsByTagName("head")[0];

        setup(state, nextSpy, action);

        expect(head).not.toContain("//movableink.betfair.com/p/js/1.js");
      });
    });
  });

  describe("When the throttle is not active", () => {
    describe("and the cookie consent category is active", () => {
      beforeEach(() => {
        getState = jest.fn().mockReturnValue({
          entities: {
            throttles: {
              INJECT_MI_SCRIPT: {
                isActive: false,
              },
            },
          },
          cookieConsent: {
            activeCategories: ["C0004"],
          },
        });

        state = { getState };

        document.head.innerHTML = "";
      });

      it("should not inject the MI script", () => {
        const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
        const action = {};
        const head = document.getElementsByTagName("head")[0];

        setup(state, nextSpy, action);

        expect(head).not.toContain("//movableink.betfair.com/p/js/1.js");
      });
    });
  });

  describe("and the cookie consent category is not active", () => {
    beforeEach(() => {
      getState = jest.fn().mockReturnValue({
        entities: {
          throttles: {
            INJECT_MI_SCRIPT: {
              isActive: false,
            },
          },
        },
        cookieConsent: {
          activeCategories: [],
        },
      });

      state = { getState };

      document.head.innerHTML = "";
    });

    it("should not inject the MI script", () => {
      const nextSpy = jest.fn().mockReturnValue("nextReturnValue");
      const action = {};
      const head = document.getElementsByTagName("head")[0];

      setup(state, nextSpy, action);

      expect(head).not.toContain("//movableink.betfair.com/p/js/1.js");
    });
  });
});
