import { render } from "@testing-library/react-native";
import { typography } from "@ppb/the-wall-common/base-theme";
import { RaceViewLinkCard } from "./RaceViewLinkCard.native";
import styles from "./RaceViewLinkCard.native.styles";
import {
  RACE_VIEW_LINK_CARD,
  RACE_VIEW_LINK_CARD_TITLE,
  RACE_VIEW_LINK_CARD_IMAGE,
  RACE_VIEW_LINK_CARD_CIRCULAR_PLACEHOLDER,
  RACE_VIEW_LINK_CARD_SUBTITLE,
  RACE_VIEW_LINK_CARD_SUBTITLE_LABEL,
} from "./RaceViewLinkCard.native.selectors";

jest.mock("react-native-svg", () => ({ SvgCssUri: jest.fn(() => <svg-css-uri-mock />) }));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
  heights: {},
  typography: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const onClick = jest.fn();

function renderRaceViewLinkCard({ title = "Vincennes", image, subtitle, subtitleLabel }) {
  return render(
    <RaceViewLinkCard
      title={title}
      countryFlag={image}
      onClick={onClick}
      subtitle={subtitle}
      subtitleLabel={subtitleLabel}
    />,
  );
}

describe("RaceViewLinkCard", () => {
  it("should have the 'raceViewLinkCard' style", () => {
    const { queryByTestId } = renderRaceViewLinkCard({});
    const raceViewLinkCard = queryByTestId(RACE_VIEW_LINK_CARD);

    expect(raceViewLinkCard).toHaveStyle(styles.raceViewLinkCard);
  });

  it("should display the title", () => {
    const { queryByTestId } = renderRaceViewLinkCard({});
    const title = queryByTestId(RACE_VIEW_LINK_CARD_TITLE);

    expect(title).toHaveTextContent("Vincennes");
    expect(title).toHaveStyle(styles.title);
  });

  describe("displaying the image", () => {
    it("should display the image if imageUrl is defined", () => {
      const { queryByTestId } = renderRaceViewLinkCard({ image: { small: "fakeImageUrl" } });
      const image = queryByTestId(RACE_VIEW_LINK_CARD_IMAGE);

      expect(image).not.toBeNull();
      expect(image).toHaveStyle(styles.image);
    });

    it("should display the circular image placeholder if imageUrl is not defined", () => {
      const { queryByTestId } = renderRaceViewLinkCard({});
      const circularImagePlaceholder = queryByTestId(RACE_VIEW_LINK_CARD_CIRCULAR_PLACEHOLDER);

      expect(circularImagePlaceholder).not.toBeNull();
    });
  });

  describe("displaying the subtitle", () => {
    it("should display the subtitle and it's label if defined", () => {
      const { queryByTestId } = renderRaceViewLinkCard({ subtitle: "Walton White", subtitleLabel: "WINNER" });
      const subtitle = queryByTestId(RACE_VIEW_LINK_CARD_SUBTITLE);
      const subtitleLabel = queryByTestId(RACE_VIEW_LINK_CARD_SUBTITLE_LABEL);

      expect(subtitle).toHaveTextContent("Walton White");
      expect(subtitle).toHaveStyle(typography["typography-h152"]);

      expect(subtitleLabel).toHaveTextContent("WINNER");
      expect(subtitleLabel).toHaveStyle(styles.subtitleLabel);
    });

    it("shouldn't display the subtitle and it's label if it's not defined", () => {
      const { queryByTestId } = renderRaceViewLinkCard({});
      const subtitle = queryByTestId(RACE_VIEW_LINK_CARD_SUBTITLE);
      const subtitleLabel = queryByTestId(RACE_VIEW_LINK_CARD_SUBTITLE_LABEL);

      expect(subtitle).toBe(null);
      expect(subtitleLabel).toBe(null);
    });
  });
});
