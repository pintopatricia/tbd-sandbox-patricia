import { render } from "@testing-library/react";

import { VirtualSilk } from "@ppb/the-wall-common/icons/Virtuals/VirtualSilk";
import { VirtualRunner } from "./VirtualRunner.web";
import styles from "./VirtualRunner.web.css";
import { DESCRIPTION, IMAGE, NAME, NUMBER, TEST_ID } from "./VirtualRunner.web.selectors";

jest.mock("@ppb/the-wall-common/icons/Virtuals/VirtualSilk", () => ({
  VirtualSilk: jest.fn(() => <silk-mock />),
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
      const { container } = renderVirtualRunner({ children: <div>some children</div> });

      expect(container.querySelector(TEST_ID).lastChild.textContent).toBe("some children");
    });
  });

  describe("name", () => {
    it("should render runner name", () => {
      const { container } = renderVirtualRunner({ name: "some name" });

      expect(container.querySelector(NAME).firstChild.textContent).toBe("some name");
    });
  });

  describe("number", () => {
    describe("when not defined", () => {
      it("should not render runner number", () => {
        const { container } = renderVirtualRunner();

        expect(container.querySelector(NUMBER)).toBe(null);
      });
    });

    describe("when defined", () => {
      it("should render runner number", () => {
        const { container } = renderVirtualRunner({ number: 7 });

        expect(container.querySelector(NUMBER).firstChild.textContent).toBe("7");
      });
    });
  });

  describe("description", () => {
    describe("when not defined", () => {
      it("should not render runner description", () => {
        const { container } = renderVirtualRunner();

        expect(container.querySelector(DESCRIPTION)).toBe(null);
      });
    });

    describe("when defined", () => {
      it("should render runner description", () => {
        const { container } = renderVirtualRunner({ description: "some description" });

        expect(container.querySelector(DESCRIPTION).firstChild.textContent).toBe("some description");
      });
    });
  });

  describe("showSilk", () => {
    describe("when it's false", () => {
      it("should not render runner image", () => {
        const { container } = renderVirtualRunner({ humanTexture: "some human texture", showSilk: false });

        expect(container.querySelector(IMAGE)).toBe(null);
      });
    });

    describe("when it's true", () => {
      describe("and there's a humanTexture", () => {
        it("should render runner image", () => {
          const { container } = renderVirtualRunner({ humanTexture: "some human texture", showSilk: true });

          expect(container.querySelector(IMAGE)).toBeDefined();
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
          sportId | expectedClassname
          ${0}    | ${styles.horseRacing}
          ${100}  | ${styles.horseRacing}
          ${10}   | ${styles.horseRacing}
          ${1}    | ${styles.square}
          ${3}    | ${styles.square}
          ${4}    | ${styles.football}
          ${9}    | ${styles.football}
        `("should apply the appropriate classname to the silk container", ({ sportId, expectedClassname }) => {
          const { container } = renderVirtualRunner({ humanTexture: "1", sportId, showSilk: true });

          expect(container.querySelector(`.${expectedClassname}`)).not.toBeNull();
        });
      });

      describe("and there isn't a humanTexture", () => {
        it.each`
          sportId | expectedClassname
          ${0}    | ${styles.horseRacing}
          ${100}  | ${styles.horseRacing}
          ${10}   | ${styles.horseRacing}
          ${1}    | ${styles.square}
          ${3}    | ${styles.square}
          ${4}    | ${styles.football}
          ${9}    | ${styles.football}
        `("should have the appropriate space", ({ sportId, expectedClassname }) => {
          const { container } = renderVirtualRunner({ humanTexture: "", sportId, showSilk: true });

          expect(container.querySelectorAll(`.${expectedClassname}`)).not.toBeNull();
        });
      });
    });
  });
});
