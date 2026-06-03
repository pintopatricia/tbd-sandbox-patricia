import { render } from "@testing-library/react-native";

import { SelectionsBoard } from "@ppb/the-wall-native";

import { SystemIconName } from "@ppb/the-wall-icons";
import { BetLegs } from "./BetLegs.native";

jest.mock("@ppb/the-wall-native", () => ({
  SelectionsBoard: jest.fn(({ props, children }) => <selections-board {...props}>{children}</selections-board>),
  Text: jest.requireActual("react-native").Text,
}));

function renderBetLegs({
  legIds = [],
  title,
  description,
  onRemove = () => {},
  renderLeg = () => {},
  isWarning,
  hasIcon,
} = {}) {
  return render(
    <BetLegs
      legIds={legIds}
      title={title}
      description={description}
      renderLeg={renderLeg}
      isWarning={isWarning}
      hasIcon={hasIcon}
      onRemove={onRemove}
    />,
  );
}

describe("BetLegs", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there are no legIds", () => {
    it("should not render", () => {
      const { root } = renderBetLegs();

      expect(root).toBeUndefined();
    });
  });

  describe("when there are legIds", () => {
    it("should render", () => {
      const { root } = renderBetLegs({ legIds: ["leg1", "leg2"] });

      expect(root).not.toBeNull();
    });

    describe("SelectionsBoard", () => {
      it("should pass title to component", () => {
        renderBetLegs({ title: "amazing title", legIds: ["leg1"] });

        expect(SelectionsBoard).toHaveBeenCalledWith(expect.objectContaining({ title: "amazing title" }), undefined);
        expect(SelectionsBoard).toHaveBeenCalledTimes(1);
      });

      it("should pass onRemove to component", () => {
        const onRemoveSpy = jest.fn();
        renderBetLegs({ legIds: ["leg1"], onRemove: onRemoveSpy });

        expect(SelectionsBoard).toHaveBeenCalledWith(
          expect.objectContaining({ onRemoveSelection: onRemoveSpy }),
          undefined,
        );
        expect(SelectionsBoard).toHaveBeenCalledTimes(1);
      });

      describe("children", () => {
        it("should call renderLeg for each selection", () => {
          const renderLegMock = jest.fn((legId) => <p>{legId}</p>);
          renderBetLegs({ renderLeg: renderLegMock, legIds: ["leg1", "leg2"] });

          expect(renderLegMock).toHaveBeenNthCalledWith(1, "leg1");
          expect(renderLegMock).toHaveBeenNthCalledWith(2, "leg2");
          expect(renderLegMock).toHaveBeenCalledTimes(2);
        });

        describe("when description is provided", () => {
          it("should render the description", () => {
            const { queryByText } = renderBetLegs({ description: "so descriptive", legIds: ["leg"] });

            expect(queryByText("so descriptive")).not.toBeNull();
          });
        });

        describe("when description is not provided", () => {
          it("should render the description", () => {
            const { queryByText } = renderBetLegs();

            expect(queryByText("so descriptive")).toBeNull();
          });
        });
      });

      describe("when isWarning is provided", () => {
        it("should render SelectionsBoard with correct theme", () => {
          renderBetLegs({ legIds: ["leg1", "leg2"], isWarning: true });

          expect(SelectionsBoard).toHaveBeenCalledWith(expect.objectContaining({ theme: "yellow" }), undefined);
        });

        describe("when hasIcon is true", () => {
          it("should render SelectionsBoard with an icon", () => {
            renderBetLegs({ legIds: ["leg1", "leg2"], isWarning: true, hasIcon: true });

            expect(SelectionsBoard).toHaveBeenCalledWith(
              expect.objectContaining({ icon: SystemIconName.NOTIFICATION_WARNING }),
              undefined,
            );
          });
        });

        describe("when hasIcon is false", () => {
          it("should render SelectionsBoard with no icon", () => {
            renderBetLegs({ legIds: ["leg1", "leg2"], isWarning: true, hasIcon: false });

            expect(SelectionsBoard).toHaveBeenCalledWith(expect.objectContaining({ icon: undefined }), undefined);
          });
        });
      });
    });
  });
});
