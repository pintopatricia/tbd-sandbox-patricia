import { render, screen, fireEvent } from "@testing-library/react";

import { ObbMicroPlayer } from "./ObbMicroPlayer.web.tsx";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key, interpolationValues }) => (interpolationValues ? `${key}:${JSON.stringify(interpolationValues)}` : key),
}));

const SAMPLE_JERSEY = "https://example.com/jersey.png";
const SAMPLE_PLAYER = { firstName: "John", lastName: "Doe" };

describe("ObbMicroPlayer", () => {
  beforeEach(jest.clearAllMocks);

  describe("single variant", () => {
    it("should render a single jersey image", () => {
      render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[SAMPLE_JERSEY]} />);

      const img = screen.getByRole("presentation");
      expect(img).not.toBeNull();
      expect(img.getAttribute("src")).toBe(SAMPLE_JERSEY);
    });

    it("should render fallback jersey when jersey is undefined", () => {
      render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[undefined]} />);

      const fallback = screen.getByTestId("fallback-jersey");
      expect(fallback).not.toBeNull();
    });

    it("should render single player first and last name", () => {
      render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[SAMPLE_JERSEY]} />);

      expect(screen.getByText("John")).not.toBeNull();
      expect(screen.getByText("Doe")).not.toBeNull();
    });

    it("should render only first name when last name is missing", () => {
      render(<ObbMicroPlayer players={[{ firstName: "John" }]} jerseys={[SAMPLE_JERSEY]} />);

      expect(screen.getByText("John")).not.toBeNull();
    });

    it("should render empty state when players is empty", () => {
      render(<ObbMicroPlayer players={[]} jerseys={[SAMPLE_JERSEY]} />);

      expect(screen.getByText("I18N.OBB.MICRO_PLAYER.NO_PLAYERS.LABEL")).not.toBeNull();
    });

    it("should render remove button when onRemovePlayerClick is provided", () => {
      render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[SAMPLE_JERSEY]} onRemovePlayerClick={jest.fn()} />);

      expect(screen.getByRole("button")).not.toBeNull();
    });

    it("should not render remove button when onRemovePlayerClick is not provided", () => {
      render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[SAMPLE_JERSEY]} />);

      expect(screen.queryByRole("button")).toBeNull();
    });

    it("should call onRemovePlayerClick when remove button is clicked", () => {
      const onRemovePlayerClick = jest.fn();
      render(
        <ObbMicroPlayer
          players={[SAMPLE_PLAYER]}
          jerseys={[SAMPLE_JERSEY]}
          onRemovePlayerClick={onRemovePlayerClick}
        />,
      );

      fireEvent.click(screen.getByRole("button"));
      expect(onRemovePlayerClick).toHaveBeenCalledTimes(1);
    });

    it("should call onRemovePlayerClick when Enter key is pressed on remove button", () => {
      const onRemovePlayerClick = jest.fn();
      render(
        <ObbMicroPlayer
          players={[SAMPLE_PLAYER]}
          jerseys={[SAMPLE_JERSEY]}
          onRemovePlayerClick={onRemovePlayerClick}
        />,
      );

      fireEvent.keyDown(screen.getByRole("button"), { key: "Enter" });
      expect(onRemovePlayerClick).toHaveBeenCalledTimes(1);
    });

    it("should call onRemovePlayerClick when Space key is pressed on remove button", () => {
      const onRemovePlayerClick = jest.fn();
      render(
        <ObbMicroPlayer
          players={[SAMPLE_PLAYER]}
          jerseys={[SAMPLE_JERSEY]}
          onRemovePlayerClick={onRemovePlayerClick}
        />,
      );

      fireEvent.keyDown(screen.getByRole("button"), { key: " " });
      expect(onRemovePlayerClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onRemovePlayerClick when other keys are pressed", () => {
      const onRemovePlayerClick = jest.fn();
      render(
        <ObbMicroPlayer
          players={[SAMPLE_PLAYER]}
          jerseys={[SAMPLE_JERSEY]}
          onRemovePlayerClick={onRemovePlayerClick}
        />,
      );

      fireEvent.keyDown(screen.getByRole("button"), { key: "Tab" });
      expect(onRemovePlayerClick).not.toHaveBeenCalled();
    });
  });

  describe("multi variant", () => {
    const multiJerseys = [SAMPLE_JERSEY, SAMPLE_JERSEY, SAMPLE_JERSEY];
    const multiPlayers = [
      { firstName: "John", lastName: "Doe" },
      { firstName: "Jane", lastName: "Roe" },
      { firstName: "Sam", lastName: "Smith" },
    ];

    it("should render multiple jersey images", () => {
      render(<ObbMicroPlayer players={multiPlayers} jerseys={multiJerseys} variant="multi" />);

      const images = screen.getAllByRole("presentation");
      expect(images).toHaveLength(3);
    });

    it("should render multiple player names", () => {
      render(<ObbMicroPlayer players={multiPlayers} jerseys={multiJerseys} variant="multi" />);

      expect(screen.getByText("Doe")).not.toBeNull();
      expect(screen.getByText("Roe")).not.toBeNull();
      expect(screen.getByText("Smith")).not.toBeNull();
    });

    it("should render disabled more-players label when action link is disabled", () => {
      const players = [...multiPlayers, { firstName: "Extra", lastName: "Player" }];
      render(<ObbMicroPlayer players={players} jerseys={multiJerseys} variant="multi" />);

      expect(screen.getByText(/I18N\.OBB\.MICRO_PLAYER\.MORE_PLAYERS\.LABEL/)).not.toBeNull();
    });

    it("should call onActionLinkClick when action link is clicked", () => {
      const onActionLinkClick = jest.fn();
      const players = [...multiPlayers, { firstName: "Extra", lastName: "Player" }];
      render(
        <ObbMicroPlayer
          players={players}
          jerseys={multiJerseys}
          variant="multi"
          isActionLinkEnabled
          onActionLinkClick={onActionLinkClick}
        />,
      );

      fireEvent.click(screen.getByText(/I18N\.OBB\.MICRO_PLAYER\.MORE_PLAYERS\.LABEL/));
      expect(onActionLinkClick).toHaveBeenCalledTimes(1);
    });

    it("should not render remove button for multi variant", () => {
      render(
        <ObbMicroPlayer
          players={multiPlayers}
          jerseys={multiJerseys}
          variant="multi"
          onRemovePlayerClick={jest.fn()}
        />,
      );

      expect(screen.queryByRole("button")).toBeNull();
    });

    it("should render fallback jerseys when jerseys are undefined", () => {
      render(<ObbMicroPlayer players={multiPlayers} jerseys={[undefined, undefined, undefined]} variant="multi" />);

      const fallbacks = screen.getAllByTestId("fallback-jersey");
      expect(fallbacks).toHaveLength(3);
    });

    it("should limit jerseys to a maximum of 7", () => {
      const manyJerseys = Array.from({ length: 10 }, () => SAMPLE_JERSEY);
      render(<ObbMicroPlayer players={multiPlayers} jerseys={manyJerseys} variant="multi" />);

      const images = screen.getAllByRole("presentation");
      expect(images).toHaveLength(7);
    });
  });

  describe("hasBackground", () => {
    it("should apply background class by default", () => {
      const { container } = render(<ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[SAMPLE_JERSEY]} />);

      expect(container.querySelector("[class*='jerseyContainerBackground']")).not.toBeNull();
    });

    it("should not apply background class when hasBackground is false", () => {
      const { container } = render(
        <ObbMicroPlayer players={[SAMPLE_PLAYER]} jerseys={[SAMPLE_JERSEY]} hasBackground={false} />,
      );

      expect(container.querySelector("[class*='jerseyContainerBackground']")).toBeNull();
    });
  });
});
