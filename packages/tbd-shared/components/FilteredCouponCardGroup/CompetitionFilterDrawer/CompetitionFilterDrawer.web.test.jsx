import { render, act } from "@testing-library/react";
import { FilterDrawer, OptionList } from "@ppb/the-wall-web";
import { ConfigContextProvider } from "../../Config/ConfigContext";
import CompetitionFilterDrawer from "./CompetitionFilterDrawer.web";
import { ConnectedActiveCompetitions } from "./ActiveCompetitions/view/ActiveCompetitions.view";

jest.mock("@ppb/the-wall-web", () => ({
  Collapse: jest.fn((props) => <div>{props.children}</div>),
  OptionList: jest.fn((props) => <option-list {...props} />),
  Chip: jest.fn(() => <div />),
  FilterDrawer: jest.fn((props) => <filter-drawer {...props} />),
  ActionLink: jest.fn((props) => <action-link {...props} />),
  Image: jest.fn(() => <image-mock />),
}));

jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.mock("./AllCompetitions/view/AllCompetitions.view", () => ({
  ConnectedAllCompetitions: jest.fn((props) => <all-competitions-mock {...props} data-testid="all-competitions" />),
}));

jest.mock("./ActiveCompetitions/view/ActiveCompetitions.view", () => ({
  ConnectedActiveCompetitions: jest.fn((props) => (
    <active-competitions-mock {...props} data-testid="active-competitions" />
  )),
}));

jest.mock("./AllCompetitions/AllCompetitions.web", () => ({
  AllCompetitions: jest.fn((props) => <div>{props.children}</div>),
}));

jest.mock("./ActiveCompetitions/ActiveCompetitions.web", () => ({
  ActiveCompetitions: jest.fn((props) => <div>{props.children}</div>),
}));

const CURRENT_SELECTIONS_MOCK = {
  competitionFilter: [
    {
      urn: "ppb:competition:1",
      name: "English Premier League",
    },
  ],
};

const TOP_COMPETITIONS = {
  id: "topCompetitions",
  title: "Top Competitions",
  items: [
    { id: "ppb:competition:1", text: "English Premier League", isSelected: false },
    { id: "ppb:competition:2", text: "Championship", isSelected: false },
  ],
};

function renderCompetitionFilterDrawer(
  {
    title = "Set Competitions",
    onApply = () => {},
    onClose = () => {},
    topCompetitions = TOP_COMPETITIONS,
    currentSelections = [],
    resetText = "Reset",
  },
  value = { isDesktopLayout: false },
) {
  return render(
    <ConfigContextProvider value={value}>
      <CompetitionFilterDrawer
        title={title}
        onApply={onApply}
        onClose={onClose}
        topCompetitions={topCompetitions}
        currentSelections={currentSelections}
        resetText={resetText}
      />
      ,
    </ConfigContextProvider>,
  );
}

const filterDrawerExpectedProps = {
  title: "Set Competitions",
  displayApplyButton: true,
  onCloseTap: expect.any(Function),
  applyText: "I18N.FILTERS.APPLY",
  onApply: expect.any(Function),
  onOutsideTap: expect.any(Function),
  children: expect.any(Object),
  headerContent: false,
  theme: "dark",
};

describe("CompetitionFilterDrawer", () => {
  beforeEach(jest.clearAllMocks);

  describe("when using desktop template", () => {
    it("should render FilterDrawer", () => {
      renderCompetitionFilterDrawer({}, { isDesktopLayout: true });

      expect(FilterDrawer).toHaveBeenCalledWith(
        {
          ...filterDrawerExpectedProps,
          isDesktop: true,
        },
        undefined,
      );
    });
  });

  it("should render FilterDrawer", () => {
    renderCompetitionFilterDrawer({});

    expect(FilterDrawer).toHaveBeenCalledWith(
      {
        ...filterDrawerExpectedProps,
        isDesktop: false,
      },
      undefined,
    );
  });

  it("should render OptionList", () => {
    renderCompetitionFilterDrawer({});

    // Top Competitions
    expect(OptionList).toHaveBeenCalledTimes(1);
    expect(OptionList).toHaveBeenCalledWith(
      {
        listGroupName: "topCompetitions",
        listOptions: [
          { id: "ppb:competition:1", text: "English Premier League", isSelected: false },
          { id: "ppb:competition:2", text: "Championship", isSelected: false },
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
        renderCompetitionFilterDrawer({ currentSelections: CURRENT_SELECTIONS_MOCK, onApply });

        FilterDrawer.mock.calls[0][0].onApply();

        expect(onApply).toHaveBeenCalledWith(["ppb:competition:1"], ["English Premier League"]);
      });
    });

    describe("and the chip remove button is clicked", () => {
      it("should update the checkbox", () => {
        const onApply = jest.fn();
        renderCompetitionFilterDrawer({ onApply });

        act(() => {
          OptionList.mock.calls[0][0].handleChange({ id: "ppb:competition:1" });
        });

        // isSelected: true after clicking
        expect(OptionList).toHaveBeenNthCalledWith(
          2,
          {
            listGroupName: "topCompetitions",
            listOptions: [
              { id: "ppb:competition:1", text: "English Premier League", isSelected: true },
              { id: "ppb:competition:2", text: "Championship", isSelected: false },
            ],
            handleChange: expect.any(Function),
          },
          undefined,
        );

        render(FilterDrawer.mock.calls[1][0].headerContent);
        act(() => ConnectedActiveCompetitions.mock.calls[0][0].onReset());

        // isSelected: false after removing selections
        expect(OptionList).toHaveBeenNthCalledWith(
          3,
          {
            listGroupName: "topCompetitions",
            listOptions: [
              { id: "ppb:competition:1", text: "English Premier League", isSelected: false },
              { id: "ppb:competition:2", text: "Championship", isSelected: false },
            ],
            handleChange: expect.any(Function),
          },
          undefined,
        );
      });
    });

    describe("and the reset button is clicked", () => {
      it("should remove all selected competitions", () => {
        renderCompetitionFilterDrawer({});

        act(() => {
          OptionList.mock.calls[0][0].handleChange({ id: "ppb:competition:1" });
        });

        // isSelected: true after clicking
        expect(OptionList).toHaveBeenNthCalledWith(
          2,
          {
            listGroupName: "topCompetitions",
            listOptions: [
              { id: "ppb:competition:1", text: "English Premier League", isSelected: true },
              { id: "ppb:competition:2", text: "Championship", isSelected: false },
            ],
            handleChange: expect.any(Function),
          },
          undefined,
        );

        render(FilterDrawer.mock.calls[1][0].headerContent);
        act(() => ConnectedActiveCompetitions.mock.calls[0][0].onReset());

        // isSelected: false after removing chip
        expect(OptionList).toHaveBeenNthCalledWith(
          3,
          {
            listGroupName: "topCompetitions",
            listOptions: [
              { id: "ppb:competition:1", text: "English Premier League", isSelected: false },
              { id: "ppb:competition:2", text: "Championship", isSelected: false },
            ],
            handleChange: expect.any(Function),
          },
          undefined,
        );
      });
    });
  });
});
