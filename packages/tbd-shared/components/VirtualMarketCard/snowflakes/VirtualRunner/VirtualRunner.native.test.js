import { Text } from "react-native";
import { render } from "@testing-library/react-native";

import { VirtualSilk } from "@ppb/the-wall-common/icons/Virtuals/VirtualSilk";
import { VirtualRunner } from "./VirtualRunner.native";
import styles from "./VirtualRunner.native.styles";

jest.mock("@ppb/the-wall-common/icons/Virtuals/VirtualSilk", () => ({
  VirtualSilk: jest.fn(() => <silk-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderVirtualRunner({ name, number, sportId, showSilk, humanTexture, description, children } = {}) {
  return render(
    <VirtualRunner
      name={name}
      number={number}
      sportId={sportId}
      showSilk={showSilk}
      humanTexture={humanTexture}
      description={description}
    >
      {children}
    </VirtualRunner>,
  );
}

describe("VirtualRunner", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("When it has a child component", () => {
    it("should render the child component", () => {
      const { getByTestId } = renderVirtualRunner({
        children: <Text>some children</Text>,
      });

      expect(getByTestId("virtual-runner-line-container")).toHaveTextContent("some children");
    });
  });

  describe("name", () => {
    it("should render runner name", () => {
      const { getByTestId } = renderVirtualRunner({ name: "some name" });

      expect(getByTestId("virtual-runner-name")).toHaveTextContent("some name");
    });
  });

  describe("number", () => {
    describe("when not defined", () => {
      it("should not render runner number", () => {
        const { queryByTestId } = renderVirtualRunner();

        expect(queryByTestId("virtual-runner-number")).toBe(null);
      });
    });
    describe("when defined", () => {
      it("should render runner number", () => {
        const { getByTestId } = renderVirtualRunner({ number: 7 });

        expect(getByTestId("virtual-runner-number")).toHaveTextContent("7");
      });
    });
  });

  describe("description", () => {
    describe("when not defined", () => {
      it("should not render runner description", () => {
        const { queryByTestId } = renderVirtualRunner({});

        expect(queryByTestId("virtual-runner-description")).toBe(null);
      });
    });
    describe("when defined", () => {
      it("should render runner description", () => {
        const { getByTestId } = renderVirtualRunner({ description: "some description" });

        expect(getByTestId("virtual-runner-description")).toHaveTextContent("some description");
      });
    });
  });

  describe("showSilk", () => {
    describe("when it's false", () => {
      it("should not render runner image", () => {
        const { queryByTestId } = renderVirtualRunner({ humanTexture: "some human texture", showSilk: false });

        expect(queryByTestId("virtual-runner-image")).toBe(null);
      });
    });

    describe("when it's true", () => {
      describe("and there's a humanTexture", () => {
        it("should render runner image", () => {
          const { getByTestId } = renderVirtualRunner({ humanTexture: "some human texture", showSilk: true });

          expect(getByTestId("virtual-runner-image")).toBeDefined();
        });

        it.each`
          sportId | humanTexture
          ${0}    | ${"1"}
          ${3}    | ${"2"}
          ${9}    | ${"Argentina_Home"}
        `("should render VirtualSilk with correct sportId and humanTexture", ({ sportId, humanTexture }) => {
          renderVirtualRunner({ humanTexture, sportId, showSilk: true });

          expect(VirtualSilk).toHaveBeenCalledWith({ sportId, humanTexture }, undefined);
          expect(VirtualSilk).toHaveBeenCalledTimes(1);
        });

        it.each`
          sportId | expectedStyle
          ${0}    | ${styles.horseRacing}
          ${100}  | ${styles.horseRacing}
          ${10}   | ${styles.horseRacing}
          ${1}    | ${styles.square}
          ${3}    | ${styles.square}
          ${4}    | ${styles.football}
          ${9}    | ${styles.football}
        `("should apply the appropriate style to the silk container", ({ sportId, expectedStyle }) => {
          const { getByTestId } = renderVirtualRunner({ humanTexture: "1", sportId, showSilk: true });

          expect(getByTestId("virtual-runner-silk-container")).toHaveStyle(expectedStyle);
        });
      });

      describe("and there isn't a humanTexture", () => {
        it.each`
          sportId | expectedStyle
          ${0}    | ${styles.horseRacing}
          ${100}  | ${styles.horseRacing}
          ${10}   | ${styles.horseRacing}
          ${1}    | ${styles.square}
          ${3}    | ${styles.square}
          ${4}    | ${styles.football}
          ${9}    | ${styles.football}
        `("should have the appropriate empty space", ({ sportId, expectedStyle }) => {
          const { queryByTestId } = renderVirtualRunner({ humanTexture: "", sportId, showSilk: true });
          const space = queryByTestId("virtual-runner-space");

          expect(space).not.toBeNull();
          expect(space).toHaveStyle(expectedStyle);
        });
      });
    });
  });
});
