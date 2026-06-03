import { render } from "@testing-library/react";
import { PebbleList } from "@ppb/the-wall-web";

import { PebbleMarketTemplate } from "./PebbleMarketTemplate.web";

jest.mock("@ppb/the-wall-web", () => ({
  PebbleList: jest.fn(({ props, children }) => <market-pebble-list {...props}>{children}</market-pebble-list>),
}));

function renderPebbleMarketTemplate({ items, defaultSelectedPebble, onPebbleClick }) {
  const { container } = render(
    <PebbleMarketTemplate items={items} defaultSelectedPebble={defaultSelectedPebble} onPebbleClick={onPebbleClick}>
      <div>Children here</div>
    </PebbleMarketTemplate>,
  );
  return container;
}

beforeEach(jest.clearAllMocks); // clears all mock calls between tests

describe("PebbleMarketTemplate", () => {
  describe("when PebbleMarketTemplate is mounted", () => {
    const pebbleListProps = {
      defaultSelectedPebble: undefined,
      items: [1, 2],
      onPebbleClick: jest.fn(),
    };

    beforeEach(() => {
      renderPebbleMarketTemplate(pebbleListProps);
    });

    it("should render children correctly", () => {
      const div = renderPebbleMarketTemplate(pebbleListProps).querySelector("div");
      expect(div.textContent).toBe("Children here");
    });

    it("should call PebbleList with correct props", () => {
      expect(PebbleList).toHaveBeenCalledTimes(1);
      expect(PebbleList).toHaveBeenCalledWith(
        {
          defaultSelectedPebble: undefined,
          items: [1, 2],
          onPebbleClick: expect.any(Function),
          isDesktopLayout: false,
        },
        undefined,
      );
    });
  });

  describe("when PebbleMarketTemplate is mounted without pebbles", () => {
    const pebbleListProps = {
      defaultSelectedPebble: undefined,
      items: [],
      onPebbleClick: jest.fn(),
    };

    beforeEach(() => {
      renderPebbleMarketTemplate(pebbleListProps);
    });

    it("should not call PebbleList", () => {
      expect(PebbleList).toHaveBeenCalledTimes(0);
    });
  });
});
