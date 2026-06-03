import { renderHook } from "@testing-library/react";
import { useCollapseStrategy, BetslipCollapseStrategy } from "./useCollapseStrategy";

const CARDS_MOCK = [
  {
    id: "1",
    content: [
      {
        title: "title 1.1",
        card: {},
        collapsable: false,
      },
      {
        title: "title 1.2",
        card: {},
        collapsable: false,
      },
    ],
  },
  {
    id: "2",
    content: [
      {
        title: "title 2.1",
        card: {},
        collapsable: false,
      },
      {
        title: "title 2.2",
        card: {},
        collapsable: false,
      },
    ],
  },
];

const CARDS_MOCK_WITH_COLLAPSABLE = [
  {
    id: "1",
    content: [
      {
        title: "title 1.1",
        card: {},
        collapsable: true,
      },
      {
        title: "title 1.2",
        card: {},
        collapsable: true,
      },
    ],
  },
  {
    id: "2",
    content: [
      {
        title: "title 2.1",
        card: {},
        collapsable: true,
      },
      {
        title: "title 2.2",
        card: {},
        collapsable: false,
      },
    ],
  },
];

describe("useCollapseStrategy", () => {
  describe("All open strategy", () => {
    it("should make all cards open regardless of collapsable value", () => {
      const {
        result: { current },
      } = renderHook(() => useCollapseStrategy(CARDS_MOCK, BetslipCollapseStrategy.AllOpen));

      expect(current).toEqual([
        {
          id: "1",
          content: [
            {
              title: "title 1.1",
              card: {},
              collapsable: false,
              startsOpen: true,
            },
            {
              title: "title 1.2",
              card: {},
              collapsable: false,
              startsOpen: true,
            },
          ],
        },
        {
          id: "2",
          content: [
            {
              title: "title 2.1",
              card: {},
              collapsable: false,
              startsOpen: true,
            },
            {
              title: "title 2.2",
              card: {},
              collapsable: false,
              startsOpen: true,
            },
          ],
        },
      ]);
    });
  });

  describe("First open strategy", () => {
    it("should keep all cards closed when none have collapsable set to true", () => {
      const {
        result: { current },
      } = renderHook(() => useCollapseStrategy(CARDS_MOCK, BetslipCollapseStrategy.FirstOpen));

      expect(current).toEqual([
        {
          id: "1",
          content: [
            {
              title: "title 1.1",
              card: {},
              collapsable: false,
              startsOpen: false,
            },
            {
              title: "title 1.2",
              card: {},
              collapsable: false,
              startsOpen: false,
            },
          ],
        },
        {
          id: "2",
          content: [
            {
              title: "title 2.1",
              card: {},
              collapsable: false,
              startsOpen: false,
            },
            {
              title: "title 2.2",
              card: {},
              collapsable: false,
              startsOpen: false,
            },
          ],
        },
      ]);
    });

    it("should open only the first card that has collapsable true and a card defined", () => {
      const {
        result: { current },
      } = renderHook(() => useCollapseStrategy(CARDS_MOCK_WITH_COLLAPSABLE, BetslipCollapseStrategy.FirstOpen));

      expect(current).toEqual([
        {
          id: "1",
          content: [
            {
              title: "title 1.1",
              card: {},
              collapsable: true,
              startsOpen: true,
            },
            {
              title: "title 1.2",
              card: {},
              collapsable: true,
              startsOpen: false,
            },
          ],
        },
        {
          id: "2",
          content: [
            {
              title: "title 2.1",
              card: {},
              collapsable: true,
              startsOpen: false,
            },
            {
              title: "title 2.2",
              card: {},
              collapsable: false,
              startsOpen: false,
            },
          ],
        },
      ]);
    });
  });
});
