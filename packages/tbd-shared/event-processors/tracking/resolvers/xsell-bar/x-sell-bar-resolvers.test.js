import { buildNavigationEvent } from "tagging-library";
import { xSellBarItemClickAction } from "./xsell-bar-resolvers";

jest.mock("tagging-library", () => ({
  buildNavigationEvent: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
});

describe("xSellBarItemClickAction", () => {
  it("should send correct event", () => {
    const sendEventSpy = jest.fn();
    buildNavigationEvent.mockReturnValue("some data event");

    xSellBarItemClickAction(
      {
        sectionUrl: "https://skyvegas.com.nxt.ppbdev.com/",
        index: 0,
        sectionType: "SKY_VEGAS",
      },
      sendEventSpy,
    );

    expect(sendEventSpy).toHaveBeenCalledTimes(1);
  });
});
