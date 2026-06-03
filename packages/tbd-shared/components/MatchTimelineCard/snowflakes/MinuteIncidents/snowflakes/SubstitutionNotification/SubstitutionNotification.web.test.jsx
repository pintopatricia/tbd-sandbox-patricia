import "jest-dom/extend-expect";
import { FixtureTeamSide, IncidentIconType } from "@ppb/the-wall-common/types";
import { render } from "@testing-library/react";
import { IncidentIcon } from "@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon";
import { SubstitutionNotification } from "./SubstitutionNotification.web";

import { TEST_ID, DESCRIPTION } from "./SubstitutionNotification.web.selectors";
import styles from "./SubstitutionNotification.web.css";

function renderNotification({ title = "Substitution", playerIn = "", playerOut = "", side = FixtureTeamSide.HOME }) {
  const { container } = render(
    <SubstitutionNotification title={title} playerIn={playerIn} playerOut={playerOut} side={side} />,
  );
  return container.querySelector(TEST_ID);
}

jest.mock("@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon", () => ({
  IncidentIcon: jest.fn(() => <incident-icon-mock />),
}));

describe("Match Timeline - Substitution Event", () => {
  it("should have the title only", () => {
    const expected = renderNotification({});
    expect(expected).toHaveTextContent("Substitution");
    expect(expected.querySelector(DESCRIPTION)).toBeNull();
    expect(expected).toHaveClass(styles.home);
  });

  it("should have been displayed with playerIn and playerOut", () => {
    const expected = renderNotification({
      title: "Substitution",
      playerIn: "PlayerIn",
      playerOut: "PlayerOut",
      side: FixtureTeamSide.AWAY,
    });
    expect(expected).toHaveClass(styles.away);
    expect(expected).toHaveTextContent("Substitution");
    expect(IncidentIcon.mock.calls[0][0]).toEqual({ type: IncidentIconType.SUBSTITUTION_IN });
    expect(IncidentIcon.mock.calls[1][0]).toEqual({ type: IncidentIconType.SUBSTITUTION_OUT });
  });
});
