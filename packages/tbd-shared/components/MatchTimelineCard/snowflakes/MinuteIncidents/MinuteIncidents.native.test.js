import { render, waitFor } from "@testing-library/react-native";

import { FixtureTeamSide } from "@ppb/the-wall-common/types";

import { CardNotificationType } from "./snowflakes/CardNotification/CardNotification.types";
import { CardNotification } from "./snowflakes/CardNotification/CardNotification.native";
import { GoalNotification } from "./snowflakes/GoalNotification/GoalNotification.native";
import { Notification } from "./snowflakes/TimelineNotification/Notification.native";
import { SubstitutionNotification } from "./snowflakes/SubstitutionNotification/SubstitutionNotification.native";
import { TeamNotification } from "./snowflakes/TeamNotification/TeamNotification.native";
import { MinuteIncidentsEventType } from "./MinuteIncidents.types";
import { MinuteIncidents } from "./MinuteIncidents.native";
import { TIME_LABEL, EXTRA_TIME_LABEL } from "./MinuteIncidents.native.selectors";

jest.mock("./snowflakes/CardNotification/CardNotification.native", () => ({
  CardNotification: jest.fn(({ children, ...props }) => (
    <card-notification-mock {...props}>{children}</card-notification-mock>
  )),
  CardNotificationType: {
    RED: "RED",
    YELLOW: "YELLOW",
    SECOND_YELLOW: "SECOND_YELLOW",
  },
}));
jest.mock("./snowflakes/GoalNotification/GoalNotification.native", () => ({
  GoalNotification: jest.fn(({ children, ...props }) => (
    <goal-notification-mock {...props}>{children}</goal-notification-mock>
  )),
}));

jest.mock("./snowflakes/SubstitutionNotification/SubstitutionNotification.native", () => ({
  SubstitutionNotification: jest.fn(({ children, ...props }) => (
    <substitution-notification-mock {...props}>{children}</substitution-notification-mock>
  )),
}));
jest.mock("./snowflakes/TeamNotification/TeamNotification.native", () => ({
  TeamNotification: jest.fn(({ children, ...props }) => (
    <team-notification-mock {...props}>{children}</team-notification-mock>
  )),
}));
jest.mock("./snowflakes/TimelineNotification/Notification.native", () => ({
  Notification: jest.fn(({ children, ...props }) => <notification-mock {...props}>{children}</notification-mock>),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderMinuteIncidents({ minute, extraTimeMinute, events }) {
  return render(<MinuteIncidents minute={minute} extraTimeMinute={extraTimeMinute} events={events} />);
}

describe("MinuteIncidents", () => {
  beforeEach(jest.clearAllMocks);

  it("should create the minute container with time and the passed incidents", async () => {
    const { queryByTestId } = renderMinuteIncidents({
      minute: 90,
      extraTimeMinute: 2,
      events: [
        {
          notificationEventType: MinuteIncidentsEventType.GOAL,
          notificationEventProps: {
            title: "Goal",
            side: FixtureTeamSide.AWAY,
            description: "goal description",
            secondDescription: "secondDescription",
          },
        },
        {
          notificationEventType: MinuteIncidentsEventType.NOTIFICATION,
          notificationEventProps: {
            title: "Goal",
            description: "goal description",
            secondDescription: "secondDescription",
          },
        },
        {
          notificationEventType: MinuteIncidentsEventType.CARD,
          notificationEventProps: {
            title: "Card",
            side: FixtureTeamSide.HOME,
            description: "yellow card description",
            secondDescription: "secondDescription",
            cardType: CardNotificationType.YELLOW,
          },
        },
        {
          notificationEventType: MinuteIncidentsEventType.SUBSTITUTION,
          notificationEventProps: {
            title: "Substitution",
            side: FixtureTeamSide.AWAY,
            playerIn: "playerIn",
            playerOut: "playerOut",
          },
        },
        {
          notificationEventType: MinuteIncidentsEventType.SUBSTITUTION,
          notificationEventProps: {
            title: "Substitution home",
            side: FixtureTeamSide.HOME,
            playerIn: "playerIn",
            playerOut: "playerOut",
          },
        },
        {
          notificationEventType: MinuteIncidentsEventType.TEAM,
          notificationEventProps: {
            title: "Team notification",
            side: FixtureTeamSide.AWAY,
            description: "notification description",
            secondDescription: "secondDescription",
          },
        },
      ],
    });
    expect(Notification).toHaveBeenCalled();
    expect(CardNotification).toHaveBeenCalled();
    expect(GoalNotification).toHaveBeenCalled();
    expect(SubstitutionNotification).toHaveBeenCalled();
    expect(TeamNotification).toHaveBeenCalled();
    await waitFor(() => expect(queryByTestId(TIME_LABEL)).toBeTruthy());
    await waitFor(() => expect(queryByTestId(EXTRA_TIME_LABEL)).toBeTruthy());
  });

  describe("when no extra time is passed", () => {
    it("should not render extra time label", async () => {
      const { queryByTestId } = renderMinuteIncidents({
        minute: 90,
        events: [
          {
            notificationEventType: MinuteIncidentsEventType.GOAL,
            notificationEventProps: {
              title: "Goal",
              side: FixtureTeamSide.AWAY,
              description: "goal description",
              secondDescription: "secondDescription",
            },
          },
        ],
      });
      await waitFor(() => expect(queryByTestId(TIME_LABEL)).toBeTruthy());
      await waitFor(() => expect(queryByTestId(EXTRA_TIME_LABEL)).toBe(null));
    });
  });

  describe("when minute props are not valid", () => {
    it("should not render the time labels", async () => {
      const { queryByTestId } = renderMinuteIncidents({ minute: -1, events: [] });
      await waitFor(() => expect(queryByTestId(TIME_LABEL)).toBe(null));
      await waitFor(() => expect(queryByTestId(EXTRA_TIME_LABEL)).toBe(null));
    });
  });

  describe("when first incident is notification", () => {
    it("should not render minutes container", async () => {
      const { queryByTestId } = renderMinuteIncidents({
        minute: 90,
        events: [
          {
            notificationEventType: MinuteIncidentsEventType.NOTIFICATION,
            notificationEventProps: {
              title: "Goal",
              description: "goal description",
              secondDescription: "secondDescription",
            },
          },
        ],
      });

      expect(Notification).toHaveBeenCalled();
      await waitFor(() => expect(queryByTestId(TIME_LABEL)).toBe(null));
      await waitFor(() => expect(queryByTestId(EXTRA_TIME_LABEL)).toBe(null));
    });
  });
});
