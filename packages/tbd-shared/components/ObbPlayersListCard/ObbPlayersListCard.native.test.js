import { render, fireEvent } from "@testing-library/react-native";
import { OddsSize } from "@ppb/the-wall-common/types";
import { Odds } from "@ppb/the-wall-native/components/bricks/Indicators/Odds/Odds";
import { ProgressBar } from "@ppb/the-wall-native";
import { ObbPlayersListCard } from "./ObbPlayersListCard.native";
import { TEST_ID, HIGHLIGHTED, FIRST_NAME, LAST_NAME, POSITION } from "./ObbPlayersListCard.native.selectors";

jest.mock("@ppb/the-wall-native/components/bricks/Indicators/Odds/Odds", () => ({
  Odds: jest.fn((props) => <odds-mock testID="mock-odds" {...props} />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  ProgressBar: jest.fn((props) => <progress-bar-mock testID="mock-progress-bar" {...props} />),
  Placeholder: jest.fn((props) => <placeholder-mock testID="mock-placeholder" {...props} />),
  Text: jest.requireActual("react-native").Text,
}));

const mockHandleSelectParticipant = jest.fn();

describe("ObbPlayersListCard", () => {
  const defaultProps = {
    participant: {
      player: {
        id: "11960",
        name: "Bernardo Silva",
        position: "Forward",
        team: "Manchester City",
      },
      odds: "8/1",
      color: "#0000ff",
      stat: 2,
    },
    handleSelectParticipant: mockHandleSelectParticipant,
    maxStatValue: 10,
  };

  function renderComponent(props) {
    return render(<ObbPlayersListCard {...props} />);
  }

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the player name correctly", () => {
    const { getByTestId } = renderComponent(defaultProps);

    expect(getByTestId(FIRST_NAME)).toHaveTextContent("Bernardo");
    expect(getByTestId(LAST_NAME)).toHaveTextContent("Silva");
  });

  it("should render the player position", () => {
    const { getByTestId } = renderComponent(defaultProps);
    expect(getByTestId(POSITION)).toHaveTextContent("Forward");
  });

  it("should call handleSelectParticipant when clicked", () => {
    const { getByTestId } = renderComponent({ ...defaultProps, selectedPlayer: "123" });
    fireEvent.press(getByTestId(TEST_ID));

    expect(mockHandleSelectParticipant).toHaveBeenCalledWith("11960");
  });

  it("should not call handleSelectParticipant when already selected", () => {
    const { getByTestId } = renderComponent({ ...defaultProps, isSelected: true });
    fireEvent.press(getByTestId(HIGHLIGHTED));
    expect(defaultProps.handleSelectParticipant).not.toHaveBeenCalled();
  });

  it("should render the odds component with correct props", () => {
    renderComponent(defaultProps);
    expect(Odds).toHaveBeenCalledWith(
      {
        disabled: false,
        value: defaultProps.participant.odds,
        size: OddsSize.SMALL,
      },
      undefined,
    );
  });

  it("should render the progress bar component with correct props", () => {
    renderComponent(defaultProps);

    expect(ProgressBar).toHaveBeenCalledWith(
      {
        barStat: true,
        away: 80,
        home: 20,
        homeColor: "#0000ff",
        variant: "homeStat",
      },
      undefined,
    );
  });

  it("should pass disabled prop to Odds when odds value is '-'", () => {
    renderComponent({
      ...defaultProps,
      participant: {
        ...defaultProps.participant,
        odds: null,
      },
    });
    expect(Odds).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
      }),
      undefined,
    );
  });

  it("should correctly handle single-word player names", () => {
    const props = {
      ...defaultProps,
      participant: {
        ...defaultProps.participant,
        player: {
          ...defaultProps.participant.player,
          name: "Ronaldo",
        },
      },
    };
    const { getByTestId } = renderComponent({ ...props });
    expect(getByTestId(FIRST_NAME)).toHaveTextContent("Ronaldo");
    expect(getByTestId(LAST_NAME)).toHaveTextContent("");
  });
});
