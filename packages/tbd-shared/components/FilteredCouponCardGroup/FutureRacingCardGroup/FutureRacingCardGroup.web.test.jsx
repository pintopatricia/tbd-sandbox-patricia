import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { useVisibilityObserver } from "../../../hooks/useVisibilityObserver.web";
import ConnectedCard from "../../Card";
import Card from "../../Card/Card.web";
import FutureRacingCardGroup from "./FutureRacingCardGroup.web";

jest.mock("../../Card", () => jest.fn((props) => <connected-card-mock {...props} />));
jest.mock("../../Card/Card.web", () => <card-mock />);

const dispatchFetchCardsMock = jest.fn();

jest.mock("../../../hooks/useVisibilityObserver.web", () => {
  const refMock = jest.fn();

  return {
    useVisibilityObserver: jest.fn(() => ({
      observe: refMock,
      visibility: {
        "ppb:market:3": true,
      },
    })),
  };
});

const itemsMock = [
  {
    date: "4 june",
    items: [
      { date: "4 june", urn: "ppb:market:1", typename: "card" },
      { date: "4 june", urn: "ppb:market:2", typename: "card" },
    ],
  },
  {
    date: "5 june",
    items: [
      { date: "5 june", urn: "ppb:market:3", typename: "card" },
      { date: "5 june", urn: "ppb:market:4", typename: "card" },
    ],
  },
];

const urnListMock = [
  { date: "4 june", urn: "ppb:market:1", typename: "card" },
  { date: "4 june", urn: "ppb:market:2", typename: "card" },
  { date: "5 june", urn: "ppb:market:3", typename: "card" },
  { date: "5 june", urn: "ppb:market:4", typename: "card" },
];

function renderFilteredQuickLinksList({
  items = itemsMock,
  urnList = urnListMock,
  dispatchFetchCards = dispatchFetchCardsMock,
}) {
  return render(<FutureRacingCardGroup items={items} urnList={urnList} dispatchFetchCards={dispatchFetchCards} />);
}

describe("QuickLinksList", () => {
  const { observe } = useVisibilityObserver();

  beforeEach(jest.clearAllMocks);

  it("should call useLazyLoading", () => {
    renderFilteredQuickLinksList({});

    useVisibilityObserver.mock.calls[0][0].onFirstShow("randomUrn");

    expect(dispatchFetchCardsMock).toHaveBeenCalledWith("randomUrn", urnListMock);
    expect(observe).toHaveBeenCalledTimes(4);
  });

  it("should call the ConnectedCardGroup for each item", () => {
    renderFilteredQuickLinksList({});

    expect(ConnectedCard).toHaveBeenCalledTimes(4);
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "ppb:market:1", component: Card, typename: "card", visible: false },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "ppb:market:2", component: Card, typename: "card", visible: false },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "ppb:market:3", component: Card, typename: "card", visible: true },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "ppb:market:4", component: Card, typename: "card", visible: false },
      undefined,
    );
  });
});
