import { fireEvent, render, act } from "@testing-library/react-native";
import { RaceDetails } from "@ppb/the-wall-native";

import { navigate } from "@ppb/tbd-router/native";
import RaceDetailsCard from "./RaceDetailsCard.native";
import { RACE_CARD_LINK, RACE_DETAILS_CARD } from "./RaceDetailsCard.native.selectors";

import ConnectedNotificationsSubscription from "../NotificationsSubscription";
import NotificationsSubscription from "../NotificationsSubscription/NotificationsSubscription.native";
import { NotificationsViewMode } from "../NotificationsSubscription/map-to-props-factory";
import { useStickyCard } from "../../hooks/useStickyCard.native";

const PLATFORM_MOCK = { OS: "ios" };

jest.mock("../../hooks/useStickyCard.native", () => ({
  useStickyCard: jest.fn(() => false),
}));

jest.mock("react-native", () => ({
  View: jest.fn((props) => <view-mock {...props} />),
  Pressable: jest.fn((props) => <pressable-mock {...props} />),
  StyleSheet: {
    create: (nativeStyles) => nativeStyles,
    flatten: jest.fn(),
  },
  Platform: PLATFORM_MOCK,
}));

jest.mock("@ppb/the-wall-native", () => ({
  RaceDetails: jest.fn(({ children }) => <race-details-mock> {children} </race-details-mock>),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  tokens: {},
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

jest.mock("../NotificationsSubscription", () =>
  jest.fn((props) => <connected-notification-subscription-mock {...props} />),
);

jest.mock("../NotificationsSubscription/NotificationsSubscription.native", () =>
  jest.fn(() => <notification-subscription-mock />),
);

jest.mock("react-native-device-info", () => ({}));

function renderRaceDetailsCard(raceDetailsCardProps) {
  return render(<RaceDetailsCard {...raceDetailsCardProps} />);
}

describe("RaceDetailsCard component", () => {
  beforeEach(jest.clearAllMocks);

  const dateTime = new Date();
  let component;

  const raceDetailsCardProps = {
    countryFlag: { small: "countryFlagURL" },
    raceTime: "14:00",
    meetingName: "Ayr",
    showDuration: true,
    date: "Today",
    dateTime,
    raceName: "race name",
    raceStatus: "Going",
    raceStatusLabel: "I18N.RACE_STATUS.GOING_DOWN",
    numberOfRunners: 5,
    raceClass: "Class 2",
    raceDetailsTitle: "a long race",
    isRaceRunningStatus: false,
    runnersLabel: "runners label",
    trackGoing: "Track Going",
    raceURN: "race:12345",
    showMeetingInfo: true,
    isHighlighted: true,
    dispatchSubscribeRaceUpdates: jest.fn(),
    dispatchUnsubscribeRaceUpdates: jest.fn(),
  };

  describe("when isn't sticky", () => {
    it("must render the race details with the correct props", () => {
      component = renderRaceDetailsCard(raceDetailsCardProps);
      expect(component.queryByTestId(RACE_DETAILS_CARD)).not.toBeNull();

      expect(RaceDetails).toHaveBeenCalledWith(
        {
          countryFlag: { small: "countryFlagURL" },
          raceTime: "14:00",
          meetingName: "Ayr",
          showDuration: true,
          date: "Today",
          dateTime,
          raceName: "race name",
          raceStatusLabel: "I18N.RACE_STATUS.GOING_DOWN",
          numberOfRunners: 5,
          runnersLabel: "runners label",
          raceClass: "Class 2",
          raceDetailsTitle: "a long race",
          isRaceRunningStatus: false,
          trackGoing: "Track Going",
          showMeetingInfo: true,
          isHighlighted: true,
        },
        undefined,
      );
    });
  });

  describe("when is sticky", () => {
    it("must render the race details with the correct props", () => {
      useStickyCard.mockReturnValueOnce(true);
      component = renderRaceDetailsCard(raceDetailsCardProps);
      expect(component.queryByTestId(RACE_DETAILS_CARD)).not.toBeNull();

      expect(RaceDetails).toHaveBeenCalledWith(
        {
          countryFlag: { small: "countryFlagURL" },
          raceTime: "14:00",
          meetingName: "Ayr",
          showDuration: true,
          date: "Today",
          dateTime,
          raceName: "race name",
          raceStatusLabel: "I18N.RACE_STATUS.GOING_DOWN",
          numberOfRunners: 5,
          runnersLabel: "runners label",
          raceClass: "Class 2",
          isRaceRunningStatus: false,
          raceDetailsTitle: "a long race",
          trackGoing: "Track Going",
          showMeetingInfo: true,
          isHighlighted: true,
        },
        undefined,
      );
    });
  });

  describe("when availableToSubscribe is true", () => {
    it("should render the notification subscription component", () => {
      renderRaceDetailsCard({
        ...raceDetailsCardProps,
        availableToSubscribe: true,
      });

      expect(ConnectedNotificationsSubscription).toHaveBeenCalledWith(
        {
          viewMode: NotificationsViewMode.EVENT_OR_RACE,
          component: NotificationsSubscription,
        },
        undefined,
      );
    });
  });

  describe("when viewLink is defined", () => {
    it("should render Pressable Component", () => {
      const { queryByTestId } = renderRaceDetailsCard({
        ...raceDetailsCardProps,
        viewLink: "raceViewLink",
      });
      const pressable = queryByTestId(RACE_CARD_LINK);

      expect(pressable).toBeDefined();
    });

    describe("when user press the Pressable Component", () => {
      it("should call navigation function", () => {
        const { queryByTestId } = renderRaceDetailsCard({
          ...raceDetailsCardProps,
          viewLink: "raceViewLink",
        });

        const pressable = queryByTestId(RACE_CARD_LINK);
        fireEvent.press(pressable);
        expect(navigate).toHaveBeenCalledWith("raceViewLink");
      });
    });
  });

  describe("Race Status Poller", () => {
    describe("when there is raceStatus", () => {
      describe("and is visible", () => {
        it("should call dispatchSubscribeRaceUpdates when rendering", () => {
          renderRaceDetailsCard({ ...raceDetailsCardProps, visible: true });

          expect(raceDetailsCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledTimes(1);
          expect(raceDetailsCardProps.dispatchSubscribeRaceUpdates).toHaveBeenCalledWith("race:12345");
        });

        it("should call dispatchUnsubscribeRaceUpdates when RaceDetailsCard unmounts", () => {
          const dispatchUnsubscribeRaceUpdates = jest.fn();
          const { unmount } = renderRaceDetailsCard({
            ...raceDetailsCardProps,
            dispatchUnsubscribeRaceUpdates,
            visible: true,
          });

          act(() => {
            unmount();
          });

          expect(dispatchUnsubscribeRaceUpdates).toHaveBeenCalledTimes(1);
          expect(dispatchUnsubscribeRaceUpdates).toHaveBeenCalledWith("race:12345");
        });
      });

      describe("and is not visible", () => {
        it("should not call dispatchSubscribeRaceUpdates when rendering", () => {
          renderRaceDetailsCard({ ...raceDetailsCardProps, visible: false });

          expect(raceDetailsCardProps.dispatchSubscribeRaceUpdates).not.toHaveBeenCalled();
        });

        it("should not call dispatchUnsubscribeRaceUpdates when RaceDetailsCard unmounts", () => {
          const dispatchUnsubscribeRaceUpdates = jest.fn();
          const { unmount } = renderRaceDetailsCard({
            ...raceDetailsCardProps,
            dispatchUnsubscribeRaceUpdates,
            visible: false,
          });

          act(() => {
            unmount();
          });

          expect(dispatchUnsubscribeRaceUpdates).not.toHaveBeenCalledWith();
        });
      });
    });

    describe("when there is NO raceStatus", () => {
      renderRaceDetailsCard({
        ...raceDetailsCardProps,
        raceStatus: undefined,
      });

      it("should NOT call dispatchSubscribeRaceUpdates", () => {
        expect(raceDetailsCardProps.dispatchSubscribeRaceUpdates).not.toHaveBeenCalled();
      });

      it("should NOT call dispatchUnsubscribeRaceUpdates", () => {
        expect(raceDetailsCardProps.dispatchUnsubscribeRaceUpdates).not.toHaveBeenCalled();
      });
    });
  });
});
