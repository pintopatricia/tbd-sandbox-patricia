import { emitCollapseToggleEvent, emitShowMoreShowLessClickEvent } from "./event-emitters";
import emitEvent from "../../event-broker/event-emitter";

jest.mock("../../event-broker/event-emitter", () => jest.fn());

beforeEach(() => {
  jest.clearAllMocks();
});

describe("emitCollapseToggleEvent", () => {
  it("should emit correct event", () => {
    emitCollapseToggleEvent(true, "sport", "Zone Name", "Tab name");

    expect(emitEvent).toHaveBeenCalledWith("@@UI/PRICE_BOOST_MULTIS_LIST_COLLAPSE_TOGGLE", {
      isExpanded: true,
      pageType: "sport",
      zoneName: "Zone Name",
      tabName: "Tab name",
    });
    expect(emitEvent).toHaveBeenCalledTimes(1);
  });
});

describe("emitShowMoreShowLessClickEvent", () => {
  it("should emit correct event", () => {
    emitShowMoreShowLessClickEvent(true, "sport", "Zone Name", "Tab name");

    expect(emitEvent).toHaveBeenCalledWith("@@UI/PRICE_BOOST_MULTIS_LIST_SHOW_MORE_SHOW_LESS_CLICK", {
      isOpen: true,
      pageType: "sport",
      zoneName: "Zone Name",
      tabName: "Tab name",
    });
    expect(emitEvent).toHaveBeenCalledTimes(1);
  });
});
