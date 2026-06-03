import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import ObbOnboardingCard from "./ObbOnboardingCard.web";
import ConnectedObbBetButton from "../ObbBetButton";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

jest.mock("../ObbBetButton", () => jest.fn(({ legId }) => <div data-testid="bet-button" data-leg-id={legId} />));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  ...jest.requireActual("@ppb/the-wall-icons/GenericIcon/GenericIcon"),
  GenericIcon: jest.fn(({ name }) => <span data-testid="generic-icon" data-icon-name={name} />),
}));

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  getLayoutMetadata: jest.fn(() => ({ tabName: "test-tab", cardGroupTitle: "test-group" })),
}));

const defaultParticipant = {
  urn: "ppb:obb:footballPlayer:1/e/1",
  name: "John Smith",
  jersey: "https://example.com/jersey.png",
};

const defaultEvent = {
  urn: "ppb:event:1",
  name: "Team A vs Team B",
  eventId: 1,
  openDate: "2026-04-20T15:00:00Z",
};

const defaultCard = {
  type: "SquadBet",
  outcomeLabel: "Score Anytime",
  legIds: ["leg:1"],
  participants: [defaultParticipant],
};

function renderObbOnboardingCard(props = {}) {
  return render(<ObbOnboardingCard card={defaultCard} event={defaultEvent} cardGroupUrn="cardGroup:1" {...props} />);
}

describe("ObbOnboardingCard", () => {
  describe("participants display", () => {
    it("should display the player jersey image when available", () => {
      const { getAllByAltText } = renderObbOnboardingCard();

      expect(getAllByAltText("")[0]).toHaveAttribute("src", "https://example.com/jersey.png");
    });

    it("should display fallback element when jersey is not available", () => {
      const participantWithoutJersey = {
        ...defaultParticipant,
        jersey: undefined,
      };

      const { getByTestId } = renderObbOnboardingCard({
        card: { ...defaultCard, participants: [participantWithoutJersey] },
      });

      expect(getByTestId("fallback-jersey")).toBeInTheDocument();
    });

    it("should display the player name", () => {
      const { getByText } = renderObbOnboardingCard();

      expect(getByText("Smith")).toBeInTheDocument();
    });

    it("should display all participants", () => {
      const secondParticipant = {
        ...defaultParticipant,
        urn: "ppb:obb:footballPlayer:2/e/1",
        name: "Jane Doe",
        jersey: "https://example.com/jersey2.png",
      };

      const { getByText } = renderObbOnboardingCard({
        card: { ...defaultCard, participants: [defaultParticipant, secondParticipant] },
      });

      expect(getByText("Smith")).toBeInTheDocument();
      expect(getByText("Doe")).toBeInTheDocument();
    });
  });

  describe("legs display", () => {
    it("should render a bet button for a single leg", () => {
      const { getAllByTestId } = renderObbOnboardingCard();

      expect(getAllByTestId("bet-button")).toHaveLength(1);
      expect(getAllByTestId("bet-button")[0]).toHaveAttribute("data-leg-id", "leg:1");
    });

    it("should render a bet button with the correct leg ID", () => {
      const { getAllByTestId } = renderObbOnboardingCard({
        card: { ...defaultCard, legIds: ["leg:2"] },
      });

      expect(getAllByTestId("bet-button")[0]).toHaveAttribute("data-leg-id", "leg:2");
    });

    it("should render all legs", () => {
      const { getAllByTestId } = renderObbOnboardingCard({
        card: { ...defaultCard, legIds: ["leg:1", "leg:2"] },
      });

      const buttons = getAllByTestId("bet-button");
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveAttribute("data-leg-id", "leg:1");
      expect(buttons[1]).toHaveAttribute("data-leg-id", "leg:2");
    });

    it("should render ObbBetButton with correct metadataOverride", () => {
      renderObbOnboardingCard();

      expect(ConnectedObbBetButton.mock.calls[0][0]).toMatchObject({
        metadataOverride: { card: "onboarding card", tab: "test-tab", group: "test-group" },
      });
    });
  });

  describe("header", () => {
    it("should render the outcome label", () => {
      const { getByText } = renderObbOnboardingCard({
        card: { ...defaultCard, outcomeLabel: "Both teams to score" },
      });

      expect(getByText("Both teams to score")).toBeInTheDocument();
    });

    it("should render the GenericIcon with the provided name when outcomeIcon is set", () => {
      const { getByTestId } = renderObbOnboardingCard({
        card: { ...defaultCard, outcomeIcon: "GOAL" },
      });

      expect(getByTestId("generic-icon")).toHaveAttribute("data-icon-name", "GOAL");
    });

    it("should not render the icon container when outcomeIcon is undefined", () => {
      const { queryByTestId } = renderObbOnboardingCard({
        card: { ...defaultCard, outcomeIcon: undefined },
      });

      expect(queryByTestId("generic-icon")).not.toBeInTheDocument();
    });
  });
});
