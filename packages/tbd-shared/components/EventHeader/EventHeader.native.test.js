import { render } from "@testing-library/react-native";

import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { EventHeader as EventHeaderComponent } from "@ppb/the-wall-native";

import EventHeader from "./EventHeader.native";
import ConnectedNotificationsSubscription from "../NotificationsSubscription";
import { NotificationsViewMode } from "../NotificationsSubscription/map-to-props-factory";
import NotificationsSubscription from "../NotificationsSubscription/NotificationsSubscription.native";

jest.mock("../NotificationsSubscription", () =>
  jest.fn((props) => <connected-notification-subscription-mock {...props} />),
);

jest.mock("../NotificationsSubscription/NotificationsSubscription.native", () =>
  jest.fn(() => <notification-subscription-mock />),
);

jest.mock("@ppb/the-wall-native", () => ({
  EventHeader: jest.fn((props) => (
    <>
      {props.notificationsSubscription}
      <event-header-mock />
    </>
  )),
}));

jest.mock("../../hooks/useDebounce", () => jest.fn().mockImplementation(() => "inPlay"));

jest.mock("react-native-device-info", () => ({}));

const PROPS = {
  title: "title",
  subtitle: "subtitle",
  inPlay: "inPlay",
  tertiaryTitle: "tertiaryTitle",
  isSticky: false,
  showBorder: true,
  viewMode: "DEFAULT",
  homeRunnerName: "home runner",
  awayRunnerName: "away runner",
  date: "yesterday",
  time: "03:90",
  iconsList: [IconsList.NINETY_MINUTE_PAYOUT],
  showHorizontalDuration: false,
};

function renderEventHeader(props = PROPS) {
  return render(<EventHeader {...props}></EventHeader>);
}

describe("EventHeader", () => {
  beforeEach(jest.clearAllMocks);

  it("should render event header component with the correct props", () => {
    renderEventHeader();

    expect(EventHeaderComponent).toHaveBeenCalledWith(
      {
        awayRunnerName: "away runner",
        date: "yesterday",
        homeRunnerName: "home runner",
        inPlay: "inPlay",
        isSticky: false,
        showBorder: true,
        notificationsSubscription: undefined,
        subtitle: "subtitle",
        tertiaryTitle: "tertiaryTitle",
        time: "03:90",
        title: "title",
        viewMode: "DEFAULT",
        iconsList: [IconsList.NINETY_MINUTE_PAYOUT],
        showHorizontalDuration: false,
      },
      undefined,
    );
  });

  describe("when availableToSubscribe is true", () => {
    describe("when sporteventURN is available", () => {
      it("should sent NotificationsSubscription component to Event Header component", () => {
        renderEventHeader({ ...PROPS, availableToSubscribe: true, sporteventURN: "sport:event:urn" });

        expect(EventHeaderComponent).toHaveBeenCalledWith(
          {
            awayRunnerName: "away runner",
            date: "yesterday",
            homeRunnerName: "home runner",
            inPlay: "inPlay",
            isSticky: false,
            showBorder: true,
            notificationsSubscription: expect.any(Object),
            subtitle: "subtitle",
            tertiaryTitle: "tertiaryTitle",
            time: "03:90",
            title: "title",
            viewMode: "DEFAULT",
            iconsList: [IconsList.NINETY_MINUTE_PAYOUT],
            showHorizontalDuration: false,
          },
          undefined,
        );

        expect(ConnectedNotificationsSubscription).toHaveBeenCalledWith(
          {
            viewMode: NotificationsViewMode.EVENT_OR_RACE,
            component: NotificationsSubscription,
          },
          undefined,
        );
      });
    });

    describe("when sporteventURN is not available", () => {
      it("should not sent notificationsSubscription to Event Header component", () => {
        renderEventHeader({ ...PROPS, availableToSubscribe: true, sporteventURN: undefined });

        expect(EventHeaderComponent).toHaveBeenCalledWith(
          {
            awayRunnerName: "away runner",
            date: "yesterday",
            homeRunnerName: "home runner",
            inPlay: "inPlay",
            isSticky: false,
            showBorder: true,
            notificationsSubscription: undefined,
            subtitle: "subtitle",
            tertiaryTitle: "tertiaryTitle",
            time: "03:90",
            title: "title",
            viewMode: "DEFAULT",
            iconsList: [IconsList.NINETY_MINUTE_PAYOUT],
            showHorizontalDuration: false,
          },
          undefined,
        );
      });
    });
  });

  describe("when availableToSubscribe is false", () => {
    it("should not sent notificationsSubscription to Event Header component", () => {
      renderEventHeader({ ...PROPS, availableToSubscribe: false });

      expect(EventHeaderComponent).toHaveBeenCalledWith(
        {
          awayRunnerName: "away runner",
          date: "yesterday",
          homeRunnerName: "home runner",
          inPlay: "inPlay",
          isSticky: false,
          showBorder: true,
          notificationsSubscription: undefined,
          subtitle: "subtitle",
          tertiaryTitle: "tertiaryTitle",
          time: "03:90",
          title: "title",
          viewMode: "DEFAULT",
          iconsList: [IconsList.NINETY_MINUTE_PAYOUT],
          showHorizontalDuration: false,
        },
        undefined,
      );
    });
  });
});
