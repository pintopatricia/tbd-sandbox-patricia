import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { FixtureTeamSide } from "@ppb/the-wall-common/types";

import { GoalNotification } from "./snowflakes/GoalNotification/GoalNotification.web";
import { CardNotificationType } from "./snowflakes/CardNotification/CardNotification.types";
import { CardNotification } from "./snowflakes/CardNotification/CardNotification.web";
import { Notification } from "./snowflakes/TimelineNotification/Notification.web";
import { SubstitutionNotification } from "./snowflakes/SubstitutionNotification/SubstitutionNotification.web";
import { TeamNotification } from "./snowflakes/TeamNotification/TeamNotification.web";
import { TEST_ID, MINUTE_LINE, SIDES, MINUTE, EXTRA_TIME } from "./MinuteIncidents.web.selectors";
import styles from "./MinuteIncidents.web.css";
import { MinuteIncidentsEventType } from "./MinuteIncidents.types";
import { MinuteIncidents } from "./MinuteIncidents.web";

function renderMinuteIncidents(minuteIncidents) {
  const { container } = render(
    <MinuteIncidents
      minute={minuteIncidents.minute}
      extraTimeMinute={minuteIncidents.extraTimeMinute}
      events={minuteIncidents.events}
    />,
  );
  return container.querySelector(TEST_ID);
}

jest.mock("./snowflakes/CardNotification/CardNotification.web", () => ({
  CardNotification: jest.fn(() => <cardNotification-mock />),
  CardNotificationType: {
    RED: "RED",
    YELLOW: "YELLOW",
    SECOND_YELLOW: "SECOND_YELLOW",
  },
}));

jest.mock("./snowflakes/GoalNotification/GoalNotification.web", () => ({
  GoalNotification: jest.fn(() => <goalNotification-mock />),
}));

jest.mock("./snowflakes/SubstitutionNotification/SubstitutionNotification.web", () => ({
  SubstitutionNotification: jest.fn(() => <substitutionNotification-mock />),
}));
jest.mock("./snowflakes/TeamNotification/TeamNotification.web", () => ({
  TeamNotification: jest.fn(() => <teamNotification-mock />),
}));
jest.mock("./snowflakes/TimelineNotification/Notification.web", () => ({
  Notification: jest.fn(() => <notification-mock />),
}));

const minuteIncidents = {
  minute: 10,
  events: [
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
      notificationEventType: MinuteIncidentsEventType.GOAL,
      notificationEventProps: {
        title: "Goal",
        side: FixtureTeamSide.AWAY,
        description: "goal description",
        secondDescription: "secondDescription",
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
      notificationEventType: MinuteIncidentsEventType.TEAM,
      notificationEventProps: {
        title: "Team notification",
        side: FixtureTeamSide.AWAY,
        description: "notification description",
        secondDescription: "secondDescription",
      },
    },
    {
      notificationEventType: MinuteIncidentsEventType.NOTIFICATION,
      notificationEventProps: {
        title: "General notification",
        description: "notification description",
        secondDescription: "secondDescription",
      },
    },
  ],
};

describe("MinuteIncidents", () => {
  it("should have minute component rendered", () => {
    const minuteComponent = renderMinuteIncidents(minuteIncidents);
    expect(minuteComponent).toHaveClass(styles.footballTimelineMinute);
  });
  it("one incident is displayed on left side with correct content", () => {
    jest.clearAllMocks();
    const oneIncident = {
      minute: 90,
      events: [
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
      ],
    };
    const result = renderMinuteIncidents(oneIncident);
    expect(result.querySelector(MINUTE_LINE)).not.toBeNull();
    expect(result.querySelectorAll(SIDES).item(0)).not.toBeNull();
    expect(result.querySelectorAll(SIDES).item(1)).toHaveTextContent("");
    expect(result.querySelector(MINUTE)).toHaveTextContent("90'");
    expect(CardNotification.mock.calls.length).toBe(1);
    expect(GoalNotification.mock.calls.length).toBe(0);
    expect(SubstitutionNotification.mock.calls.length).toBe(0);
    expect(TeamNotification.mock.calls.length).toBe(0);
    expect(Notification.mock.calls.length).toBe(0);
  });
  it("extra time value is displayed", () => {
    jest.clearAllMocks();
    const oneIncident = {
      minute: 90,
      extraTimeMinute: 2,
      events: [
        {
          notificationEventType: MinuteIncidentsEventType.CARD,
          notificationEventProps: {
            title: "Card",
            side: FixtureTeamSide.AWAY,
            description: "yellow card description",
            secondDescription: "secondDescription",
            cardType: CardNotificationType.YELLOW,
          },
        },
      ],
    };
    const result = renderMinuteIncidents(oneIncident);
    expect(result.querySelector(EXTRA_TIME)).toHaveTextContent("+2'");
  });
  it("4 different incident types are displayed", () => {
    jest.clearAllMocks();
    renderMinuteIncidents(minuteIncidents);
    expect(CardNotification.mock.calls.length).toBe(1);
    expect(GoalNotification.mock.calls.length).toBe(1);
    expect(SubstitutionNotification.mock.calls.length).toBe(1);
    expect(TeamNotification.mock.calls.length).toBe(1);
    expect(Notification.mock.calls.length).toBe(1);
  });

  it("module displayed with right elements", () => {
    jest.clearAllMocks();
    renderMinuteIncidents(minuteIncidents);
    expect(CardNotification.mock.calls[0][0]).toEqual({
      title: "Card",
      side: FixtureTeamSide.HOME,
      description: "yellow card description",
      secondDescription: "secondDescription",
      cardType: CardNotificationType.YELLOW,
    });
    expect(GoalNotification.mock.calls[0][0]).toEqual({
      title: "Goal",
      side: FixtureTeamSide.AWAY,
      description: "goal description",
      secondDescription: "secondDescription",
    });
    expect(SubstitutionNotification.mock.calls[0][0]).toEqual({
      title: "Substitution",
      side: FixtureTeamSide.AWAY,
      playerIn: "playerIn",
      playerOut: "playerOut",
    });

    expect(TeamNotification.mock.calls[0][0]).toEqual({
      title: "Team notification",
      side: FixtureTeamSide.AWAY,
      description: "notification description",
      secondDescription: "secondDescription",
    });
    expect(Notification.mock.calls[0][0]).toEqual({
      title: "General notification",
      description: "notification description",
      secondDescription: "secondDescription",
    });
  });
});
