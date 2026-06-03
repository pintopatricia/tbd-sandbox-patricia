import { useRef as useRefMock } from "react";
import { act, render } from "@testing-library/react-native";
import { SelectableItems } from "@ppb/the-wall-native/components/SelectableItems/SelectableItems";
import { navigate } from "@ppb/tbd-router/native";
import RaceViewLinksCard from "./RaceViewLinksCard.native";

const scrollToIndexSpy = jest.fn();
const dispatchRaceViewLinksLinkClickMock = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(),
}));

jest.mock("@ppb/the-wall-native/components/SelectableItems/SelectableItems", () => ({
  SelectableItems: jest.fn(({ children, ...props }) => (
    <selectable-items-mock {...props}>{children}</selectable-items-mock>
  )),
}));
jest.mock("@ppb/tbd-router/native", () => ({ navigate: jest.fn() }));

function renderComponent(RaceViewLinksCardProps) {
  return render(<RaceViewLinksCard {...RaceViewLinksCardProps} />);
}

describe("RaceViewLinksCard native", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when races are filled", () => {
    it("should render the SelectableItems component", () => {
      useRefMock.mockReturnValue({ current: null });
      const props = {
        races: [
          {
            viewLink: {
              viewUrn: "ppb:tbd:view:race:1",
              viewUrl: "url/1",
            },
            startTime: "19:00",
          },
        ],
        defaultRaceIndex: 0,
        isHighlighted: false,
      };

      renderComponent(props);
      expect(SelectableItems).toHaveBeenCalledTimes(1);
      expect(SelectableItems).toHaveBeenCalledWith(
        {
          items: [
            {
              viewLink: {
                viewUrn: "ppb:tbd:view:race:1",
                viewUrl: "url/1",
              },
              startTime: "19:00",
            },
          ],
          defaultItemIndex: 0,
          onRaceTimeClick: expect.any(Function),
          listContainerRef: expect.any(Object),
          isHighlighted: false,
        },
        undefined,
      );
    });

    it("should scroll to the given index", () => {
      useRefMock.mockReturnValue({
        current: { scrollToIndex: scrollToIndexSpy },
      });

      const props = {
        races: [
          {
            viewLink: {
              viewUrn: "ppb:tbd:view:race:1",
              viewUrl: "url/1",
            },
            startTime: "19:00",
          },
        ],
        defaultRaceIndex: 0,
      };

      renderComponent(props);
      expect(scrollToIndexSpy).toHaveBeenCalledTimes(1);
      expect(scrollToIndexSpy).toHaveBeenCalledWith({ index: 0, viewPosition: 0.5 });
    });
  });

  describe("and races are empty", () => {
    it("should not render the SelectableItems component", () => {
      const props = {
        races: undefined,
        defaultRaceIndex: 0,
      };

      renderComponent(props);
      expect(SelectableItems).not.toHaveBeenCalled();
    });
  });

  describe("onRaceTimeClick", () => {
    beforeEach(() => {
      const props = {
        urn: "ppb:tbd:card:raceViewLinks:xx",
        races: [
          {
            viewLink: {
              viewUrn: "ppb:tbd:view:race:1",
              viewUrl: "url/1",
            },
            startTime: "19:00",
          },
        ],
        defaultRaceIndex: 0,
        dispatchRaceViewLinksLinkClick: dispatchRaceViewLinksLinkClickMock,
      };

      renderComponent(props);
    });

    it("should navigate to the race viewlink", () => {
      const { onRaceTimeClick } = SelectableItems.mock.calls[0][0];
      act(() => {
        onRaceTimeClick(0, true, { viewUrn: "urn", viewUrl: "url" });
      });

      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith({ viewUrn: "urn", viewUrl: "url" });
      expect(dispatchRaceViewLinksLinkClickMock).toHaveBeenCalledTimes(1);
      expect(dispatchRaceViewLinksLinkClickMock).toHaveBeenCalledWith("ppb:tbd:card:raceViewLinks:xx", "url", true);
    });
  });
});
