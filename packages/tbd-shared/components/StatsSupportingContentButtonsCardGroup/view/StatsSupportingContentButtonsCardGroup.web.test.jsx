import { fireEvent, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import StatsSupportingContentButtonsCardGroup from "./StatsSupportingContentButtonsCardGroup.web";
import useStatsSupportingContentButtonsCardGroupVMMockFn from "../viewmodel/StatsSupportingContentButtonsCardGroup.viewmodel";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import SupportingContentCardGroup from "../snowflakes/SupportingContentCardGroup/SupportingContentCardGroup.web";

jest.mock("../model/StatsSupportingContentButtonsCardGroup.graphql.ts", () => ({
  writeStatsSupportingContentButtonsCardGroupFragment: jest.fn(),
}));

jest.mock("../snowflakes/SupportingContentCardGroup/SupportingContentCardGroup.web", () =>
  jest.fn((props) => <mocked-supporting-content-card-group {...props} />),
);

const urn = "ppb:tbd:stats:cardgroup:supportingContentButtons:1|1|my-bets";

const matchStatsButton = { urn: "ppb:tbd:stats:card:matchStats:1", typename: "StatsMatchStatsCard" };
const incidentsButton = { urn: "ppb:tbd:card:incidents:1|pebble", typename: "IncidentsCard" };
const liveVideoButton = { urn: "ppb:tbd:stats:card:broadcasts:1|1|livevideo", typename: "StatsBroadcastsCard" };

const buttonsDataArray = [
  {
    urn: matchStatsButton.urn,
    label: "I18N.INPLAY.COUPON.MATCH.STATS.PEBBLE",
    typename: matchStatsButton.typename,
    icon: SupportingContentIconName.MATCH_STATS,
    applyContentStyles: true,
  },
  {
    urn: incidentsButton.urn,
    label: "I18N.STATS.EVENTS_PEBBLE",
    typename: incidentsButton.typename,
    icon: SupportingContentIconName.PITCH,
    applyContentStyles: true,
  },
  {
    urn: liveVideoButton.urn,
    label: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
    typename: liveVideoButton.typename,
    icon: SupportingContentIconName.LIVE_VIDEO,
    applyContentStyles: false,
  },
];

const onButtonsStatsPress = jest.fn();

const useStatsSupportingContentButtonsCardGroupVMMock = {
  vm: {
    data: {
      items: buttonsDataArray,
    },
    events: { onButtonsStatsPress },
  },
};

jest.mock("../viewmodel/StatsSupportingContentButtonsCardGroup.viewmodel", () => ({
  ...jest.requireActual("../viewmodel/StatsSupportingContentButtonsCardGroup.viewmodel"),
  __esModule: true,
  default: jest.fn(() => useStatsSupportingContentButtonsCardGroupVMMock),
}));

const mockViewModel = ({ items = null } = {}) => {
  useStatsSupportingContentButtonsCardGroupVMMockFn.mockReturnValueOnce({
    vm: { data: items ? { items } : null, events: { onButtonsStatsPress } },
  });
};

function renderComponent() {
  return render(<StatsSupportingContentButtonsCardGroup urn={urn} />);
}

describe("StatsSupportingContentButtonsCardGroup component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initialize the component", () => {
    describe("when data.items is undefined", () => {
      it("should render null", () => {
        mockViewModel({ items: null });
        const { container } = renderComponent();

        expect(container.firstChild).toBeNull();
      });
    });

    describe("when data.items is defined", () => {
      it("should render items", () => {
        const items = buttonsDataArray;

        mockViewModel({ items });
        renderComponent();

        expect(SupportingContentCardGroup).toHaveBeenCalledWith(
          {
            items,
            visible: true,
            onSupportingContentButtonPress: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("when onSupportingContentButtonPress is pressed", () => {
      it("should call onButtonsStatsPress", () => {
        const items = buttonsDataArray;

        mockViewModel({ items });
        renderComponent();

        const { onSupportingContentButtonPress } = SupportingContentCardGroup.mock.calls[0][0];

        onSupportingContentButtonPress("buttonId", true);

        expect(onButtonsStatsPress).toHaveBeenCalledWith(urn, "buttonId", true);
      });
    });
  });
});
