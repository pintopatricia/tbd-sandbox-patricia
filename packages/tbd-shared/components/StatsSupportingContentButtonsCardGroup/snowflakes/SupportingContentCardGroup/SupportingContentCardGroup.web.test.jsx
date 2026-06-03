import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ScrollableSwimlane, SupportingContentButton } from "@ppb/the-wall-web";
import SupportingContentCardGroup from "./SupportingContentCardGroup.web";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import ConnectedCard from "../../../Card";

jest.mock("../../../Card", () => jest.fn(() => <mock-connected-card />));
jest.mock("../../../Card/Card.web", () => jest.fn(() => <mock-card-web />));

jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: jest.fn(({ children }) => <mock-scrollable-swimlane>{children}</mock-scrollable-swimlane>),
  SupportingContentButton: jest.fn((props) => <supporting-content-button-mock {...props} />),
}));

const urn = "ppb:tbd:stats:cardgroup:supportingContentButtons:1|1|my-bets";

const items = [
  {
    urn: "ppb:tbd:stats:card:matchStats:1",
    label: "I18N.INPLAY.COUPON.MATCH.STATS.PEBBLE",
    typename: "StatsMatchStatsCard",
    icon: SupportingContentIconName.MATCH_STATS,
    applyContentStyles: true,
  },
  {
    urn: "ppb:tbd:card:incidents:1|pebble",
    label: "I18N.STATS.EVENTS_PEBBLE",
    typename: "IncidentsCard",
    icon: SupportingContentIconName.PITCH,
    applyContentStyles: true,
  },
  {
    urn: "ppb:tbd:stats:card:broadcasts:1|1|livevideo",
    label: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
    typename: "StatsBroadcastsCard",
    icon: SupportingContentIconName.LIVE_VIDEO,
    applyContentStyles: false,
  },
];

const onSupportingContentButtonPressMock = jest.fn();

const renderComponent = ({ items }) =>
  render(
    <SupportingContentCardGroup
      items={items}
      visible={true}
      onSupportingContentButtonPress={onSupportingContentButtonPressMock}
    />,
  );

describe("SupportingContentCardGroup component", () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  describe("when initializing the component", () => {
    describe("when items is empty", () => {
      it("should render null", () => {
        const { container } = renderComponent({ items: [] });

        expect(container.firstChild).toBeNull();
      });
    });

    describe("when items are defined", () => {
      beforeEach(async () => {
        renderComponent({ items });
      });

      it("should render a swimlane", () => {
        expect(ScrollableSwimlane).toHaveBeenCalledWith(
          expect.objectContaining({
            large: true,
            children: expect.any(Object),
          }),
          undefined,
        );
      });

      it("should render 3 Supporting Content Buttons", () => {
        expect(SupportingContentButton).toHaveBeenCalledTimes(3);

        expect(SupportingContentButton).toHaveBeenCalledWith(
          {
            title: items[0].label,
            icon: items[0].icon,
            isOpen: false,
            onPress: expect.any(Function),
            showExpandIcon: true,
          },
          undefined,
        );

        expect(SupportingContentButton).toHaveBeenCalledWith(
          {
            title: items[1].label,
            icon: items[1].icon,
            isOpen: false,
            onPress: expect.any(Function),
            showExpandIcon: true,
          },
          undefined,
        );

        expect(SupportingContentButton).toHaveBeenCalledWith(
          {
            title: items[2].label,
            icon: items[2].icon,
            isOpen: false,
            onPress: expect.any(Function),
            showExpandIcon: true,
          },
          undefined,
        );
      });

      it("should not render any item card", () => {
        expect(ConnectedCard).not.toHaveBeenCalled();
      });

      describe("and the user triggers the first button", () => {
        beforeEach(async () => {
          act(() => {
            SupportingContentButton.mock.calls[0][0].onPress(true);
          });
        });

        it("should call onSupportingContentButtonPress with the first item urn and a true visibility flag", () => {
          expect(onSupportingContentButtonPressMock).toHaveBeenCalledWith(items[0].urn, true);
        });

        it("should render the first item card", () => {
          expect(ConnectedCard).toHaveBeenCalledTimes(1);
          expect(ConnectedCard).toHaveBeenCalledWith(
            {
              urn: items[0].urn,
              component: expect.any(Function),
              typename: items[0].typename,
              visible: true,
            },
            undefined,
          );
        });

        describe("and the user triggers the second button", () => {
          beforeEach(async () => {
            act(() => {
              SupportingContentButton.mock.calls[1][0].onPress(true);
            });
          });

          it("should call onSupportingContentButtonPress with the second item urn and a true visibility flag", () => {
            expect(onSupportingContentButtonPressMock).toHaveBeenCalledWith(items[1].urn, true);
          });

          it("should render the second item card", () => {
            expect(ConnectedCard).toHaveBeenCalledTimes(2);
            expect(ConnectedCard).toHaveBeenCalledWith(
              {
                urn: items[1].urn,
                component: expect.any(Function),
                typename: items[1].typename,
                visible: true,
              },
              undefined,
            );
          });

          describe("and the user triggers the second button again", () => {
            beforeEach(async () => {
              act(() => {
                SupportingContentButton.mock.calls[1][0].onPress(false);
              });
            });

            it("should call onSupportingContentButtonPress with the second item urn and a false visibility flag", () => {
              expect(onSupportingContentButtonPressMock).toHaveBeenCalledWith(items[1].urn, false);
            });

            it("should not render any item card", () => {
              expect(ConnectedCard).toHaveBeenCalledTimes(2);
            });
          });
        });
      });
    });
  });
});
