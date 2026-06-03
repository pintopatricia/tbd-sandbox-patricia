import { emitCollapseToggleEvent, emitShowMoreClickEvent } from "./event-emitters";
import emitEvent from "../../event-broker/event-emitter";

jest.mock("../../event-broker/event-emitter", () => jest.fn());

beforeEach(() => {
  jest.clearAllMocks();
});

describe("emitCollapseToggleEvent", () => {
  it("should emit correct event", () => {
    emitCollapseToggleEvent(true, "sport", "Card Group Title", "Tab name");

    expect(emitEvent).toHaveBeenCalledWith("@@UI/PACKAGED_CREATED_BETS_COLLAPSE_TOGGLE", {
      isExpanded: true,
      pageType: "sport",
      pebbleCardGroupTitle: "Card Group Title",
      tabName: "Tab name",
    });
    expect(emitEvent).toHaveBeenCalledTimes(1);
  });
});

describe("emitShowMoreClickEvent", () => {
  it("should emit correct event", () => {
    emitShowMoreClickEvent("sport", "Card Group Title", "Tab name");

    expect(emitEvent).toHaveBeenCalledWith("@@UI/PACKAGED_CREATED_BETS_SHOW_MORE_CLICK", {
      pageType: "sport",
      pebbleCardGroupTitle: "Card Group Title",
      tabName: "Tab name",
    });
    expect(emitEvent).toHaveBeenCalledTimes(1);
  });
});
