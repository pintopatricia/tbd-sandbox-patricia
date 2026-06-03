import { render, screen, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ObbPlayersRowCard } from "./ObbPlayersRowCard.web";
import { FIRST_NAME, JERSEY, LAST_NAME, PLAYER_POSITION_AND_NUMBER } from "./ObbPlayersRowCard.web.selectors";
import { splitName } from "../../helpers/obb";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: ({ name }) => <generic-icon data-testid="icon">{name}</generic-icon>,
}));

jest.mock("../../helpers/obb", () => ({
  splitName: jest.fn((name) => {
    const [firstName, lastName] = name.split(" ");
    return { firstName, lastName };
  }),
  formatPlayerStat: jest.fn((stat) => (stat ?? 0).toFixed(2)),
}));

const mockParticipant = {
  player: {
    id: "player-1",
    name: "Lionel Messi",
    position: "FW",
    shirtNumber: 10,
  },
  odds: true,
  stat: 7.5,
};

describe("ObbPlayersRowCard", () => {
  beforeEach(jest.clearAllMocks);

  it("renders player name, position and stat", () => {
    const { getByText } = render(
      <ObbPlayersRowCard participant={mockParticipant} isSelected={false} handleSelectParticipant={jest.fn()} />,
    );

    expect(getByText("Lionel")).toBeInTheDocument();
    expect(getByText("Messi")).toBeInTheDocument();
    expect(getByText("FW #10")).toBeInTheDocument();
    expect(getByText("7.50")).toBeInTheDocument();
  });

  it("calls handleSelectParticipant on click", () => {
    const handleSelect = jest.fn();

    render(
      <ObbPlayersRowCard participant={mockParticipant} isSelected={false} handleSelectParticipant={handleSelect} />,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleSelect).toHaveBeenCalledWith("player-1");
  });

  it("does not call handleSelectParticipant if player is disabled", () => {
    const handleSelect = jest.fn();

    render(
      <ObbPlayersRowCard
        participant={mockParticipant}
        isSelected={false}
        handleSelectParticipant={handleSelect}
        isPlayerDisabled={true}
      />,
    );

    fireEvent.click(screen.getByRole("button"));
    expect(handleSelect).not.toHaveBeenCalled();
  });

  it("renders fallback jersey icon if no jersey is provided", () => {
    const { getAllByTestId } = render(
      <ObbPlayersRowCard participant={mockParticipant} isSelected={false} handleSelectParticipant={() => {}} />,
    );

    expect(getAllByTestId("icon")[0]).toHaveTextContent("Assets--Fallback-Jersey");
  });

  it("shows 0.00 stat if no stat is provided", () => {
    const { getByText } = render(
      <ObbPlayersRowCard
        participant={{ ...mockParticipant, stat: null }}
        isSelected={false}
        handleSelectParticipant={() => {}}
      />,
    );

    expect(getByText("0.00")).toBeInTheDocument();
  });

  it("selects player with Enter or Space key", () => {
    const handleSelect = jest.fn();

    render(
      <ObbPlayersRowCard participant={mockParticipant} isSelected={false} handleSelectParticipant={handleSelect} />,
    );

    const card = screen.getByRole("button");

    fireEvent.keyDown(card, { key: "Enter" });
    fireEvent.keyDown(card, { key: " " });

    expect(handleSelect).toHaveBeenCalledTimes(2);
  });

  it("renders only position if shirtNumber is missing", () => {
    const { container } = render(
      <ObbPlayersRowCard
        participant={{
          ...mockParticipant,
          player: { ...mockParticipant.player, shirtNumber: null },
        }}
        isSelected={false}
        handleSelectParticipant={jest.fn()}
      />,
    );

    expect(container.querySelector(PLAYER_POSITION_AND_NUMBER)).toHaveTextContent("FW");
  });

  it("renders only shirtNumber if position is missing", () => {
    const { container } = render(
      <ObbPlayersRowCard
        participant={{
          ...mockParticipant,
          player: { ...mockParticipant.player, position: "" },
        }}
        isSelected={false}
        handleSelectParticipant={jest.fn()}
      />,
    );

    expect(container.querySelector(PLAYER_POSITION_AND_NUMBER)).toHaveTextContent("#10");
  });

  it("renders only first name if last name is missing", () => {
    splitName.mockReturnValueOnce({ firstName: "Lionel", lastName: "" });

    const { container } = render(
      <ObbPlayersRowCard
        participant={{
          ...mockParticipant,
          player: { ...mockParticipant.player, name: "Lionel" },
        }}
        isSelected={false}
        handleSelectParticipant={jest.fn()}
      />,
    );

    expect(container.querySelector(FIRST_NAME)).not.toBeInTheDocument();
    expect(container.querySelector(LAST_NAME)).toHaveTextContent("Lionel");
  });

  it("renders only last name if first name is missing", () => {
    splitName.mockReturnValueOnce({ firstName: undefined, lastName: "Messi" });

    const { container } = render(
      <ObbPlayersRowCard
        participant={{
          ...mockParticipant,
          player: { ...mockParticipant.player, name: "Messi" },
        }}
        isSelected={false}
        handleSelectParticipant={jest.fn()}
      />,
    );

    expect(container.querySelector(FIRST_NAME)).not.toBeInTheDocument();
    expect(container.querySelector(LAST_NAME)).toHaveTextContent("Messi");
  });

  it("renders jersey image if jersey is provided", () => {
    const { container } = render(
      <ObbPlayersRowCard
        participant={{
          ...mockParticipant,
          jersey: "jersey.png",
        }}
        isSelected={false}
        handleSelectParticipant={jest.fn()}
      />,
    );

    expect(container.querySelector(JERSEY)).toBeInTheDocument();
  });
});
