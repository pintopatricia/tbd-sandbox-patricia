import { ComponentTheme } from "@ppb/the-wall-common/types";
import { RadioList, SwitchOption, SegmentedControl } from "@ppb/the-wall-web";
import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { NavigationIconName } from "@ppb/the-wall-icons";
import { IconSize } from "@ppb/the-wall-common/types/Tooltip/Tooltip.types";
import { PreferenceCard } from "./snowflakes/PreferenceCard/PreferenceCard.web";
import PreferenceSingleChoiceCard from "./PreferenceSingleChoiceCard.web";
import { ConfigContextProvider } from "../Config/ConfigContext";

jest.mock("@ppb/the-wall-web", () => ({
  RadioList: jest.fn(({ props }) => <radio-list {...props} />),
  SwitchOption: jest.fn(({ props }) => <switch-option {...props} />),
  Tooltip: jest.fn(({ props }) => <tool-tip {...props} />),
  SegmentedControl: jest.fn(({ props }) => <segmented-control {...props} />),
}));

jest.mock("./snowflakes/PreferenceCard/PreferenceCard.web", () => ({
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
  isLoggedIn: true,
  isSwitchLayout: false,
  tooltipContent: undefined,
  dispatchPreferenceChange: jest.fn(),
  layout: "RADIO",
};

function renderPreferenceSingleChoiceCard(props, value = { isDesktopLayout: false }) {
  return render(
    <ConfigContextProvider value={value}>
      <PreferenceSingleChoiceCard {...props} />
    </ConfigContextProvider>,
  );
}

describe("Embedded view card web", () => {
  afterEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    it("should render PreferenceCard with the correct props", () => {
      renderPreferenceSingleChoiceCard(PREFERENCE_SINGLE_CHOICE_CARD_PROPS);
      const { title, hint } = PREFERENCE_SINGLE_CHOICE_CARD_PROPS;
      expect(PreferenceCard).toHaveBeenCalledWith(
        { title, hint, onInfoButtonClick: undefined, children: expect.anything(), extraContent: null },
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
        isSwitchLayout: true,
      });
      const { extraContent } = PreferenceCard.mock.calls[0][0];

      expect(extraContent).not.toBe(null);
    });

    describe("should not render PreferenceCard", () => {
      it("when isVisible is false", () => {
        renderPreferenceSingleChoiceCard({ ...PREFERENCE_SINGLE_CHOICE_CARD_PROPS, isVisible: false });

        expect(PreferenceCard).not.toHaveBeenCalled();
        expect(SegmentedControl).not.toHaveBeenCalled();
      });

      it("when isLoggedIn is false", () => {
        renderPreferenceSingleChoiceCard({ ...PREFERENCE_SINGLE_CHOICE_CARD_PROPS, isLoggedIn: false });

        expect(PreferenceCard).not.toHaveBeenCalled();
        expect(SegmentedControl).not.toHaveBeenCalled();
      });
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
          listGroupName: "ppb:tbd:preference:singleChoice:1",
        },
        undefined,
      );
    });

    it("should render SwitchOption with the correct props", () => {
      renderPreferenceSingleChoiceCard({
        ...PREFERENCE_SINGLE_CHOICE_CARD_PROPS,
        tooltipContent: {
          title: "TITLE",
          description: "DESC",
          iconName: NavigationIconName.ARROWS,
          iconSize: IconSize.Regular,
        },
        isSwitchLayout: true,
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

    it("should render SegmentedControl with the correct props", () => {
      const options = [
        { key: "decimal", value: "decimal" },
        { key: "fractional", value: "fractional" },
      ];

      renderPreferenceSingleChoiceCard(
        {
          ...PREFERENCE_SINGLE_CHOICE_CARD_PROPS,
          segmentedOptions: options,
          layout: "SEGMENTED",
        },
        { isDesktopLayout: true },
      );

      expect(SegmentedControl).toHaveBeenCalledWith(
        {
          onClick: expect.any(Function),
          selectedOption: "decimal",
          options,
        },
        undefined,
      );
    });

    it("should render nothing without throwing when props are empty (mapStateToProps returned {})", () => {
      expect(() => renderPreferenceSingleChoiceCard({}, { isDesktopLayout: true })).not.toThrow();

      expect(PreferenceCard).not.toHaveBeenCalled();
      expect(RadioList).not.toHaveBeenCalled();
      expect(SegmentedControl).not.toHaveBeenCalled();
      expect(SwitchOption).not.toHaveBeenCalled();
    });

    it("should not render SegmentedControl without a desktop layout", () => {
      const options = [
        { key: "decimal", value: "decimal" },
        { key: "fractional", value: "fractional" },
      ];

      renderPreferenceSingleChoiceCard({
        ...PREFERENCE_SINGLE_CHOICE_CARD_PROPS,
        segmentedOptions: options,
        layout: "SEGMENTED",
      });

      expect(SegmentedControl).not.toHaveBeenCalled();
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
          tooltipContent: {
            title: "TITLE",
            description: "DESC",
            iconName: NavigationIconName.ARROWS,
            iconSize: IconSize.Regular,
          },
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
