import { render, act, fireEvent, waitFor } from "@testing-library/react";
import "jest-dom/extend-expect";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { BetButtonsCarousel } from "./BetButtonsCarousel.web";
import { CAROUSEL_ARROW_LEFT, CAROUSEL_ARROW_RIGHT } from "./BetButtonsCarousel.web.selectors";

Object.defineProperty(HTMLElement.prototype, "scrollTo", {
  configurable: true,
  value: jest.fn(),
});

Object.defineProperty(HTMLElement.prototype, "offsetWidth", {
  configurable: true,
  get: () => 400,
});

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

let resizeCallback;

const mockResizeObserver = () => {
  class ResizeObserver {
    constructor(cb) {
      resizeCallback = cb;
      this.observe = jest.fn();
      this.disconnect = jest.fn();
    }
  }

  global.ResizeObserver = ResizeObserver;
};

const createItems = (count) =>
  Array.from({ length: count }, (_, index) => (
    <div key={index} data-testid={`carousel-item-${index}`}>
      Item {index}
    </div>
  ));

function renderBetButtonsCarousel({ pageSize, initialIndex, children }) {
  return render(
    <BetButtonsCarousel pageSize={pageSize} initialIndex={initialIndex}>
      {children}
    </BetButtonsCarousel>,
  );
}

describe("SquadBetButtonsCarousel", () => {
  let container;
  beforeEach(() => {
    jest.clearAllMocks();
    mockResizeObserver();
  });

  it("should scroll to initialIndex on mount", async () => {
    const items = createItems(10);

    await act(async () => {
      const result = renderBetButtonsCarousel({ pageSize: 4, initialIndex: 4, children: items });
      container = result.container;
    });

    act(() => {
      resizeCallback([
        {
          contentRect: {
            width: 400,
          },
        },
      ]);
    });

    await waitFor(() => {
      expect(HTMLElement.prototype.scrollTo).toHaveBeenCalledWith({
        left: 400,
        behavior: "auto",
      });
    });
  });

  describe("when on initial page and having a total of 3 pages", () => {
    it("should render two arrow buttons and only the first one should be disabled", async () => {
      const items = createItems(10);

      await act(async () => {
        const result = renderBetButtonsCarousel({ pageSize: 4, children: items });
        container = result.container;
      });
      expect(container).not.toBeEmpty();
      expect(GenericIcon).toHaveBeenCalledTimes(2);
      expect(GenericIcon).toHaveBeenNthCalledWith(
        1,
        {
          color: "var(--bet-button-carousel-icon-disable-colour)",
          name: "System--chevron-left",
        },
        undefined,
      );
      expect(GenericIcon).toHaveBeenNthCalledWith(
        2,
        {
          color: "var(--bet-button-carousel-icon-default-colour)",
          name: "System--chevron-right",
        },
        undefined,
      );
    });

    describe("when click on right arrow", () => {
      it("should scroll to next page and have both arrows enabled", async () => {
        const items = createItems(10);

        await act(async () => {
          const result = renderBetButtonsCarousel({ pageSize: 4, initialIndex: 0, children: items });
          container = result.container;
        });

        const rightArrow = container.querySelector(CAROUSEL_ARROW_RIGHT);

        act(() => {
          fireEvent.click(rightArrow);
        });

        expect(GenericIcon).toHaveBeenCalledTimes(4);
        expect(GenericIcon).toHaveBeenNthCalledWith(
          3,
          {
            color: "var(--bet-button-carousel-icon-default-colour)",
            name: "System--chevron-left",
          },
          undefined,
        );
        expect(GenericIcon).toHaveBeenNthCalledWith(
          4,
          {
            color: "var(--bet-button-carousel-icon-default-colour)",
            name: "System--chevron-right",
          },
          undefined,
        );
      });
    });
  });

  describe("when on last page and having a total of 3 pages", () => {
    it("should render two arrow buttons and only the last one should be disabled", async () => {
      const items = createItems(10);

      await act(async () => {
        const result = renderBetButtonsCarousel({ pageSize: 4, initialIndex: 8, children: items });
        container = result.container;
      });

      expect(container).not.toBeEmpty();
      expect(GenericIcon).toHaveBeenCalledTimes(2);
      expect(GenericIcon).toHaveBeenNthCalledWith(
        1,
        {
          color: "var(--bet-button-carousel-icon-default-colour)",
          name: "System--chevron-left",
        },
        undefined,
      );
      expect(GenericIcon).toHaveBeenNthCalledWith(
        2,
        {
          color: "var(--bet-button-carousel-icon-disable-colour)",
          name: "System--chevron-right",
        },
        undefined,
      );
    });

    describe("when click on left arrow", () => {
      it("should scroll to previous page and have both arrows enabled", async () => {
        const items = createItems(10);

        await act(async () => {
          const result = renderBetButtonsCarousel({ pageSize: 4, initialIndex: 8, children: items });
          container = result.container;
        });

        const leftArrow = container.querySelector(CAROUSEL_ARROW_LEFT);

        act(() => {
          fireEvent.click(leftArrow);
        });

        expect(GenericIcon).toHaveBeenCalledTimes(4);
        expect(GenericIcon).toHaveBeenNthCalledWith(
          3,
          {
            color: "var(--bet-button-carousel-icon-default-colour)",
            name: "System--chevron-left",
          },
          undefined,
        );
        expect(GenericIcon).toHaveBeenNthCalledWith(
          4,
          {
            color: "var(--bet-button-carousel-icon-default-colour)",
            name: "System--chevron-right",
          },
          undefined,
        );
      });
    });
  });
});
