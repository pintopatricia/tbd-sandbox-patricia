import { FixtureTeamSide, IncidentIconType } from "@ppb/the-wall-common/types";
import { render } from "@testing-library/react-native";
import { IncidentIcon } from "@ppb/the-wall-native";
import { CardNotification } from "./CardNotification.native";
import {
  CARD_NOTIFICATION,
  CARD_NOTIFICATION_TITLE,
  CARD_NOTIFICATION_DESCRIPTION,
} from "./CardNotification.native.selectors";
import styles from "./CardNotification.native.styles";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
  heights: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  IncidentIcon: jest.fn(() => <incident-icon-mock />),
  Text: jest.requireActual("react-native").Text,
}));

function renderCardNotification({ title, description, cardType, side }) {
  return render(<CardNotification title={title} description={description} cardType={cardType} side={side} />);
}

describe("Card Notification", () => {
  afterEach(jest.clearAllMocks);

  describe("Home Card Notification", () => {
    const side = FixtureTeamSide.HOME;

    it("should render a Home RedCard", () => {
      const { queryByTestId } = renderCardNotification({
        cardType: "RED",
        side,
        title: "TITLE",
        description: "DESCRIPTION",
      });

      expect(queryByTestId(CARD_NOTIFICATION_TITLE)).toHaveTextContent("TITLE");
      expect(queryByTestId(CARD_NOTIFICATION_DESCRIPTION)).toHaveTextContent("DESCRIPTION");
      expect(queryByTestId(CARD_NOTIFICATION)).toHaveStyle([styles.cardNotification, styles.cardHome]);
      expect(IncidentIcon.mock.calls[0][0]).toEqual({ type: IncidentIconType.RED_CARD });
    });

    it("should render a Home YellowCard", () => {
      const { queryByTestId } = renderCardNotification({
        cardType: "YELLOW",
        side,
        title: "TITLE",
        description: "DESCRIPTION",
      });

      expect(queryByTestId(CARD_NOTIFICATION_TITLE)).toHaveTextContent("TITLE");
      expect(queryByTestId(CARD_NOTIFICATION_DESCRIPTION)).toHaveTextContent("DESCRIPTION");
      expect(queryByTestId(CARD_NOTIFICATION)).toHaveStyle([styles.cardNotification, styles.cardHome]);
      expect(IncidentIcon.mock.calls[0][0]).toEqual({ type: IncidentIconType.YELLOW_CARD });
    });

    it("should render a Home SecondYellowCard", () => {
      const { queryByTestId } = renderCardNotification({
        cardType: "SECOND_YELLOW",
        side,
        title: "TITLE",
        description: "DESCRIPTION",
      });

      expect(queryByTestId(CARD_NOTIFICATION_TITLE)).toHaveTextContent("TITLE");
      expect(queryByTestId(CARD_NOTIFICATION_DESCRIPTION)).toHaveTextContent("DESCRIPTION");
      expect(queryByTestId(CARD_NOTIFICATION)).toHaveStyle([styles.cardNotification, styles.cardHome]);
      expect(IncidentIcon.mock.calls[0][0]).toEqual({ type: IncidentIconType.SECOND_YELLOW_CARD });
    });
  });

  describe("Away Card Notification", () => {
    const side = FixtureTeamSide.AWAY;

    it("should render an Away RedCard", () => {
      const { queryByTestId } = renderCardNotification({
        cardType: "RED",
        side,
        title: "TITLE",
        description: "DESCRIPTION",
      });

      expect(queryByTestId(CARD_NOTIFICATION_TITLE)).toHaveTextContent("TITLE");
      expect(queryByTestId(CARD_NOTIFICATION_DESCRIPTION)).toHaveTextContent("DESCRIPTION");
      expect(queryByTestId(CARD_NOTIFICATION)).toHaveStyle([styles.cardNotification, styles.cardAway]);
      expect(IncidentIcon.mock.calls[0][0]).toEqual({ type: IncidentIconType.RED_CARD });
    });

    it("should render an Away YellowCard", () => {
      const { queryByTestId } = renderCardNotification({
        cardType: "YELLOW",
        side,
        title: "TITLE",
        description: "DESCRIPTION",
      });

      expect(queryByTestId(CARD_NOTIFICATION_TITLE)).toHaveTextContent("TITLE");
      expect(queryByTestId(CARD_NOTIFICATION_DESCRIPTION)).toHaveTextContent("DESCRIPTION");
      expect(queryByTestId(CARD_NOTIFICATION)).toHaveStyle([styles.cardNotification, styles.cardAway]);
      expect(IncidentIcon.mock.calls[0][0]).toEqual({ type: IncidentIconType.YELLOW_CARD });
    });

    it("should render an Away SecondYellowCard", () => {
      const { queryByTestId } = renderCardNotification({
        cardType: "SECOND_YELLOW",
        side,
        title: "TITLE",
        description: "DESCRIPTION",
      });

      expect(queryByTestId(CARD_NOTIFICATION_TITLE)).toHaveTextContent("TITLE");
      expect(queryByTestId(CARD_NOTIFICATION_DESCRIPTION)).toHaveTextContent("DESCRIPTION");
      expect(queryByTestId(CARD_NOTIFICATION)).toHaveStyle([styles.cardNotification, styles.cardAway]);
      expect(IncidentIcon.mock.calls[0][0]).toEqual({ type: IncidentIconType.SECOND_YELLOW_CARD });
    });
  });
});
