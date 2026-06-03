import { render, waitFor } from "@testing-library/react-native";

import { FixtureTeamSide } from "@ppb/the-wall-common/types";

import { CardNotificationType } from "../MinuteIncidents/snowflakes/CardNotification/CardNotification.types";
import { MinuteIncidentsEventType } from "../MinuteIncidents/MinuteIncidents.types";
import { MinuteIncidents } from "../MinuteIncidents/MinuteIncidents.native";
import { MinuteByMinute } from "./MinuteByMinute.native";
import {
  MINUTE_BY_MINUTE_CONTAINER,
  MINUTE_BY_MINUTE_SEPARATOR,
  MINUTE_INCIDENTS_CONTAINER,
  MINUTE_INCIDENT_CONTAINER,
} from "./MinuteByMinute.native.selectors";
import styles from "./MinuteByMinute.native.styles";

jest.mock("../MinuteIncidents/MinuteIncidents.native", () => ({
  MinuteIncidents: jest.fn(({ children, ...props }) => <minute-incidents {...props}>{children}</minute-incidents>),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
}));

function renderMinuteByMinute({ incidents, lineExtensionStyle }) {
  return render(<MinuteByMinute incidents={incidents} lineExtensionStyle={lineExtensionStyle} />);
}

const incidentsMock = [
  {
    minute: 10,
    events: [
      {
        notificationEventType: MinuteIncidentsEventType.CARD,
        notificationEventProps: {
          title: "Card",
          side: FixtureTeamSide.HOME,
          description: "yellow card description",
          cardType: CardNotificationType.YELLOW,
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
          description: "red card description",
          cardType: CardNotificationType.RED,
        },
      },
    ],
  },
];

describe("MinuteByMinute", () => {
  beforeEach(jest.clearAllMocks);

  it("should display the minute by minute container", async () => {
    const { queryByTestId } = renderMinuteByMinute({ incidents: incidentsMock });

    await waitFor(() => expect(queryByTestId(MINUTE_BY_MINUTE_CONTAINER)).toBeTruthy());
  });

  it("should display the minute by minute separator", async () => {
    const { queryByTestId } = renderMinuteByMinute({ incidents: incidentsMock });

    await waitFor(() => expect(queryByTestId(MINUTE_BY_MINUTE_SEPARATOR)).toBeTruthy());
  });

  it("should draw the minute incidents container with the correct styling", () => {
    const lineExtensionStyle = { marginTop: 1 };
    const { queryByTestId } = renderMinuteByMinute({ incidents: incidentsMock, lineExtensionStyle });

    expect(queryByTestId(MINUTE_INCIDENTS_CONTAINER)).toHaveStyle([
      styles.minuteIncidentsContainer,
      lineExtensionStyle,
    ]);
  });

  it("should create a MinuteIncidentContainer for each incident with the correct styling", () => {
    const { queryAllByTestId } = renderMinuteByMinute({ incidents: incidentsMock });
    const minuteIncidentContainers = queryAllByTestId(MINUTE_INCIDENT_CONTAINER);

    expect(minuteIncidentContainers.length).toBe(2);
    expect(minuteIncidentContainers[0]).toHaveStyle(null);
    expect(minuteIncidentContainers[1]).toHaveStyle(styles.minuteIncident);
  });

  it("should instantiate a MinuteIncident component for every incidents", () => {
    renderMinuteByMinute({ incidents: incidentsMock });

    expect(MinuteIncidents).toHaveBeenCalledTimes(2);
    expect(MinuteIncidents).toHaveBeenNthCalledWith(
      1,
      {
        events: [
          {
            notificationEventProps: {
              cardType: "YELLOW",
              description: "yellow card description",
              side: "HOME",
              title: "Card",
            },
            notificationEventType: "CARD",
          },
        ],
        extraTimeMinute: undefined,
        minute: 10,
      },
      undefined,
    );
    expect(MinuteIncidents).toHaveBeenNthCalledWith(
      2,
      {
        events: [
          {
            notificationEventProps: {
              cardType: "RED",
              description: "red card description",
              side: "HOME",
              title: "Card",
            },
            notificationEventType: "CARD",
          },
        ],
        extraTimeMinute: undefined,
        minute: 30,
      },
      undefined,
    );
  });
});
