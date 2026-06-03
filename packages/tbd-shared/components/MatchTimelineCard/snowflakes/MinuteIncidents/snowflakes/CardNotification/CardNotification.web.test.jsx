import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { FixtureTeamSide, IncidentIconType } from "@ppb/the-wall-common/types";
import { IncidentIcon } from "@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon";
import { CardNotification } from "./CardNotification.web";

import { CardNotificationType } from "./CardNotification.types";
import { TEST_ID, DESCRIPTION, CARD_ICON, TITLE } from "./CardNotification.web.selectors";
import styles from "./CardNotification.web.css";

function renderNotification({
  title = "",
  description = "",
  cardType = CardNotificationType.YELLOW,
  side = FixtureTeamSide.HOME,
}) {
  const { container } = render(
    <CardNotification title={title} description={description} cardType={cardType} side={side} />,
  );
  return container.querySelector(TEST_ID);
}

jest.mock("@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon", () => ({
  IncidentIcon: jest.fn(() => <incident-icon-mock />),
}));

beforeEach(jest.clearAllMocks);

describe("Match Timeline - Card TeamNotification", () => {
  it("should have the title", () => {
    const expected = renderNotification({ title: "Card Notification" });
    expect(expected).toHaveTextContent("Card Notification");
    expect(expected).toHaveClass(styles.home);
  });

  it("should have Description", () => {
    const announcement = renderNotification({ title: "Card Notification", description: "description" });
    const expected = announcement.querySelector(DESCRIPTION);
    expect(expected).toHaveTextContent("description");
  });

  it("should have empty title and description", () => {
    const announcement = renderNotification({});
    expect(announcement.querySelector(TITLE)).toBeEmpty();
    expect(announcement.querySelector(DESCRIPTION)).toBeNull();
  });

  describe("Card Event Type", () => {
    it("should have the red card item", () => {
      const expected = renderNotification({
        title: "Red Card",
        cardType: CardNotificationType.RED,
        side: FixtureTeamSide.AWAY,
        description: "De Vrij",
      });
      expect(expected).toHaveClass(styles.away);
      expect(expected.querySelector(CARD_ICON)).not.toBeEmpty();
      expect(IncidentIcon.mock.calls[0][0]).toEqual({ type: IncidentIconType.RED_CARD });
    });

    it("should have yellow card item", () => {
      const expected = renderNotification({
        title: "YELLOW Card",
        cardType: CardNotificationType.YELLOW,
        side: FixtureTeamSide.HOME,
        description: "De Vrij",
      });
      expect(expected).toHaveClass(styles.home);

      expect(expected.querySelector(CARD_ICON)).not.toBeEmpty();
      expect(IncidentIcon.mock.calls[0][0]).toEqual({ type: IncidentIconType.YELLOW_CARD });
    });

    it("should have second yellow card item", () => {
      const expected = renderNotification({
        title: "Second YELLOW Card",
        cardType: CardNotificationType.SECOND_YELLOW,
        side: FixtureTeamSide.HOME,
        description: "De Vrij",
      });
      expect(expected).toHaveClass(styles.home);

      expect(expected.querySelector(CARD_ICON)).not.toBeEmpty();
      expect(IncidentIcon.mock.calls[0][0]).toEqual({ type: IncidentIconType.SECOND_YELLOW_CARD });
    });
  });
});
