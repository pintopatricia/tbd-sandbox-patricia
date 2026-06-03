import { render, fireEvent } from "@testing-library/react-native";

import { ObbPlayersRowCard } from "./ObbPlayersRowCard.native";
import styles from "./ObbPlayersRowCard.native.styles";
import { TEST_ID, FIRST_NAME, LAST_NAME, DISABLED, HIGHLIGHTED, JERSEY } from "./ObbPlayersRowCard.native.selectors";
import { splitName } from "../../helpers/obb";

// Mocks
jest.mock("@ppb/the-wall-native", () => ({
  TBDImage: jest.fn((props) => <tbd-image-mock testID="mock-image" {...props} />),
  getTestProps: (testID) => ({ testID }),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: ({ name }) => <generic-icon-mock testID="mock-icon" iconName={name} />,
}));

jest.mock("../../helpers/obb", () => ({
  splitName: jest.fn((name) => {
    const [firstName, lastName] = name.split(" ");
    return { firstName, lastName };
  }),
  formatPlayerStat: jest.fn((stat) => (stat ?? 0).toFixed(2)),
}));

const mockHandleSelectParticipant = jest.fn();

const defaultParticipant = {
  player: {
    id: "player-1",
    name: "Lionel Messi",
    position: "Forward",
    shirtNumber: 10,
  },
  odds: "8/1",
  stat: 5.25,
};

function renderComponent(props = {}) {
  return render(
    <ObbPlayersRowCard
      participant={defaultParticipant}
      handleSelectParticipant={mockHandleSelectParticipant}
      isSelected={false}
      {...props}
    />,
  );
}

describe("ObbPlayersRowCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders player position and number", () => {
    const { getByText } = renderComponent();

    expect(getByText("Forward #10")).toBeTruthy();
  });

  it("renders stat correctly", () => {
    const { getByText } = renderComponent();

    expect(getByText("5.25")).toBeTruthy();
  });

  it("calls handleSelectParticipant when pressed", () => {
    const { getByTestId } = renderComponent();
    fireEvent.press(getByTestId(TEST_ID));

    expect(mockHandleSelectParticipant).toHaveBeenCalledWith("player-1");
  });

  it("does not call handleSelectParticipant when player is disabled", () => {
    const { getByTestId } = renderComponent({ isPlayerDisabled: true });
    fireEvent.press(getByTestId(DISABLED));

    expect(mockHandleSelectParticipant).not.toHaveBeenCalled();
  });

  it("renders fallback jersey if jersey prop is missing", () => {
    const { getAllByTestId } = renderComponent();

    expect(getAllByTestId("mock-icon")[0].props.iconName).toBe("Assets--Fallback-Jersey");
  });

  it("renders jersey image if jersey is provided", () => {
    const { getByTestId } = renderComponent({ participant: { ...defaultParticipant, jersey: "jersey.png" } });

    expect(getByTestId(JERSEY)).toBeTruthy();
  });

  it("renders 0.00 stat if stat is null", () => {
    const { getByText } = renderComponent({ participant: { ...defaultParticipant, stat: null } });

    expect(getByText("0.00")).toBeTruthy();
  });

  it("renders player first and last name", () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId(FIRST_NAME)).toHaveTextContent("Lionel");
    expect(getByTestId(FIRST_NAME)).toHaveStyle(styles.firstName);
    expect(getByTestId(LAST_NAME)).toHaveTextContent("Messi");
    expect(getByTestId(LAST_NAME)).toHaveStyle(styles.lastName);
  });

  it("renders only first name if last name is missing", () => {
    splitName.mockReturnValueOnce({ firstName: "Lionel", lastName: "" });
    const oneNameParticipant = {
      ...defaultParticipant,
      player: { ...defaultParticipant.player, name: "Lionel" },
    };
    const { getByTestId, queryByTestId } = renderComponent({ participant: oneNameParticipant });

    expect(getByTestId(FIRST_NAME)).toHaveTextContent("Lionel");
    expect(getByTestId(FIRST_NAME)).toHaveStyle(styles.lastName);
    expect(queryByTestId(LAST_NAME)).toBeNull();
  });

  it("renders only last name if first name is missing", () => {
    splitName.mockReturnValueOnce({ firstName: undefined, lastName: "Messi" });
    const oneNameParticipant = {
      ...defaultParticipant,
      player: { ...defaultParticipant.player, name: "Messi" },
    };
    const { getByTestId, queryByTestId } = renderComponent({ participant: oneNameParticipant });

    expect(getByTestId(FIRST_NAME)).toHaveTextContent("Messi");
    expect(getByTestId(FIRST_NAME)).toHaveStyle(styles.lastName);
    expect(queryByTestId(LAST_NAME)).toBeNull();
  });

  it("applies highlighted style when selected", () => {
    const { getByTestId } = renderComponent({ isSelected: true });
    expect(getByTestId(HIGHLIGHTED)).toHaveStyle(styles.highlighted);
  });

  it("renders only position if shirtNumber is missing", () => {
    const participant = {
      ...defaultParticipant,
      player: { ...defaultParticipant.player, shirtNumber: null },
    };
    const { getByText } = renderComponent({ participant });
    expect(getByText("Forward")).toBeTruthy();
  });

  it("renders only shirtNumber if position is missing", () => {
    const participant = {
      ...defaultParticipant,
      player: { ...defaultParticipant.player, position: null },
    };
    const { getByText } = renderComponent({ participant });
    expect(getByText("#10")).toBeTruthy();
  });
});
