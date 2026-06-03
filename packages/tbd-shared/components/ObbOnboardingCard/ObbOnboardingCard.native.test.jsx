import { render } from "@testing-library/react-native";
import ObbOnboardingCard from "./ObbOnboardingCard.native";
import ConnectedObbBetButton from "../ObbBetButton";

jest.mock("@ppb/the-wall-native", () => {
  const { View, Text } = jest.requireActual("react-native");
  return {
    Card: jest.fn(({ children, title, icon }) => (
      <View testID="card-mock" data-title={title} data-icon={icon}>
        {!!title && <Text testID="card-title">{title}</Text>}
        {children}
      </View>
    )),
    Text,
  };
});

jest.mock("../ObbMicroPlayer/ObbMicroPlayer.native", () => ({
  ObbMicroPlayer: jest.fn(({ jerseys, players, variant, jerseySize }) => {
    const { View } = jest.requireActual("react-native");
    return (
      <View
        testID="obb-micro-player-mock"
        data-variant={variant}
        data-jersey-size={jerseySize}
        data-jerseys={JSON.stringify(jerseys)}
        data-players={JSON.stringify(players)}
      />
    );
  }),
}));

jest.mock("../ObbBetButton", () => {
  const { View } = jest.requireActual("react-native");
  return jest.fn(({ legId }) => <View testID="bet-button" data-leg-id={legId} />);
});

jest.mock("../ObbBetButton/ObbBetButton.native", () => "ObbBetButton");

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

describe("ObbOnboardingCard (native)", () => {
  beforeEach(jest.clearAllMocks);

  describe("Card wrapper", () => {
    it("should render the Card with the outcome label as title", () => {
      const { getByTestId } = renderObbOnboardingCard();

      expect(getByTestId("card-title").props.children).toBe("Score Anytime");
    });
  });

  describe("SquadBet variant", () => {
    it("should render a single ObbMicroPlayer with all participants", () => {
      const secondParticipant = {
        ...defaultParticipant,
        urn: "ppb:obb:footballPlayer:2/e/1",
        name: "Jane Doe",
        jersey: "https://example.com/jersey2.png",
      };

      const { getAllByTestId } = renderObbOnboardingCard({
        card: { ...defaultCard, participants: [defaultParticipant, secondParticipant] },
      });

      const microPlayers = getAllByTestId("obb-micro-player-mock");
      expect(microPlayers).toHaveLength(1);
      expect(microPlayers[0].props["data-variant"]).toBe("multi");
      expect(microPlayers[0].props["data-jersey-size"]).toBe("large");
      expect(JSON.parse(microPlayers[0].props["data-jerseys"])).toEqual([
        "https://example.com/jersey.png",
        "https://example.com/jersey2.png",
      ]);
      expect(JSON.parse(microPlayers[0].props["data-players"])).toEqual([
        { firstName: "John", lastName: "Smith" },
        { firstName: "Jane", lastName: "Doe" },
      ]);
    });

    it("should pass undefined jersey when missing", () => {
      const { getAllByTestId } = renderObbOnboardingCard({
        card: { ...defaultCard, participants: [{ ...defaultParticipant, jersey: undefined }] },
      });

      const microPlayer = getAllByTestId("obb-micro-player-mock")[0];
      expect(JSON.parse(microPlayer.props["data-jerseys"])).toEqual([null]);
    });

    it("should fall back to an empty name when participant name is missing", () => {
      const { getAllByTestId } = renderObbOnboardingCard({
        card: { ...defaultCard, participants: [{ ...defaultParticipant, name: undefined }] },
      });

      const microPlayer = getAllByTestId("obb-micro-player-mock")[0];
      expect(JSON.parse(microPlayer.props["data-players"])).toEqual([{ firstName: "", lastName: "" }]);
    });
  });

  describe("SquadVsSquad variant", () => {
    const squadVsSquadCard = {
      type: "SquadVsSquad",
      outcomeLabel: "Which squad will have more shots?",
      legIds: ["leg:a", "leg:b"],
      jerseySize: "small",
      squadAParticipants: [{ urn: "p:a1", name: "Player A", jersey: "https://example.com/a.png" }],
      squadBParticipants: [{ urn: "p:b1", name: "Player B", jersey: "https://example.com/b.png" }],
    };

    it("should render two ObbMicroPlayer components and a vs label", () => {
      const { getAllByTestId, getByText } = renderObbOnboardingCard({ card: squadVsSquadCard });

      const microPlayers = getAllByTestId("obb-micro-player-mock");
      expect(microPlayers).toHaveLength(2);
      expect(JSON.parse(microPlayers[0].props["data-players"])).toEqual([{ firstName: "Player", lastName: "A" }]);
      expect(JSON.parse(microPlayers[1].props["data-players"])).toEqual([{ firstName: "Player", lastName: "B" }]);
      expect(getByText("vs")).toBeTruthy();
    });

    it("should forward the jerseySize to the ObbMicroPlayer", () => {
      const { getAllByTestId } = renderObbOnboardingCard({
        card: { ...squadVsSquadCard, jerseySize: "large" },
      });

      const microPlayers = getAllByTestId("obb-micro-player-mock");
      expect(microPlayers[0].props["data-jersey-size"]).toBe("large");
      expect(microPlayers[1].props["data-jersey-size"]).toBe("large");
    });

    it("should fall back to an empty name when squad participant names are missing", () => {
      const { getAllByTestId } = renderObbOnboardingCard({
        card: {
          ...squadVsSquadCard,
          squadAParticipants: [{ urn: "p:a1", name: undefined, jersey: undefined }],
          squadBParticipants: [{ urn: "p:b1", name: undefined, jersey: undefined }],
        },
      });

      const microPlayers = getAllByTestId("obb-micro-player-mock");
      expect(JSON.parse(microPlayers[0].props["data-players"])).toEqual([{ firstName: "", lastName: "" }]);
      expect(JSON.parse(microPlayers[1].props["data-players"])).toEqual([{ firstName: "", lastName: "" }]);
    });
  });

  describe("unknown variant", () => {
    it("should not render any ObbMicroPlayer when the card type is not recognised", () => {
      const { queryAllByTestId } = renderObbOnboardingCard({
        card: { ...defaultCard, type: "Unknown", participants: [defaultParticipant] },
      });

      expect(queryAllByTestId("obb-micro-player-mock")).toHaveLength(0);
    });
  });

  describe("legs display", () => {
    it("should render a bet button for a single leg", () => {
      const { getAllByTestId } = renderObbOnboardingCard();

      const buttons = getAllByTestId("bet-button");
      expect(buttons).toHaveLength(1);
      expect(buttons[0].props["data-leg-id"]).toBe("leg:1");
    });

    it("should render all legs", () => {
      const { getAllByTestId } = renderObbOnboardingCard({
        card: { ...defaultCard, legIds: ["leg:1", "leg:2"] },
      });

      const buttons = getAllByTestId("bet-button");
      expect(buttons).toHaveLength(2);
      expect(buttons[0].props["data-leg-id"]).toBe("leg:1");
      expect(buttons[1].props["data-leg-id"]).toBe("leg:2");
    });

    it("should render ObbBetButton with correct metadataOverride", () => {
      renderObbOnboardingCard();

      expect(ConnectedObbBetButton.mock.calls[0][0]).toMatchObject({
        metadataOverride: { card: "onboarding card", tab: "test-tab", group: "test-group" },
      });
    });
  });
});
