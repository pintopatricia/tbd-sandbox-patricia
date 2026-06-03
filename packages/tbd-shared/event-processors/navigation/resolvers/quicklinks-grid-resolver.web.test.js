import { getStore } from "@ppb/tbd-store/create-store";
import { quicklinksGridItemOnTapProcessor } from "./quicklinks-grid-resolver.web";
import { EXTERNAL_PUSH_BLANK } from "@ppb/tbd-store/actions";
import { UI__QUICK_LINK_CLICK } from "@ppb/tbd-store/actions/navigation";

jest.mock("@ppb/tbd-store/create-store", () => {
  const dispatch = jest.fn();

  return {
    getStore: jest.fn(() => ({
      dispatch,
    })),
  };
});

describe("quicklinks-grid-resolver.web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("quicklinksGridItemOnTapProcessor", () => {
    describe("on an internal navigation", () => {
      it("should dispatch a UI__QUICK_LINK_CLICK action with the label and urn", () => {
        quicklinksGridItemOnTapProcessor({
          viewLink: { viewUrn: "test", viewUrl: "test" },
          label: "Test",
          urn: "test",
        });

        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: "UI__QUICK_LINK_CLICK",
          payload: {
            url: "test",
            label: "Test",
            cardUrn: "test",
          },
        });
      });

      it("should dispatch a PUSH action with the viewLink", () => {
        quicklinksGridItemOnTapProcessor({
          viewLink: { viewUrn: "test", viewUrl: "test" },
          label: "Test",
          urn: "test",
        });

        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: "Router/push",
          payload: { viewUrn: "test", viewUrl: "test" },
        });
      });
    });

    describe("on an external navigation", () => {
      it("should dispatch a UI__QUICK_LINK_CLICK action with the label and urn", () => {
        quicklinksGridItemOnTapProcessor({
          viewLink: { viewUrn: "test", viewUrl: "test" },
          label: "Test",
          urn: "test",
        });

        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: UI__QUICK_LINK_CLICK,
          payload: {
            url: "test",
            label: "Test",
            cardUrn: "test",
          },
        });
      });

      it("should dispatch an EXTERNAL_PUSH_BLANK action with the viewLink", () => {
        quicklinksGridItemOnTapProcessor({
          viewLink: { viewUrn: "ppb:tbd:view:external", viewUrl: "http://www.betfair.com" },
          label: "External Test",
          urn: "test",
        });

        expect(getStore().dispatch).toHaveBeenCalledWith({
          type: EXTERNAL_PUSH_BLANK,
          payload: { viewUrn: "ppb:tbd:view:external", viewUrl: "http://www.betfair.com" },
        });
      });
    });
  });
});
