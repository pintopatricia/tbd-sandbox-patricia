import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";

import { CardIconTypes } from "@ppb/the-wall-common/types";
import { MILLISECONDS_IN_A_DAY } from "@ppb/tbd-store/helpers/dates";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(),
}));

const mockCard = {
  releaseDate: Date.now(),
  uid: "test",
};

const getGamingLinkCardByURN = jest.fn(() => [mockCard]);
createCardGroupByURNSelector.mockImplementation(() => getGamingLinkCardByURN);

describe("makeMapStateToProps", () => {
  const urn = "urn:gaming:123";

  const now = new Date().getTime();

  const recentDate = new Date(now - 3 * MILLISECONDS_IN_A_DAY).toISOString();
  const oldDate = new Date(now - 10 * MILLISECONDS_IN_A_DAY).toISOString();

  const card = {
    link: {
      label: "Play Now",
      icon: null,
      viewLink: "/play",
    },
    games: [{ uid: "game-1", releaseDate: recentDate }, { uid: "game-2", releaseDate: oldDate }, { uid: "game-3" }],
  };

  const mockState = {
    layouts: {
      cards: {
        gaminglinks: {
          [urn]: card,
        },
      },
    },
    entities: {
      brandSettings: {
        HIGHLIGHTED_SPORTS_RIBBON: true,
      },
    },
  };

  it("should return correct props when card exists with recent games", () => {
    const mapStateToProps = makeMapStateToProps();
    const props = mapStateToProps(mockState, { urn });

    expect(props).toEqual({
      urn,
      label: "Play Now",
      icon: CardIconTypes.Games,
      viewLink: "/play",
      games: ["game-1"],
      isGamesRibbonHighlighted: true,
    });
  });

  it("should return empty object when card is missing", () => {
    const mapStateToProps = makeMapStateToProps();
    const props = mapStateToProps(
      {
        layouts: {
          cards: {
            gaminglinks: {},
          },
        },
      },
      { urn },
    );

    expect(props).toEqual({});
  });

  it("should use the provided icon if available", () => {
    const mapStateToProps = makeMapStateToProps();
    const iconCard = {
      ...card,
      link: {
        ...card.link,
        icon: "custom-icon",
      },
    };

    const props = mapStateToProps(
      {
        layouts: {
          cards: {
            gaminglinks: {
              [urn]: iconCard,
            },
          },
        },
        entities: {
          brandSettings: {
            HIGHLIGHTED_SPORTS_RIBBON: true,
          },
        },
      },
      { urn },
    );

    expect(props.icon).toBe("custom-icon");
  });
});
