import { act, render, screen } from "@testing-library/react";
import "jest-dom/extend-expect";
import { SelectableItems, SegmentedControl, Card as CardTheWall } from "@ppb/the-wall-web";
import { SelectableItemsFilterOptions } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import SelectableItemsCardGroup from "./SelectableItemsCardGroup.web";
import { TEST_ID as SELECTABLE_ITEMS_CARD_GROUP_CONTAINER, TITLE } from "./SelectableItemsCardGroup.web.selectors";
import { CardTheme } from "@ppb/the-wall-common/types";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({ isDesktopLayout: false })),
}));
jest.mock("@ppb/the-wall-web", () => ({
  SelectableItems: jest.fn(({ props }) => <selectable-items-mock {...props} />),
  SegmentedControl: jest.fn(({ props }) => <segmented-control-mock {...props} />),
  Card: jest.fn(({ children }) => <card-the-wall data-testid="card-the-wall">{children}</card-the-wall>),
}));

jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.web", () => jest.fn(() => <card-mock />));

const cardGroupItemsMock = [
  {
    startTime: "2020-11-12T17:00:00.000Z",
    venue: "Cheltenham",
    typename: "RaceMarketCard",
    urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
  },
  {
    startTime: "2020-11-12T17:00:00.000Z",
    venue: "Ruby",
    typename: "RaceMarketCard",
    urn: "ppb:tbd:card:racemarket:1.175262304;924.244997853|25",
  },
  {
    typename: "HeadToHeadCard",
    urn: "ppb:tbd:card:headToHead:1",
  },
];

const selectableItemsMock = [
  {
    raceTime: "12:00",
    meetingName: "Cheltenham",
  },
  {
    raceTime: "12:00",
    meetingName: "Cheltenham",
  },
];

function renderComponent({
  urn = "cardUrn",
  title,
  isHighlighted = false,
  cardGroupItems,
  selectableItems,
  filterProps,
  hasItemRotation = false,
  dispatchFetchCardsAction = jest.fn(),
  dispatchRaceClick = jest.fn(),
  dispatchStatisticsItemClick = jest.fn(),
  dispatchFetchFilteredSelectableItems = jest.fn(),
  dispatchNextRacesFilterClick = jest.fn(),
}) {
  return render(
    <SelectableItemsCardGroup
      urn={urn}
      title={title}
      isHighlighted={isHighlighted}
      cardGroupItems={cardGroupItems}
      selectableItems={selectableItems}
      filterProps={filterProps}
      hasItemRotation={hasItemRotation}
      dispatchFetchCardsAction={dispatchFetchCardsAction}
      dispatchRaceClick={dispatchRaceClick}
      dispatchStatisticsItemClick={dispatchStatisticsItemClick}
      dispatchFetchFilteredSelectableItems={dispatchFetchFilteredSelectableItems}
      dispatchNextRacesFilterClick={dispatchNextRacesFilterClick}
    />,
  );
}

describe("SelectableItemsCardGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render SegmentedControl component", () => {
    const props = {
      title: "Over/Under",
      cardGroupItems: cardGroupItemsMock,
      selectableItems: selectableItemsMock,
      filterProps: {
        options: [
          {
            key: SelectableItemsFilterOptions.UK_AND_IRE,
            value: "UK AND IRE",
          },
          {
            key: SelectableItemsFilterOptions.ALL_COUNTRIES,
            value: "ALL COUNTRIES",
          },
        ],
        selectedOption: SelectableItemsFilterOptions.UK_AND_IRE,
      },
    };

    const { container } = renderComponent(props);
    expect(container.querySelector(SELECTABLE_ITEMS_CARD_GROUP_CONTAINER)).toBeVisible();

    expect(SegmentedControl).toHaveBeenCalledWith(
      {
        onClick: expect.any(Function),
        options: [
          {
            key: SelectableItemsFilterOptions.UK_AND_IRE,
            value: "UK AND IRE",
          },
          {
            key: SelectableItemsFilterOptions.ALL_COUNTRIES,
            value: "ALL COUNTRIES",
          },
        ],
        selectedOption: SelectableItemsFilterOptions.UK_AND_IRE,
      },
      undefined,
    );
  });

  it("should render SelectableItems component", () => {
    const props = {
      title: "Over/Under",
      cardGroupItems: cardGroupItemsMock,
      selectableItems: selectableItemsMock,
      isHighlighted: true,
    };

    const { container } = renderComponent(props);
    expect(container.querySelector(SELECTABLE_ITEMS_CARD_GROUP_CONTAINER)).toBeVisible();

    expect(SelectableItems).toHaveBeenCalledWith(
      {
        isHighlighted: true,
        items: selectableItemsMock,
        onRaceTimeClick: expect.any(Function),
        onStatisticsClick: expect.any(Function),
        defaultItemIndex: 0,
        listContainerRef: expect.any(Object),
        isDesktop: false,
      },
      undefined,
    );

    expect(SegmentedControl).not.toHaveBeenCalled();
  });

  it("should render the Card component with the correct properties", () => {
    const props = {
      title: "Over/Under",
      cardGroupItems: cardGroupItemsMock,
      selectableItems: selectableItemsMock,
      isHighlighted: true,
    };

    renderComponent(props);

    const card = screen.getByTestId("card-the-wall");

    expect(CardTheWall).toHaveBeenCalledWith(
      expect.objectContaining({
        showShadow: true,
        fullWidthContent: true,
        theme: CardTheme.TRANSPARENT,
      }),
      undefined,
    );

    expect(card).toBeInTheDocument();
  });

  it("should render ConnectedCard component with correct props", () => {
    const props = {
      title: "Over/Under",
      cardGroupItems: cardGroupItemsMock,
      selectableItems: selectableItemsMock,
    };
    renderComponent(props);

    expect(ConnectedCard).toHaveBeenCalledWith(
      {
        urn: "ppb:tbd:card:racemarket:1.175262306;924.244997857|25",
        typename: "RaceMarketCard",
        component: Card,
      },
      undefined,
    );
  });

  it("should not render ConnectedCard component if there is no selectedItem", () => {
    const props = {
      title: "Over/Under",
      cardGroupItems: [],
      selectableItems: selectableItemsMock,
    };
    renderComponent(props);

    expect(ConnectedCard).not.toHaveBeenCalled();
  });

  describe("title", () => {
    it("should render title when its defined", () => {
      const props = {
        title: "Next Races",
        cardGroupItems: cardGroupItemsMock,
        selectableItems: selectableItemsMock,
        filterProps: {
          options: [
            {
              key: SelectableItemsFilterOptions.UK_AND_IRE,
              value: "UK AND IRE",
            },
            {
              key: SelectableItemsFilterOptions.ALL_COUNTRIES,
              value: "ALL COUNTRIES",
            },
          ],
          defaultkey: SelectableItemsFilterOptions.UK_AND_IRE,
        },
      };

      const { container } = renderComponent(props);
      expect(container.querySelector(TITLE)).toHaveTextContent("Next Races");
    });

    it("should not render title when its undefined", () => {
      const props = {
        cardGroupItems: cardGroupItemsMock,
        selectableItems: selectableItemsMock,
        filterProps: {
          options: [
            {
              key: SelectableItemsFilterOptions.UK_AND_IRE,
              value: "UK AND IRE",
            },
            {
              key: SelectableItemsFilterOptions.ALL_COUNTRIES,
              value: "ALL COUNTRIES",
            },
          ],
          defaultkey: SelectableItemsFilterOptions.UK_AND_IRE,
        },
      };

      const { container } = renderComponent(props);
      expect(container.querySelector(TITLE)).toBeNull();
    });
  });

  describe("when there is item rotation", () => {
    describe("when the current selected item has a closed race", () => {
      describe("when there is an available item", () => {
        it("should rotate to the next item", () => {
          const dispatchFetchCardsAction = jest.fn();
          const baseCardGroupItems = [
            {
              startTime: "12:00",
              urn: "urn:1",
              typename: "VirtualCardGroup",
              isClosed: false,
              isDisabled: false,
            },
            {
              startTime: "13:00",
              urn: "urn:2",
              typename: "VirtualCardGroup",
              isClosed: false,
              isDisabled: false,
            },
          ];
          const baseSelectableItems = [
            {
              urn: "urn:1",
              raceTime: "12:00",
              isRaceClosed: false,
              isDisabled: false,
            },
            {
              urn: "urn:2",
              raceTime: "13:00",
              meetingName: "Cheltenham2",
              isRaceClosed: false,
              isDisabled: false,
            },
          ];
          const props = {
            title: "Over/Under",
            cardGroupItems: baseCardGroupItems,
            selectableItems: baseSelectableItems,
            hasItemRotation: true,
            dispatchFetchCardsAction,
          };
          const closedCardGroupItem = [
            {
              ...baseCardGroupItems[0],
              isClosed: true,
              isDisabled: true,
            },
            baseCardGroupItems[1],
          ];
          const closedSelectableItems = [
            {
              ...baseSelectableItems[0],
              isRaceClosed: true,
              isDisabled: true,
            },
            baseSelectableItems[1],
          ];

          const { rerender } = renderComponent(props);

          expect(ConnectedCard).toHaveBeenCalledWith(
            { urn: "urn:1", typename: "VirtualCardGroup", component: Card },
            undefined,
          );

          act(() =>
            rerender(
              <SelectableItemsCardGroup
                {...props}
                selectableItems={closedSelectableItems}
                cardGroupItems={closedCardGroupItem}
              />,
            ),
          );

          expect(ConnectedCard).toHaveBeenCalledWith(
            { urn: "urn:2", typename: "VirtualCardGroup", component: Card },
            undefined,
          );
          expect(dispatchFetchCardsAction).toHaveBeenCalledWith(["urn:2"]);
        });
      });

      describe("when there is no available item", () => {
        it("should keep the current item", () => {
          const dispatchFetchCardsAction = jest.fn();
          const baseCardGroupItems = [
            {
              startTime: "12:00",
              urn: "urn:1",
              typename: "VirtualCardGroup",
              isClosed: false,
              isDisabled: false,
            },
          ];
          const baseSelectableItems = [
            {
              urn: "urn:1",
              raceTime: "12:00",
              isRaceClosed: false,
              isDisabled: false,
            },
          ];
          const props = {
            title: "Over/Under",
            cardGroupItems: baseCardGroupItems,
            selectableItems: baseSelectableItems,
            hasItemRotation: true,
            dispatchFetchCardsAction,
          };
          const closedCardGroupItem = [
            {
              ...baseCardGroupItems[0],
              isClosed: true,
              isDisabled: true,
            },
          ];
          const closedSelectableItems = [
            {
              ...baseSelectableItems[0],
              isRaceClosed: true,
              isDisabled: true,
            },
          ];

          const { rerender } = renderComponent(props);

          expect(ConnectedCard).toHaveBeenCalledWith(
            { urn: "urn:1", typename: "VirtualCardGroup", component: Card },
            undefined,
          );

          act(() =>
            rerender(
              <SelectableItemsCardGroup
                {...props}
                selectableItems={closedSelectableItems}
                cardGroupItems={closedCardGroupItem}
              />,
            ),
          );

          expect(ConnectedCard).toHaveBeenCalledWith(
            { urn: "urn:1", typename: "VirtualCardGroup", component: Card },
            undefined,
          );
          expect(dispatchFetchCardsAction).not.toHaveBeenCalled();
        });
      });
    });

    describe("when the selected index does not match the selected urn", () => {
      it("should update the index of the selected item, keep the same selected item and not re-fetch", () => {
        const dispatchFetchCardsAction = jest.fn();
        const baseCardGroupItems = [
          {
            startTime: "12:00",
            urn: "urn:1",
            typename: "VirtualCardGroup",
            isClosed: false,
            isDisabled: false,
          },
          {
            startTime: "13:00",
            urn: "urn:2",
            typename: "VirtualCardGroup",
            isClosed: false,
            isDisabled: false,
          },
        ];
        const baseSelectableItems = [
          {
            urn: "urn:1",
            raceTime: "12:00",
            isRaceClosed: false,
            isDisabled: false,
          },
          {
            urn: "urn:2",
            raceTime: "13:00",
            meetingName: "Cheltenham2",
            isRaceClosed: false,
            isDisabled: false,
          },
        ];
        const props = {
          title: "Over/Under",
          cardGroupItems: baseCardGroupItems,
          selectableItems: baseSelectableItems,
          hasItemRotation: true,
          dispatchFetchCardsAction,
        };
        const shiftedCardGroupItems = [baseCardGroupItems[1]];
        const shiftedSelectableItems = [baseSelectableItems[1]];

        const { rerender } = renderComponent(props);

        expect(ConnectedCard).toHaveBeenCalledWith(
          { urn: "urn:1", typename: "VirtualCardGroup", component: Card },
          undefined,
        );

        act(() => {
          const [[{ onRaceTimeClick }]] = SelectableItems.mock.calls;

          onRaceTimeClick(1);
        });

        expect(ConnectedCard).toHaveBeenCalledWith(
          { urn: "urn:2", typename: "VirtualCardGroup", component: Card },
          undefined,
        );
        expect(SelectableItems).toHaveBeenCalledWith(expect.objectContaining({ defaultItemIndex: 1 }), undefined);

        // Selected item is removed
        act(() =>
          rerender(
            <SelectableItemsCardGroup
              {...props}
              selectableItems={shiftedSelectableItems}
              cardGroupItems={shiftedCardGroupItems}
            />,
          ),
        );

        expect(ConnectedCard).toHaveBeenCalledWith(
          { urn: "urn:2", typename: "VirtualCardGroup", component: Card },
          undefined,
        );
        expect(SelectableItems).toHaveBeenCalledWith(expect.objectContaining({ defaultItemIndex: 0 }), undefined);

        expect(dispatchFetchCardsAction).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the selected item no longer exists", () => {
      it("should set the current index to 0", () => {
        const dispatchFetchCardsAction = jest.fn();
        const baseCardGroupItems = [
          {
            startTime: "12:00",
            urn: "urn:1",
            typename: "VirtualCardGroup",
            isClosed: false,
            isDisabled: false,
          },
          {
            startTime: "13:00",
            urn: "urn:2",
            typename: "VirtualCardGroup",
            isClosed: false,
            isDisabled: false,
          },
        ];
        const baseSelectableItems = [
          {
            urn: "urn:1",
            raceTime: "12:00",
            isRaceClosed: false,
            isDisabled: false,
          },
          {
            urn: "urn:2",
            raceTime: "13:00",
            meetingName: "Cheltenham2",
            isRaceClosed: false,
            isDisabled: false,
          },
        ];
        const props = {
          title: "Over/Under",
          cardGroupItems: baseCardGroupItems,
          selectableItems: baseSelectableItems,
          hasItemRotation: true,
          dispatchFetchCardsAction,
        };
        const shiftedCardGroupItems = [baseCardGroupItems[1]];
        const shiftedSelectableItems = [baseSelectableItems[1]];

        const { rerender } = renderComponent(props);

        expect(ConnectedCard).toHaveBeenCalledWith(
          { urn: "urn:1", typename: "VirtualCardGroup", component: Card },
          undefined,
        );

        // Selected item is removed
        act(() =>
          rerender(
            <SelectableItemsCardGroup
              {...props}
              selectableItems={shiftedSelectableItems}
              cardGroupItems={shiftedCardGroupItems}
            />,
          ),
        );

        expect(ConnectedCard).toHaveBeenCalledWith(
          { urn: "urn:2", typename: "VirtualCardGroup", component: Card },
          undefined,
        );
        expect(SelectableItems).toHaveBeenCalledWith(expect.objectContaining({ defaultItemIndex: 0 }), undefined);

        expect(dispatchFetchCardsAction).not.toHaveBeenCalled();
      });
    });
  });

  describe("when a race time item is clicked", () => {
    it("should dispatch fetch cards and dispatchRaceClick for GTM event", () => {
      const dispatchFetchCardsAction = jest.fn();
      const dispatchRaceClick = jest.fn();

      const props = {
        title: "Over/Under",
        cardGroupItems: cardGroupItemsMock,
        selectableItems: selectableItemsMock,
        dispatchFetchCardsAction,
        dispatchRaceClick,
      };
      renderComponent(props);

      act(() => {
        SelectableItems.mock.calls[0][0].onRaceTimeClick(1, false, { viewUrn: "urn", viewUrl: "url" });
      });

      expect(dispatchFetchCardsAction).toHaveBeenCalledTimes(1);
      expect(dispatchFetchCardsAction).toHaveBeenCalledWith(["ppb:tbd:card:racemarket:1.175262304;924.244997853|25"]);

      expect(dispatchRaceClick).toHaveBeenCalledWith("cardUrn");
    });
  });

  describe("when a statistic item is clicked", () => {
    it("should dispatch fetch cards and statistics item click action", () => {
      const dispatchFetchCardsAction = jest.fn();
      const dispatchStatisticsItemClick = jest.fn();

      const props = {
        title: "Over/Under",
        cardGroupItems: cardGroupItemsMock,
        selectableItems: selectableItemsMock,
        dispatchFetchCardsAction,
        dispatchStatisticsItemClick,
      };
      renderComponent(props);

      act(() => {
        SelectableItems.mock.calls[0][0].onStatisticsClick(2, "form");
      });

      expect(dispatchFetchCardsAction).toHaveBeenCalledTimes(1);
      expect(dispatchFetchCardsAction).toHaveBeenCalledWith(["ppb:tbd:card:headToHead:1"]);

      expect(dispatchStatisticsItemClick).toHaveBeenCalledTimes(1);
      expect(dispatchStatisticsItemClick).toHaveBeenCalledWith("form");
    });
  });

  describe("when a country filter option is clicked", () => {
    it("should call dispatchFetchFilteredSelectableItems and dispatchNextRacesFilterClick", () => {
      const dispatchFetchFilteredSelectableItems = jest.fn();
      const dispatchNextRacesFilterClick = jest.fn();

      const props = {
        cardGroupItems: cardGroupItemsMock,
        selectableItems: selectableItemsMock,
        filterProps: {
          options: [
            {
              key: SelectableItemsFilterOptions.UK_AND_IRE,
              value: "UK AND IRE",
            },
            {
              key: SelectableItemsFilterOptions.ALL_COUNTRIES,
              value: "ALL COUNTRIES",
            },
          ],
          selectedOption: SelectableItemsFilterOptions.UK_AND_IRE,
        },
        dispatchFetchFilteredSelectableItems,
        dispatchNextRacesFilterClick,
      };
      renderComponent(props);

      act(() => {
        SegmentedControl.mock.calls[0][0].onClick("AllCountries", "ALL COUNTRIES");
      });

      expect(dispatchFetchFilteredSelectableItems).toHaveBeenCalledTimes(1);
      expect(dispatchFetchFilteredSelectableItems).toHaveBeenCalledWith("cardUrn", "AllCountries");

      expect(dispatchNextRacesFilterClick).toHaveBeenCalledTimes(1);
      expect(dispatchNextRacesFilterClick).toHaveBeenCalledWith("ALL COUNTRIES");
    });
  });
});
