import { renderHook } from "@testing-library/react";
import { useLoopProviderValue } from "./useLoopProviderValue";
import { buildLoopContext } from "../context-builder";
import { createLoopClient } from "../loop-client-factory";

jest.mock("../context-builder", () => ({
  buildLoopContext: jest.fn(() => ({
    product: "some product",
  })),
}));

jest.mock("../loop-client-factory", () => ({
  createLoopClient: jest.fn(() => "some loop client"),
}));

const STATE_MOCK = {
  entities: {
    appkeytype: "MOBILE",
    experiments: {
      A: {
        bucket: 0,
        variant: "A.1",
      },
      B: {
        bucket: 0,
        variant: "B.2",
      },
    },
    userdetails: {
      some: "user details mock",
    },
    throttles: {},
  },
};

describe("useLoopProviderValue", () => {
  describe("when throttle is active", () => {
    it("should return loop client", () => {
      const storeMock = {
        getState: jest.fn(() => ({
          ...STATE_MOCK,
          entities: {
            ...STATE_MOCK.entities,
            throttles: {
              LPS_FE_EXPOSURE: {
                isActive: true,
              },
            },
          },
        })),
      };
      const visitorIdResolver = jest.fn(() => "some visitorId");

      const {
        result: { current },
      } = renderHook(() => useLoopProviderValue(storeMock, visitorIdResolver));

      expect(buildLoopContext).toHaveBeenCalledWith(
        {
          some: "user details mock",
        },
        "mobile",
        "some visitorId",
      );
      expect(buildLoopContext).toHaveBeenCalledTimes(1);

      expect(createLoopClient).toHaveBeenCalledWith(
        "some product",
        [
          {
            id: "A",
            variant: "A.1",
            bucket: 0,
          },
          {
            id: "B",
            variant: "B.2",
            bucket: 0,
          },
        ],
        {
          product: "some product",
        },
      );
      expect(createLoopClient).toHaveBeenCalledTimes(1);
      expect(current).toBe("some loop client");
    });
  });

  describe("when throttle is not active", () => {
    it("should return null", () => {
      const storeMock = {
        getState: jest.fn(() => ({
          ...STATE_MOCK,
          entities: {
            ...STATE_MOCK.entities,
            throttles: {
              LPS_FE_EXPOSURE: {
                isActive: false,
              },
            },
          },
        })),
      };
      const visitorIdResolver = jest.fn(() => "some visitorId");

      const {
        result: { current },
      } = renderHook(() => useLoopProviderValue(storeMock, visitorIdResolver));

      expect(current).toBe(null);
    });
  });
});
