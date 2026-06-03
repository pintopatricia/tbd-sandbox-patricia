import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";
import { Divider, SupportingContentButton } from "@ppb/the-wall-web";
import StatsContentCardGroup from "./StatsContentCardGroup.web";
import useStatsContentCardGroupVM from "../viewmodel/StatsContentCardGroup.viewmodel";

jest.mock("../viewmodel/StatsContentCardGroup.viewmodel");
jest.mock("./placeholder/StatsContentCardGroupPlaceholder.web", () => {
  const StatsContentCardGroupPlaceholder = () => <div>StatsContentCardGroupPlaceholder</div>;
  return StatsContentCardGroupPlaceholder;
});
jest.mock("@ppb/the-wall-web", () => ({
  Divider: jest.fn((props) => <div {...props} />),
  ScrollableSwimlane: ({ children }) => <div>{children}</div>,
  SupportingContentButton: jest.fn(({ title, onPress }) => <button onClick={onPress}>{title}</button>),
}));
jest.mock("../../ViewItem/ViewItem.web", () => ({
  ViewItem: jest.fn(() => <div>ViewItem</div>),
}));

jest.mock("../model/StatsContentCardGroup.graphql.ts", () => ({
  writeStatsContentCardGroupFragment: jest.fn(),
}));

const urn = "ppb:tbd:stats:cardgroup:statsContent:1";
const onTabPress = jest.fn();

const mockViewModel = (data = null, loading = false) => {
  useStatsContentCardGroupVM.mockReturnValueOnce({
    loading,
    vm: {
      data,
      events: { onTabPress },
    },
  });
};

function renderComponent() {
  return render(<StatsContentCardGroup urn={urn} />);
}

describe("StatsContentCardGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when request is loading", () => {
    it("should render StatsContentCardGroupPlaceholder", () => {
      mockViewModel(null, true);
      const { getByText } = renderComponent();

      expect(getByText("StatsContentCardGroupPlaceholder")).toBeInTheDocument();
    });
  });

  describe("when data is loaded", () => {
    describe("when data.items is undefined", () => {
      it("should render null", () => {
        mockViewModel(null, false);
        const { container } = renderComponent();

        expect(container.firstChild).toBeNull();
      });
    });

    describe("when data.items is defined", () => {
      it("should render items", () => {
        const items = [
          {
            icon: "team_form_icon",
            urn: "urn:1",
            label: "Form",
            typename: "StatsPebbleCardGroup",
          },
          {
            icon: "team_form_icon",
            urn: "urn:2",
            label: "Form button",
            typename: "StatsFormCard",
          },
        ];

        mockViewModel({ items });
        renderComponent();

        expect(SupportingContentButton).toHaveBeenCalledWith(
          {
            title: items[0].label,
            icon: items[0].icon,
            isOpen: false,
            onPress: expect.any(Function),
            isHighlighted: true,
          },

          undefined,
        );
        expect(SupportingContentButton).toHaveBeenCalledWith(
          {
            title: items[1].label,
            icon: items[1].icon,
            isOpen: false,
            onPress: expect.any(Function),
            isHighlighted: true,
          },
          undefined,
        );
        expect(SupportingContentButton).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("when selectedTab is defined", () => {
    describe("when supportingContentButton is clicked", () => {
      it("should toggle selectedTab and should show the ViewItem component once clicked", () => {
        const items = [
          {
            icon: "team_form_icon",
            urn: "urn:1",
            label: "Form",
            typename: "StatsPebbleCardGroup",
          },
          {
            icon: "team_form_icon",
            urn: "urn:2",
            label: "Form button",
            typename: "StatsFormCard",
          },
        ];
        const local = {
          selectedTab: {
            urn: "urn:1",
            typename: "StatsPebbleCardGroup",
          },
        };

        mockViewModel({ items });
        const { getByText, queryByText, rerender } = renderComponent();

        const button = getByText("Form");
        expect(button).toBeInTheDocument();

        expect(queryByText("ViewItem")).toBeNull();

        fireEvent.click(button);
        mockViewModel({ items, local });
        rerender(<StatsContentCardGroup urn={urn} />);
        expect(onTabPress).toHaveBeenNthCalledWith(1, urn, items[0].urn, true);

        expect(queryByText("ViewItem")).toBeInTheDocument();

        fireEvent.click(button);
        expect(onTabPress).toHaveBeenNthCalledWith(2, urn, items[0].urn, false);
        mockViewModel({ items });
        rerender(<StatsContentCardGroup urn={urn} />);
        expect(queryByText("ViewItem")).toBeNull();
      });
    });
  });
});
