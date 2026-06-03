import { render, act } from "@testing-library/react-native";
import { FilterDrawer, OptionList } from "@ppb/the-wall-native";
import CompetitionFilterDrawer from "./CompetitionFilterDrawer.native";
import { ConnectedActiveCompetitions } from "./ActiveCompetitions/view/ActiveCompetitions.view";

jest.mock("@ppb/the-wall-native", () => ({
  Collapse: jest.fn((props) => <div>{props.children}</div>),
  OptionList: jest.fn((props) => <option-list {...props} />),
  Chip: jest.fn(() => <div />),
  FilterDrawer: jest.fn((props) => <filter-drawer {...props} />),
  ActionLink: jest.fn((props) => <action-link {...props} />),
  TBDImage: jest.fn(() => <tbd-image-mock />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
  tokens: {
    CollapseHorizontalGap: {},
  },
}));

jest.mock("./AllCompetitions/view/AllCompetitions.view", () => ({
  ConnectedAllCompetitions: jest.fn((props) => <conneced-all-competitions {...props} />),
}));
jest.mock("./AllCompetitions/AllCompetitions.native", () => ({
  AllCompetitions: jest.fn((props) => <all-competitions-component {...props} />),
}));

jest.mock("./ActiveCompetitions/view/ActiveCompetitions.view", () => ({
  ConnectedActiveCompetitions: jest.fn((props) => <conneced-active-competitions {...props} />),
}));
jest.mock("./ActiveCompetitions/ActiveCompetitions.native", () => ({
  ActiveCompetitions: jest.fn((props) => <active-competitions-component {...props} />),
}));

const TOP_COMPETITIONS = {
  id: "topCompetitions",
  title: "Top Competitions",
  items: [
    { id: "ppb:competition:10932509", text: "English Premier League", isSelected: false },
    { id: "ppb:competition:81", text: "Italian Serie A", isSelected: false },
  ],
};

const CURRENT_SELECTIONS = {
  competitionFilter: [{ urn: "ppb:competition:10932509", name: "English Premier League" }],
};

function renderCompetitionFilterDrawer({
  title = "Set Competitions",
  onApply = () => {},
  onClose = () => {},
  topCompetitions = TOP_COMPETITIONS,
  currentSelections = [],
  resetText = "Reset",
}) {
  return render(
    <CompetitionFilterDrawer
      urn={"ppb:123"}
      title={title}
      onApply={onApply}
      onClose={onClose}
      topCompetitions={topCompetitions}
      resetText={resetText}
      currentSelections={currentSelections}
    />,
  );
}

describe("CompetitionFilterDrawer", () => {
  beforeEach(jest.clearAllMocks);

  it("should render FilterDrawer", () => {
    renderCompetitionFilterDrawer({});

    expect(FilterDrawer).toHaveBeenCalledWith(
      {
        title: "Set Competitions",
        displayApplyButton: true,
        onCloseTap: expect.any(Function),
        applyText: "I18N.FILTERS.APPLY",
        onApply: expect.any(Function),
        onOutsideTap: expect.any(Function),
        children: expect.any(Object),
        headerContent: expect.any(Object),
        theme: "dark",
      },
      undefined,
    );
  });

  it("should render OptionList", () => {
    renderCompetitionFilterDrawer({});

    // Top Competitions, ITA group, GBR group
    expect(OptionList).toHaveBeenCalledTimes(1);
    expect(OptionList).toHaveBeenCalledWith(
      {
        listOptions: [
          { id: "ppb:competition:10932509", text: "English Premier League", isSelected: false },
          { id: "ppb:competition:81", text: "Italian Serie A", isSelected: false },
        ],
        handleChange: expect.any(Function),
      },
      undefined,
    );
  });

  describe("when a competition is selected", () => {
    describe("and the apply button is clicked", () => {
      it("should call the callback with the selected competitions", () => {
        const onApply = jest.fn();
        renderCompetitionFilterDrawer({ onApply, currentSelections: CURRENT_SELECTIONS });

        FilterDrawer.mock.calls[0][0].onApply();
        expect(onApply).toHaveBeenCalledWith(["ppb:competition:10932509"], ["English Premier League"]);
      });
    });

    describe("and the reset button is clicked", () => {
      it("should update the checkbox", () => {
        const onApply = jest.fn();
        renderCompetitionFilterDrawer({ onApply });

        act(() => {
          OptionList.mock.calls[0][0].handleChange("ppb:competition:10932509");
        });

        // isSelected: true after clicking
        expect(OptionList).toHaveBeenNthCalledWith(
          2,
          {
            listOptions: [
              { id: "ppb:competition:10932509", text: "English Premier League", isSelected: true },
              { id: "ppb:competition:81", text: "Italian Serie A", isSelected: false },
            ],
            handleChange: expect.any(Function),
          },
          undefined,
        );

        act(() => {
          OptionList.mock.calls[1][0].handleChange("ppb:competition:81");
        });

        expect(OptionList).toHaveBeenNthCalledWith(
          3,
          {
            listOptions: [
              { id: "ppb:competition:10932509", text: "English Premier League", isSelected: true },
              { id: "ppb:competition:81", text: "Italian Serie A", isSelected: true },
            ],
            handleChange: expect.any(Function),
          },
          undefined,
        );

        render(FilterDrawer.mock.calls[1][0].headerContent);

        act(() => {
          ConnectedActiveCompetitions.mock.calls[0][0].onReset();
        });

        // isSelected: false after removing chip
        expect(OptionList).toHaveBeenNthCalledWith(
          4,
          {
            listOptions: [
              { id: "ppb:competition:10932509", text: "English Premier League", isSelected: false },
              { id: "ppb:competition:81", text: "Italian Serie A", isSelected: false },
            ],
            handleChange: expect.any(Function),
          },
          undefined,
        );
      });
    });
  });
});
