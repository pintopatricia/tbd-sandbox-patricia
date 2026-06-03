import { render, act } from "@testing-library/react";
import { SystemIconName } from "@ppb/the-wall-icons";
import "jest-dom/extend-expect";
import { MatchStatSelection } from "./MatchStatSelection.web";
import { TEST_ID, ICON, TITLE, SUBTITLE } from "./MatchStatSelection.web.selectors";
import styles from "./MatchStatSelection.web.css";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

function renderMatchStatSelection(
  title = {
    playerNames: ["Player 1", "Player 2"],
    combiner: "AND",
  },
  subtitle = "To become friends",
  stats = "They both have 3 friends each",
  icon = SystemIconName.ACC_SUBTRACT,
) {
  const transformedTitle = `${title.playerNames.join(` ${title.combiner} `)}`;
  return render(<MatchStatSelection title={transformedTitle} subtitle={subtitle} stats={stats} icon={icon} />);
}

describe("MatchStatSelection", () => {
  it("should render the card with the correct styling", async () => {
    let container;
    await act(async () => {
      const result = await renderMatchStatSelection();
      container = result.container;
    });

    const matchStatSelection = container.querySelector(TEST_ID);
    expect(matchStatSelection).not.toBeNull();
    expect(matchStatSelection).toHaveClass(styles.matchStatSelectionCardContainer);
  });

  it("should display the title with the correct styling", async () => {
    let container;
    await act(async () => {
      const result = await renderMatchStatSelection();
      container = result.container;
    });

    const title = container.querySelector(TITLE);

    expect(title).toBeVisible();
    expect(title).toHaveTextContent("Player 1 AND Player 2");
    expect(title).toHaveClass(styles.title);
  });

  it("should display the subtitle with the correct styling", async () => {
    let container;
    await act(async () => {
      const result = await renderMatchStatSelection();
      container = result.container;
    });

    const subtitle = container.querySelector(SUBTITLE);

    expect(subtitle).toBeVisible();
    expect(subtitle).toHaveTextContent("To become friends");
    expect(subtitle).toHaveClass(styles.subtitle);
  });

  it("should display the icon with the correct styling", async () => {
    let container;
    await act(async () => {
      const result = await renderMatchStatSelection();
      container = result.container;
    });

    const icon = container.querySelector(ICON);

    expect(icon).toBeVisible();
    expect(icon).toHaveClass(styles.icon);
  });

  it("should not display the icon", async () => {
    let container;
    await act(async () => {
      const result = await renderMatchStatSelection(undefined, undefined, undefined, null);
      container = result.container;
    });

    const icon = container.querySelector(ICON);

    expect(icon).toBeNull();
  });
});
