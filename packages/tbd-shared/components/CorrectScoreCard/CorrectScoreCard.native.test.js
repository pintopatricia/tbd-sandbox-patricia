import { render, act } from "@testing-library/react-native";
import { Runner, MarketBlurbs } from "@ppb/the-wall-native";
import CorrectScoreCard from "./CorrectScoreCard.native";
import ConnectedCorrectScoreCardItem from "./CorrectScoreCardItem";
import CorrectScoreCardItem from "./CorrectScoreCardItem/CorrectScoreCardItem.native";
import ShowMore from "../ShowMore/ShowMore.native";

jest.mock("./CorrectScoreCardItem", () => jest.fn(() => <connected-correct-score-card-item />));

jest.mock("./CorrectScoreCardItem/CorrectScoreCardItem.native", () => jest.fn(() => <correct-score-card-item />));

jest.mock("../ShowMore/ShowMore.native", () => jest.fn(() => <show-more-mock />));

jest.mock("@ppb/the-wall-native", () => ({
  MarketBlurbs: jest.fn(() => <show-more />),
  Runner: jest.fn(({ children }) => children),
}));

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

    expect(ConnectedCorrectScoreCardItem).toHaveBeenCalledTimes(1);
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

    expect(MarketBlurbs).toHaveBeenCalledTimes(1);
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
        cardRef: expect.anything(),
        onToggleShowMoreRunners: expect.any(Function),
        numberOfItemsToDisplay: 2,
        numberOfLines: 3,
        setShowMore: expect.any(Function),
        showMore: true,
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
      const { setShowMore, onToggleShowMoreRunners } = ShowMore.mock.calls[0][0];
      setShowMore();
      onToggleShowMoreRunners(true);
    });

    expect(Runner).toHaveBeenCalledWith({ children: expect.any(Object), name: "Runner 1" }, undefined);
    expect(Runner).toHaveBeenCalledWith({ children: expect.any(Object), name: "Runner 2" }, undefined);
    expect(Runner).toHaveBeenCalledWith({ children: expect.any(Object), name: "Runner 3" }, undefined);

    expect(DEFAULT_PROPS.dispatchToggleShowMoreRunners).toHaveBeenCalledTimes(1);
    expect(DEFAULT_PROPS.dispatchToggleShowMoreRunners).toHaveBeenCalledWith("ppb:tbd:card:correctscore:12345", true);
  });
});
