import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { i18n } from "../../helpers/i18n";

import { NoContentAvailableCard } from "./NoContentAvailableCard.web";
import { TEST_ID } from "./NoContentAvailableCard.web.selectors";
import styles from "./NoContentAvailableCard.web.css";

const translationMock = "translationMock";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/tbd-shared/helpers/i18n", () => ({
  i18n: jest.fn(() => translationMock),
}));

function renderNoContentAvailableCard() {
  return render(<NoContentAvailableCard />);
}

describe("NoContentAvailableCard", () => {
  beforeAll(jest.clearAllMocks);

  describe("when view is rendered", () => {
    it("should draw the container with the correct styling", () => {
      const { container } = renderNoContentAvailableCard();
      const noContentAvailableContainer = container.querySelector(TEST_ID);

      expect(noContentAvailableContainer.className).toContain(styles.noContentAvailableContainer);
    });

    it("should call GenericIcon with correct props", () => {
      renderNoContentAvailableCard();

      expect(GenericIcon).toHaveBeenCalledWith(
        {
          name: SystemIconName.CLOSE,
          color: "var(--neutrals-icon-secondary)",
        },
        undefined,
      );
    });

    it("should call i18n with correct props", () => {
      renderNoContentAvailableCard();

      expect(i18n).toHaveBeenNthCalledWith(1, { key: "I18N.NO_PRICE_AVAILABLE.TITLE" });
      expect(i18n).toHaveBeenNthCalledWith(2, { key: "I18N.NO_CONTENT_AVAILABLE.TEXT" });
    });
  });
});
