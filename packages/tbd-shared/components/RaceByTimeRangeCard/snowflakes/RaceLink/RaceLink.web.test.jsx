import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { RichContentIconName, ValueIconName } from "@ppb/the-wall-icons/types";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { RaceLinkIcon } from "./RaceLink.types";
import { RaceLink } from "./RaceLink.web";

import { TEST_ID, TEXTWRAPPER, ICON, RACETITLE, SUBTITLE } from "./RaceLink.web.selectors";

import styles from "./RaceLink.web.css";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

const defaultItem = {
  title: "Please click here!",
  viewLink: {
    viewUrl: "",
    viewUrn: "",
  },
};

function renderRaceLink({ item, iconStates = [], isDetailed }) {
  return render(<RaceLink item={item} iconStates={iconStates} isDetailed={isDetailed} />);
}
describe("RaceLink", () => {
  describe("link", () => {
    it("should render the link with the correct styles", () => {
      const { container } = renderRaceLink({ item: defaultItem });
      const racelinkCardElement = container.querySelector(TEST_ID);

      expect(racelinkCardElement).not.toBeNull();
      expect(racelinkCardElement).toHaveClass(styles.link);
      expect(racelinkCardElement).toHaveAttribute("href", defaultItem.viewLink.viewUrl);
      expect(racelinkCardElement).not.toHaveAttribute("onClick");
    });
  });

  describe("text area", () => {
    it("should render the text wrapper element with correct styles", () => {
      const { container } = renderRaceLink({ item: defaultItem });
      const textWrapperElement = container.querySelector(TEXTWRAPPER);

      expect(textWrapperElement).not.toBeNull();
      expect(textWrapperElement).toHaveClass(styles.textWrapper);
    });

    it("should render the correct race time title", () => {
      const { container } = renderRaceLink({ item: defaultItem });
      const raceTitleElement = container.querySelector(RACETITLE);

      expect(raceTitleElement).not.toBeNull();
      expect(raceTitleElement).toHaveClass(styles.racetime);
      expect(raceTitleElement).toHaveTextContent(defaultItem.title);
    });

    describe("when providing subtitle", () => {
      it("should render the subtitle text", () => {
        const subtitle = "subtitle";
        const { container } = renderRaceLink({ item: { ...defaultItem, subtitle } });
        const subtitleText = container.querySelector(SUBTITLE);

        expect(subtitleText).not.toBeNull();
        expect(subtitleText).toHaveClass(styles.subtitle);
        expect(subtitleText).toHaveTextContent(subtitle);
      });
    });
  });

  describe("when providing iconStates", () => {
    describe("with one race closed state", () => {
      const iconStatesMock = [RaceLinkIcon.RaceClosed];
      const { container } = renderRaceLink({ item: defaultItem, iconStates: iconStatesMock });
      const iconElement = container.querySelectorAll(ICON);

      it("should render the icon with the correct style", () => {
        expect(iconElement).toHaveLength(1);
        expect(iconElement[0]).not.toBeNull();
        expect(iconElement[0]).toHaveClass(styles.icon);
      });

      it("should have been called with the correct properties", () => {
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: RichContentIconName.HORSE_LOLLIPOP_SELECTED,
            color: "var(--race-link-icon-secondary-colour)",
          },
          undefined,
        );
      });
    });

    describe("with one sports promotion state", () => {
      const iconStatesMock = [RaceLinkIcon.Promotion];
      const { container } = renderRaceLink({ item: defaultItem, iconStates: iconStatesMock });
      const iconElement = container.querySelectorAll(ICON);

      it("should render the icon with the correct style", () => {
        expect(iconElement).toHaveLength(1);
        expect(iconElement[0]).not.toBeNull();
        expect(iconElement[0]).toHaveClass(styles.icon);
      });

      it("should have been called with the correct properties", () => {
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: ValueIconName.MONEY_BACK,
            color: "var(--race-link-icon-colour)",
          },
          undefined,
        );
      });
    });

    describe("with the extra places state", () => {
      const iconStatesMock = [RaceLinkIcon.ExtraPlaces];
      const { container } = renderRaceLink({ item: defaultItem, iconStates: iconStatesMock });
      const iconElement = container.querySelectorAll(ICON);

      it("should render the icon with the correct style", () => {
        expect(iconElement).toHaveLength(1);
        expect(iconElement[0]).not.toBeNull();
        expect(iconElement[0]).toHaveClass(styles.icon);
      });

      it("should have been called with the correct properties", () => {
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: ValueIconName.EXTRA_PLACES,
            color: "var(--race-link-icon-colour)",
          },
          undefined,
        );
      });
    });
    describe("with three iconStates provided", () => {
      const iconStatesMock = [RaceLinkIcon.RaceClosed, RaceLinkIcon.Promotion, RaceLinkIcon.ExtraPlaces];
      const { container } = renderRaceLink({ item: defaultItem, iconStates: iconStatesMock });
      const iconElement = container.querySelectorAll(ICON);

      it("should render only 2 icons with the correct style", () => {
        expect(iconElement).toHaveLength(2);
        expect(iconElement[0]).not.toBeNull();
        expect(iconElement[0]).toHaveClass(styles.icon);
        expect(iconElement[1]).not.toBeNull();
        expect(iconElement[1]).toHaveClass(styles.icon);
      });

      it("should have been called with the correct properties", () => {
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: RichContentIconName.HORSE_LOLLIPOP_SELECTED,
            color: "var(--race-link-icon-secondary-colour)",
          },
          undefined,
        );
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: ValueIconName.MONEY_BACK,
            color: "var(--race-link-icon-colour)",
          },
          undefined,
        );
      });
    });
  });
});
