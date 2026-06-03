import { getStore } from "@ppb/tbd-store/create-store";
import subscribeEvent from "../../event-broker/event-subscriber";
import register from "./catalogue-event-processor";

jest.mock("@ppb/tbd-store/create-store", () => {
  const dispatch = jest.fn();

  return {
    getStore: jest.fn(() => ({
      dispatch,
    })),
  };
});

jest.mock("../../event-broker/event-subscriber", () => jest.fn());

describe("catalogue-event-processor", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    describe("for fetch cards event", () => {
      it(`should subscribe to @@UI/FETCH_CARDS event`, () => {
        register();

        const callback = subscribeEvent.mock.calls.find((call) => call[0] === "@@UI/FETCH_CARDS")[1];
        callback({ itemUrns: "urns" });

        expect(subscribeEvent).toHaveBeenCalledWith("@@UI/FETCH_CARDS", expect.any(Function));
        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: "FETCH_CARDS",
          payload: { urns: "urns" },
        });
      });
    });

    describe("for fetch catalogue event", () => {
      it(`should subscribe to @@UI/FETCH_BARS event`, () => {
        register();

        const callback = subscribeEvent.mock.calls.find((call) => call[0] === "@@UI/FETCH_BARS")[1];
        callback({ viewUrn: "urn", bottomBar: true, leftSidebar: true });

        expect(subscribeEvent).toHaveBeenCalledWith("@@UI/FETCH_BARS", expect.any(Function));
        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: "FETCH_CATALOGUE",
          payload: {
            urn: "urn",
            withBottomBar: true,
            withLeftSidebar: true,
            decorationsOnly: true,
          },
        });
      });
    });
  });
});
