import { render } from "@testing-library/react-native";
import ConnectedCardGroup from "../CardGroup";
import CardGroup from "../CardGroup/CardGroup.native";
import BetCardGroup from "./BetCardGroup.native";
import ConnectedFixtureCard from "../FixtureCard";
import MyBetsFixtureCard from "../FixtureCard/MyBetsFixture/MyBetsFixtureCard.native";
import FixtureCardPlaceholder from "../FixtureCard/FixtureCardPlaceholder.native";
import styles from "./BetCardGroup.native.styles";
import { BET_CARD_GROUP_ITEM } from "./BetCardGroup.native.selectors";

jest.mock("../FixtureCard", (props) => jest.fn(() => <connected-fixture-card-mock {...props} />));
jest.mock("../FixtureCard/MyBetsFixture/MyBetsFixtureCard.native", (props) =>
  jest.fn(() => <my-bets-fixture-card-mock {...props} />),
);
jest.mock("../FixtureCard/FixtureCardPlaceholder.native", () => jest.fn(() => <fixture-card-placeholder-mock />));
jest.mock("../CardGroup/", () => jest.fn(() => <connected-card-group-mock />));
jest.mock("../CardGroup/CardGroup.native", () => jest.fn(() => <card-group-mock />));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
  colors: {},
  tokens: {},
}));

function renderBetCardGroup(props) {
  return render(<BetCardGroup {...props} />);
}

describe("BetCardGroup", () => {
  beforeEach(jest.clearAllMocks);

  describe("when receives items", () => {
    it("should render all cards", () => {
      renderBetCardGroup({
        items: [
          {
            typename: "firstMockTypename",
            urn: "firstMockURN",
          },

          {
            typename: "FixtureCard",
            urn: "secondMockURN",
          },
        ],
      });

      expect(ConnectedCardGroup).toHaveBeenNthCalledWith(
        1,
        { component: CardGroup, urn: "firstMockURN", typename: "firstMockTypename" },
        undefined,
      );
      expect(ConnectedFixtureCard).toHaveBeenNthCalledWith(
        1,
        {
          component: MyBetsFixtureCard,
          urn: "secondMockURN",
          placeholder: FixtureCardPlaceholder,
          iconsList: undefined,
        },
        undefined,
      );
      expect(ConnectedCardGroup).toHaveBeenCalledTimes(1);
      expect(ConnectedFixtureCard).toHaveBeenCalledTimes(1);
    });

    it("should apply different style when the item typename is 'FixtureCard'", () => {
      const { getAllByTestId } = renderBetCardGroup({
        items: [
          {
            typename: "FixtureCard",
            urn: "firstMockURN",
          },
          {
            typename: "secondMockTypename",
            urn: "secondMockURN",
          },
        ],
      });

      const connectedCardGroups = getAllByTestId(BET_CARD_GROUP_ITEM);

      expect(connectedCardGroups.length).toEqual(2);
      expect(connectedCardGroups[0]).toHaveStyle(styles.fixtureCardGroupItem);
      expect(connectedCardGroups[1]).toHaveStyle(undefined);
    });

    it("should apply different style when the item typename is 'EventHeaderCard'", () => {
      const { getAllByTestId } = renderBetCardGroup({
        items: [
          {
            typename: "EventHeaderCard",
            urn: "firstMockURN",
          },
          {
            typename: "secondMockTypename",
            urn: "secondMockURN",
          },
        ],
      });

      const connectedCardGroups = getAllByTestId(BET_CARD_GROUP_ITEM);

      expect(connectedCardGroups.length).toEqual(2);
      expect(connectedCardGroups[0]).toHaveStyle(styles.fixtureCardGroupItem);
      expect(connectedCardGroups[1]).toHaveStyle(undefined);
    });

    it("should apply different style when the item typename is 'MarketBetCardGroup'", () => {
      const { getAllByTestId } = renderBetCardGroup({
        items: [
          {
            typename: "MarketBetCardGroup",
            urn: "firstMockURN",
          },
          {
            typename: "secondMockTypename",
            urn: "secondMockURN",
          },
        ],
      });

      const connectedCardGroups = getAllByTestId(BET_CARD_GROUP_ITEM);

      expect(connectedCardGroups.length).toEqual(2);
      expect(connectedCardGroups[0]).toHaveStyle(styles.marketBetCardGroupItem);
      expect(connectedCardGroups[1]).toHaveStyle(undefined);
    });
  });

  describe("when doesn't receive items", () => {
    it("should not render any card", () => {
      renderBetCardGroup({});

      expect(ConnectedCardGroup).not.toHaveBeenCalled();
    });
  });
});
