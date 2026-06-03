import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { Stars } from "./snowflakes/Stars/Stars.web";
import { TimeformCard } from "./TimeformCard.web";
import { CONTENT, RUNNER, VERDICT, VERDICT_LABEL, VERDICT_SECTION } from "./TimeformCard.web.selectors";

jest.mock("./snowflakes/Stars/Stars.web", () => ({
  Stars: jest.fn((props) => <starts-icon-mock {...props} />),
}));

const timeformRunners = [
  { name: "Shakalakaboomboom", stars: 4 },
  { name: "Jon Snow", stars: 3 },
  { name: "Sydney Novak", stars: 1 },
];

const timeformProps = {
  runnerRatings: timeformRunners,
  verdictLabel: "Timeform View",
  verdict: "Shakalakaboomboom looks the way to go as she showed...",
};

const renderTimeformCard = (props) => render(<TimeformCard {...props} />);

describe("TimeformCard", () => {
  beforeEach(jest.clearAllMocks);

  it("should render content section with 3 runners", () => {
    const { container } = renderTimeformCard(timeformProps);
    const content = container.querySelector(CONTENT);
    const runners = container.querySelectorAll(RUNNER);

    expect(content).toBeDefined();
    expect(runners.length).toBe(3);
    expect(runners[0]).toHaveTextContent("1. Shakalakaboomboom");
    expect(runners[1]).toHaveTextContent("2. Jon Snow");
    expect(runners[2]).toHaveTextContent("3. Sydney Novak");
  });

  describe("when 1 runner has 4 stars", () => {
    const tfRunner = [{ name: "Shakalakaboomboom", stars: 4 }];

    it("should call Stars with correct params", () => {
      renderTimeformCard({ ...timeformProps, runnerRatings: tfRunner });

      expect(Stars).toHaveBeenCalledWith({ filled: 4, outline: 1 }, undefined);
    });
  });

  it("should render verdict section", () => {
    const { container } = renderTimeformCard(timeformProps);
    const verdictSection = container.querySelector(VERDICT_SECTION);
    const verdictLabel = container.querySelector(VERDICT_LABEL);
    const verdictText = container.querySelector(VERDICT);

    expect(verdictSection).toBeDefined();
    expect(verdictLabel).toHaveTextContent("Timeform View");
    expect(verdictText).toHaveTextContent("Shakalakaboomboom looks the way to go as she showed...");
  });

  describe("when verdict or verdictLabel are undefined", () => {
    it("should not render verdict section when verdict is undefined", () => {
      const { container } = renderTimeformCard({ ...timeformProps, verdict: undefined });
      const verdictSection = container.querySelector(VERDICT_SECTION);
      const verdictLabel = container.querySelector(VERDICT_LABEL);
      const verdictText = container.querySelector(VERDICT);

      expect(verdictSection).toBeNull();
      expect(verdictLabel).toBeNull();
      expect(verdictText).toBeNull();
    });

    it("should not render verdict section when verdictLabel is undefined", () => {
      const { container } = renderTimeformCard({ ...timeformProps, verdictLabel: undefined });
      const verdictSection = container.querySelector(VERDICT_SECTION);
      const verdictLabel = container.querySelector(VERDICT_LABEL);
      const verdictText = container.querySelector(VERDICT);

      expect(verdictSection).toBeNull();
      expect(verdictLabel).toBeNull();
      expect(verdictText).toBeNull();
    });
  });
});
