import { Text, View } from "react-native";
import { render, waitFor, fireEvent } from "@testing-library/react-native";
import { ObbSquadBetAnimationWrapper } from "./ObbSquadBetAnimationWrapper.native";

jest.mock("react-native-reanimated", () => require("react-native-reanimated/mock"));

describe("ObbSquadBetAnimationWrapper.native", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic rendering", () => {
    it("should render children correctly", () => {
      const { getByText } = render(
        <ObbSquadBetAnimationWrapper>
          <View>
            <Text>Test Content</Text>
          </View>
        </ObbSquadBetAnimationWrapper>,
      );
      expect(getByText("Test Content")).toBeTruthy();
    });
  });

  describe("Props handling", () => {
    it("should accept trigger prop", () => {
      const { getByText } = render(
        <ObbSquadBetAnimationWrapper trigger={1}>
          <View>
            <Text>Test Content</Text>
          </View>
        </ObbSquadBetAnimationWrapper>,
      );
      expect(getByText("Test Content")).toBeTruthy();
    });

    it("should accept custom animation duration", () => {
      const { getByText } = render(
        <ObbSquadBetAnimationWrapper animationDuration={1000}>
          <View>
            <Text>Test Content</Text>
          </View>
        </ObbSquadBetAnimationWrapper>,
      );
      expect(getByText("Test Content")).toBeTruthy();
    });

    it("should handle trigger changes", async () => {
      const { getByText, rerender } = render(
        <ObbSquadBetAnimationWrapper trigger={1}>
          <View>
            <Text>Test Content</Text>
          </View>
        </ObbSquadBetAnimationWrapper>,
      );

      rerender(
        <ObbSquadBetAnimationWrapper trigger={2}>
          <View>
            <Text>Updated Content</Text>
          </View>
        </ObbSquadBetAnimationWrapper>,
      );

      await waitFor(() => {
        expect(getByText("Updated Content")).toBeTruthy();
      });
    });

    it("should use default animation duration when not provided", () => {
      const { getByText } = render(
        <ObbSquadBetAnimationWrapper trigger={1}>
          <View>
            <Text>Test Content</Text>
          </View>
        </ObbSquadBetAnimationWrapper>,
      );
      expect(getByText("Test Content")).toBeTruthy();
    });
  });

  describe("Layout handling", () => {
    it("should handle layout event with height", () => {
      const TestComponent = () => (
        <ObbSquadBetAnimationWrapper trigger={1}>
          <View testID="content-view">
            <Text>Test Content</Text>
          </View>
        </ObbSquadBetAnimationWrapper>
      );

      const { getByTestId } = render(<TestComponent />);
      const contentView = getByTestId("content-view");

      fireEvent(contentView, "layout", {
        nativeEvent: {
          layout: {
            x: 0,
            y: 0,
            width: 100,
            height: 200,
          },
        },
      });

      expect(getByTestId("content-view")).toBeTruthy();
    });

    it("should handle layout event updates", () => {
      const TestComponent = ({ trigger }) => (
        <ObbSquadBetAnimationWrapper trigger={trigger}>
          <View testID="content-view">
            <Text>Test Content</Text>
          </View>
        </ObbSquadBetAnimationWrapper>
      );

      const { getByTestId, rerender } = render(<TestComponent trigger={1} />);
      const contentView = getByTestId("content-view");

      fireEvent(contentView, "layout", {
        nativeEvent: {
          layout: {
            x: 0,
            y: 0,
            width: 100,
            height: 200,
          },
        },
      });

      expect(getByTestId("content-view")).toBeTruthy();

      rerender(<TestComponent trigger={2} />);

      fireEvent(contentView, "layout", {
        nativeEvent: {
          layout: {
            x: 0,
            y: 0,
            width: 100,
            height: 250,
          },
        },
      });

      expect(getByTestId("content-view")).toBeTruthy();
    });

    it("should handle zero height layout", () => {
      const TestComponent = () => (
        <ObbSquadBetAnimationWrapper trigger={1}>
          <View testID="content-view">
            <Text>Test Content</Text>
          </View>
        </ObbSquadBetAnimationWrapper>
      );

      const { getByTestId } = render(<TestComponent />);
      const contentView = getByTestId("content-view");

      fireEvent(contentView, "layout", {
        nativeEvent: {
          layout: {
            x: 0,
            y: 0,
            width: 100,
            height: 0,
          },
        },
      });

      expect(getByTestId("content-view")).toBeTruthy();
    });
  });
});
