import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { GameTileContainer } from "./GameTileContainer.web";

import { TEST_ID } from "./GameTileContainer.web.selectors";
import styles from "./GameTileContainer.web.css";

function renderGameTileContainer({ layout, children }) {
  return render(<GameTileContainer layout={layout}>{children}</GameTileContainer>);
}

const gameTileContainerProps = {
  layout: "RECTANGLE",
};

describe("GameTileContainer", () => {
  describe("game tile container", () => {
    it("should wrap children", () => {
      const { container } = renderGameTileContainer({
        children: "CHILDREN",
      });

      expect(container.querySelector(TEST_ID).innerHTML).toBe("CHILDREN");
    });

    it("should have the rectangle class", () => {
      const { container } = renderGameTileContainer(gameTileContainerProps);
      const gameTileContainer = container.querySelector(TEST_ID);
      expect(gameTileContainer).toHaveClass(styles.rectangle);
    });
  });
});
