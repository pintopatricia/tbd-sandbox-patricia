import "jest-extended";
import { render } from "@testing-library/react";
import { Image } from "@ppb/the-wall-web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import ByTimeRangeMeetingCardGroup from "./ByTimeRangeMeetingCardGroup.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";

jest.mock("../Card/", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.web", () => ({
  __esModule: true,
  default: jest.fn(() => <card-mock />),
  isCardImplemented: jest.fn(() => true),
}));

jest.mock("@ppb/the-wall-web", () => ({
  Image: jest.fn(() => <image-mock />),
}));

jest.mock("../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(() => ({
    observe: jest.fn(),
    visibility: {},
  })),
}));

function renderByTimeRangeMeetingCardGroup(props) {
  return render(<ByTimeRangeMeetingCardGroup {...props} />);
}

describe("ByTimeRangeMeetingCardGroup", () => {
  beforeEach(jest.clearAllMocks);

  it("should render by timerange meeting card group", () => {
    const itemsMock = [
      { urn: "1", typename: "typename-1" },
      { urn: "2", typename: "typename-2" },
      { urn: "3", typename: "typename-3" },
    ];

    renderByTimeRangeMeetingCardGroup({
      title: "Today",
      items: itemsMock,
      icon: { vector: "someVector" },
    });

    expect(Image).toHaveBeenCalledWith(
      {
        alt: "",
        src: "someVector",
      },
      undefined,
    );

    expect(ConnectedCard).toHaveBeenCalledWith(
      {
        urn: "1",
        component: Card,
        typename: "typename-1",
        visible: false,
      },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      {
        urn: "2",
        component: Card,
        typename: "typename-2",
        visible: false,
      },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      {
        urn: "3",
        component: Card,
        typename: "typename-3",
        visible: false,
      },
      undefined,
    );
  });

  it("should call dispatchFetchCards onFirstShow", () => {
    const dispatchFetchCardsMock = jest.fn();
    const itemsMock = [
      { urn: "1", typename: "typename-1" },
      { urn: "2", typename: "typename-2" },
      { urn: "3", typename: "typename-3" },
    ];
    renderByTimeRangeMeetingCardGroup({
      title: "Today",
      items: itemsMock,
      icon: { vector: "someVector" },
      dispatchFetchCards: dispatchFetchCardsMock,
    });
    useVisibilityObserver.mock.calls[0][0].onFirstShow("randomUrn");

    expect(dispatchFetchCardsMock).toHaveBeenCalledWith("randomUrn", itemsMock);
  });

  describe("when there are no urns", () => {
    it("should render empty component", () => {
      renderByTimeRangeMeetingCardGroup({
        title: "Today",
        items: [],
      });

      expect(ConnectedCard).not.toHaveBeenCalled();
    });
  });
});
