import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { MarketBlurbs, Runner } from "@ppb/the-wall-web";
import CorrectScoreCard from "./CorrectScoreCard.web";
import ConnectedCorrectScoreCardItem from "./CorrectScoreCardItem";
import CorrectScoreCardItem from "./CorrectScoreCardItem/CorrectScoreCardItem.web";
import ShowMore from "../ShowMore/ShowMore.web";

jest.mock("./CorrectScoreCardItem", () => jest.fn(() => <connected-correct-score-card-item />));

jest.mock("./CorrectScoreCardItem/CorrectScoreCardItem.web", () => jest.fn(() => <correct-score-card-item />));

jest.mock("@ppb/the-wall-web", () => ({
  MarketBlurbs: jest.fn(() => <show-more />),
  Runner: jest.fn(({ children }) => children),
}));

jest.mock("../ShowMore/ShowMore.web", () => jest.fn(() => <grid-card-item />));

const runnerMock = {
  label: "Runner 1",
  runnerUrn: "ppb:tbd:runner:924.111",
  selectionId: 12345,
};

const columnsMock = {
  label: "Runner 1",
  runners: [runnerMock],
};

const DEFAULT_PROPS = {
  urn: "ppb:tbd:card:correctscore:12345",
  columns: [columnsMock],
  numberOfItemsToDisplay: 5,
  numberOfLines: 3,
  marketUrn: "ppb:market:urn",
  dispatchToggleShowMoreRunners: jest.fn(),
};

const renderCorrectScoreCard = (props = {}) => render(<CorrectScoreCard {...DEFAULT_PROPS} {...props} />);

describe("CorrectScoreCard", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the CorrectScoreCardItem component", () => {
    renderCorrectScoreCard({});

    // FIXME: renders twice because of the useState for cardRef, we should use a Ref instead to avoid unnecessary re-renders
    expect(ConnectedCorrectScoreCardItem).toHaveBeenCalledTimes(2);
    expect(ConnectedCorrectScoreCardItem).toHaveBeenCalledWith(
      {
        cardUrn: "ppb:tbd:card:correctscore:12345",
        component: CorrectScoreCardItem,
        marketUrn: "ppb:market:urn",
        runnerUrn: "ppb:tbd:runner:924.111",
      },
      undefined,
    );
  });

  it("should render the columns", () => {
    renderCorrectScoreCard({});

    // FIXME: renders twice because of the useState for cardRef, we should use a Ref instead to avoid unnecessary re-renders
    expect(MarketBlurbs).toHaveBeenCalledTimes(2);
    expect(MarketBlurbs).toHaveBeenCalledWith(
      {
        columnGrid: true,
        columns: ["Runner 1"],
      },
      undefined,
    );
  });

  it("should render showMore button when hiding some lines", () => {
    renderCorrectScoreCard({
      numberOfItemsToDisplay: 2,
      lines: [columnsMock, columnsMock, columnsMock],
    });

    expect(ShowMore).toHaveBeenCalledWith(
      {
        cardRef: null,
        numberOfItemsToDisplay: 2,
        numberOfLines: 3,
        setShowMore: expect.any(Function),
        showMore: true,
        onToggleShowMoreRunners: expect.any(Function),
      },
      undefined,
    );
  });

  it("should show/hide extra lines when showMore is clicked", () => {
    renderCorrectScoreCard({
      numberOfItemsToDisplay: 2,
      columns: [
        { ...columnsMock, runners: [{ ...runnerMock, label: "Runner 1" }] },
        { ...columnsMock, runners: [{ ...runnerMock, label: "Runner 2" }] },
        { ...columnsMock, runners: [{ ...runnerMock, label: "Runner 3" }] },
      ],
    });

    act(() => {
      const { setShowMore } = ShowMore.mock.calls[0][0];
      setShowMore();
    });

    expect(Runner).toHaveBeenCalledWith({ children: expect.any(Object), name: "Runner 1" }, undefined);
    expect(Runner).toHaveBeenCalledWith({ children: expect.any(Object), name: "Runner 2" }, undefined);
    expect(Runner).toHaveBeenCalledWith({ children: expect.any(Object), name: "Runner 3" }, undefined);
  });
});
