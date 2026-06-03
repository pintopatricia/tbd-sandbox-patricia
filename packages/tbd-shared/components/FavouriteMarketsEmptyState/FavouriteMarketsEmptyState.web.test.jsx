import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { EmptyStateIconSize } from "@ppb/the-wall-common/types";
import { AssetsIconName } from "@ppb/the-wall-icons/types";
import { Card, EmptyState } from "@ppb/the-wall-web";

import { i18n } from "../../helpers/i18n";

import { FavouriteMarketsEmptyState } from "./FavouriteMarketsEmptyState.web";
import { TEST_ID } from "./FavouriteMarketsEmptyState.web.selectors";
import styles from "./FavouriteMarketsEmptyState.web.css";

const translationMock = "translationMock";

const TRANSLATIONS = {
  title: "I18N.FAVOURITE_MARKETS.EMPTY_STATE.TITLE",
  message: "I18N.FAVOURITE_MARKETS.EMPTY_STATE.MESSAGE",
};

jest.mock("@ppb/the-wall-web", () => ({
  EmptyState: jest.fn(() => <empty-state-mock />),
  Card: jest.fn(({ children }) => <card-mock data-testid="card">{children}</card-mock>),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(() => translationMock),
}));

const defaultProps = {
  hasImage: true,
};

const renderFavouriteMarketsEmptyState = (props = defaultProps) => render(<FavouriteMarketsEmptyState {...props} />);

describe("FavouriteMarketsEmptyState", () => {
  beforeEach(jest.clearAllMocks);

  describe("when view is rendered", () => {
    it("should draw the container with the correct styling", () => {
      const { container } = renderFavouriteMarketsEmptyState();
      const favouriteMarketsEmptyState = container.querySelector(TEST_ID);

      expect(favouriteMarketsEmptyState.className).toContain(styles.favouriteMarketsEmptyState);
    });

    it("should call EmptyState with correct props", () => {
      renderFavouriteMarketsEmptyState();

      expect(EmptyState).toHaveBeenCalledWith(
        {
          hasImage: defaultProps.hasImage,
          icon: AssetsIconName.NO_FAVOURITES_ADDED,
          iconSize: EmptyStateIconSize.SMALL,
          title: translationMock,
          message: translationMock,
        },
        undefined,
      );
    });

    it("should call Card component", () => {
      renderFavouriteMarketsEmptyState();

      expect(Card).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          children: expect.anything(),
        }),
        undefined,
      );
      expect(Card).toHaveBeenCalledTimes(1);
    });

    it("should call i18n with correct props", () => {
      renderFavouriteMarketsEmptyState();

      expect(i18n).toHaveBeenNthCalledWith(1, { key: TRANSLATIONS.title });
      expect(i18n).toHaveBeenNthCalledWith(2, { key: TRANSLATIONS.message });
    });
  });
});
