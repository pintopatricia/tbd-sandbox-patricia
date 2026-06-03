import { ComponentTheme } from "@ppb/the-wall-common/types";
import { RadioList, SwitchOption } from "@ppb/the-wall-native";
import { act, render } from "@testing-library/react-native";
import { NavigationIconName } from "@ppb/the-wall-icons";
import { IconSize } from "@ppb/the-wall-common/types/Tooltip/Tooltip.types";
import { PreferenceCard } from "./snowflakes/PreferenceCard/PreferenceCard.native";
import PreferenceSingleChoiceCard from "./PreferenceSingleChoiceCard.native";

jest.mock("@ppb/the-wall-native", () => ({
  RadioList: jest.fn(({ props }) => <radio-list {...props} />),
  SwitchOption: jest.fn(({ props }) => <switch-option {...props} />),
  Tooltip: jest.fn(({ props }) => <tooltip-mock {...props} />),
}));

jest.mock("./snowflakes/PreferenceCard/PreferenceCard.native", () => ({
  PreferenceCard: jest.fn(({ props, children }) => <preference-card {...props}>{children}</preference-card>),
}));

const PREFERENCE_SINGLE_CHOICE_CARD_PROPS = {
  preferenceUrn: "ppb:tbd:preference:singleChoice:1",
  title: "Odds Display",
  hint: "Choose how you would like your odds to be displayed.",
  selectedOptionIndex: 0,
  listOptions: [
    { id: "decimal", value: "decimal" },
    { id: "fractional", value: "fractional" },
  ],
  isVisible: true,
  isSwitchLayout: false,
  tooltipContent: undefined,
  dispatchPreferenceChange: jest.fn(),
};

function renderPreferenceSingleChoiceCard(props) {
  return render(<PreferenceSingleChoiceCard {...props} />);
}

describe("Embedded view card web", () => {
  afterEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    it("should render PreferenceCard with the correct props", () => {
      renderPreferenceSingleChoiceCard(PREFERENCE_SINGLE_CHOICE_CARD_PROPS);
      const { title, hint } = PREFERENCE_SINGLE_CHOICE_CARD_PROPS;
      expect(PreferenceCard).toHaveBeenCalledWith(
        {
          title,
          hint,
          onInfoButtonClick: undefined,
          children: expect.anything(),
          extraContent: null,
        },
        undefined,
      );
    });

    it("should PreferenceCard have extraContent", () => {
      renderPreferenceSingleChoiceCard({
        ...PREFERENCE_SINGLE_CHOICE_CARD_PROPS,
        tooltipContent: {
          title: "TITLE",
          description: "DESC",
          iconName: NavigationIconName.ARROWS,
          iconSize: IconSize.Regular,
        },
      });
      const { extraContent } = PreferenceCard.mock.calls[0][0];

      expect(extraContent).not.toBe(null);
    });

    it("should render RadioList with the correct props", () => {
      renderPreferenceSingleChoiceCard(PREFERENCE_SINGLE_CHOICE_CARD_PROPS);
      const { listOptions } = PREFERENCE_SINGLE_CHOICE_CARD_PROPS;
      expect(RadioList).toHaveBeenCalledWith(
        {
          handleChange: expect.any(Function),
          listOptions,
          theme: ComponentTheme.DarkTransparent,
          selectedOption: "decimal",
        },
        undefined,
      );
    });

    it("should render SwitchOption with the correct props when isSwitchLayout true", () => {
      renderPreferenceSingleChoiceCard({
        ...PREFERENCE_SINGLE_CHOICE_CARD_PROPS,
        isSwitchLayout: true,
        tooltipContent: { title: "TITLE", iconName: NavigationIconName.ARROWS, iconSize: IconSize.Regular },
      });
      expect(SwitchOption).toHaveBeenCalledWith(
        {
          label: "Choose how you would like your odds to be displayed.",
          isChecked: false,
          onChange: expect.any(Function),
        },
        undefined,
      );
    });

    it("should not render PreferenceCard when isVisible is false", () => {
      renderPreferenceSingleChoiceCard({ ...PREFERENCE_SINGLE_CHOICE_CARD_PROPS, isVisible: false });

      expect(PreferenceCard).not.toHaveBeenCalled();
    });

    it("should render nothing without throwing when props are empty (mapStateToProps returned {})", () => {
      expect(() => renderPreferenceSingleChoiceCard({})).not.toThrow();

      expect(PreferenceCard).not.toHaveBeenCalled();
      expect(RadioList).not.toHaveBeenCalled();
      expect(SwitchOption).not.toHaveBeenCalled();
    });
  });

  describe("callbacks", () => {
    describe("handleRadioListChange", () => {
      beforeEach(() => {
        renderPreferenceSingleChoiceCard(PREFERENCE_SINGLE_CHOICE_CARD_PROPS);

        const { handleChange } = RadioList.mock.calls[0][0];
        act(() => {
          handleChange("selectedOptionId");
        });
      });

      it("should dispatch call to action tap with correct parameters", () => {
        expect(PREFERENCE_SINGLE_CHOICE_CARD_PROPS.dispatchPreferenceChange).toHaveBeenCalledWith(
          PREFERENCE_SINGLE_CHOICE_CARD_PROPS.preferenceUrn,
          "selectedOptionId",
        );
      });
    });

    describe("handleSwitchOptionChange", () => {
      beforeEach(() => {
        renderPreferenceSingleChoiceCard({
          ...PREFERENCE_SINGLE_CHOICE_CARD_PROPS,
          listOptions: [
            { id: "ems", value: "ems" },
            { id: "neme", value: "nem" },
          ],
          isSwitchLayout: true,
        });

        const { onChange } = SwitchOption.mock.calls[0][0];
        act(() => {
          onChange(true);
        });
      });

      it("should dispatch call to action tap with correct parameters", () => {
        expect(PREFERENCE_SINGLE_CHOICE_CARD_PROPS.dispatchPreferenceChange).toHaveBeenCalledWith(
          PREFERENCE_SINGLE_CHOICE_CARD_PROPS.preferenceUrn,
          "neme",
        );
      });
    });
  });
});
