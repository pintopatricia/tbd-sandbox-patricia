import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { PebbleList, EmptyState } from "@ppb/the-wall-web";
import StatsPebbleCardGroup from "./StatsPebbleCardGroup.web";
import ConnectedCard from "../../Card";
import useStatsPebbleCardGroupVMMockFn from "../viewmodel/StatsPebbleCardGroup.viewmodel";
import { writeLocalStatsPebbleCardGroupFragment } from "../model/StatsPebbleCardGroup.graphql";

jest.mock("../../Card", () => jest.fn(() => <connected-card-mock />));
jest.mock("../../Card/Card.web", () => jest.fn(() => <card-mock />));

jest.mock("@ppb/the-wall-web", () => ({
  PebbleList: jest.fn(({ children, props }) => <pebble-list-mock {...props}>{children}</pebble-list-mock>),
  EmptyState: jest.fn(() => <empty-state-mock />),
}));

jest.mock("../model/StatsPebbleCardGroup.graphql.ts", () => ({
  writeLocalStatsPebbleCardGroupFragment: jest.fn(),
}));

const formPebble = { urn: "ppb:tbd:stats:card:form:1", typename: "StatsFormCard" };
const h2hPebble = { urn: "ppb:tbd:stats:card:h2h:1", typename: "StatsHeadToHeadCard" };

const pebblesDataArray = [
  {
    id: formPebble.urn,
    text: "I18N.STATS.OVERALL_FOR",
    typename: formPebble.typename,
  },
  {
    id: h2hPebble.urn,
    text: "I18N.STATS.H2H_FORM",
    typename: h2hPebble.typename,
  },
];

const onPebbleStatsPress = jest.fn();

const useStatsPebbleCardGroupVMMock = {
  request: {
    called: true,
    loading: false,
    call: () => {},
  },
  vm: {
    data: {
      items: pebblesDataArray,
    },
    emptyLabels: {
      title: "I18N.STATS.PEBBLE_EMPTY_TITLE",
      message: "I18N.STATS.PEBBLE_EMPTY_MESSAGE",
    },
    events: { onPebbleStatsPress },
  },
};

const selectedPebbleMock = {
  urn: formPebble.urn,
  typename: formPebble.typename,
};

jest.mock("../viewmodel/StatsPebbleCardGroup.viewmodel", () => ({
  ...jest.requireActual("../viewmodel/StatsPebbleCardGroup.viewmodel"),
  __esModule: true,
  default: jest.fn(() => useStatsPebbleCardGroupVMMock),
}));

const mockViewModel = ({ items = null, selectedPebble = selectedPebbleMock } = {}) => {
  useStatsPebbleCardGroupVMMockFn.mockReturnValue({
    ...useStatsPebbleCardGroupVMMock,
    vm: items
      ? {
          data: { items, local: { selectedPebble } },
          emptyLabels: useStatsPebbleCardGroupVMMock.vm.emptyLabels,
          events: useStatsPebbleCardGroupVMMock.vm.events,
        }
      : {
          data: null,
          emptyLabels: useStatsPebbleCardGroupVMMock.vm.emptyLabels,
          events: useStatsPebbleCardGroupVMMock.vm.events,
        },
  });
};

const PEBBLE_CARD_URN = "ppb:tbd:stats:cardgroup:pebble:1";

function renderComponent() {
  return render(<StatsPebbleCardGroup urn={PEBBLE_CARD_URN} />);
}

describe("StatsPebbleCardGroup component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initialize the component", () => {
    describe("when there is no SCA data", () => {
      it("should render emptyState component", () => {
        mockViewModel();
        renderComponent(false);

        expect(PebbleList).not.toHaveBeenCalled();
        expect(EmptyState).toHaveBeenCalledWith(
          {
            isHighlighted: true,
            hasImage: false,
            message: "I18N.STATS.PEBBLE_EMPTY_MESSAGE",
            title: "I18N.STATS.PEBBLE_EMPTY_TITLE",
          },
          undefined,
        );
        expect(EmptyState).toHaveBeenCalledTimes(1);
      });
    });

    describe("when there is SCA data", () => {
      beforeEach(() => {
        mockViewModel({
          items: pebblesDataArray,
          selectedPebble: selectedPebbleMock,
        });
        renderComponent();
      });

      it("should initialize StatsPebbleCardGroup component with the correct props", () => {
        expect(PebbleList).toHaveBeenCalledWith(
          {
            items: pebblesDataArray,
            onPebbleClick: expect.any(Function),
            isDesktopLayout: false,
            selectedPebble: formPebble.urn,
          },
          undefined,
        );
        expect(PebbleList).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when pebble item is clicked", () => {
    it("should update selectedPebble", () => {
      mockViewModel({
        items: pebblesDataArray,
        selectedPebble: selectedPebbleMock,
      });
      const { rerender } = renderComponent();
      const onClickPebble = PebbleList.mock.calls[0][0].onPebbleClick;

      act(() => {
        onClickPebble(h2hPebble.urn);
      });

      mockViewModel({
        items: pebblesDataArray,
        selectedPebble: {
          urn: h2hPebble.urn,
          typename: h2hPebble.typename,
        },
      });

      rerender(<StatsPebbleCardGroup urn={PEBBLE_CARD_URN} />);

      expect(ConnectedCard).toHaveBeenLastCalledWith(
        expect.objectContaining({ urn: h2hPebble.urn, typename: h2hPebble.typename }),
        undefined,
      );

      expect(onPebbleStatsPress).toHaveBeenCalledWith(PEBBLE_CARD_URN, h2hPebble.urn);
      expect(writeLocalStatsPebbleCardGroupFragment).toHaveBeenCalledWith(PEBBLE_CARD_URN, {
        pebbleUrn: h2hPebble.urn,
        typename: h2hPebble.typename,
      });
    });
  });

  describe("when the pebble list changes", () => {
    const NEW_PEBBLE_1 = { urn: "new:pebble:1", typename: "NewPebble1" };
    const NEW_PEBBLE_2 = { urn: "new:pebble:2", typename: "NewPebble2" };

    const NEW_TAB_PEBLES_DATA_ARRAY = [
      {
        id: NEW_PEBBLE_1.urn,
        text: "NEW PEBBLE 1",
        typename: NEW_PEBBLE_1.typename,
      },
      {
        id: NEW_PEBBLE_2.urn,
        text: "NEW PEBBLE 2",
        typename: NEW_PEBBLE_2.typename,
      },
    ];

    it("should updated selectedPebble to the default of new list", () => {
      mockViewModel({
        items: pebblesDataArray,
        selectedPebble: selectedPebbleMock,
      });
      const { rerender } = renderComponent();

      expect(ConnectedCard).toHaveBeenCalledWith(
        {
          component: expect.any(Function),
          urn: pebblesDataArray[0].id,
          typename: pebblesDataArray[0].typename,
        },
        undefined,
      );

      mockViewModel({
        items: NEW_TAB_PEBLES_DATA_ARRAY,
        selectedPebble: {
          urn: NEW_PEBBLE_1.urn,
          typename: NEW_PEBBLE_1.typename,
        },
      });

      rerender(<StatsPebbleCardGroup urn={"ppb:tbd:stats:cardgroup:pebble:2"} />);

      expect(ConnectedCard).toHaveBeenCalledWith(
        {
          component: expect.any(Function),
          urn: NEW_TAB_PEBLES_DATA_ARRAY[0].id,
          typename: NEW_TAB_PEBLES_DATA_ARRAY[0].typename,
        },
        undefined,
      );
    });
  });
});
