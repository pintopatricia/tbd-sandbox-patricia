import { fireEvent, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ConfigContext } from "../../../Config/ConfigContext";
import {
  CONTAINER_DESKTOP_LAYOUT,
  CONTAINER_MOBILE_LAYOUT,
  CAROUSEL_CONTAINER,
  EDIT_SQUAD_BUTTON_ICON,
} from "./MicroPlayersCarousel.web.selectors";
import { MicroPlayersCarousel } from "./MicroPlayersCarousel.web";
import { ObbMicroPlayer } from "../../../ObbMicroPlayer/ObbMicroPlayer.web";

jest.mock("../../../Config/ConfigContext", () => ({
  ConfigContext: require("react").createContext({}),
}));

jest.mock("../../../../helpers/obb", () => ({
  getMicroPlayerBorderRadius: jest.fn((index, size) => {
    if (index === 0) return "first";
    if (index === size - 1) return "last";
    return undefined;
  }),
  getSquadBetParticipantName: jest.fn((participant) => {
    if (participant.status === "loading") return { firstName: undefined, lastName: undefined };
    return { firstName: participant.firstName, lastName: participant.lastName };
  }),
}));

jest.mock("../../../ObbMicroPlayer/ObbMicroPlayer.web", () => ({
  ObbMicroPlayer: jest.fn(({ jersey, firstName, lastName }) => (
    <obb-micro-player jersey={jersey} firstName={firstName} lastName={lastName} />
  )),
}));

jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: jest.fn(({ children, onClick }) => (
    <scrollable-swimlane-mock onClick={onClick}>{children}</scrollable-swimlane-mock>
  )),
}));

jest.mock("@ppb/the-wall-web/components/bricks/SwimlaneArrow/SwimlaneArrow", () => ({
  SwimlaneArrow: jest.fn(({ onClick, side }) => (
    <button data-testid={`arrow-${side}`} onClick={onClick}>
      {side}
    </button>
  )),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

const mockPlayers = [
  { urn: "urn:1", status: "loaded", firstName: "Erling", lastName: "Haaland", jersey: "Manchester City" },
  { urn: "urn:2", status: "loaded", firstName: "Bukayo", lastName: "Saka", jersey: "Arsenal" },
  { urn: "urn:3", status: "loading", firstName: "Mohamed", lastName: "Salah" },
  { urn: "urn:4", status: "loaded", firstName: "Bruno", lastName: "Fernandes", jersey: "Manchester United" },
  { urn: "urn:5", status: "loaded", firstName: "Son", lastName: "Heung-min", jersey: "Tottenham Hotspur" },
  { urn: "urn:6", status: "loaded", firstName: "Kevin", lastName: "De Bruyne" },
  { urn: "urn:7", status: "loaded", firstName: "Martin", lastName: "Ødegaard", jersey: "Arsenal" },
  { urn: "urn:8", status: "loading", firstName: "James", lastName: "Maddison", jersey: "Leicester City" },
  { urn: "urn:9", status: "loaded", firstName: "Luis", lastName: "Díaz", jersey: "Liverpool" },
  { urn: "urn:10", status: "loaded", firstName: "Alejandro", lastName: "Garnacho" },
];

let scrollLeft = 0;
const scrollToMock = jest.fn(({ left }) => {
  scrollLeft = left;
});
const onScrollArrowClickMock = jest.fn();
const onClickMock = jest.fn();
const onEditSquadButtonClickMock = jest.fn();

describe("MicroPlayersCarousel", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    scrollLeft = 0;

    Object.defineProperty(HTMLElement.prototype, "clientWidth", {
      configurable: true,
      get: () => 400,
    });
    Object.defineProperty(HTMLElement.prototype, "scrollWidth", {
      configurable: true,
      get: () => 1000,
    });
    Object.defineProperty(HTMLElement.prototype, "offsetLeft", {
      configurable: true,
      get: () => Array.from(document.querySelectorAll(".carouselContainer > div")).indexOf(this) * 100,
    });
    Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
      configurable: true,
      get: () => 0,
    });

    Object.defineProperty(HTMLElement.prototype, "scrollLeft", {
      configurable: true,
      get: () => scrollLeft,
      set: (val) => {
        scrollLeft = val;
      },
    });

    HTMLElement.prototype.scrollTo = scrollToMock;
  });

  const renderWithContext = (ui, isDesktopLayout = false) =>
    render(<ConfigContext.Provider value={{ isDesktopLayout }}>{ui}</ConfigContext.Provider>);

  describe("When isDesktopLayout is true", () => {
    it("should render desktop layout", () => {
      const { container } = renderWithContext(<MicroPlayersCarousel players={mockPlayers} />, true);
      const desktopLayout = container.querySelector(CONTAINER_DESKTOP_LAYOUT);
      expect(desktopLayout).not.toBeNull();
    });

    it("should not show left arrow initially and show it after scrolling right", () => {
      const { container } = renderWithContext(<MicroPlayersCarousel players={mockPlayers} />, true);

      const leftArrow = container.querySelector('[data-testid="arrow-left"]');
      const rightArrow = container.querySelector('[data-testid="arrow-right"]');
      const carouselContainer = container.querySelector(CAROUSEL_CONTAINER);

      expect(leftArrow).not.toBeInTheDocument();
      expect(rightArrow).toBeInTheDocument();

      fireEvent.click(rightArrow);
      scrollLeft = 100;
      fireEvent.scroll(carouselContainer);

      const updatedLeftArrow = container.querySelector('[data-testid="arrow-left"]');

      expect(updatedLeftArrow).toBeInTheDocument();
    });

    it("should not show right arrow when positioned on the end and show it after scrolling left", () => {
      scrollLeft = 600;
      const { container } = renderWithContext(<MicroPlayersCarousel players={mockPlayers} />, true);

      const leftArrow = container.querySelector('[data-testid="arrow-left"]');
      const rightArrow = container.querySelector('[data-testid="arrow-right"]');
      const carouselContainer = container.querySelector(CAROUSEL_CONTAINER);

      expect(leftArrow).toBeInTheDocument();
      expect(rightArrow).not.toBeInTheDocument();

      fireEvent.click(leftArrow);
      scrollLeft = 500;
      fireEvent.scroll(carouselContainer);

      const updatedRightArrow = container.querySelector('[data-testid="arrow-right"]');

      expect(updatedRightArrow).toBeInTheDocument();
    });

    it("should call onScrollArrowClick with 'next' when right arrow is clicked", () => {
      const { container } = renderWithContext(
        <MicroPlayersCarousel players={mockPlayers} onScrollArrowClick={onScrollArrowClickMock} />,
        true,
      );

      const rightArrow = container.querySelector('[data-testid="arrow-right"]');
      expect(rightArrow).toBeInTheDocument();

      fireEvent.click(rightArrow);
      expect(onScrollArrowClickMock).toHaveBeenCalledWith("next");
    });

    it("should call onScrollArrowClick with 'previous' when left arrow is clicked", () => {
      scrollLeft = 600;
      const { container } = renderWithContext(
        <MicroPlayersCarousel players={mockPlayers} onScrollArrowClick={onScrollArrowClickMock} />,
        true,
      );

      const leftArrow = container.querySelector('[data-testid="arrow-left"]');
      expect(leftArrow).toBeInTheDocument();

      fireEvent.click(leftArrow);
      expect(onScrollArrowClickMock).toHaveBeenCalledWith("previous");
    });

    it("should not throw if onScrollArrowClick is not provided", () => {
      const { container } = renderWithContext(<MicroPlayersCarousel players={mockPlayers} />, true);
      const rightArrow = container.querySelector('[data-testid="arrow-right"]');

      expect(() => fireEvent.click(rightArrow)).not.toThrow();
    });

    it("should render MicroPlayers with correct props", () => {
      renderWithContext(<MicroPlayersCarousel players={mockPlayers} />, true);
      expect(ObbMicroPlayer).toHaveBeenCalledTimes(10);
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        1,
        {
          players: [{ firstName: "Erling", lastName: "Haaland" }],
          jerseys: ["Manchester City"],
          onRemovePlayerClick: undefined,
        },
        undefined,
      );
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        2,
        {
          players: [{ firstName: "Bukayo", lastName: "Saka" }],
          jerseys: ["Arsenal"],
          onRemovePlayerClick: undefined,
        },
        undefined,
      );
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        3,
        {
          players: [{ firstName: "", lastName: "" }],
          jerseys: [undefined],
          onRemovePlayerClick: undefined,
        },
        undefined,
      );
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        4,
        {
          players: [{ firstName: "Bruno", lastName: "Fernandes" }],
          jerseys: ["Manchester United"],
          onRemovePlayerClick: undefined,
        },
        undefined,
      );
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        5,
        {
          players: [{ firstName: "Son", lastName: "Heung-min" }],
          jerseys: ["Tottenham Hotspur"],
          onRemovePlayerClick: undefined,
        },
        undefined,
      );
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        6,
        {
          players: [{ firstName: "Kevin", lastName: "De Bruyne" }],
          jerseys: [undefined],
          onRemovePlayerClick: undefined,
        },
        undefined,
      );
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        7,
        {
          players: [{ firstName: "Martin", lastName: "Ødegaard" }],
          jerseys: ["Arsenal"],
          onRemovePlayerClick: undefined,
        },
        undefined,
      );
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        8,
        {
          players: [{ firstName: "", lastName: "" }],
          jerseys: [undefined],
          onRemovePlayerClick: undefined,
        },
        undefined,
      );
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        9,
        {
          players: [{ firstName: "Luis", lastName: "Díaz" }],
          jerseys: ["Liverpool"],
          onRemovePlayerClick: undefined,
        },
        undefined,
      );
      expect(ObbMicroPlayer).toHaveBeenNthCalledWith(
        10,
        {
          players: [{ firstName: "Alejandro", lastName: "Garnacho" }],
          jerseys: [undefined],
          onRemovePlayerClick: undefined,
        },
        undefined,
      );
    });
  });

  describe("When isDesktopLayout is false", () => {
    it("should render mobile layout when isDesktopLayout is false", () => {
      const { container } = renderWithContext(<MicroPlayersCarousel players={mockPlayers} />, false);
      const mobileLayout = container.querySelector(CONTAINER_MOBILE_LAYOUT);
      expect(mobileLayout).not.toBeNull();
    });
  });

  describe("Nudge Player Picker Experiment", () => {
    describe("Variant 1", () => {
      describe("When isDesktopLayout is true", () => {
        it("should call 'onClick' when the carousel is clicked", () => {
          const { container } = renderWithContext(
            <MicroPlayersCarousel players={mockPlayers} onClick={onClickMock} />,
            true,
          );

          const carouselContainer = container.querySelector(CAROUSEL_CONTAINER);

          fireEvent.click(carouselContainer);

          expect(onClickMock).toHaveBeenCalledTimes(1);
        });

        it("should call 'onClick' when the carousel is focused and 'Enter' key is pressed", () => {
          const { container } = renderWithContext(
            <MicroPlayersCarousel players={mockPlayers} onClick={onClickMock} />,
            true,
          );

          const carouselContainer = container.querySelector(CAROUSEL_CONTAINER);
          carouselContainer.focus();

          fireEvent.keyDown(carouselContainer, { key: "Enter" });

          expect(onClickMock).toHaveBeenCalledTimes(1);
        });

        it("should call 'onClick' when the carousel is focused and 'Space' key is pressed", () => {
          const { container } = renderWithContext(
            <MicroPlayersCarousel players={mockPlayers} onClick={onClickMock} />,
            true,
          );

          const carouselContainer = container.querySelector(CAROUSEL_CONTAINER);
          carouselContainer.focus();

          fireEvent.keyDown(carouselContainer, { key: " " });

          expect(onClickMock).toHaveBeenCalledTimes(1);
        });

        it("should apply 'playerCarouselClickable' CSS class when 'onClick' is provided", () => {
          const { container } = renderWithContext(
            <MicroPlayersCarousel players={mockPlayers} onClick={onClickMock} />,
            true,
          );

          const carouselContainer = container.querySelector(CAROUSEL_CONTAINER);

          expect(carouselContainer.className).toContain("playerCarouselClickable");
        });

        it("should not apply 'playerCarouselClickable' CSS class when 'onClick' is not provided", () => {
          const { container } = renderWithContext(<MicroPlayersCarousel players={mockPlayers} />, true);

          const carouselContainer = container.querySelector(CAROUSEL_CONTAINER);

          expect(carouselContainer.className).not.toContain("playerCarouselClickable");
        });

        it("should apply 'role=button' and 'tabIndex=0' when 'onClick' is provided", () => {
          const { container } = renderWithContext(
            <MicroPlayersCarousel players={mockPlayers} onClick={onClickMock} />,
            true,
          );

          const carouselContainer = container.querySelector(CAROUSEL_CONTAINER);

          expect(carouselContainer).toHaveAttribute("role", "button");
          expect(carouselContainer).toHaveAttribute("tabIndex", "0");
        });

        it("should not apply 'role=button' and 'tabIndex=0' when 'onClick' is not provided", () => {
          const { container } = renderWithContext(<MicroPlayersCarousel players={mockPlayers} />, true);

          const carouselContainer = container.querySelector(CAROUSEL_CONTAINER);

          expect(carouselContainer).not.toHaveAttribute("role");
          expect(carouselContainer).not.toHaveAttribute("tabIndex");
        });

        it("should not throw if 'onClick' is not provided", () => {
          const { container } = renderWithContext(<MicroPlayersCarousel players={mockPlayers} />, true);

          const carouselContainer = container.querySelector(CAROUSEL_CONTAINER);

          expect(() => fireEvent.click(carouselContainer)).not.toThrow();
        });

        it("should not interfere with 'onScrollArrowClick' when 'onClick' is provided", () => {
          const { container } = renderWithContext(
            <MicroPlayersCarousel
              players={mockPlayers}
              onScrollArrowClick={onScrollArrowClickMock}
              onClick={onClickMock}
            />,
            true,
          );

          const rightArrow = container.querySelector('[data-testid="arrow-right"]');

          expect(rightArrow).toBeInTheDocument();

          fireEvent.click(rightArrow);

          expect(onScrollArrowClickMock).toHaveBeenCalledWith("next");
          expect(onClickMock).not.toHaveBeenCalled();
        });
      });

      describe("When isDesktopLayout is false", () => {
        it("should call 'onClick' when 'ScrollableSwimlane' is clicked and 'onClick' is provided", () => {
          const { container } = renderWithContext(
            <MicroPlayersCarousel players={mockPlayers} onClick={onClickMock} />,
            false,
          );

          const scrollableSwimlane = container.querySelector("scrollable-swimlane-mock");

          fireEvent.click(scrollableSwimlane);

          expect(onClickMock).toHaveBeenCalledTimes(1);
        });

        it("should not throw when 'ScrollableSwimlane' is clicked and 'onClick' is not provided", () => {
          const { container } = renderWithContext(<MicroPlayersCarousel players={mockPlayers} />, false);

          const scrollableSwimlane = container.querySelector("scrollable-swimlane-mock");

          expect(() => fireEvent.click(scrollableSwimlane)).not.toThrow();
        });
      });
    });

    describe("Variant 2", () => {
      describe.each([
        [true, CAROUSEL_CONTAINER],
        [false, CONTAINER_MOBILE_LAYOUT],
      ])("When 'isDesktopLayout' is %s", (isDesktopLayout, containerSelector) => {
        it("should render the 'plus' button inside the carousel when 'onEditSquadButtonClick' is provided", () => {
          const { container } = renderWithContext(
            <MicroPlayersCarousel players={mockPlayers} onEditSquadButtonClick={onEditSquadButtonClickMock} />,
            isDesktopLayout,
          );

          const carouselContainer = container.querySelector(containerSelector);
          const editSquadButtonIcon = carouselContainer.querySelector(EDIT_SQUAD_BUTTON_ICON);

          expect(editSquadButtonIcon).toBeInTheDocument();
        });

        it("should call 'onEditSquadButtonClick' when the 'plus' button is clicked", () => {
          const { container } = renderWithContext(
            <MicroPlayersCarousel players={mockPlayers} onEditSquadButtonClick={onEditSquadButtonClickMock} />,
            isDesktopLayout,
          );

          const carouselContainer = container.querySelector(containerSelector);
          const editSquadButtonIcon = carouselContainer.querySelector(EDIT_SQUAD_BUTTON_ICON);

          fireEvent.click(editSquadButtonIcon);

          expect(onEditSquadButtonClickMock).toHaveBeenCalledTimes(1);
        });
      });
    });
  });
});
