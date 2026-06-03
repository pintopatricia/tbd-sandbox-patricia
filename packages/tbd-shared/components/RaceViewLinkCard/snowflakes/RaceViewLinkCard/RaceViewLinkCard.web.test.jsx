import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { RaceViewLinkCard } from "./RaceViewLinkCard.web";
import styles from "./RaceViewLinkCard.web.css";
import { TEST_ID, TITLE, SUBTITLE_LABEL, SUBTITLE, IMAGE } from "./RaceViewLinkCard.web.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

function renderRaceViewLinkCard({
  title = "Vincennes",
  countryFlag = { small: "fakeImageUrl" },
  subtitle = "Walton White",
  subtitleLabel = "WINNER",
  imageAlt = "fakeImageAlt",
}) {
  return render(
    <RaceViewLinkCard
      title={title}
      countryFlag={countryFlag}
      subtitle={subtitle}
      subtitleLabel={subtitleLabel}
      imageAlt={imageAlt}
    />,
  );
}

describe("RaceViewLinkCard", () => {
  it("should have the 'raceViewLinkCard' class", () => {
    const { container } = renderRaceViewLinkCard({});
    const raceViewLinkCard = container.querySelector(TEST_ID);

    expect(raceViewLinkCard).toHaveClass(styles.raceViewLinkCard);
  });

  it("should display the title", () => {
    const { container } = renderRaceViewLinkCard({});
    const title = container.querySelector(TITLE);

    expect(title).toHaveTextContent("Vincennes");
    expect(title).toHaveClass(styles.title);
  });

  describe("displaying the image url", () => {
    it("should display the image if it's defined", () => {
      const { container } = renderRaceViewLinkCard({});
      const image = container.querySelector(IMAGE);

      expect(image).toHaveAttribute("srcSet", "fakeImageUrl 1x, undefined 2x, undefined 3x");
      expect(image).toHaveAttribute("alt", "fakeImageAlt");
    });

    it("should display the fallback image if it's not", () => {
      const { container } = renderRaceViewLinkCard({ countryFlag: null });
      const image = container.querySelector(IMAGE);

      expect(image).not.toHaveAttribute("src", "fakeImageUrl");
      expect(image).not.toHaveAttribute("alt", "fakeImageAlt");

      expect(image).toHaveClass(styles.image);
    });
  });

  describe("displaying the subtitle", () => {
    it("should display the subtitle and its label if defined", () => {
      const { container } = renderRaceViewLinkCard({});
      const subtitle = container.querySelector(SUBTITLE);
      const subtitleLabel = container.querySelector(SUBTITLE_LABEL);

      expect(subtitle).toHaveTextContent("Walton White");
      expect(subtitle).toHaveClass("typography-h152");

      expect(subtitleLabel).toHaveTextContent("WINNER");
      expect(subtitleLabel).toHaveClass(styles.subtitleLabel);
    });

    it("shouldn't display the subtitle and its label if subtitle is not defined", () => {
      const { container } = renderRaceViewLinkCard({ subtitle: null });
      const subtitle = container.querySelector(SUBTITLE);
      const subtitleLabel = container.querySelector(SUBTITLE_LABEL);

      expect(subtitle).toBe(null);
      expect(subtitleLabel).toBe(null);
    });

    it("shouldn't display the subtitle and its label if subtitleLabel is not defined", () => {
      const { container } = renderRaceViewLinkCard({ subtitleLabel: null });
      const subtitle = container.querySelector(SUBTITLE);
      const subtitleLabel = container.querySelector(SUBTITLE_LABEL);

      expect(subtitle).toBe(null);
      expect(subtitleLabel).toBe(null);
    });
  });

  it("should display the arrow", () => {
    renderRaceViewLinkCard({});

    expect(GenericIcon).toHaveBeenCalledWith(
      { color: "var(--neutrals-icon-secondary)", name: SystemIconName.ARROW_BIG_RIGHT },
      undefined,
    );
  });
});
