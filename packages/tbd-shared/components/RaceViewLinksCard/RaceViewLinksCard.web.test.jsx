import { useRef as useRefMock } from "react";
import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { SelectableItems } from "@ppb/the-wall-web";
import RaceViewLinksCard from "./RaceViewLinksCard.web";

beforeEach(jest.clearAllMocks);

const getBoundingClientRectMock = jest.fn(() => ({ x: 100, width: 50 }));

const scrollToMock = jest.fn();

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useRef: jest.fn(),
  useContext: jest.fn(() => ({ isDesktopLayout: undefined })),
}));

jest.mock("@ppb/the-wall-web", () => ({
  SelectableItems: jest.fn(({ props }) => <race-selector-mock {...props} />),
}));

const dispatchPushMock = jest.fn();
const dispatchRaceViewLinksLinkClickMock = jest.fn();

function renderRaceViewLinksCard(RaceViewLinksCardProps) {
  return render(<RaceViewLinksCard {...RaceViewLinksCardProps} />);
}

const RaceViewLinksCardProps = {
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
  dispatchPush: dispatchPushMock,
  dispatchRaceViewLinksLinkClick: dispatchRaceViewLinksLinkClickMock,
};

describe("RaceViewLinksCard component", () => {
  describe("when the races are defined", () => {
    it("should render the selectable items component with valid props", () => {
      renderRaceViewLinksCard(RaceViewLinksCardProps);

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
          isHighlighted: false,
        },
        undefined,
      );
    });

    it("should scroll to the selected race time", () => {
      useRefMock.mockReturnValue({
        current: { scrollTo: scrollToMock, getBoundingClientRect: getBoundingClientRectMock },
      });

      renderRaceViewLinksCard({
        ...RaceViewLinksCardProps,
        items: [
          {
            viewLink: {
              viewUrn: "ppb:tbd:view:race:1",
              viewUrl: "url/1",
            },
            startTime: "19:00",
          },
          {
            viewLink: {
              viewUrn: "ppb:tbd:view:race:2",
              viewUrl: "url/2",
            },
            startTime: "20:00",
          },
        ],
        defaultItemIndex: 1,
      });

      expect(scrollToMock).toHaveBeenCalledWith(50, 0);
      expect(scrollToMock).toHaveBeenCalledTimes(1);
    });

    describe("when a race time is clicked", () => {
      it("should dispatch Push and ViewLinksLinkClick", () => {
        SelectableItems.mockClear();

        renderRaceViewLinksCard(RaceViewLinksCardProps);

        const { onRaceTimeClick } = SelectableItems.mock.calls[0][0];

        const viewLinkMock = { viewUrn: "urn", viewUrl: "url" };
        onRaceTimeClick(0, true, viewLinkMock);

        expect(dispatchPushMock).toHaveBeenCalledWith(viewLinkMock);
        expect(dispatchRaceViewLinksLinkClickMock).toHaveBeenCalledWith("ppb:tbd:card:raceViewLinks:xx", "url", true);
      });
    });
  });
});
