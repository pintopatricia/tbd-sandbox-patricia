import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import BetCardGroup from "./BetCardGroup.web";
import ConnectedFixtureCard from "../FixtureCard";
import MyBetsFixtureCard from "../FixtureCard/MyBetsFixture/MyBetsFixtureCard.web";
import FixtureCardPlaceholder from "../FixtureCard/FixtureCardPlaceholder.web";
import styles from "./BetCardGroup.web.css";
import { TEST_ID } from "./BetCardGroup.selectors";

jest.mock("../FixtureCard", () => jest.fn(() => <connected-fixture-card-mock />));
jest.mock("../FixtureCard/MyBetsFixture/MyBetsFixtureCard.web", () => jest.fn(() => <my-bets-fixture-card-mock />));
jest.mock("../FixtureCard/FixtureCardPlaceholder.web", () => jest.fn(() => <fixture-card-placeholder-mock />));
jest.mock("../Card/", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.web", () => jest.fn(() => <card-mock />));

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

      expect(ConnectedCard).toHaveBeenNthCalledWith(
        1,
        { component: Card, urn: "firstMockURN", typename: "firstMockTypename" },
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
      expect(ConnectedCard).toHaveBeenCalledTimes(1);
      expect(ConnectedFixtureCard).toHaveBeenCalledTimes(1);
    });

    it("should apply different style when the item typename is 'FixtureCard'", () => {
      const { container } = renderBetCardGroup({
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

      const connectedCards = container.querySelectorAll(`${TEST_ID} > div`);

      expect(connectedCards.length).toEqual(2);
      expect(connectedCards[0].className).toContain(styles.fixtureCardGroupItem);
      expect(connectedCards[1].className).toEqual(styles.groupItem);
    });

    it("should apply different style when the item typename is 'EventHeaderCard'", () => {
      const { container } = renderBetCardGroup({
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

      const connectedCards = container.querySelectorAll(`${TEST_ID} > div`);

      expect(connectedCards.length).toEqual(2);
      expect(connectedCards[0].className).toContain(styles.fixtureCardGroupItem);
      expect(connectedCards[1].className).toEqual(styles.groupItem);
    });

    it("should apply different style when the item typename is 'MarketBetCardGroup'", () => {
      const { container } = renderBetCardGroup({
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

      const connectedCards = container.querySelectorAll(`${TEST_ID} > div`);

      expect(connectedCards.length).toEqual(2);
      expect(connectedCards[0].className).toContain(styles.marketBetCardGroupItem);
      expect(connectedCards[1].className).toEqual(styles.groupItem);
    });
  });

  describe("when doesn't receive items", () => {
    it("should not render any card", () => {
      renderBetCardGroup({});

      expect(ConnectedCard).not.toHaveBeenCalled();
    });
  });
});
