import { getByTestId, render, waitFor } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import SegmentedCardGroup from "./SegmentedCardGroup.web";
import ConnectedGamingCardGroup from "../GamingCardGroup";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";

jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: jest.fn(({ children }) => <scrollable-mock>{children}</scrollable-mock>),
}));

jest.mock("../GamingCardGroup", () => jest.fn(() => <connected-card-group data-testid="games" />));
jest.mock("../GamingCardGroup/GamingCardGroup.web", () => jest.fn(() => <card-group />));
jest.mock("../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web", () =>
  jest.fn(() => <swimlane-cardgroup-card-placeholder />),
);
jest.mock("../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(() => ({
    observe: jest.fn(),
    visibility: {},
  })),
}));

function renderSegmentedCardGroup(zones, segmentedCardGroupUrn, dispatchFetchCards = jest.fn()) {
  return render(
    <SegmentedCardGroup
      zones={zones}
      dispatchFetchCards={dispatchFetchCards}
      segmentedCardGroupUrn={segmentedCardGroupUrn}
      visible={false}
    />,
  );
}

const zones = [{ urn: "ppb:tbd:card:group:curatedGames:gaming-zone-1" }];

describe("Segmented Card Group", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render ScrollableSwimlane and one ConnectedCardGroup", async () => {
    const dispatchFetchCards = jest.fn();
    const { container } = renderSegmentedCardGroup(zones, "segmentedCardGroupUrn", dispatchFetchCards);

    expect(ScrollableSwimlane).toHaveBeenCalledTimes(1);

    await waitFor(() => getByTestId(container, "games"));

    expect(ConnectedGamingCardGroup).toHaveBeenCalledTimes(1);
    expect(ConnectedGamingCardGroup).toHaveBeenCalledWith(
      {
        component: expect.any(Object),
        placeholder: SwimlaneCardGroupPlaceholder,
        urn: "ppb:tbd:card:group:curatedGames:gaming-zone-1",
        isSegmented: true,
        segmentedCardGroupUrn: "segmentedCardGroupUrn",
        visible: false,
      },
      undefined,
    );
  });

  it("should not render zone if there is no gaming zone", async () => {
    renderSegmentedCardGroup([]);

    expect(ScrollableSwimlane).toHaveBeenCalledTimes(1);
    expect(ConnectedGamingCardGroup).toHaveBeenCalledTimes(0);
  });
});
