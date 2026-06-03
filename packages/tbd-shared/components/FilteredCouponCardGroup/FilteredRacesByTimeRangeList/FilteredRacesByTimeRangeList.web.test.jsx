import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { useVisibilityObserver } from "../../../hooks/useVisibilityObserver.web";
import ConnectedSwimlaneCardGroup from "../../SwimlaneCardGroup";
import SwimlaneCardGroup from "../../SwimlaneCardGroup/SwimlaneCardGroup.web";
import SwimlaneCardGroupPlaceholder from "../../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import FilteredRacesByTimeRangeList from "./FilteredRacesByTimeRangeList.web";

jest.mock("../../SwimlaneCardGroup", () => jest.fn((props) => <connected-card-group-mock {...props} />));
jest.mock("../../SwimlaneCardGroup/SwimlaneCardGroup.web", () => <card-group-mock />);
jest.mock("../../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web", () => jest.fn(<card-group-placeholder-mock />));

const dispatchFetchCardsMock = jest.fn();

jest.mock("../../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(() => ({
    observe: jest.fn(),
    visibility: {},
  })),
}));

const itemsMock = [{ urn: "ppb:market:1" }, { urn: "ppb:market:2" }];

function renderFilteredRacesByTimeRangeList({ items, dispatchFetchCards = jest.fn() }) {
  return render(<FilteredRacesByTimeRangeList items={items} dispatchFetchCards={dispatchFetchCards} />);
}

describe("FilteredRacesByTimeRangeList", () => {
  afterEach(jest.clearAllMocks);

  it("should call useLazyLoading twice", () => {
    renderFilteredRacesByTimeRangeList({
      items: itemsMock,
      dispatchFetchCards: dispatchFetchCardsMock,
    });

    useVisibilityObserver.mock.calls[0][0].onFirstShow("randomUrn");

    expect(dispatchFetchCardsMock).toHaveBeenCalledWith("randomUrn", itemsMock);
  });

  it("should call the ConnectedSwimlaneCardGroup for each item", () => {
    renderFilteredRacesByTimeRangeList({
      items: itemsMock,
      dispatchFetchCards: dispatchFetchCardsMock,
    });

    expect(ConnectedSwimlaneCardGroup).toHaveBeenCalledTimes(2);
    expect(ConnectedSwimlaneCardGroup).toHaveBeenCalledWith(
      { urn: "ppb:market:1", component: SwimlaneCardGroup, placeholder: SwimlaneCardGroupPlaceholder },
      undefined,
    );
    expect(ConnectedSwimlaneCardGroup).toHaveBeenCalledWith(
      { urn: "ppb:market:2", component: SwimlaneCardGroup, placeholder: SwimlaneCardGroupPlaceholder },
      undefined,
    );
  });
});
