import { fireEvent, render } from "@testing-library/react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { RichContentIconName, ValueIconName } from "@ppb/the-wall-icons/types";
import { RaceLinkIcon } from "./RaceLink.types";
import { RaceLink } from "./RaceLink.native";
import {
  RACE_LINK,
  RACE_LINK_ICON,
  RACE_LINK_SUBTITLE,
  RACE_LINK_TEXT_WRAPPER,
  RACE_LINK_TIME,
} from "./RaceLink.native.selectors";
import styles from "./RaceLink.native.styles";

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const itemMock = {
  title: "12:34",
  viewLink: {
    viewUrl: "",
    viewUrn: "",
  },
};

const onPressMock = jest.fn();

function renderRaceLink({ item, onPress, iconStates = [], isDetailed, style }) {
  const container = render(
    <RaceLink item={item} iconStates={iconStates} isDetailed={isDetailed} onPress={onPress} style={style} />,
  );

  return {
    raceLinkContainer: container.getByTestId(RACE_LINK),
    raceLinkTextWrapper: container.getByTestId(RACE_LINK_TEXT_WRAPPER),
    raceLinkTitleTime: container.getByTestId(RACE_LINK_TIME),
    raceLinkIcons: iconStates.length ? container.getAllByTestId(RACE_LINK_ICON) : null,
    raceLinkSubtitle: item.subtitle ? container.getByTestId(RACE_LINK_SUBTITLE) : null,
  };
}

describe("RaceLink", () => {
  let iconStatesMock;
  let results;
  let iconElements;
  let containerElement;
  describe("Container", () => {
    beforeEach(() => {
      results = renderRaceLink({ item: itemMock, onPress: onPressMock });
      containerElement = results.raceLinkContainer;
    });

    it("should render container", () => {
      expect(containerElement).not.toBeNull();
    });

    it("should have style", () => {
      expect(containerElement).toHaveStyle(styles.container);
    });

    describe("Press action", () => {
      it("should fire a press action", () => {
        expect(onPressMock).not.toHaveBeenCalled();
        fireEvent.press(containerElement);
        expect(onPressMock).toHaveBeenCalled();
      });
    });
  });

  describe("Text area", () => {
    it("should render the text wrapper element", () => {
      results = renderRaceLink({ item: itemMock });
      const raceLinkWrapperElement = results.raceLinkTextWrapper;

      expect(raceLinkWrapperElement).not.toBeNull();
    });

    it("should render the correct race time title", () => {
      results = renderRaceLink({ item: itemMock });
      const raceTitleElement = results.raceLinkTitleTime;

      expect(raceTitleElement).not.toBeNull();
      expect(raceTitleElement).toHaveStyle(styles.raceTitle);
      expect(raceTitleElement).toHaveTextContent(itemMock.title);
    });

    describe("when providing subtitle", () => {
      it("should render the subtitle text", () => {
        const subtitle = "subtitle";
        results = renderRaceLink({ item: { ...itemMock, subtitle } });
        const subtitleElement = results.raceLinkSubtitle;

        expect(subtitleElement).not.toBeNull();
        expect(subtitleElement).toHaveStyle(styles.subtitle);
        expect(subtitleElement).toHaveTextContent(subtitle);
      });
    });
  });

  describe("when providing iconStates", () => {
    describe("with one race closed state", () => {
      beforeEach(() => {
        iconStatesMock = [RaceLinkIcon.RaceClosed];
        results = renderRaceLink({ item: itemMock, iconStates: iconStatesMock });
        iconElements = results.raceLinkIcons;
      });

      it("should render the icon with the correct style", () => {
        expect(iconElements).toHaveLength(1);
        expect(iconElements[0]).not.toBeNull();
        expect(iconElements[0]).toHaveStyle(styles.icon);
      });

      it("should have been called with the correct properties", () => {
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: RichContentIconName.HORSE_LOLLIPOP_SELECTED,
            color: tokens.RaceLinkIconSecondaryColour,
          },
          undefined,
        );
      });
    });

    describe("with one sports promotion state", () => {
      beforeEach(() => {
        iconStatesMock = [RaceLinkIcon.Promotion];
        results = renderRaceLink({ item: itemMock, iconStates: iconStatesMock });
        iconElements = results.raceLinkIcons;
      });

      it("should render the icon with the correct style", () => {
        expect(iconElements).toHaveLength(1);
        expect(iconElements[0]).not.toBeNull();
        expect(iconElements[0]).toHaveStyle(styles.icon);
      });

      it("should have been called with the correct properties", () => {
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: ValueIconName.MONEY_BACK,
            color: tokens.RaceLinkIconColour,
          },
          undefined,
        );
      });
    });

    describe("with one extra places state", () => {
      beforeEach(() => {
        iconStatesMock = [RaceLinkIcon.ExtraPlaces];
        results = renderRaceLink({ item: itemMock, iconStates: iconStatesMock });
        iconElements = results.raceLinkIcons;
      });

      it("should render the icon with the correct style", () => {
        expect(iconElements).toHaveLength(1);
        expect(iconElements[0]).not.toBeNull();
        expect(iconElements[0]).toHaveStyle(styles.icon);
      });

      it("should have been called with the correct properties", () => {
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: ValueIconName.EXTRA_PLACES,
            color: tokens.RaceLinkIconColour,
          },
          undefined,
        );
      });
    });
    describe("with three iconStates provided", () => {
      beforeEach(() => {
        iconStatesMock = [RaceLinkIcon.RaceClosed, RaceLinkIcon.Promotion, RaceLinkIcon.ExtraPlaces];
        results = renderRaceLink({ item: itemMock, iconStates: iconStatesMock });
        iconElements = results.raceLinkIcons;
      });

      it("should render only 2 icons with the correct style", () => {
        expect(iconElements).toHaveLength(2);
        expect(iconElements[0]).not.toBeNull();
        expect(iconElements[0]).toHaveStyle(styles.icon);
        expect(iconElements[1]).not.toBeNull();
        expect(iconElements[1]).toHaveStyle(styles.icon);
      });

      it("should have been called with the correct properties", () => {
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: RichContentIconName.HORSE_LOLLIPOP_SELECTED,
            color: tokens.RaceLinkIconSecondaryColour,
          },
          undefined,
        );
        expect(GenericIcon).toHaveBeenCalledWith(
          {
            name: ValueIconName.MONEY_BACK,
            color: tokens.RaceLinkIconColour,
          },
          undefined,
        );
      });
    });
  });
});
