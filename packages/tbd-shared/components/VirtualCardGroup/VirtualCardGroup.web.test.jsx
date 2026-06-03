import { createRef } from "react";
import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { useOnIntersect } from "@ppb/the-wall-web";
import VirtualCardGroup from "./VirtualCardGroup.web";
import { ViewItem } from "../ViewItem/ViewItem.web";

jest.mock("../ViewItem/ViewItem.web", () => ({
  ViewItem: jest.fn().mockReturnValue(<mocked-view-item />),
}));

jest.mock("@ppb/the-wall-web", () => ({
  useOnIntersect: jest.fn().mockReturnValue({ isIntersecting: true, ref: createRef() }),
}));

const defaultItems = [
  { urn: "urn:1", typename: "VirtualCardGroup" },
  { urn: "urn:2", typename: "VirtualCardGroup" },
];

describe("VirtualCardGroup", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should call a ViewItem per item", () => {
    render(
      <VirtualCardGroup
        urn={"card:urn:1"}
        items={defaultItems}
        dispatchVirtualsSubscribe={jest.fn()}
        dispatchVirtualsUnsubscribe={jest.fn()}
      />,
    );

    expect(ViewItem).toHaveBeenCalledTimes(2);
    expect(ViewItem).toHaveBeenCalledWith({ urn: "urn:1", typename: "VirtualCardGroup", visible: true }, undefined);
    expect(ViewItem).toHaveBeenCalledWith({ urn: "urn:2", typename: "VirtualCardGroup", visible: true }, undefined);
  });

  describe("when mounted", () => {
    describe("when intersecting", () => {
      it("should subscribe", () => {
        const dispatchVirtualsSubscribe = jest.fn();

        render(
          <VirtualCardGroup
            urn={"card:urn:1"}
            items={defaultItems}
            dispatchVirtualsSubscribe={dispatchVirtualsSubscribe}
            dispatchVirtualsUnsubscribe={jest.fn()}
          />,
        );

        expect(dispatchVirtualsSubscribe).toHaveBeenCalledTimes(1);
        expect(dispatchVirtualsSubscribe).toHaveBeenCalledWith("card:urn:1");
      });
    });

    describe("when not intersecting", () => {
      it("should unsubscribe", () => {
        const dispatchVirtualsUnsubscribe = jest.fn();

        const { rerender } = render(
          <VirtualCardGroup
            urn={"card:urn:1"}
            items={defaultItems}
            dispatchVirtualsSubscribe={jest.fn()}
            dispatchVirtualsUnsubscribe={dispatchVirtualsUnsubscribe}
          />,
        );

        act(() => {
          useOnIntersect.mockReturnValue({ isIntersecting: false });

          rerender(
            <VirtualCardGroup
              urn={"card:urn:1"}
              items={defaultItems}
              dispatchVirtualsSubscribe={jest.fn()}
              dispatchVirtualsUnsubscribe={dispatchVirtualsUnsubscribe}
            />,
          );
        });

        // unmount + no longer intersecting
        expect(dispatchVirtualsUnsubscribe).toHaveBeenCalledTimes(2);
        expect(dispatchVirtualsUnsubscribe).toHaveBeenCalledWith();
      });
    });
  });

  describe("when unmounted", () => {
    it("should unsubscribe", () => {
      useOnIntersect.mockReturnValue({ isIntersecting: true });

      const dispatchVirtualsUnsubscribe = jest.fn();
      const { unmount } = render(
        <VirtualCardGroup
          urn={"card:urn:2"}
          items={defaultItems}
          dispatchVirtualsSubscribe={jest.fn()}
          dispatchVirtualsUnsubscribe={dispatchVirtualsUnsubscribe}
        />,
      );

      act(() => {
        unmount();
      });

      expect(dispatchVirtualsUnsubscribe).toHaveBeenCalledTimes(1);
      expect(dispatchVirtualsUnsubscribe).toHaveBeenCalledWith();
    });
  });
});
