import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { FixtureTeamSide } from "@ppb/the-wall-common/types";
import { CardNotificationType } from "../MinuteIncidents/snowflakes/CardNotification/CardNotification.types";
import { MinuteIncidentsEventType } from "../MinuteIncidents/MinuteIncidents.types";
import { MinuteIncidents } from "../MinuteIncidents/MinuteIncidents.web";
import { TEST_ID } from "./MinuteByMinute.web.selectors";
import styles from "./MinuteByMinute.web.module.css";
import { MinuteByMinute } from "./MinuteByMinute.web";

function renderMinuteByMinute(minutesIncidents) {
  const { container } = render(<MinuteByMinute incidents={minutesIncidents} />);
  return container.querySelector(TEST_ID);
}

jest.mock("../MinuteIncidents/MinuteIncidents.web", () => ({
  MinuteIncidents: jest.fn(() => <minuteIncidents-mock />),
  MinuteIncidentsEventType: {
    CARD: "CARD",
    GOAL: "GOAL",
    SUBSTITUTION: "SUBSTITUTION",
    TEAM: "TEAM",
  },
}));

const minuteIncidents = [
  {
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
    ],
  },
  {
    minute: 30,
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
  },
  {
    minute: 80,
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
  },
];

const oneIncident = [
  {
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
  },
];

describe("Minute By Minute", () => {
  it("should have minute by minute component rendered", () => {
    const minuteComponent = renderMinuteByMinute(minuteIncidents);
    expect(minuteComponent).toHaveClass(styles.minuteByMinuteContainer);
  });
  it("one incident is displayed", () => {
    jest.clearAllMocks();
    renderMinuteByMinute(oneIncident);
    expect(MinuteIncidents.mock.calls.length).toBe(1);
  });

  it("3 minutes with incidents are displayed", () => {
    jest.clearAllMocks();
    renderMinuteByMinute(minuteIncidents);
    expect(MinuteIncidents.mock.calls.length).toBe(3);
  });

  it("module displayed with right elements", () => {
    jest.clearAllMocks();

    renderMinuteByMinute(oneIncident);

    expect(MinuteIncidents.mock.calls[0][0]).toEqual({
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
    });
  });
});
