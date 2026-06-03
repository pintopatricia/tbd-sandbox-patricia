import { render } from "@testing-library/react";
import classnames from "classnames";
import "jest-dom/extend-expect";
import { ProgressBar } from "@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar";
import { GameBadge } from "../../../GameInfo/snowflakes/GameBadge/GameBadge.web";
import { Jackpot } from "./Jackpot.web";
import styles from "./Jackpot.web.css";
import { TITLE, DESCRIPTION, LABEL } from "./Jackpot.web.selectors";

jest.mock("../../../GameInfo/snowflakes/GameBadge/GameBadge.web", () => ({
  GameBadge: jest.fn(() => <game-mock />),
}));

jest.mock("@ppb/the-wall-web/components/bricks/ProgressBar/ProgressBar", () => ({
  ProgressBar: jest.fn(() => <progress-mock />),
}));

function renderJackpot(progress, title = "test", value = "value", description = "description", state = "HOT") {
  return render(<Jackpot title={title} value={value} description={description} state={state} progress={progress} />);
}

describe("JackpotElement", () => {
  beforeEach(jest.clearAllMocks);

  describe("Title jackpot", () => {
    it("should have the hotTitleClass", () => {
      const { container } = renderJackpot();

      const title = container.querySelector(TITLE);
      expect(title).toHaveClass(classnames(styles.title, styles.hotTitle));
      expect(title).toHaveTextContent("test");
    });
  });

  describe("Description jackpot", () => {
    it("should have the correct text", () => {
      const { container } = renderJackpot();

      const description = container.querySelector(DESCRIPTION);

      expect(description).toHaveTextContent("description");
    });
  });

  describe("label jackpot", () => {
    it("should have the correct text", () => {
      const { container } = renderJackpot();

      const label = container.querySelector(LABEL);
      expect(GameBadge).toHaveBeenCalledTimes(1);
      expect(label).toHaveTextContent("value");
    });
  });

  describe("progressBar jackpot", () => {
    it("should  call the ProgressBar", () => {
      renderJackpot("50", "test", "value", "description", "HOT");

      expect(ProgressBar).toHaveBeenCalledTimes(1);
      expect(ProgressBar).toHaveBeenCalledWith({ animation: true, away: 50, home: "50", type: "GAMING" }, undefined);
    });
  });
});
