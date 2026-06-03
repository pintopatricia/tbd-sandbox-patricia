import { render } from "@testing-library/react-native";

import { EmptyStateIconSize } from "@ppb/the-wall-common/types";
import { AssetsIconName } from "@ppb/the-wall-icons/types";
import { Card, EmptyState } from "@ppb/the-wall-native";

import { i18n } from "../../helpers/i18n";

import { FAVOURITE_MARKETS_EMPTY_STATE } from "./FavouriteMarketsEmptyState.native.selectors";
import { FavouriteMarketsEmptyState } from "./FavouriteMarketsEmptyState.native";
import styles from "./FavouriteMarketsEmptyState.native.styles";

const translationMock = "translationMock";

const TRANSLATIONS = {
  title: "I18N.FAVOURITE_MARKETS.EMPTY_STATE.TITLE",
  message: "I18N.FAVOURITE_MARKETS.EMPTY_STATE.MESSAGE",
};

jest.mock("@ppb/the-wall-native", () => ({
  EmptyState: jest.fn(() => <empty-state-mock />),
  Card: jest.fn(({ children }) => <card-mock data-testid="card">{children}</card-mock>),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
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
      const { queryByTestId } = renderFavouriteMarketsEmptyState();
      const favouriteMarketsEmptyState = queryByTestId(FAVOURITE_MARKETS_EMPTY_STATE);

      expect(favouriteMarketsEmptyState).toHaveStyle(styles.favouriteMarketsEmptyState);
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

      expect(Card).toHaveBeenCalledTimes(1);
      expect(Card).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          children: expect.anything(),
        }),
        undefined,
      );
    });

    it("should call i18n with correct props", () => {
      renderFavouriteMarketsEmptyState();

      expect(i18n).toHaveBeenNthCalledWith(1, { key: TRANSLATIONS.title });
      expect(i18n).toHaveBeenNthCalledWith(2, { key: TRANSLATIONS.message });
    });
  });
});
