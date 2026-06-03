import { act, render } from "@testing-library/react-native";

import VirtualCardGroup from "./VirtualCardGroup.native";
import ConnectedCardGroup from "../CardGroup";
import CardGroup from "../CardGroup/CardGroup.native";

jest.mock("../CardGroup", () => jest.fn(() => <connected-card-group-item />));
jest.mock("../CardGroup/CardGroup.native", () => jest.fn(() => <card-group-item />));
jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
  heights: {},
}));

const defaultItems = [
  { urn: "urn:1", typename: "VirtualCardGroup" },
  { urn: "urn:2", typename: "VirtualCardGroup" },
];

describe("VirtualCardGroup", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should call a ConnectedCardGroup per item", () => {
    render(
      <VirtualCardGroup
        urn={"card:urn:1"}
        items={defaultItems}
        dispatchVirtualsSubscribe={jest.fn()}
        dispatchVirtualsUnsubscribe={jest.fn()}
      />,
    );

    expect(ConnectedCardGroup).toHaveBeenCalledTimes(2);
    expect(ConnectedCardGroup).toHaveBeenCalledWith(
      { urn: "urn:1", typename: "VirtualCardGroup", component: CardGroup },
      undefined,
    );
    expect(ConnectedCardGroup).toHaveBeenCalledWith(
      { urn: "urn:2", typename: "VirtualCardGroup", component: CardGroup },
      undefined,
    );
  });

  describe("when mounted", () => {
    describe("when intersecting", () => {
      it("should subscribe", () => {
        const dispatchVirtualsSubscribe = jest.fn();

        render(
          <VirtualCardGroup
            urn={"card:urn:1"}
            items={defaultItems}
            visible={true}
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
        const dispatchVirtualsUnsubscribe = jest.fn(() => {});

        const { rerender, unmount } = render(
          <VirtualCardGroup
            urn={"card:urn:1"}
            items={defaultItems}
            visible={false}
            dispatchVirtualsSubscribe={jest.fn()}
            dispatchVirtualsUnsubscribe={dispatchVirtualsUnsubscribe}
          />,
        );

        act(() => {
          rerender(
            <VirtualCardGroup
              urn={"card:urn:1"}
              items={defaultItems}
              visible={false}
              dispatchVirtualsSubscribe={jest.fn()}
              dispatchVirtualsUnsubscribe={dispatchVirtualsUnsubscribe}
            />,
          );
        });

        act(() => {
          unmount();
        });

        // unmount + no longer intersecting
        expect(dispatchVirtualsUnsubscribe).toHaveBeenCalledTimes(4);
        expect(dispatchVirtualsUnsubscribe).toHaveBeenCalledWith();
      });
    });
  });

  describe("when unmounted", () => {
    it("should unsubscribe", () => {
      const dispatchVirtualsUnsubscribe = jest.fn();
      const { unmount } = render(
        <VirtualCardGroup
          urn={"card:urn:2"}
          items={defaultItems}
          visible={true}
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
